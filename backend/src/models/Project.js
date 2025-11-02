const mongoose = require('mongoose');
const FileSchema = new mongoose.Schema({
  path: String,
  content: { type: String, default: '' },
  language: String
});
const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: String,
  skills: [String],
  stack: String,
  complexity: String,
  spec: String,
  files: [FileSchema],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Project', ProjectSchema);

