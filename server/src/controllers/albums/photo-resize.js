var sharp = require("sharp");
var exif = require('exif-reader');

sharp.cache(false);

module.exports = async function (file, sizes, options) {

  var stats = options ? options.stats : false;

  var result = {};

  /* PHOTO STATISTICS */
  if (stats) {
    var metadata = await Promise.all([
      sharp(file).metadata(),
      sharp(file).stats()
    ]);

    try {
      var origExif = metadata[0].exif ? exif(metadata[0].exif) : null;
    }
    catch (e) {
      var origExif = null;
    }

    result.stats = {
      date: (origExif && origExif.exif && origExif.exif.DateTimeOriginal) || (origExif && origExif.image && origExif.image.ModifyDate),
      bg: "rgb(" + metadata[1].channels.slice(0, 3).map(channel => Math.round(channel.mean)).join(",") + ")",
      width: metadata[0].width,
      height: metadata[0].height
    };
  }

  if (sizes) {

    // generate smaller versions of the file    
    var sizesMetadata = [];
    for (let size of sizes) {
      const meta = await sharp(file).rotate().resize(size.width, size.height, { fit: "inside" }).withMetadata().toFile(size.path);
      sizesMetadata.push(meta);
    };

    result.sizes = sizes.map((size, i) => ({
      width: sizesMetadata[i].width,
      height: sizesMetadata[i].height,
      size: sizesMetadata[i].size,
      name: size.name
    }));

  }

  return result;

}