// Helper function to detect language from file extension
export function getLanguageFromFile(filename) {
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

