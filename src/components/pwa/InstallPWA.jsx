import React, { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    // Check if already in standalone mode
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    if (isInStandaloneMode) {
      return; // Don't show if already installed
    }

    // Android / Desktop event
    const handler = (e) => {
      e.preventDefault();
      setPromptInstall(e);
      setSupportsPWA(true);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show banner for iOS too if not installed
    if (isIosDevice) {
        setShowBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onInstallClick = (e) => {
    e.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            setShowBanner(false);
        }
    });
  };

  const onClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  // Inline Styles Object
  const styles = {
    banner: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 9999,
      border: '1px solid #e5e7eb',
      maxWidth: '400px',
      margin: '0 auto', // Center on desktop
      animation: 'slideUp 0.3s ease-out'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start'
    },
    titleBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#111827',
      margin: 0
    },
    description: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '4px'
    },
    actionArea: {
        marginTop: '8px'
    },
    installButton: {
      width: '100%',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background-color 0.2s'
    },
    iosInstructions: {
        fontSize: '13px',
        color: '#4b5563',
        backgroundColor: '#f3f4f6',
        padding: '12px',
        borderRadius: '8px',
        lineHeight: '1.5'
    },
    iosIcon: {
        verticalAlign: 'middle',
        margin: '0 4px'
    }
  };

  return (
    <div style={styles.banner}>
      <div style={styles.header}>
        <div style={styles.titleBox}>
            <h3 style={styles.title}>Install App</h3>
            <p style={styles.description}>Add to home screen for better experience</p>
        </div>
        <button onClick={onClose} style={styles.closeButton}>
          <X size={20} />
        </button>
      </div>

      {isIOS ? (
        <div style={styles.iosInstructions}>
          Tap <Share size={14} style={styles.iosIcon} /> then "Add to Home Screen" <span style={{fontSize: '16px', lineHeight: '1'}}>+</span>
        </div>
      ) : (
        <div style={styles.actionArea}>
            <button onClick={onInstallClick} style={styles.installButton}>
            <Download size={18} />
            Install Application
            </button>
        </div>
      )}
    </div>
  );
};

export default InstallPWA;
