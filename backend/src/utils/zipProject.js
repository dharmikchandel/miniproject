const archiver = require('archiver');
function zipProjectFiles(res, files, zipName = 'project.zip') {
  res.setHeader('Content-disposition', `attachment; filename=${zipName}`);
  res.setHeader('Content-Type', 'application/zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);
  files.forEach(f => {
    archive.append(f.content || '', { name: f.path });
  });
  archive.finalize();
}
module.exports = zipProjectFiles;

