import { Validator, ValidationError } from "express-json-validator-middleware";
var validator = new Validator({ allErrors: true });

export default validator.validate;
