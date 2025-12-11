import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "../../components/navbar.jsx";
import useUserStore from "../../store/userStore.js";

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
        fetchConversations,
        selectConversation,
        sendMessage,
        isAuthenticated,
        user,
        accessToken,
    } = useUserStore();

    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            // Initialize socket connection
            const newSocket = io(`${API}/chat`, {
                auth: { token: accessToken },
            });

            newSocket.on('connect', () => {
                console.log('Connected to chat socket');
            });

            newSocket.on('newMessage', (messageData) => {
                console.log('New message received:', messageData);
                // Refresh messages for the current conversation
                if (selectedConversation) {
                    fetchConversations(); // Refresh conversations to update lastMessage
                    // Re-fetch messages for current conversation
                    const currentConversation = conversations.find(c => c._id === selectedConversation);
                    if (currentConversation) {
                        selectConversation(selectedConversation);
                    }
                }
            });

            newSocket.on('messagesRead', (data) => {
                console.log('Messages marked as read:', data);
                // Refresh messages
                if (selectedConversation) {
                    selectConversation(selectedConversation);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isAuthenticated, accessToken, selectedConversation, fetchConversations, selectConversation, conversations]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchConversations();
        }
    }, [isAuthenticated, fetchConversations]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const result = await sendMessage(selectedConversation, newMessage.trim());
        if (result.success) {
            setNewMessage("");
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

    const sortedConversations = [...conversations].sort((a, b) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime; // latest first
    });

    if (!isAuthenticated) {
        return (
            <>
                <Navbar />
                <div style={styles.loginPrompt}>
                    <p>Please log in to view your messages.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={styles.pageContainer}>
                <div style={styles.mainContainer}>
                    {/* Conversations List */}
                    <div style={styles.conversationsContainer}>
                        <h3 style={styles.conversationsHeader}>Your Conversations</h3>
                        {conversationsLoading && <p style={styles.loadingText}>Loading conversations...</p>}
                        {conversationsError && <p style={styles.errorText}>{conversationsError}</p>}
                        {!conversationsLoading && conversations.length === 0 && <p style={styles.noConversationsText}>No conversations yet.</p>}
                        <div style={styles.conversationsList}>
                            {sortedConversations.map((conversation) => {
                                const otherParticipant = getOtherParticipant(conversation);
                                return (
                                    <div
                                        key={conversation._id}
                                        onClick={() => selectConversation(conversation._id)}
                                        style={{
                                            ...styles.conversationItem,
                                            ...(selectedConversation === conversation._id ? styles.conversationItemSelected : {}),
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.conversationItemHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = selectedConversation === conversation._id ? styles.conversationItemSelected.backgroundColor : styles.conversationItem.backgroundColor}
                                    >
                                        <div style={styles.conversationAvatar}>
                                            {getInitials(otherParticipant?.name)}
                                        </div>
                                        <div style={styles.conversationContent}>
                                            <div style={styles.conversationName}>{otherParticipant?.name || 'Unknown User'}</div>
                                            <div style={styles.conversationLastMessage}>
                                                {conversation.lastMessage?.content || 'No messages yet'}
                                            </div>
                                            <div style={styles.conversationTime}>
                                                {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleString() : ''}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Messages View */}
                    <div style={styles.messagesContainer}>
                        {selectedConversation ? (
                            <>
                                <div style={styles.chatHeader}>
                                    <div style={styles.chatHeaderAvatar}>{getInitials(activeOther?.name)}</div>
                                    <div style={styles.chatHeaderInfo}>
                                        <div style={styles.chatHeaderName}>{activeOther?.name || 'Unknown User'}</div>
                                        <div style={styles.chatHeaderStatus}>Chat</div>
                                    </div>
                                </div>
                                {messagesLoading && <p style={styles.loadingText}>Loading messages...</p>}
                                {messagesError && <p style={styles.errorText}>{messagesError}</p>}
                                <div style={styles.messagesList}>
                                    {messages.messages && messages.messages.length > 0 ? (
                                        messages.messages.map((message) => (
                                            <div
                                                key={message._id}
                                                style={{
                                                    ...styles.messageBubble,
                                                    ...(message.sender._id === user._id ? styles.messageBubbleSent : styles.messageBubbleReceived),
                                                }}
                                            >
                                                <div style={styles.messageContent}>{message.content}</div>
                                                <div style={message.sender._id === user._id ? styles.messageTime : { ...styles.messageTime, ...styles.messageTimeReceived }}>
                                                    {new Date(message.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={styles.noMessagesText}>No messages in this conversation.</p>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} style={styles.inputForm}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        style={styles.messageInput}
                                        onFocus={(e) => e.target.style.borderColor = styles.messageInputFocus.borderColor}
                                        onBlur={(e) => e.target.style.borderColor = styles.messageInput.borderColor}
                                    />
                                    <button
                                        type="submit"
                                        style={styles.sendButton}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.sendButtonHover.backgroundColor}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.sendButton.backgroundColor}
                                    >
                                        <span style={styles.sendIcon}>➤</span>
                                        Send
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={styles.noConversationSelected}>
                                <p>Select a conversation to view messages.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    pageContainer: {
        width: "100vw",
        minHeight: "calc(100vh - 64px)",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "88px 32px 32px",
        boxSizing: "border-box",
        border: "1px solid black",
        borderRadius: "14px",
    },
    mainContainer: {
        width: "100%",
        maxWidth: "1280px",
        height: "calc(100vh - 180px)",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        gap: "20px",
        border: "1px solid black",
        borderRadius: "14px",
        boxSizing: "border-box",
    },
    loginPrompt: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40vh",
        color: "#334155",
        fontSize: "16px",
    },
    loadingText: {
        color: "#64748b",
        fontSize: "14px",
    },
    errorText: {
        color: "#ef4444",
        fontSize: "14px",
        fontWeight: 600,
    },
    noConversationsText: {
        color: "#94a3b8",
        fontSize: "14px",
    },
    conversationsContainer: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        boxShadow: "0 10px 30px -15px rgba(0,0,0,0.25)",
        padding: "16px",
        boxSizing: "border-box",
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
    },
    conversationsList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflowY: "auto",
        justifyContent: "flex-start",
    },
    conversationsHeader: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#0f172a",
        marginBottom: "12px",
    },
    conversationItem: {
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        gap: "12px",
        alignItems: "center",
        padding: "10px",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.2s",
    },
    conversationItemHover: {
        backgroundColor: "#f1f5f9",
    },
    conversationItemSelected: {
        backgroundColor: "#f0f9ff",
        borderColor: "#bae6fd",
    },
    conversationAvatar: {
        height: "44px",
        width: "44px",
        borderRadius: "50%",
        background: "#0ea5e9",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 700,
        letterSpacing: "0.5px",
        boxShadow: "0 6px 16px rgba(14,165,233,0.35)",
        userSelect: "none",
    },
    conversationContent: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "4px",
    },
    conversationName: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#0f172a",
    },
    conversationLastMessage: {
        fontSize: "13px",
        color: "#64748b",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    conversationTime: {
        fontSize: "11px",
        color: "#94a3b8",
    },
    messagesContainer: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        boxShadow: "0 10px 30px -15px rgba(0,0,0,0.25)",
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        overflow: "hidden",
    },
    messagesHeader: {
        padding: "14px 16px",
        fontSize: "16px",
        fontWeight: 700,
        color: "#0f172a",
        borderBottom: "1px solid #e2e8f0",
    },
    chatHeader: {
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderBottom: "1px solid #e2e8f0",
        background: "#ffffff",
    },
    chatHeaderAvatar: {
        height: "44px",
        width: "44px",
        borderRadius: "50%",
        background: "#0ea5e9",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 700,
        boxShadow: "0 6px 16px rgba(14,165,233,0.35)",
    },
    chatHeaderInfo: {
        display: "grid",
        gridTemplateRows: "auto auto",
        gap: "2px",
    },
    chatHeaderName: {
        fontSize: "15px",
        fontWeight: 700,
        color: "#0f172a",
    },
    chatHeaderStatus: {
        fontSize: "12px",
        color: "#94a3b8",
    },
    messagesList: {
        padding: "16px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "#f8fafc",
        height: "100%",
    },
    messageBubble: {
        maxWidth: "68%",
        borderRadius: "18px",
        padding: "10px 12px",
        display: "inline-flex",
        flexDirection: "column",
        gap: "6px",
        border: "1px solid transparent",
    },
    messageBubbleSent: {
        alignSelf: "flex-end",
        background: "#dcfce7",
        borderColor: "#bbf7d0",
        borderTopRightRadius: "6px",
    },
    messageBubbleReceived: {
        alignSelf: "flex-start",
        background: "#ffffff",
        borderColor: "#e2e8f0",
        borderTopLeftRadius: "6px",
    },
    messageContent: {
        fontSize: "14px",
        color: "#0f172a",
        lineHeight: 1.5,
        wordBreak: "break-word",
    },
    messageTime: {
        fontSize: "11px",
        color: "#64748b",
        textAlign: "right",
        marginTop: "2px",
    },
    messageTimeReceived: {
        textAlign: "left",
    },
    noMessagesText: {
        fontSize: "14px",
        color: "#94a3b8",
        textAlign: "center",
        padding: "12px 0",
    },
    inputForm: {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "12px",
        padding: "12px",
        borderTop: "1px solid #e2e8f0",
        background: "#ffffff",
    },
    messageInput: {
        width: "100%",
        padding: "12px 14px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        outline: "none",
        fontSize: "14px",
        background: "#f8fafc",
        color: "#0f172a",
        boxSizing: "border-box",
    },
    messageInputFocus: {
        borderColor: "#3b82f6",
    },
    sendButton: {
        padding: "12px 18px",
        borderRadius: "10px",
        backgroundColor: "#0ea5e9",
        color: "#ffffff",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 6px 16px rgba(14,165,233,0.35)",
    },
    sendButtonHover: {
        backgroundColor: "#0284c7",
    },
    sendIcon: {
        display: "inline-block",
        transform: "translateY(1px)",
    },
    noConversationSelected: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#94a3b8",
        fontSize: "15px",
    },
};
