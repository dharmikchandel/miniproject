import React, { useState } from 'react';
import api from './services/api';
import SkillChips from './components/SkillChips';
import Header from './components/Header';
import ProjectSpec from './components/ProjectSpec';
import FileManifest from './components/FileManifest';
import FilePreview from './components/FilePreview';
import { ErrorNotification, SuccessNotification } from './components/Notification';

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

  const showError = (msg, timeout = 8000) => {
    setError(msg);
    setTimeout(() => setError(null), timeout);
  };

  const showSuccess = (msg, timeout = 5000) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), timeout);
  };

  async function generateProject() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await api.generateProject({
        skills,
        stack: 'MERN',
        complexity,
        titleHint: 'Adaptive Generator Demo'
      });
      setProjectId(data.projectId);
      setManifest(data.manifest);
      setSpec(data.spec);
      showSuccess(`Project generated! Created ${data.manifest?.length || 0} files.`);
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.response?.data?.details || e.message || 'Unknown error occurred';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  async function genFile(path) {
    if (!projectId) {
      showError('Please generate a project first!', 5000);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateFile({ projectId, path });
      setManifest(prev => prev.map(f => f.path === path ? { ...f, content: data.content } : f));
      setSelectedFile(path);
      setFileContent(data.content);
      showSuccess(`File ${path} generated successfully!`, 4000);
    } catch (e) {
      const errorMsg = e.response?.data?.error || e.response?.data?.details || e.message || 'Error generating file';
      showError(errorMsg, 6000);
    } finally {
      setLoading(false);
    }
  }

  function handlePreviewFile(path, content) {
    setSelectedFile(path);
    setFileContent(content);
  }

  function download() {
    if (!projectId) {
      showError('Please generate a project first!', 5000);
      return;
    }
    api.downloadProject(projectId);
    showSuccess('Download started!', 3000);
  }

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      {/* Notifications */}
      <ErrorNotification error={error} />
      <SuccessNotification success={success} />

      {/* Header Section */}
      <Header />

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
      <ProjectSpec spec={spec} />

      {/* Manifest Section */}
      <FileManifest 
        manifest={manifest}
        onGenerateFile={genFile}
        onPreviewFile={handlePreviewFile}
        loading={loading}
      />

      {/* File Preview Section */}
      <FilePreview selectedFile={selectedFile} fileContent={fileContent} />

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
