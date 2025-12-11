// src/pages/TestNotifications.jsx
import React from 'react';
import useUserStore from '../store/userStore';

const TestNotifications = () => {
  const { 
    notifications, 
    unreadCount,
    markAsRead,
    markAllAsRead,
    simulateNotification 
  } = useUserStore();

  const notificationTypes = [
    "New message from John",
    "Your post got 5 new likes",
    "Alice started following you",
    "Your order has been shipped",
    "New update available"
  ];

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '1rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Notification Tester</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Test Notifications</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {notificationTypes.map((text, index) => (
            <button
              key={index}
              onClick={() => simulateNotification(text)}
              style={{
                padding: '8px 12px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send: "{text}"
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #eee'
        }}>
          <h3>Notifications ({unreadCount} unread)</h3>
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            style={{
              padding: '6px 12px',
              background: unreadCount > 0 ? '#2196F3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: unreadCount > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            Mark all as read
          </button>
        </div>

        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              No notifications yet. Use the buttons above to test.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: notification.isRead ? '#fff' : '#f8f9ff',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{notification.message}</span>
                  {!notification.isRead && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#2196F3'
                    }}></span>
                  )}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#666',
                  marginTop: '4px'
                }}>
                  {new Date(notification.date).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;