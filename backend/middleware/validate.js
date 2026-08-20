const { validationResult } = require('express-validator');

// Run after an express-validator chain. Stops the request with a 400 if any rule failed.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = validate;