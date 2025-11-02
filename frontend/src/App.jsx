import React, { useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function SkillChips({ skills, onChange }) {
  const all = ['react','node','express','mongodb','typescript','jest'];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
      {all.map(s => (
        <button
          key={s}
          onClick={() => {
            const set = new Set(skills);
            set.has(s) ? set.delete(s) : set.add(s);
            onChange(Array.from(set));
          }}
          className={`brutal-chip ${skills.includes(s) ? 'active' : ''}`}
        >
          {skills.includes(s) ? '✓ ' : ''}{s}
        </button>
      ))}
    </div>
  );
}

// Helper function to detect language from file extension
function getLanguageFromFile(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const languageMap = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'json': 'json',
    'css': 'css',
    'html': 'html',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'sh': 'bash',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
    'vue': 'vue',
    'svelte': 'svelte',
    'dockerfile': 'dockerfile',
    'txt': 'text',
    'env': 'text'
  };
  
  // Also check for specific file patterns
  if (filename === 'package.json' || filename === 'tsconfig.json') return 'json';
  if (filename === '.gitignore' || filename === '.env') return 'text';
  if (filename.startsWith('Dockerfile')) return 'dockerfile';
  
  return languageMap[ext] || 'text';
}

export default function App() {
  const [skills, setSkills] = useState(['react','node','mongodb']);
  const [complexity, setComplexity] = useState('small');
  const [manifest, setManifest] = useState([]);
  const [spec, setSpec] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function generateProject() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await axios.post('/api/generate-project', { skills, stack: 'MERN', complexity, titleHint: 'Adaptive Generator Demo' });
      setProjectId(resp.data.projectId);
      setManifest(resp.data.manifest);
      setSpec(resp.data.spec);
      setSuccess(`Project generated! Created ${resp.data.manifest?.length || 0} files.`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.response?.data?.details || e.message || 'Unknown error occurred';
      setError(errorMsg);
      setTimeout(() => setError(null), 8000);
    } finally { setLoading(false); }
  }

  async function genFile(p) {
    if (!projectId) {
      setError('Please generate a project first!');
      setTimeout(() => setError(null), 5000);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.post('/api/generate-file', { projectId, path: p });
      // update local manifest copy
      setManifest(prev => prev.map(f => f.path === p ? { ...f, content: resp.data.content } : f));
      setSelectedFile(p);
      setFileContent(resp.data.content);
      setSuccess(`File ${p} generated successfully!`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.response?.data?.details || e.message || 'Error generating file';
      setError(errorMsg);
      setTimeout(() => setError(null), 6000);
    } finally { setLoading(false); }
  }

  function download() {
    if (!projectId) {
      setError('Please generate a project first!');
      setTimeout(() => setError(null), 5000);
      return;
    }
    window.location = `/api/download/${projectId}`;
    setSuccess('Download started!');
    setTimeout(() => setSuccess(null), 3000);
  }

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      {/* Notifications */}
      {error && (
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
      )}

      {success && (
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
      )}

      {/* Header Section */}
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

      {/* Controls Section */}
      <div className="brutal-box" style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 24 }}>Configuration</h2>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: 'block', 
            fontWeight: 700, 
            fontSize: '16px', 
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Select Skills:
          </label>
          <SkillChips skills={skills} onChange={setSkills} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: 'block', 
            fontWeight: 700, 
            fontSize: '16px', 
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Complexity Level:
          </label>
          <select 
            value={complexity} 
            onChange={e => setComplexity(e.target.value)}
            className="brutal-select"
          >
            <option value='small'>Small</option>
            <option value='medium'>Medium</option>
            <option value='large'>Large</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button 
            onClick={generateProject} 
            disabled={loading}
            className={`brutal-button brutal-button-primary ${loading ? 'loading' : ''}`}
          >
            {loading ? '⚙️ Generating...' : '✨ Generate Project'}
          </button>
          <button 
            onClick={() => { if (manifest.length) genFile(manifest[0].path); }} 
            disabled={!projectId || loading}
            className="brutal-button brutal-button-secondary"
          >
            📄 Generate First File
          </button>
          <button 
            onClick={download} 
            disabled={!projectId}
            className="brutal-button brutal-button-danger"
          >
            💾 Download Zip
          </button>
        </div>
      </div>

      {/* Spec Section */}
      {spec && (
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
      )}

      {/* Manifest Section */}
      {manifest.length > 0 && (
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
                    onClick={() => genFile(f.path)}
                    className="brutal-button"
                    style={{ padding: '10px 18px', fontSize: '14px' }}
                    disabled={loading}
                  >
                    Generate
                  </button>
                  <button 
                    onClick={() => { setSelectedFile(f.path); setFileContent(f.content || ''); }}
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
      )}

      {/* File Preview Section */}
      {selectedFile && (
        <div className="brutal-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ margin: 0 }}>File Preview</h2>
            <div style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                padding: '8px 16px',
                background: '#FFD93D',
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px 0px #000000',
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                📄 {selectedFile}
              </div>
              {fileContent && (
                <div style={{
                  padding: '8px 16px',
                  background: '#6BCB77',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px 0px #000000',
                  fontWeight: 700,
                  fontSize: '14px',
                  textTransform: 'uppercase'
                }}>
                  {fileContent.split('\n').length} Lines
                </div>
              )}
            </div>
          </div>
          <div style={{
            background: '#1E1E1E',
            border: '4px solid #000000',
            boxShadow: '6px 6px 0px 0px #000000',
            borderRadius: 0,
            overflow: 'hidden'
          }}>
            {/* Code Header */}
            <div style={{
              background: '#2D2D2D',
              borderBottom: '3px solid #000000',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#FF6B6B',
                border: '2px solid #000000'
              }} />
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#FFD93D',
                border: '2px solid #000000'
              }} />
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#6BCB77',
                border: '2px solid #000000'
              }} />
              <div style={{
                marginLeft: 'auto',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {selectedFile.split('.').pop()?.toUpperCase() || 'CODE'}
              </div>
            </div>
            {/* Code Content */}
            <div style={{
              maxHeight: '600px',
              overflow: 'auto',
              background: '#1E1E1E'
            }}>
              {fileContent ? (
                <SyntaxHighlighter
                  language={getLanguageFromFile(selectedFile)}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '20px',
                    background: '#1E1E1E',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace"
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    minWidth: '50px',
                    paddingRight: '20px',
                    color: '#858585',
                    userSelect: 'none',
                    fontSize: '12px'
                  }}
                  lineProps={(lineNumber) => {
                    return {
                      style: {
                        minHeight: '22px'
                      }
                    };
                  }}
                >
                  {fileContent}
                </SyntaxHighlighter>
              ) : (
                <div style={{
                  color: '#858585',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  padding: '40px',
                  fontSize: '16px',
                  background: '#1E1E1E'
                }}>
                  No content generated yet. Click Generate to create this file.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!spec && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: 60,
          padding: '20px',
          background: '#FFFFFF',
          border: '4px solid #000000',
          boxShadow: '8px 8px 0px 0px #000000'
        }}>
          <p style={{ 
            fontWeight: 600, 
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0
          }}>
            Ready to generate? Configure above and click Generate! 🎯
          </p>
        </div>
      )}
    </div>
  );
}

