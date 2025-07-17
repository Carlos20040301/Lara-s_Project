require('dotenv').config();
const jwt = require('jsonwebtoken');

const generarToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRETO, { expiresIn: '10h' });
};

const verificarToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRETO);
};

module.exports = { generarToken, verificarToken };