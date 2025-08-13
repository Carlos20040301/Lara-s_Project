const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errores.array()
    });
  }
  next();
};
