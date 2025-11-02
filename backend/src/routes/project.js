const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Health check
router.get('/health', (req, res) => res.json({ ok: true }));

// Project routes
router.post('/api/generate-project', projectController.generateProject);
router.post('/api/generate-file', projectController.generateFile);
router.post('/api/generate-all', projectController.generateAllFiles);
router.get('/api/project/:id', projectController.getProject);
router.get('/api/download/:projectId', projectController.downloadProject);

module.exports = router;
