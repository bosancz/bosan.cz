var config = require("../../config");

module.exports = function createPage(options){
  var image = "";
  if(options.image){
    image = `
    <meta property="og:image" content="${options.image.url}" />
    <meta property="og:image:width" content="${options.image.width}" />
    <meta property="og:image:height" content="${options.image.height}" />`;
  }
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fb:app_id" content="${config.facebook.app_id}" />
    <meta property="og:url" content="${options.url}" />
    <meta property="og:type" content="${options.type}" />
    <meta property="og:title" content="${options.title}" />
    <meta property="og:description" content="${options.description}" />
    ${image}
  </head>
  <body></body>
</html>
`;
}