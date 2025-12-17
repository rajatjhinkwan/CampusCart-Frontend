import React, { useEffect, useState, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import Navbar from "../../components/navbar.jsx";
import { useUserStore } from "../../store/userStore.js";
import { format } from "date-fns";
import { Send, ArrowLeft, MoreVertical, Image as ImageIcon, Tag, Check, X, Search } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function MessagesPage() {
    const {
        conversations,
        selectedConversation,
        messages,
        conversationsLoading,
        messagesLoading,
        conversationsError,
        messagesError,
        selectConversation,
        sendMessage,
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

            newSocket.on('newMessage', (messageData) => {
                const store = useUserStore.getState();
                store.fetchConversations?.();
                if (store.selectedConversation) {
                    store.fetchMessages?.(store.selectedConversation);
                }
            });

            newSocket.on('messagesRead', (data) => {
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

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if ((!newMessage.trim() && !isOfferMode) || !selectedConversation) return;

        let textToSend = newMessage.trim();
        
        if (isOfferMode) {
            const v = parseInt(String(offerAmount).replace(/[^\d]/g, ""), 10);
            if (!v || Number.isNaN(v)) return;
            textToSend = `I would like to make an offer of ${baseCurrency} ${v.toLocaleString()}`;
        }

        const result = await sendMessage(selectedConversation, textToSend);
        if (result.success) {
            setNewMessage("");
            setOfferAmount("");
            setIsOfferMode(false);
        } else {
            alert(result.error);
        }
    };

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p._id !== user._id);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const activeConversation = conversations.find(c => c._id === selectedConversation);
    const activeOther = activeConversation ? getOtherParticipant(activeConversation) : null;
    
    // Resolve active item
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

    const { title: itemTitle, price: itemPrice, image: itemImage, currency: baseCurrency } = getItemDetails(activeItem);
    const basePrice = itemPrice;

    const getIdSafe = (entity) => {
        if (!entity) return '';
        if (typeof entity === 'string') return entity;
        return (entity._id || entity.id || '').toString();
    };
    const myId = getIdSafe(user);
    const isFromMe = (msg) => getIdSafe(msg.sender) === myId;

    const sortedConversations = useMemo(() => {
        return [...conversations]
            .filter(c => {
                if (!searchTerm) return true;
                const other = getOtherParticipant(c);
                return other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => {
                const aTime = a.lastMessage?.createdAt
                    ? new Date(a.lastMessage.createdAt).getTime()
                    : a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const bTime = b.lastMessage?.createdAt
                    ? new Date(b.lastMessage.createdAt).getTime()
                    : b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                return bTime - aTime;
            });
    }, [conversations, searchTerm]);

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
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 animate-pulse">Loading messages...</p>
            </div>
        );
    }

    if (!isAuthenticated || !accessToken) {
        return (
            <div className="h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Please Log In</h2>
                        <p className="text-gray-600">You need to be logged in to view your messages.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            <Navbar />
            
            <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-2 sm:p-4 gap-4 h-[calc(100vh-64px)]">
                {/* Sidebar - Conversations List */}
                <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-white rounded-2xl shadow-sm border border-gray-200 flex-col overflow-hidden`}>
                    <div className="p-4 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {conversationsLoading && <div className="p-4 text-center text-gray-500 text-sm">Loading conversations...</div>}
                        {!conversationsLoading && conversations.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
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
                                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 group ${
                                        isActive 
                                            ? "bg-blue-50 ring-1 ring-blue-100" 
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ${isActive ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                                        {otherParticipant?.avatar ? (
                                            <img src={otherParticipant.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            getInitials(otherParticipant?.name)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-semibold truncate ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
                                                {otherParticipant?.name || 'Unknown'}
                                            </h3>
                                            <span className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                                                {conversation.lastMessage?.createdAt && format(new Date(conversation.lastMessage.createdAt), 'p')}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${isActive ? 'text-blue-700/80' : 'text-gray-500 group-hover:text-gray-600'}`}>
                                            {conversation.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={`${!selectedConversation ? 'hidden md:flex' : 'flex'} flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex-col overflow-hidden relative`}>
                    {!selectedConversation ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <ImageIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
                            <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm z-10">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => selectConversation(null)}
                                        className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                            {activeOther?.avatar ? (
                                                <img src={activeOther.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                getInitials(activeOther?.name)
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    
                                    <div>
                                        <h2 className="font-bold text-gray-800">{activeOther?.name || 'Unknown User'}</h2>
                                        {activeItem && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <span>Active on:</span>
                                                <span className="font-medium text-blue-600 truncate max-w-[150px]">{itemTitle}</span>
                                                {basePrice && <span className="text-gray-400">• {baseCurrency} {Number(basePrice).toLocaleString()}</span>}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#f8fafc]">
                                {messagesLoading && <div className="text-center text-gray-400 text-xs py-4">Loading history...</div>}
                                
                                {messages.messages?.map((msg, idx) => {
                                    const fromMe = isFromMe(msg);
                                    
                                    // Detect Offer Pattern
                                    const offerMatch = msg.content?.match(/(?:offer|price|deal).*(?:₹|rs\.?|inr)\s*([\d,]+)/i) || msg.content?.match(/offer.*(?:₹|rs\.?|inr)\s*([\d,]+)/i);
                                    const isOffer = !!offerMatch;
                                    const offerAmountVal = isOffer ? parseInt(offerMatch[1].replace(/,/g, ''), 10) : null;
                                    
                                    // Normalize target price
                                    const target = basePrice ? Number(basePrice) : null;

                                    return (
                                        <div key={idx} className={`flex w-full ${fromMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${fromMe ? 'items-end' : 'items-start'}`}>
                                                <div 
                                                    className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative group
                                                    ${fromMe 
                                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                                    }
                                                    ${isOffer ? 'border-2 border-amber-300 ring-2 ring-amber-50' : ''}
                                                    `}
                                                >
                                                    {isOffer && !fromMe && target && (
                                                        <div className="mb-3 pb-3 border-b border-gray-100">
                                                            <div className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Offer Received</div>
                                                            <div className="text-2xl font-bold text-gray-900">{baseCurrency} {offerAmountVal?.toLocaleString()}</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Original Price: {baseCurrency} {target.toLocaleString()} 
                                                                {offerAmountVal < target && <span className="text-green-600 ml-1">({Math.round(((target - offerAmountVal) / target) * 100)}% off)</span>}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="whitespace-pre-wrap">{msg.content}</div>

                                                    {/* Offer Actions for Receiver */}
                                                    {isOffer && !fromMe && (
                                                        <div className="mt-3 pt-2 flex gap-2">
                                                            <button 
                                                                onClick={() => sendMessage(selectedConversation, `I accept your offer of ${baseCurrency} ${offerAmountVal?.toLocaleString()}!`)}
                                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                                            >
                                                                <Check className="w-3 h-3" /> Accept
                                                            </button>
                                                            <button 
                                                                onClick={() => sendMessage(selectedConversation, `Sorry, ${baseCurrency} ${offerAmountVal?.toLocaleString()} is too low for me.`)}
                                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                                            >
                                                                <X className="w-3 h-3" /> Decline
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                                    {msg.createdAt && format(new Date(msg.createdAt), 'p')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100 z-20">
                                {/* Smart Replies */}
                                <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
                                    {quickTemplates.map((t, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setNewMessage(t)}
                                            className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 text-xs font-medium rounded-full border border-gray-200 hover:border-blue-200 transition-all"
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                                    <button 
                                        type="button"
                                        onClick={() => setIsOfferMode(!isOfferMode)}
                                        className={`p-2 rounded-xl transition-colors flex-shrink-0 ${isOfferMode ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-200 text-gray-500'}`}
                                        title="Make an Offer"
                                    >
                                        <Tag className="w-5 h-5" />
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        {isOfferMode ? (
                                            <div className="flex items-center h-full px-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                <span className="text-gray-500 font-bold mr-2">{baseCurrency}</span>
                                                <input
                                                    type="number"
                                                    value={offerAmount}
                                                    onChange={(e) => setOfferAmount(e.target.value)}
                                                    placeholder="Enter offer amount..."
                                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-800 font-medium placeholder:text-gray-400 h-[24px]"
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
                                                className="w-full bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-400 resize-none max-h-32 py-2 min-h-[40px] text-[15px]"
                                                rows={1}
                                            />
                                        )}
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={(!newMessage.trim() && !isOfferMode) || (isOfferMode && !offerAmount)}
                                        className={`p-2.5 rounded-xl flex-shrink-0 transition-all duration-200 ${
                                            (newMessage.trim() || (isOfferMode && offerAmount))
                                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
