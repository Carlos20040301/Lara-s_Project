const express = require('express');
const router = express.Router();
const {
  solicitarRecuperacion,
  verificarToken,
  cambiarPassword
} = require('../controladores/controladorRecuperacionPassword');

// Solicitar recuperación de contraseña
router.post('/recuperar-password', solicitarRecuperacion);

// Verificar token de recuperación
router.post('/verificar-token', verificarToken);

// Cambiar contraseña
router.post('/cambiar-password', cambiarPassword);

module.exports = router; 