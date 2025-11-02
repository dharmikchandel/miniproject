import React from 'react';

function FileManifest({ manifest, onGenerateFile, onPreviewFile, loading }) {
  if (manifest.length === 0) return null;

  return (
    <div className="brutal-box" style={{ marginBottom: 32 }}>
      <h2>File Manifest ({manifest.length} files)</h2>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {manifest.map(f => (
          <div
            key={f.path}
            style={{
              background: '#FFFFFF',
              border: '3px solid #000000',
              boxShadow: '4px 4px 0px 0px #000000',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>
                {f.path}
              </div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 600,
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {f.language}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => onGenerateFile(f.path)}
                className="brutal-button"
                style={{ padding: '10px 18px', fontSize: '14px' }}
                disabled={loading}
              >
                Generate
              </button>
              <button 
                onClick={() => onPreviewFile(f.path, f.content || '')}
                className="brutal-button brutal-button-secondary"
                style={{ padding: '10px 18px', fontSize: '14px' }}
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileManifest;

