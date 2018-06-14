var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
var chokidar = require('chokidar');
var sharp = require('sharp');
var async = require("async");

var defaultOptions = {

  storageDir: null,

  thumbsDir: null,

  sizes: [],

  log: message => console.log(message),
  thumbCreated: (originalPath,thumbPath,size) => {},
  thumbDeleted: (originalPath) => {},

  getThumbPath: (file,storageDir,thumbsDir) => file.replace(storageDir,thumbsDir),

  chodikar: {
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    },

    ignoreInitial: false,

    ignored: /(^|[\/\\])\../
  }
};

var PhotoResizer = module.exports = function(userOptions){

  this.options = Object.assign({},defaultOptions,userOptions);

  this.watch();

}

PhotoResizer.prototype.watch = function(){

  chokidar.watch(this.options.storageDir, this.options.chokidar)
    .on('add', file => this.createThumbs(file))
    .on("unlink", file => this.deleteThumbs(file))
    .on('addDir', file => this.createDir(file))
    .on('unlinkDir', file => this.deleteDir(file));

  this.options.log("Watching directory " + this.options.storageDir + " for changes to recreate thumbnails.");

}

PhotoResizer.prototype.getThumbPath = function(file){
  let thumbPath = this.options.getThumbPath(file,this.options.storageDir,this.options.thumbsDir);
  if(!thumbPath) throw new Error("Invalid getThumbPath function!");
  return thumbPath;
}

PhotoResizer.prototype.removeOrphans = function(callback){
  
  console.log("Removing orphans...");

  var sizes = this.options.sizes;

  var targetPath = this.getThumbPath(file);

  var targetDir = path.dirname(targetPath);

  
  ///FIX
  fs.readdir(targetDir,(err,files) => {
    if(err) return callback(err);

    var targetFileSizes = sizes.map(size => path.basename(targetPath).replace(/(\.[a-z]+)$/,"_" + size + "$1"));

    var targetFiles = files.filter(file => targetFileSizes.indexOf(file) === -1);

    async.series(targetFiles.map(file => cb => {
      rimraf(path.join(targetDir,file),err => {
        this.options.log("Deleted orphan file " + path.join(targetDir,file));
        cb(err);
      });
    }), callback);
  });

};

PhotoResizer.prototype.createThumbs = function(file){
  var sizes = this.options.sizes;

  var sourcePath = file;
  var targetPath = this.getThumbPath(file);

  var resizeTasks = sizes.map(size => {
    return callback => {

      let targetSizePath = targetPath.replace(/(\.[a-z]+)$/,"_" + size + "$1");

      if(fs.existsSync(targetSizePath)) {
        callback();
        return;
      }

      let source = fs.createReadStream(file);
      let resizer = sharp().resize(size,size);
      let target = fs.createWriteStream(targetSizePath);

      target.on("finish",err => {
        this.options.log("Created thumbnail " + size + "x" + size + ": " + sourcePath + " => " + targetSizePath);
        this.options.thumbCreated(sourcePath,targetSizePath,size);
        callback(err);
      });

      source.pipe(resizer).pipe(target);
    };
  });

  async.series(resizeTasks);
}

PhotoResizer.prototype.deleteThumbs = function(file){
  var targetPath = this.getThumbPath(file).replace(/(\.[a-z]+)$/,"_*$1");
  rimraf(targetPath,paths => this.options.log("Files " + targetPath + " deleted."));
  this.options.thumbDeleted(file);
}

PhotoResizer.prototype.createDir = function(file){
  var targetPath = this.getThumbPath(file);

  if(fs.existsSync(targetPath)) return;

  fs.mkdirSync(targetPath)

  this.options.log("Directory " + targetPath + " created.");
}

PhotoResizer.prototype.deleteDir = function(file){
  var targetPath = getThumbPath(file);
  rimraf(targetPath,err => {
    if(err && err.code !== "ENOENT") throw err;
    this.options.log("Directory " + targetPath + " removed.");
  })

}

