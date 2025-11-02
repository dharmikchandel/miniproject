const mongoose = require('mongoose');
const Project = require('../models/Project');
const { callPreferred } = require('../llm/adapters');
const zipProjectFiles = require('../utils/zipProject');

// Validation helpers
const isDbConnected = () => mongoose.connection.readyState === 1;

const hasGeminiKey = () => !!process.env.GEMINI_API_KEY;

// Generate a new project
exports.generateProject = async (req, res) => {
  try {
    // Validate database connection
    if (!isDbConnected()) {
      return res.status(500).json({ 
        error: 'Database not connected', 
        details: 'MongoDB connection is not established. Please check your MongoDB connection string and ensure MongoDB is running.' 
      });
    }

    // Validate API key
    if (!hasGeminiKey()) {
      return res.status(500).json({ 
        error: 'API key missing', 
        details: 'GEMINI_API_KEY is not set in environment variables. Please add it to your .env file.' 
      });
    }

    const { skills = [], stack = 'MERN', complexity = 'small', titleHint = '' } = req.body;
    console.log('Generating project with:', { skills, stack, complexity, titleHint });
    
    // Generate project spec using LLM
    const prompt = `SKILLS: ${skills.join(',')}\nSTACK: ${stack}\nCOMPLEXITY: ${complexity}\nTITLE_HINT: ${titleHint}\n\nReturn valid JSON with keys: title, summary, features (array), acceptance (array), manifest (array of {path, language, purpose}).`;
    
    console.log('Calling LLM API...');
    const llmResp = await callPreferred(prompt);
    console.log('LLM response received, length:', llmResp?.length || 0);
    
    // Parse LLM response
    let parsed;
    try { 
      parsed = JSON.parse(llmResp); 
    } catch (e) {
      console.warn('Direct JSON parse failed, attempting extraction:', e.message);
      const m = llmResp.match(/\{[\s\S]*\}$/);
      parsed = m ? JSON.parse(m[0]) : null;
    }
    
    if (!parsed) {
      console.error('Failed to parse LLM response as JSON. Response:', llmResp?.substring(0, 500));
      return res.status(500).json({ 
        error: 'LLM did not return valid JSON', 
        details: 'The AI response could not be parsed as JSON. Check the LLM adapter configuration.' 
      });
    }
    
    // Create and save project
    const project = new Project({
      title: parsed.title || titleHint || 'Generated Project',
      skills, stack, complexity, spec: JSON.stringify(parsed, null, 2),
      files: (parsed.manifest || []).map(f => ({ path: f.path, content: '', language: f.language }))
    });
    
    console.log('Saving project to database...');
    await project.save();
    console.log('Project saved successfully:', project._id);
    
    res.json({ projectId: project._id, title: project.title, manifest: project.files, spec: parsed });
  } catch (err) {
    console.error('Error in generateProject:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: 'generation failed', 
      details: err.message,
      hint: err.message.includes('GEMINI_API_KEY') ? 'Check your .env file for GEMINI_API_KEY' :
            err.message.includes('connect') ? 'Check MongoDB connection' :
            'Check server logs for more details'
    });
  }
};

// Generate a single file
exports.generateFile = async (req, res) => {
  try {
    // Validate database connection
    if (!isDbConnected()) {
      return res.status(500).json({ 
        error: 'Database not connected', 
        details: 'MongoDB connection is not established.' 
      });
    }

    const { projectId, path } = req.body;
    
    // Validate inputs
    if (!projectId || !path) {
      return res.status(400).json({ error: 'Missing required fields: projectId and path' });
    }

    console.log('Generating file:', path, 'for project:', projectId);
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'project not found' });
    }
    
    // Generate file content using LLM
    const spec = project.spec || '{}';
    const prompt = `PROJECT_SPEC: ${spec}\nTARGET_PATH: ${path}\n\nINSTRUCTIONS: Generate the file content exactly, no commentary.`;
    
    console.log('Calling LLM API for file generation...');
    const content = await callPreferred(prompt);
    console.log('File content generated, length:', content?.length || 0);
    
    // Update file in project
    const file = project.files.find(f => f.path === path);
    if (!file) {
      return res.status(404).json({ error: 'file path not found in manifest' });
    }
    
    file.content = content;
    await project.save();
    
    res.json({ path, content });
  } catch (err) {
    console.error('Error in generateFile:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      error: err.message,
      details: err.message.includes('GEMINI_API_KEY') ? 'Check your .env file for GEMINI_API_KEY' : 'Check server logs'
    });
  }
};

// Generate all files in a project
exports.generateAllFiles = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'project not found' });
    }
    
    // Generate content for all files that don't have content yet
    for (const file of project.files) {
      if (!file.content) {
        const prompt = `PROJECT_SPEC: ${project.spec}\nTARGET_PATH: ${file.path}\nINSTRUCTIONS: Generate the file content exactly.`;
        try {
          const content = await callPreferred(prompt);
          file.content = content;
        } catch (e) {
          file.content = `// ERROR generating file: ${e.message}`;
        }
      }
    }
    
    await project.save();
    res.json({ ok: true, files: project.files });
  } catch (err) {
    console.error('Error in generateAllFiles:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get a project by ID
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'not found' });
    }
    
    res.json(project);
  } catch (err) {
    console.error('Error in getProject:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Download project as zip
exports.downloadProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'not found' });
    }
    
    zipProjectFiles(res, project.files, `${project.title || 'project'}.zip`);
  } catch (err) {
    console.error('Error in downloadProject:', err.message);
    res.status(500).json({ error: err.message });
  }
};

