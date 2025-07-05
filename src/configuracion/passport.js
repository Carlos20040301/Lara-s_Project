const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const Usuario = require('../modelos/Usuario'); // 
const { clave } = process.env;
const moment = require("moment");
const expiracion = moment.duration(1, "hours").asSeconds();
require('dotenv').config();

exports.getToken = (data) => {
  return jwt.sign(data, clave, { expiresIn: expiracion });
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: clave,
};

exports.validarAutenticacion =passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    await Usuario.findByPk(jwt_payload.id,(err, user)=> {
 if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
});
}));

module.exports = exports.validarAutenticacion;

