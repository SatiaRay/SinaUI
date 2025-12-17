import React from 'react';

const NetworkBackground = () => {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background: `
          radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.25) 0%, transparent 40%),
          radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.25) 0%, transparent 75%),
          radial-gradient(ellipse at bottom left, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
          radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
          linear-gradient(to top left, #0a0a0f 0%, #111827 50%, #2d1b69 100%)
        `,
        backgroundAttachment: 'fixed',
      }}
    />
  );
};

export default NetworkBackground;