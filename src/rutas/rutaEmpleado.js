const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const autenticacionMiddleware = require('../middlewares/middlewareAutenticacion');
const { obtenerEmpleados, obtenerEmpleado, crearEmpleado, actualizarEmpleado, eliminarEmpleado } = require('../controladores/controladorEmpleado');

router.get('/listar', autenticacionMiddleware(['admin']), obtenerEmpleados);

router.get('/buscarEmpleado',
        query('id').isInt().withMessage("ID inválido"),
    autenticacionMiddleware(['admin']), obtenerEmpleado);

router.post('/guardar',
        body('id_usuario').isInt().withMessage('ID de usuario inválido'),
        body('cargo').isIn(['gerente', 'vendedor', 'cajero', 'otro']).withMessage('Cargo inválido. Solo puede ingresar: gerente, vendedor, cajero u otro'),
        body('telefono').notEmpty().withMessage('El teléfono es requerido'),
    autenticacionMiddleware(['admin']), crearEmpleado);

router.put('/actualizar', 
      query('id').isInt().withMessage('ID inválido'),
      body('cargo').isIn(['gerente', 'vendedor', 'cajero', 'otro']).withMessage('Cargo inválido. Solo puede ingresar: gerente, vendedor, cajero u otro'),
      body('telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío'),
    autenticacionMiddleware(['admin']), actualizarEmpleado);

router.delete('/eliminar',
      query('id').isInt().withMessage('ID inválido'),
    autenticacionMiddleware(['admin']), eliminarEmpleado);

module.exports = router;