import axios from 'axios';

const api = {
  async generateProject({ skills, stack, complexity, titleHint }) {
    const response = await axios.post('/api/generate-project', {
      skills,
      stack,
      complexity,
      titleHint
    });
    return response.data;
  },

  async generateFile({ projectId, path }) {
    const response = await axios.post('/api/generate-file', {
      projectId,
      path
    });
    return response.data;
  },

  downloadProject(projectId) {
    window.location = `/api/download/${projectId}`;
  }
};

export default api;

