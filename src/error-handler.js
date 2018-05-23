module.exports = function(err, req, res, next){
  console.error(err);
  res.sendStatus(500);
};