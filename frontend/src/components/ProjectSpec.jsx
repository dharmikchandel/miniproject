import React from 'react';

function ProjectSpec({ spec }) {
  if (!spec) return null;

  return (
    <div className="brutal-box" style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Project Specification</h2>
        <div style={{
          background: '#FFD93D',
          padding: '4px 12px',
          border: '3px solid #000000',
          boxShadow: '3px 3px 0px 0px #000000',
          fontWeight: 700,
          fontSize: '14px',
          textTransform: 'uppercase'
        }}>
          {spec.title || 'Project'}
        </div>
      </div>

      {/* Project Title */}
      {spec.title && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ 
            marginBottom: 12,
            fontSize: '28px',
            color: '#000000',
            textShadow: '2px 2px 0px #FFD93D'
          }}>
            {spec.title}
          </h3>
        </div>
      )}

      {/* Summary */}
      {spec.summary && (
        <div style={{
          background: '#F8F8F8',
          border: '3px solid #000000',
          boxShadow: '4px 4px 0px 0px #000000',
          padding: '20px',
          marginBottom: 24
        }}>
          <div style={{
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 12,
            color: '#666'
          }}>
            📋 Summary
          </div>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 500
          }}>
            {spec.summary}
          </p>
        </div>
      )}

      {/* Features */}
      {spec.features && spec.features.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>✨ Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {spec.features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '3px solid #000000',
                  boxShadow: '4px 4px 0px 0px #000000',
                  padding: '16px',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: 16,
                  background: '#6BCB77',
                  border: '3px solid #000000',
                  padding: '4px 12px',
                  fontWeight: 700,
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}>
                  Feature {idx + 1}
                </div>
                <div style={{
                  marginTop: 8,
                  fontSize: '15px',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}>
                  {feature}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acceptance Criteria */}
      {spec.acceptance && spec.acceptance.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 16 }}>✅ Acceptance Criteria</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {spec.acceptance.map((criteria, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px 0px #000000',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12
                }}
              >
                <div style={{
                  background: '#4ECDC4',
                  border: '2px solid #000000',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: '14px'
                }}>
                  ✓
                </div>
                <div style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  fontWeight: 500,
                  flex: 1
                }}>
                  {criteria}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSpec;

