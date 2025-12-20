import React, { useEffect, useState, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import Navbar from "../../components/navbar.jsx";
import { useUserStore } from "../../store/userStore.js";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import axios from "axios";
import { Send, ArrowLeft, MoreVertical, Image as ImageIcon, Tag, Check, CheckCheck, X, Search, Edit2, Trash2, Phone, Video as VideoIcon, Mic, MicOff, VideoOff } from "lucide-react";
import SimplePeer from "simple-peer";
import toast from "react-hot-toast";
import { styles } from "./styles";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function MessagesPage() {
    const {
        conversations,
        selectedConversation,
        messages,
        conversationsLoading,
        messagesLoading,
        selectConversation,
        sendMessage,
        uploadMessageAttachments,
        sendMessageWithAttachments,
        isAuthenticated,
        user,
        accessToken,
        checkAuth,
    } = useUserStore();

    const [newMessage, setNewMessage] = useState("");
    const [offerAmount, setOfferAmount] = useState("");
    const [isOfferMode, setIsOfferMode] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);
    const hasFetchedRef = useRef(false);
    const [authReady, setAuthReady] = useState(false);
    const socketInitRef = useRef(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [progressVisible, setProgressVisible] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const progressTimerRef = useRef(null);
    const [attachments, setAttachments] = useState([]);
    const [attachmentPreviews, setAttachmentPreviews] = useState([]);
    const [attachmentUploadPct, setAttachmentUploadPct] = useState(0);
    const fileInputRef = useRef(null);
    const [dealPopup, setDealPopup] = useState(null);

    // Message Edit State
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [hoveredMessageId, setHoveredMessageId] = useState(null);

    // Call State
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [isVideoCall, setIsVideoCall] = useState(false);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const [callModalOpen, setCallModalOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    // Audio Refs
    const ringtoneRef = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"));
    const callingSoundRef = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3"));

    useEffect(() => {
        // Configure audio
        ringtoneRef.current.loop = true;
        callingSoundRef.current.loop = true;
        
        return () => {
            ringtoneRef.current.pause();
            callingSoundRef.current.pause();
            ringtoneRef.current.currentTime = 0;
            callingSoundRef.current.currentTime = 0;
        };
    }, []);

    const stopSounds = () => {
        ringtoneRef.current.pause();
        callingSoundRef.current.pause();
        ringtoneRef.current.currentTime = 0;
        callingSoundRef.current.currentTime = 0;
    };

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    const showSidebar = !isMobile || (isMobile && !selectedConversation);
    const showChat = !isMobile || (isMobile && selectedConversation);

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p._id !== user._id);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const activeConversation = conversations.find(c => c._id === selectedConversation);
    const activeOther = activeConversation ? getOtherParticipant(activeConversation) : null;
    
    const activeItem = activeConversation ? (activeConversation.contextId || activeConversation.product || activeConversation.listing || activeConversation.item || null) : null;
    
    const getItemDetails = (item) => {
        if (!item) return { title: "Item", price: null, image: null, currency: "₹" };
        let title = item.title || item.name || "Item";
        let price = null;
        if (item.type === 'rent' && item.rentalPrice) {
             price = item.rentalPrice;
        } else {
             price = item.price || item.rent || item.salary || null;
        }
        let image = null;
        if (item.images && item.images.length > 0) {
            const first = item.images[0];
            image = typeof first === 'string' ? first : (first.url || null);
        } else if (item.image) {
            image = typeof item.image === 'string' ? item.image : (item.image.url || null);
        } else if (item.companyLogo) {
            image = item.companyLogo;
        }
        return { title, price, image, currency: item.currency || "₹" };
    };

    const { title: itemTitle, price: itemPrice, currency: baseCurrency } = getItemDetails(activeItem);
    const basePrice = itemPrice;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const clearProgressTimer = () => {
        if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
        }
    };

    const startIndeterminateProgress = () => {
        clearProgressTimer();
        setProgressVisible(true);
        setProgressValue(15);
        let dir = 1;
        progressTimerRef.current = setInterval(() => {
            setProgressValue((prev) => {
                let next = prev + (dir * 7);
                if (next >= 85) dir = -1;
                if (next <= 15) dir = 1;
                return Math.max(15, Math.min(85, next));
            });
        }, 200);
    };

    const startDeterminateProgress = () => {
        clearProgressTimer();
        setProgressVisible(true);
        setProgressValue(0);
        progressTimerRef.current = setInterval(() => {
            setProgressValue((prev) => Math.min(prev + 10, 85));
        }, 150);
    };

    const completeProgress = () => {
        setProgressValue(100);
        clearProgressTimer();
        setTimeout(() => {
            setProgressVisible(false);
            setProgressValue(0);
        }, 350);
    };

    useEffect(() => {
        if (conversationsLoading || messagesLoading) {
            startIndeterminateProgress();
        } else {
            if (progressVisible) completeProgress();
        }
        return clearProgressTimer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationsLoading, messagesLoading]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOfferMode]);

    useEffect(() => {
        if (isAuthenticated && accessToken && !socketInitRef.current) {
            socketInitRef.current = true;
            const newSocket = io(`${API}/chat`, {
                auth: { token: accessToken },
            });

            newSocket.on('connect', () => {
                console.log('Connected to chat socket');
            });

            newSocket.on('newMessage', () => {
                const store = useUserStore.getState();
                store.fetchConversations?.();
                if (store.selectedConversation) {
                    store.fetchMessages?.(store.selectedConversation);
                }
            });

            newSocket.on('messagesRead', () => {
                const store = useUserStore.getState();
                if (store.selectedConversation) {
                    store.fetchMessages?.(store.selectedConversation);
                }
            });

            newSocket.on('messageUpdated', () => {
                const store = useUserStore.getState();
                if (store.selectedConversation) {
                    store.fetchMessages?.(store.selectedConversation);
                }
            });

            newSocket.on('messageDeleted', () => {
                const store = useUserStore.getState();
                if (store.selectedConversation) {
                    store.fetchMessages?.(store.selectedConversation);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
                setSocket(null);
                socketInitRef.current = false;
            };
        }
    }, [isAuthenticated, accessToken]);

    // Join/leave conversation rooms
    useEffect(() => {
        if (!socket) return;
        if (selectedConversation) {
            socket.emit('joinConversation', { conversationId: selectedConversation });
        }
        return () => {
            if (selectedConversation) {
                socket.emit('leaveConversation', { conversationId: selectedConversation });
            }
        };
    }, [socket, selectedConversation]);

    // Call Socket Listeners
    useEffect(() => {
        if (!socket) return;

        socket.on("incomingCall", ({ from, name: callerName, signal, isVideo }) => {
            setReceivingCall(true);
            setCaller(from);
            setName(callerName);
            setCallerSignal(signal);
            setIsVideoCall(isVideo);
            setCallModalOpen(true);
        });

        socket.on("callAccepted", ({ signal }) => {
            setCallAccepted(true);
            connectionRef.current?.signal(signal);
        });

        socket.on("callEnded", () => {
            setCallEnded(true);
            setCallAccepted(false);
            setReceivingCall(false);
            setCallModalOpen(false);
            connectionRef.current?.destroy();
            setStream((currentStream) => {
                currentStream?.getTracks().forEach(track => track.stop());
                return null;
            });
            window.location.reload(); 
        });

        socket.on("callRejected", () => {
             toast.error("User is busy or rejected the call");
             setCallModalOpen(false);
             setCallAccepted(false);
             setReceivingCall(false);
             connectionRef.current?.destroy();
             setStream((currentStream) => {
                currentStream?.getTracks().forEach(track => track.stop());
                return null;
            });
        });

        return () => {
            socket.off("incomingCall");
            socket.off("callAccepted");
            socket.off("callEnded");
            socket.off("callRejected");
        };
    }, [socket]);

    const callUser = (id, video = false) => {
        setIsVideoCall(video);
        setCallModalOpen(true);
        setIsMuted(false);
        setIsCameraOff(false);
        
        // Play calling sound
        try {
            callingSoundRef.current.play().catch(e => console.log("Audio play failed", e));
        } catch (e) {
            console.error("Error playing calling sound:", e);
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast.error("Your browser does not support calling features.");
            setCallModalOpen(false);
            stopSounds();
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: video, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                const peer = new SimplePeer({
                    initiator: true,
                    trickle: false,
                    stream: currentStream,
                    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
                });

                peer.on("signal", (data) => {
                    socket.emit("callUser", {
                        userToCall: id,
                        signalData: data,
                        from: user._id,
                        name: user.name,
                        isVideo: video
                    });
                });

                peer.on("stream", (userStream) => {
                    if (userVideo.current) {
                        userVideo.current.srcObject = userStream;
                    }
                });

                connectionRef.current = peer;
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
                let msg = "Could not access camera/microphone.";
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    msg = "Permission denied. Please allow camera/microphone access in your browser settings.";
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    msg = "No camera or microphone found on this device.";
                } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                    msg = "Camera/microphone is already in use by another application.";
                }
                toast.error(msg);
                setCallModalOpen(false);
                stopSounds();
            });
    };

    const answerCall = () => {
        setCallAccepted(true);
        setIsMuted(false);
        setIsCameraOff(false);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
             toast.error("Your browser does not support calling features.");
             setCallModalOpen(false);
             setCallAccepted(false);
             setReceivingCall(false);
             return;
        }

        navigator.mediaDevices.getUserMedia({ video: isVideoCall, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }

                const peer = new SimplePeer({
                    initiator: false,
                    trickle: false,
                    stream: currentStream,
                    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
                });

                peer.on("signal", (data) => {
                    socket.emit("answerCall", { signal: data, to: caller });
                });

                peer.on("stream", (userStream) => {
                    if (userVideo.current) {
                        userVideo.current.srcObject = userStream;
                    }
                });

                peer.signal(callerSignal);
                connectionRef.current = peer;
            })
            .catch((err) => {
                console.error("Error accessing media devices:", err);
                let msg = "Could not access camera/microphone.";
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    msg = "Permission denied. Please allow camera/microphone access in your browser settings.";
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    msg = "No camera or microphone found on this device.";
                } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                    msg = "Camera/microphone is already in use by another application.";
                }
                toast.error(msg);
                // Clean up if error
                setCallModalOpen(false);
                setCallAccepted(false);
                setReceivingCall(false);
            });
    };

    const leaveCall = () => {
        setCallEnded(true);
        stopSounds();
        connectionRef.current?.destroy();
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCallModalOpen(false);
        setCallAccepted(false);
        setReceivingCall(false);
        
        // Notify other user
        const otherId = receivingCall ? caller : (activeOther?._id || activeOther?.id);
        if (otherId) {
            socket.emit("endCall", { to: otherId });
        }
        window.location.reload(); 
    };

    const toggleMute = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleCamera = () => {
        if (stream && isVideoCall) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsCameraOff(!videoTrack.enabled);
            }
        }
    };


    useEffect(() => {
        let mounted = true;
        (async () => {
            await checkAuth();
            if (mounted) setAuthReady(true);
        })();
        return () => { mounted = false; };
    }, [checkAuth]);

    useEffect(() => {
        if (authReady && isAuthenticated && accessToken && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            try {
                const store = useUserStore.getState();
                store.fetchConversations?.();
            } catch (e) { void e; }
        }
    }, [authReady, isAuthenticated, accessToken]);

    useEffect(() => {
        if (!selectedConversation) return;
        const store = useUserStore.getState();
        store.fetchMessages?.(selectedConversation);
        try {
            store.markMessagesRead?.(selectedConversation);
        } catch (e) { void e; }
        setIsOfferMode(false); // Reset offer mode on chat switch
        setNewMessage("");
    }, [selectedConversation]);
    
    const latestOffer = useMemo(() => {
        if (!messages.messages) return null;
        let max = 0;
        for (const m of messages.messages) {
             const offerMatch = (m.content || "").match(/(?:offer|price|deal).*(?:₹|rs\.?|inr)\s*([\d,]+)/i) || (m.content || "").match(/offer.*(?:₹|rs\.?|inr)\s*([\d,]+)/i);
             const amount = offerMatch ? parseInt(offerMatch[1].replace(/,/g, ''), 10) : 0;
             if (amount > max) max = amount;
        }
        return max || null;
    }, [messages]);

    useEffect(() => {
        const target = basePrice ? Number(basePrice) : null;
        if (!target) return;
        
        // Check if deal conditions met
        const list = messages.messages || [];
        for (const m of list) {
            const accept = /accept.*offer/i.test(m.content || "");
            const offerMatch = (m.content || "").match(/(?:offer|price|deal).*(?:₹|rs\.?|inr)\s*([\d,]+)/i) || (m.content || "").match(/offer.*(?:₹|rs\.?|inr)\s*([\d,]+)/i);
            const amount = offerMatch ? parseInt(offerMatch[1].replace(/,/g, ''), 10) : null;
            if (accept || (amount && amount >= target)) {
                setDealPopup({
                    text: 'Both parties meet the price requirement!',
                    amount,
                    target
                });
                break;
            }
        }
    }, [messages, basePrice]);

    const handleEditClick = (msg) => {
        setEditingMessageId(msg._id);
        setEditContent(msg.content);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditContent("");
    };

    const handleSaveEdit = async (msgId) => {
        const msg = messages.messages?.find(m => m._id === msgId);
        const hasAttachments = msg?.attachments?.length > 0;
        
        if (!editContent.trim() && !hasAttachments) return;
        
        try {
            await axios.put(`${API}/api/messages/${msgId}`, 
                { content: editContent }, 
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setEditingMessageId(null);
            setEditContent("");
        } catch (error) {
            console.error("Failed to edit message", error);
            toast.error("Failed to edit message");
        }
    };

    const handleDeleteMessage = async (msgId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await axios.delete(`${API}/api/messages/${msgId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        } catch (error) {
            console.error("Failed to delete message", error);
            toast.error("Failed to delete message");
        }
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        const hasText = !!newMessage.trim();
        const hasOffer = isOfferMode && !!offerAmount;
        const hasFiles = attachments.length > 0;
        if ((!hasText && !hasOffer && !hasFiles) || !selectedConversation) return;

        let textToSend = newMessage.trim();
        
        if (isOfferMode) {
            const v = parseInt(String(offerAmount).replace(/[^\d]/g, ""), 10);
            if (!v || Number.isNaN(v)) return;
            textToSend = `I would like to make an offer of ${baseCurrency} ${v.toLocaleString()}`;
        }

        startDeterminateProgress();
        let result;
        if (attachments.length > 0) {
            const uploadRes = await uploadMessageAttachments(attachments, (pct) => setAttachmentUploadPct(pct));
            if (uploadRes.success) {
                result = await sendMessageWithAttachments(selectedConversation, textToSend, uploadRes.urls);
            } else {
                clearProgressTimer();
                setProgressVisible(false);
                toast.error(uploadRes.error);
                return;
            }
        } else {
            result = await sendMessage(selectedConversation, textToSend);
        }
        if (result.success) {
            completeProgress();
            setNewMessage("");
            setOfferAmount("");
            setIsOfferMode(false);
            setAttachments([]);
            setAttachmentPreviews([]);
            setAttachmentUploadPct(0);
        } else {
            clearProgressTimer();
            setProgressVisible(false);
            toast.error(result.error);
        }
    };


    const getIdSafe = (entity) => {
        if (!entity) return '';
        if (typeof entity === 'string') return entity;
        return (entity._id || entity.id || '').toString();
    };
    const myId = getIdSafe(user);
    const isFromMe = (msg) => getIdSafe(msg.sender) === myId;

    const sortedConversations = useMemo(() => {
        const filtered = conversations.filter(c => {
            if (!searchTerm) return true;
            const other = getOtherParticipant(c);
            return other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        });
        const latestByUser = new Map();
        for (const c of filtered) {
            const other = getOtherParticipant(c);
            const key = other?._id || other?.id || "unknown";
            const time = c.lastMessage?.createdAt
                ? new Date(c.lastMessage.createdAt).getTime()
                : c.updatedAt ? new Date(c.updatedAt).getTime() : 0;
            const prev = latestByUser.get(key);
            if (!prev) latestByUser.set(key, { conv: c, time });
            else if (time > prev.time) latestByUser.set(key, { conv: c, time });
        }
        const deduped = Array.from(latestByUser.values()).map(v => v.conv);
        return deduped.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt
                ? new Date(a.lastMessage.createdAt).getTime()
                : a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const bTime = b.lastMessage?.createdAt
                ? new Date(b.lastMessage.createdAt).getTime()
                : b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return bTime - aTime;
        });
    }, [conversations, searchTerm, getOtherParticipant]);

    const quickTemplates = useMemo(() => {
        const common = [
            "Is this available?",
            "Interested!",
            "Price negotiable?",
            "Can I see it?"
        ];
        return common;
    }, []);

    if (!authReady) {
        return (
            <div style={styles.loadingOverlay}>
                <p style={{ color: '#6b7280', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Loading messages...</p>
            </div>
        );
    }

    if (!isAuthenticated || !accessToken) {
        return (
            <div style={styles.loginPrompt}>
                <Navbar />
                <div style={styles.emptyState}>
                    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>Please Log In</h2>
                        <p style={{ color: '#4b5563' }}>You need to be logged in to view your messages.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Product Context Bar
    const ProductContextBar = ({ item, price, currency, currentOffer, currentUser }) => {
        if (!item) return null;
        
        const target = price ? Number(price) : null;
        const offer = currentOffer ? Number(currentOffer) : 0;
        const progress = target ? Math.min(100, Math.round((offer / target) * 100)) : 0;

        const isOwner = currentUser && item.original && (
            (item.original.seller && (item.original.seller._id === currentUser._id || item.original.seller === currentUser._id)) ||
            (item.original.owner && (item.original.owner._id === currentUser._id || item.original.owner === currentUser._id))
        );

        const productId = item.original?._id || item.original?.id;

        return (
            <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#e2e8f0', flexShrink: 0 }}>
                        {item.image ? (
                            <img src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `${API}${item.image}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <ImageIcon size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{item.title}</h3>
                            {isOwner && productId && (
                                <Link 
                                    to={`/product/${productId}`}
                                    title="View/Edit Product"
                                    style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}
                                >
                                    <Edit2 size={14} />
                                </Link>
                            )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Asking Price: <span style={{ fontWeight: '600', color: '#2563eb' }}>{currency} {price ? Number(price).toLocaleString() : 'N/A'}</span>
                        </p>
                    </div>
                </div>
                {/* Negotiation Progress - Only show if base price exists */}
                {price && (
                    <div style={{ flex: 1, maxWidth: '200px', display: isMobile ? 'none' : 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '0.25rem', color: '#64748b' }}>
                            <span>Negotiation</span>
                            <span>{progress}% of Target</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                             <div style={{ 
                                 width: `${progress}%`, 
                                 height: '100%', 
                                 background: progress >= 100 ? '#22c55e' : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                                 transition: 'width 0.5s ease'
                             }} />
                        </div>
                        {currentOffer && (
                             <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#3b82f6', marginTop: '2px' }}>
                                 Offer: {currency} {Number(currentOffer).toLocaleString()}
                             </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <Navbar />
            
            <div style={styles.contentWrapper}>
                {/* Sidebar - Conversations List */}
                <div style={{
                    ...styles.sidebar,
                    display: showSidebar ? 'flex' : 'none',
                    width: isMobile ? '100%' : (isTablet ? '20rem' : '24rem')
                }}>
                    <div style={styles.sidebarHeader}>
                        <h1 style={styles.sidebarTitle}>Messages</h1>
                        <div style={styles.searchContainer}>
                            <Search style={styles.searchIcon} />
                            <input 
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div style={styles.conversationList}>
                        {conversationsLoading && <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>Loading conversations...</div>}
                        {!conversationsLoading && conversations.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                                <p>No conversations yet.</p>
                            </div>
                        )}
                        {sortedConversations.map((conversation) => {
                            const otherParticipant = getOtherParticipant(conversation);
                            const isActive = selectedConversation === conversation._id;
                            
                            return (
                                <div
                                    key={conversation._id}
                                    onClick={() => selectConversation(conversation._id)}
                                    style={{
                                        ...styles.conversationItem,
                                        ...(isActive ? styles.conversationItemActive : {}),
                                        backgroundColor: isActive ? '#eff6ff' : 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <Link 
                                        to={`/profile/${otherParticipant?._id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            ...styles.avatar,
                                            background: isActive ? '#2563eb' : 'linear-gradient(to bottom right, #60a5fa, #2563eb)',
                                            textDecoration: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff'
                                        }}
                                    >
                                        {otherParticipant?.avatar ? (
                                            <img src={otherParticipant.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            getInitials(otherParticipant?.name)
                                        )}
                                    </Link>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                            <Link 
                                                to={`/profile/${otherParticipant?._id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ textDecoration: 'none', color: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                                            >
                                                <h3 style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isActive ? '#1e3a8a' : '#1f2937' }}>
                                                    {otherParticipant?.name || 'Unknown'}
                                                </h3>
                                            </Link>
                                            <span style={{ fontSize: '0.75rem', color: isActive ? '#3b82f6' : '#9ca3af' }}>
                                                {conversation.lastMessage?.createdAt && format(new Date(conversation.lastMessage.createdAt), 'p')}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isActive ? 'rgba(29, 78, 216, 0.8)' : '#6b7280' }}>
                                            {conversation.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div style={{
                    ...styles.chatArea,
                    display: showChat ? 'flex' : 'none'
                }}>
                    {progressVisible && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            backgroundColor: '#e5e7eb',
                            overflow: 'hidden',
                            zIndex: 30
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progressValue}%`,
                                background: 'linear-gradient(90deg, #93c5fd 0%, #3b82f6 50%, #1d4ed8 100%)',
                                transition: 'width 200ms ease'
                            }} />
                        </div>
                    )}
                    {!selectedConversation ? (
                        <div style={styles.emptyState}>
                            <div style={{ width: '6rem', height: '6rem', backgroundColor: '#f9fafb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <ImageIcon style={{ width: '2.5rem', height: '2.5rem', color: '#d1d5db' }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>Select a conversation</h3>
                            <p style={{ fontSize: '0.875rem' }}>Choose a chat from the sidebar to start messaging</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div style={styles.chatHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button 
                                        onClick={() => selectConversation(null)}
                                        style={{ display: isMobile ? 'block' : 'none', padding: '0.5rem', marginLeft: '-0.5rem', borderRadius: '50%', color: '#4b5563', border: 'none', background: 'transparent' }}
                                    >
                                        <ArrowLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                    
                                    <Link to={`/profile/${activeOther?._id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'linear-gradient(to bottom right, #6366f1, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '600' }}>
                                                {activeOther?.avatar ? (
                                                    <img src={activeOther.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    getInitials(activeOther?.name)
                                                )}
                                            </div>
                                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '0.75rem', height: '0.75rem', backgroundColor: '#22c55e', border: '2px solid #fff', borderRadius: '50%' }}></div>
                                        </div>
                                        
                                        <div>
                                            <h2 style={{ fontWeight: '700', color: '#1f2937' }}>{activeOther?.name || 'Unknown User'}</h2>
                                            <p style={{ fontSize: '0.75rem', color: '#16a34a' }}>Online</p>
                                        </div>
                                    </Link>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => callUser(activeOther?._id || activeOther?.id, false)} title="Voice Call" style={{ padding: '0.5rem', borderRadius: '50%', color: '#3b82f6', border: 'none', background: '#eff6ff', cursor: 'pointer' }}>
                                        <Phone style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                    <button onClick={() => callUser(activeOther?._id || activeOther?.id, true)} title="Video Call" style={{ padding: '0.5rem', borderRadius: '50%', color: '#3b82f6', border: 'none', background: '#eff6ff', cursor: 'pointer' }}>
                                        <VideoIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                    <button style={{ padding: '0.5rem', borderRadius: '50%', color: '#9ca3af', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                        <MoreVertical style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                </div>
                            </div>

                            {/* Product Context Bar */}
                            {activeItem && (
                                <ProductContextBar 
                                    item={{
                                        title: itemTitle,
                                        image: getItemDetails(activeItem).image,
                                        original: activeItem
                                    }}
                                    price={itemPrice}
                                    currency={baseCurrency}
                                    currentUser={user}
                                />
                            )}

                            {/* Messages List */}
                            <div style={styles.messagesList}>
                                {messagesLoading && <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', padding: '1rem 0' }}>Loading history...</div>}
                                
                                {messages.messages?.map((msg, idx) => {
                                    const fromMe = isFromMe(msg);
                                    
                                    // Detect Offer Pattern
                                    const offerMatch = msg.content?.match(/(?:offer|price|deal).*(?:₹|rs\.?|inr)\s*([\d,]+)/i) || msg.content?.match(/offer.*(?:₹|rs\.?|inr)\s*([\d,]+)/i);
                                    const isOffer = !!offerMatch;
                                    const offerAmountVal = isOffer ? parseInt(offerMatch[1].replace(/,/g, ''), 10) : null;
                                    
                                    // Normalize target price
                                    const target = basePrice ? Number(basePrice) : null;

                                    const isHovered = hoveredMessageId === msg._id;
                                    const isEditing = editingMessageId === msg._id;

                                    return (
                                        <div 
                                            key={idx} 
                                            style={{ ...styles.messageRow, justifyContent: fromMe ? 'flex-end' : 'flex-start' }}
                                            onMouseEnter={() => setHoveredMessageId(msg._id)}
                                            onMouseLeave={() => setHoveredMessageId(null)}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: isMobile ? '85%' : '70%', alignItems: fromMe ? 'flex-end' : 'flex-start' }}>
                                                <div style={{
                                                    ...styles.messageBubble,
                                                    ...(fromMe ? styles.messageBubbleOwn : styles.messageBubbleOther),
                                                    ...(isOffer ? { border: '2px solid #fcd34d', boxShadow: '0 0 0 2px #fffbeb' } : {})
                                                }}>
                                                    {isOffer && !fromMe && target && (
                                                        <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: '0.25rem' }}>Offer Received</div>
                                                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{baseCurrency} {offerAmountVal?.toLocaleString()}</div>
                                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                                Original Price: {baseCurrency} {target.toLocaleString()} 
                                                                {offerAmountVal < target && <span style={{ color: '#16a34a', marginLeft: '0.25rem' }}>({Math.round(((target - offerAmountVal) / target) * 100)}% off)</span>}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isEditing ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                                                            <textarea 
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                style={{ 
                                                                    padding: '0.5rem', 
                                                                    borderRadius: '0.25rem', 
                                                                    border: '1px solid #d1d5db',
                                                                    fontSize: '0.875rem',
                                                                    color: '#1f2937',
                                                                    width: '100%',
                                                                    resize: 'none',
                                                                    fontFamily: 'inherit'
                                                                }}
                                                                rows={3}
                                                                autoFocus
                                                            />
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                <button onClick={handleCancelEdit} style={{ fontSize: '0.75rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                                                <button onClick={() => handleSaveEdit(msg._id)} style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Save</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                                                    )}

                                                    {/* Offer Actions for Receiver */}
                                                    {isOffer && !fromMe && (
                                                        <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                                            <button 
                                                                onClick={() => sendMessage(selectedConversation, `I accept your offer of ${baseCurrency} ${offerAmountVal?.toLocaleString('en-IN')}!`)}
                                                                style={{ flex: 1, backgroundColor: '#16a34a', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: 'none', cursor: 'pointer' }}
                                                            >
                                                                <Check style={{ width: '0.75rem', height: '0.75rem' }} /> Accept
                                                            </button>
                                                            <button 
                                                                onClick={() => sendMessage(selectedConversation, `Sorry, ${baseCurrency} ${offerAmountVal?.toLocaleString('en-IN')} is too low for me.`)}
                                                                style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', fontWeight: '700', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: 'none', cursor: 'pointer' }}
                                                            >
                                                                <X style={{ width: '0.75rem', height: '0.75rem' }} /> Decline
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    {isOffer && target && (
                                                        <div style={{ marginTop: '0.5rem' }}>
                                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                                Offer vs Asking: {Math.min(100, Math.round((offerAmountVal / target) * 100))}% 
                                                            </div>
                                                            <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '9999px', marginTop: '0.25rem' }}>
                                                                <div style={{ width: `${Math.min(100, Math.round((offerAmountVal / target) * 100))}%`, height: '100%', background: 'linear-gradient(90deg, #93c5fd 0%, #3b82f6 50%, #1d4ed8 100%)', borderRadius: '9999px' }} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                                        <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: msg.attachments.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.25rem', maxWidth: '300px' }}>
                                                            {msg.attachments.map((url, i) => {
                                                                const src = typeof url === 'string' ? url : url.url;
                                                                const fullSrc = src.startsWith('http') || src.startsWith('data:') ? src : `${API}${src}`;
                                                                return (
                                                                    <div key={i} 
                                                                        onClick={() => window.open(fullSrc, '_blank')}
                                                                        style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', cursor: 'pointer' }}
                                                                    >
                                                                        <img 
                                                                            src={fullSrc}
                                                                            alt="Attachment" 
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                                                                            referrerPolicy="no-referrer"
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                                                    <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                                                        {msg.createdAt && format(new Date(msg.createdAt), 'p')}
                                                    </span>
                                                    {fromMe && (
                                                        <>
                                                            {msg.read || msg.isRead ? <CheckCheck size={16} color="#3b82f6" /> : <CheckCheck size={16} color="#9ca3af" />}
                                                            
                                                            {isHovered && !isEditing && (
                                                                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
                                                                    {!isOffer && (
                                                                        <button onClick={() => handleEditClick(msg)} style={{ padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }} title="Edit">
                                                                            <Edit2 size={12} />
                                                                        </button>
                                                                    )}
                                                                    <button onClick={() => handleDeleteMessage(msg._id)} style={{ padding: '0', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex' }} title="Delete">
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={styles.inputArea}>
                                {/* Smart Replies */}
                                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '0.25rem', scrollbarWidth: 'none' }}>
                                    {quickTemplates.map((t, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setNewMessage(t)}
                                            style={{ whiteSpace: 'nowrap', padding: '0.375rem 0.75rem', backgroundColor: '#f9fafb', color: '#4b5563', fontSize: '0.75rem', fontWeight: '500', borderRadius: '9999px', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.color = '#2563eb'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563'; }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSendMessage} style={styles.inputForm}>
                                    {/* Make Offer Button Removed as per request */}
                                    
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {isOfferMode ? (
                                            <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 0.5rem' }}>
                                                <span style={{ color: '#6b7280', fontWeight: '700', marginRight: '0.5rem' }}>{baseCurrency}</span>
                                                <input
                                                    type="number"
                                                    value={offerAmount}
                                                    onChange={(e) => setOfferAmount(e.target.value)}
                                                    placeholder="Enter offer amount..."
                                                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#1f2937', fontWeight: '500', height: '24px' }}
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <textarea
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                                placeholder="Type a message..."
                                                style={styles.textarea}
                                                rows={1}
                                            />
                                        )}
                                    </div>
                                    
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            if (!files.length) return;
                                            setAttachments(files);
                                            const previews = files.map((f) => URL.createObjectURL(f));
                                            setAttachmentPreviews(previews);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ padding: '0.5rem', borderRadius: '0.75rem', transition: 'all 0.2s', flexShrink: 0, backgroundColor: attachments.length ? '#eef2ff' : 'transparent', color: attachments.length ? '#4f46e5' : '#6b7280', border: 'none', cursor: 'pointer' }}
                                        title="Attach images"
                                    >
                                        <ImageIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>

                                    <button 
                                        type="submit"
                                        disabled={(!(newMessage.trim() || (isOfferMode && offerAmount) || attachments.length))}
                                        style={{
                                            ...styles.sendButton,
                                            backgroundColor: (newMessage.trim() || (isOfferMode && offerAmount) || attachments.length) ? '#2563eb' : '#e5e7eb',
                                            color: (newMessage.trim() || (isOfferMode && offerAmount) || attachments.length) ? '#fff' : '#9ca3af',
                                            cursor: (newMessage.trim() || (isOfferMode && offerAmount) || attachments.length) ? 'pointer' : 'not-allowed',
                                            boxShadow: (newMessage.trim() || (isOfferMode && offerAmount) || attachments.length) ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
                                        }}
                                    >
                                        <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>
                                </form>
                                
                                {attachmentPreviews.length > 0 && (
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {attachmentPreviews.map((src, i) => (
                                            <div key={i} style={{ width: '64px', height: '64px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e7eb', position: 'relative' }}>
                                                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        ))}
                                        {attachmentUploadPct > 0 && attachmentUploadPct < 100 && (
                                            <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '9999px' }}>
                                                <div style={{ width: `${attachmentUploadPct}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '9999px' }} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {dealPopup && (
                <div style={{ position: 'fixed', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ecfccb', color: '#166534', padding: '0.75rem 1rem', borderRadius: '0.75rem', boxShadow: '0 8px 16px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 50 }}>
                    <span style={{ fontWeight: '700' }}>Great Match!</span>
                    <span>{dealPopup.text}</span>
                    <button onClick={() => setDealPopup(null)} style={{ marginLeft: '0.5rem', background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer' }}>
                        <X style={{ width: '1rem', height: '1rem' }} />
                    </button>
                </div>
            )}

            {/* Call Modal */}
            {callModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#1f2937',
                        padding: '2rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        maxWidth: '90%',
                        width: '400px',
                        color: 'white'
                    }}>
                        {/* Video Area */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            {callAccepted && !callEnded && (
                                <video playsInline ref={userVideo} autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                            
                            {/* My Video (Picture in Picture) */}
                            {stream && (
                                <video 
                                    playsInline 
                                    muted 
                                    ref={myVideo} 
                                    autoPlay 
                                    style={{ 
                                        position: 'absolute', 
                                        bottom: '10px', 
                                        right: '10px', 
                                        width: '100px', 
                                        borderRadius: '0.5rem', 
                                        border: '2px solid white',
                                        display: isVideoCall ? 'block' : 'none'
                                    }} 
                                />
                            )}
                            
                            {!callAccepted && (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', overflow: 'hidden', border: '4px solid #3b82f6' }}>
                                        {/* Avatar placeholder */}
                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                            {name ? name[0] : (activeOther?.name?.[0] || 'U')}
                                        </div>
                                    </div>
                                    <p>{receivingCall ? `${name} is calling...` : `Calling ${activeOther?.name || 'User'}...`}</p>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={toggleMute} style={{ padding: '1rem', borderRadius: '50%', backgroundColor: isMuted ? '#ef4444' : '#374151', color: 'white', border: 'none', cursor: 'pointer' }}>
                                {isMuted ? <MicOff /> : <Mic />}
                            </button>
                            {isVideoCall && (
                                <button onClick={toggleCamera} style={{ padding: '1rem', borderRadius: '50%', backgroundColor: isCameraOff ? '#ef4444' : '#374151', color: 'white', border: 'none', cursor: 'pointer' }}>
                                    {isCameraOff ? <VideoOff /> : <VideoIcon />}
                                </button>
                            )}
                            <button onClick={leaveCall} style={{ padding: '1rem', borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>
                                <Phone style={{ transform: 'rotate(135deg)' }} />
                            </button>
                        </div>
                        
                        {receivingCall && !callAccepted && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={answerCall} style={{ backgroundColor: '#22c55e', color: 'white', padding: '0.75rem 2rem', borderRadius: '2rem', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                                    Answer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
