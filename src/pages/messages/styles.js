export const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9fafb', // bg-gray-50
        overflow: 'hidden',
    },
    contentWrapper: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        maxWidth: '80rem', // max-w-7xl
        margin: '0 auto',
        width: '100%',
        padding: '0.5rem', // p-2 (default)
        gap: '1rem', // gap-4
        height: 'calc(100vh - 64px)',
    },
    // Sidebar
    sidebar: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '1rem', // rounded-2xl
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
        border: '1px solid #e5e7eb', // border-gray-200
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    sidebarHeader: {
        padding: '1rem',
        borderBottom: '1px solid #f3f4f6', // border-gray-100
    },
    sidebarTitle: {
        fontSize: '1.5rem', // text-2xl
        fontWeight: '700', // font-bold
        color: '#1f2937', // text-gray-800
        marginBottom: '1rem',
    },
    searchContainer: {
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af', // text-gray-400
        width: '1rem',
        height: '1rem',
    },
    searchInput: {
        width: '100%',
        paddingLeft: '2.5rem', // pl-10
        paddingRight: '1rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        backgroundColor: '#f9fafb', // bg-gray-50
        border: '1px solid #e5e7eb', // border-gray-200
        borderRadius: '0.75rem', // rounded-xl
        outline: 'none',
        fontSize: '0.875rem', // text-sm
        transition: 'all 0.2s',
    },
    conversationList: {
        flex: 1,
        overflowY: 'auto',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem', // space-y-1
    },
    conversationItem: {
        padding: '0.75rem',
        borderRadius: '0.75rem', // rounded-xl
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem', // gap-3
    },
    conversationItemActive: {
        backgroundColor: '#eff6ff', // bg-blue-50
        boxShadow: '0 0 0 1px #dbeafe', // ring-1 ring-blue-100
    },
    avatar: {
        width: '3rem', // w-12
        height: '3rem', // h-12
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '600',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        objectFit: 'cover',
    },
    // Main Chat
    chatArea: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
    },
    emptyState: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af', // text-gray-400
        padding: '2rem',
    },
    chatHeader: {
        padding: '1rem 1.5rem', // px-6 py-4
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 10,
    },
    messagesList: {
        flex: 1,
        overflowY: 'auto',
        padding: '1rem', // p-4
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem', // space-y-6
        backgroundColor: '#f8fafc',
    },
    messageRow: {
        display: 'flex',
        width: '100%',
    },
    messageBubble: {
        padding: '0.75rem 1.25rem', // px-5 py-3
        borderRadius: '1rem', // rounded-2xl
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        fontSize: '15px',
        lineHeight: '1.625',
        position: 'relative',
        maxWidth: '100%',
        wordBreak: 'break-word',
    },
    messageBubbleOwn: {
        backgroundColor: '#2563eb', // bg-blue-600
        color: '#fff',
        borderBottomRightRadius: '0',
    },
    messageBubbleOther: {
        backgroundColor: '#fff',
        color: '#1f2937', // text-gray-800
        border: '1px solid #f3f4f6', // border-gray-100
        borderBottomLeftRadius: '0',
    },
    inputArea: {
        padding: '1rem',
        backgroundColor: '#fff',
        borderTop: '1px solid #f3f4f6',
        zIndex: 20,
    },
    inputForm: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '0.5rem',
        backgroundColor: '#f9fafb',
        padding: '0.5rem',
        borderRadius: '1rem', // rounded-2xl
        border: '1px solid #e5e7eb',
    },
    textarea: {
        width: '100%',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#1f2937',
        resize: 'none',
        maxHeight: '8rem',
        padding: '0.5rem 0',
        minHeight: '40px',
        fontSize: '15px',
    },
    sendButton: {
        padding: '0.625rem', // p-2.5
        borderRadius: '0.75rem', // rounded-xl
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    loadingOverlay: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
    },
    loginPrompt: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9fafb',
    }
};
