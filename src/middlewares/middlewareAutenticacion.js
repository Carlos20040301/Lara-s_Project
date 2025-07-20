const { verificarToken } = require('../configuraciones/jwt');

const autenticacionMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'No se proporcionó token' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = verificarToken(token);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.rol)) {
        return res.status(403).json({ mensaje: 'Usuario no autorizado' });
      }

      next();
    } catch (error) {
      res.status(401).json({ mensaje: 'Token inválido', error });
    }
  };
};

module.exports = autenticacionMiddleware;