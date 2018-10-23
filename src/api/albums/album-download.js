const archiver = require("archiver");

module.exports = function(albumId,res){
  
  const zip = archiver("zip");  
  
  const albumDir = "";
  
  zip.pipe(res);
  
  zip.directory(albumDir, false);
  
  zip.finalize();
  
};