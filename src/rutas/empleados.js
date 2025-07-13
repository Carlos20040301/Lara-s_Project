const express = require('express');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const { obtenerEmpleados, obtenerEmpleado, crearEmpleado, actualizarEmpleado, eliminarEmpleado } = require('../controladores/controladorEmpleados');

router.get('/', autenticacionMiddleware(['admin']), obtenerEmpleados);
router.get('/:id', autenticacionMiddleware(['admin']), obtenerEmpleado);
router.post('/', autenticacionMiddleware(['admin']), crearEmpleado);
router.put('/:id', autenticacionMiddleware(['admin']), actualizarEmpleado);
router.delete('/:id', autenticacionMiddleware(['admin']), eliminarEmpleado);

module.exports = router;