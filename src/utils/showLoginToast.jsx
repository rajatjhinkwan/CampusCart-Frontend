import React from 'react';
import toast from 'react-hot-toast';
import { User, Lock } from 'lucide-react';

const showLoginToast = () => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      style={{
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
        transition: 'all 0.5s ease'
      }}
    >
      <div 
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563eb'
        }}
      >
        <Lock size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
          Please Log In
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
          Log in to message sellers, access your dashboard, and more.
        </p>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px'
        }}
      >
        ✕
      </button>
    </div>
  ), {
    duration: 4000,
    position: 'top-center',
  });
};

export default showLoginToast;
