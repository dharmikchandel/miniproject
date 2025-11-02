import React, { useState } from 'react';
import axios from 'axios';

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
      <div className="brutal-box" style={{ marginBottom: 32 }}>
        <h1>Adaptive Project Generator</h1>
        <p style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          marginTop: 8,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          🚀 Pick Skills → Generate → Download
        </p>
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
          <h2>Project Specification</h2>
          <div className="brutal-pre" style={{ marginTop: 16 }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(spec, null, 2)}
            </pre>
          </div>
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
          <h2>File Preview</h2>
          <div style={{ 
            marginTop: 8,
            padding: '8px 12px',
            background: '#FFD93D',
            border: '3px solid #000000',
            display: 'inline-block',
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {selectedFile}
          </div>
          <div className="brutal-pre" style={{ marginTop: 16 }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {fileContent || 'No content generated yet. Click Generate to create this file.'}
            </pre>
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

