<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const usuariosController = require('../controladores/usuariosController');

// Aquí puedes agregar autenticación JWT cuando esté lista
// const autenticacion = require('../intermediarios/autenticacion');
// router.use(autenticacion);

router.post('/registro', usuariosController.registrar);
router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.obtenerPorId);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

=======
const express = require('express');
const router = express.Router();
const usuariosController = require('../controladores/usuariosController');

// Aquí puedes agregar autenticación JWT cuando esté lista
// const autenticacion = require('../intermediarios/autenticacion');
// router.use(autenticacion);

router.post('/registro', usuariosController.registrar);
router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.obtenerPorId);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

>>>>>>> ca053c240583f5d6c8272b463ebcb0a57060675b
module.exports = router;