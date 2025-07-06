const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');
require('dotenv').config();

const clave = process.env.clave || 'clave_secreta';
const expiracion = 24 * 60 * 60; // 24 horas en segundos

exports.getToken = (data) => {
  return jwt.sign(data, clave, { expiresIn: expiracion });
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: clave,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await Usuario.findByPk(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;

