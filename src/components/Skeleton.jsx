import React from 'react';

const Skeleton = ({ width, height, borderRadius = '8px', style }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e2e8f0',
        backgroundImage: 'linear-gradient(90deg, #e2e8f0 0px, #f1f5f9 40px, #e2e8f0 80px)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite linear',
        ...style,
      }}
    />
  );
};

// Add global style for keyframes if not present
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes skeleton-loading {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Skeleton;
