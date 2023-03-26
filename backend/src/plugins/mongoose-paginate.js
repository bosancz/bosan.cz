module.exports = function(schema){
  schema.query.paginate = function(limit,skip){

    this.limit(limit);
    this.skip(skip || 0);

    return this.then(docs => {

      const count = this.model.find().where(this._conditions).count();

      return count.then(count => ({
        docs: docs.map(doc => doc.toObject ? doc.toObject() : doc),
        total: count,
        limit: limit,
        skip: skip || 0
      }));

    });

  }
}