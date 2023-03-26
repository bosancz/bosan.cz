
var { Validator, ValidationError } = require('express-json-validator-middleware');
var validator = new Validator({allErrors: true});

module.exports = validator.validate;