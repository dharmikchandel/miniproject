import React from 'react';

function Header() {
  return (
    <div className="brutal-box" style={{ 
      marginBottom: 32,
      background: 'linear-gradient(135deg, #6BCB77 0%, #4ECDC4 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 120,
        height: 120,
        background: '#FFD93D',
        border: '4px solid #000000',
        borderRadius: '50%',
        transform: 'rotate(45deg)',
        opacity: 0.3
      }} />
      <div style={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 100,
        height: 100,
        background: '#FF6B6B',
        border: '4px solid #000000',
        borderRadius: '50%',
        opacity: 0.2
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: '56px',
          marginBottom: '12px',
          background: 'linear-gradient(45deg, #000000, #333333)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
          display: 'inline-block',
          transform: 'rotate(-1deg)'
        }}>
          Adaptive Project Generator
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
          marginTop: 16
        }}>
          <div style={{
            background: '#000000',
            color: '#FFD93D',
            padding: '8px 16px',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px 0px #FFD93D',
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            🚀 AI-Powered
          </div>
          <div style={{
            background: '#000000',
            color: '#6BCB77',
            padding: '8px 16px',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px 0px #6BCB77',
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            ⚡ Instant
          </div>
          <div style={{
            background: '#000000',
            color: '#4ECDC4',
            padding: '8px 16px',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px 0px #4ECDC4',
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            📦 Ready-to-Use
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;

