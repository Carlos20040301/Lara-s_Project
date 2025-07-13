const express = require('express');
const router = express.Router();
const { registrar, iniciarSesion } = require('../controladores/controladorAutenticacion');

router.post('/registro', registrar);
router.post('/iniciar-sesion', iniciarSesion);

module.exports = router;