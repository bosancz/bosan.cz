module.exports = function (schema) {
  schema.query.toObject = function () {

    return this.then(docs => {
      if (!docs) return docs;

      if (Array.isArray(docs)) return docs.map(doc => doc.toObject ? doc.toObject() : doc);
      else return docs.toObject ? docs.toObject() : docs;
    });
  }
};