import React from 'react';

export function ErrorNotification({ error }) {
  if (!error) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 1000,
      background: '#FF6B6B',
      border: '4px solid #000000',
      boxShadow: '8px 8px 0px 0px #000000',
      padding: '16px 24px',
      maxWidth: 400,
      animation: 'slideIn 0.3s ease'
    }}>
      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 8, textTransform: 'uppercase' }}>
        ⚠️ Error
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600 }}>{error}</div>
    </div>
  );
}

export function SuccessNotification({ success }) {
  if (!success) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 1000,
      background: '#6BCB77',
      border: '4px solid #000000',
      boxShadow: '8px 8px 0px 0px #000000',
      padding: '16px 24px',
      maxWidth: 400,
      animation: 'slideIn 0.3s ease'
    }}>
      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 8, textTransform: 'uppercase' }}>
        ✅ Success
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600 }}>{success}</div>
    </div>
  );
}

