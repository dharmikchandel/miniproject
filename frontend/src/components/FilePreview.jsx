import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageFromFile } from '../utils/languageDetection';

function FilePreview({ selectedFile, fileContent }) {
  if (!selectedFile) return null;

  return (
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
  );
}

export default FilePreview;

