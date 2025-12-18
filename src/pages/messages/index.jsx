import React, { useEffect, useState, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import Navbar from "../../components/navbar.jsx";
import { useUserStore } from "../../store/userStore.js";
import { format } from "date-fns";
import { Send, ArrowLeft, MoreVertical, Image as ImageIcon, Tag, Check, X, Search } from "lucide-react";
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
    
    useEffect(() => {
        const target = basePrice ? Number(basePrice) : null;
        if (!target) return;
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
                alert(uploadRes.error);
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
            alert(result.error);
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
                                    <div style={{
                                        ...styles.avatar,
                                        background: isActive ? '#2563eb' : 'linear-gradient(to bottom right, #60a5fa, #2563eb)'
                                    }}>
                                        {otherParticipant?.avatar ? (
                                            <img src={otherParticipant.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            getInitials(otherParticipant?.name)
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                                            <h3 style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isActive ? '#1e3a8a' : '#1f2937' }}>
                                                {otherParticipant?.name || 'Unknown'}
                                            </h3>
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
                                        {activeItem && (
                                            <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <span>Active on:</span>
                                                <span style={{ fontWeight: '500', color: '#2563eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>{itemTitle}</span>
                                                {basePrice && <span style={{ color: '#9ca3af' }}>• {baseCurrency} {Number(basePrice).toLocaleString()}</span>}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button style={{ padding: '0.5rem', borderRadius: '50%', color: '#9ca3af', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                    <MoreVertical style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                            </div>

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

                                    return (
                                        <div key={idx} style={{ ...styles.messageRow, justifyContent: fromMe ? 'flex-end' : 'flex-start' }}>
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

                                                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>

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
                                                        <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.25rem' }}>
                                                            {msg.attachments.map((url, i) => (
                                                                <div key={i} style={{ width: '100%', aspectRatio: '1', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6' }}>
                                                                    <img 
                                                                        src={typeof url === 'string' ? url : url.url} 
                                                                        alt="Attachment" 
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                                                                        referrerPolicy="no-referrer"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <span style={{ fontSize: '0.625rem', color: '#9ca3af', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                                                    {msg.createdAt && format(new Date(msg.createdAt), 'p')}
                                                </span>
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
                                    <button 
                                        type="button"
                                        onClick={() => setIsOfferMode(!isOfferMode)}
                                        style={{ padding: '0.5rem', borderRadius: '0.75rem', transition: 'all 0.2s', flexShrink: 0, backgroundColor: isOfferMode ? '#fef3c7' : 'transparent', color: isOfferMode ? '#b45309' : '#6b7280', border: 'none', cursor: 'pointer' }}
                                        title="Make an Offer"
                                    >
                                        <Tag style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </button>

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
        </div>
    );
}
