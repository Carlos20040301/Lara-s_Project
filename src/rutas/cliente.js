const express = require('express');
const { body, query } = require('express-validator');
const controladorCliente = require('../controladores/controladorCliente');
const Cliente = require('../modelos/cliente');
const { where } = require('sequelize');
const router = express.Router();

router.get('/listar', controladorCliente.listarClientes);
router.post('/guardar',

    // Campos Obligatorios
    body('primerNombre').isLength({ max: 50, min: 5 }).withMessage(
        'El primer nombre debe tener entre 5 y 50 caracteres'
    ),
    body('primerApellido').isLength({ max: 50, min: 5 }).withMessage(
        'El primer apellido debe tener entre 5 y 50 caracteres'
    ),

    // Campos Opcionales
    body('segundoNombre').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo nombre debe tener entre 5 y 50 caracteres'
    ),
    body('segundoApellido').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo apellido debe tener entre 5 y 50 caracteres'
    ),
    body('rtn').optional().isLength({ max: 14, min: 14 }).withMessage(
        'El RTN debe tener exactamente 14 caracteres'
    ).custom(async (value) => {
        const buscarRTN = await Cliente.findOne({
            where: { rtn: value }
        });
        if (buscarRTN) {
            throw new Error('El RTN ya está registrado');
        }
    }),
    body('estado').optional().isIn(['activo', 'inactivo']).withMessage(
        'El estado debe ser "activo" o "inactivo"'
    ),
    body('genero').optional().isIn(['M', 'F']).withMessage(
        'El género debe ser "M" o "F"'
    ),
    controladorCliente.guardarCliente
)

router.put('/editar',

    // Validación de ID
    query('id').isInt().withMessage('El ID debe ser un número entero')
    .custom(async (value) => {
        const buscarId = await Cliente.findOne({
            where: { id: value }
        });
        if (!buscarId) {
            throw new Error('Cliente no encontrado o no existe');
        }
    }),

    // Campos Obligatorios
    body('primerNombre').isLength({ max: 50, min: 5 }).withMessage(
        'El primer nombre debe tener entre 5 y 50 caracteres'
    ),
    body('primerApellido').isLength({ max: 50, min: 5 }).withMessage(
        'El primer apellido debe tener entre 5 y 50 caracteres'
    ),

    // Campos Opcionales
    body('segundoNombre').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo nombre debe tener entre 5 y 50 caracteres'
    ),
    body('segundoApellido').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo apellido debe tener entre 5 y 50 caracteres'
    ),
    body('rtn').optional().isLength({ max: 14, min: 14 }).withMessage(
        'El RTN debe tener exactamente 14 caracteres'
    ).custom(async (value) => {
        const buscarRTN = await Cliente.findOne({
            where: { rtn: value }
        });
        if (buscarRTN) {
            throw new Error('El RTN ya está registrado');
        }
    }),
    body('estado').optional().isIn(['activo', 'inactivo']).withMessage(
        'El estado debe ser "activo" o "inactivo"'
    ),
    body('genero').optional().isIn(['M', 'F']).withMessage(
        'El género debe ser "M" o "F"'
    ),
    controladorCliente.editarCliente
)

router.delete('/eliminar',

    // Validación de ID
    query('id').isInt().withMessage('El ID debe ser un número entero')
    .custom(async (value) => {
        const buscarId = await Cliente.findOne({
            where: { id: value }
        });
        if (!buscarId) {
            throw new Error('Cliente no encontrado o no existe');
        }
    }),

    // Campos Obligatorios
    body('primerNombre').isLength({ max: 50, min: 5 }).withMessage(
        'El primer nombre debe tener entre 5 y 50 caracteres'
    ),
    body('primerApellido').isLength({ max: 50, min: 5 }).withMessage(
        'El primer apellido debe tener entre 5 y 50 caracteres'
    ),

    // Campos Opcionales
    body('segundoNombre').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo nombre debe tener entre 5 y 50 caracteres'
    ),
    body('segundoApellido').optional().isLength({ max: 50, min: 5 }).withMessage(
        'El segundo apellido debe tener entre 5 y 50 caracteres'
    ),
    body('rtn').optional().isLength({ max: 14, min: 14 }).withMessage(
        'El RTN debe tener exactamente 14 caracteres'
    ).custom(async (value) => {
        const buscarRTN = await Cliente.findOne({
            where: { rtn: value }
        });
        if (buscarRTN) {
            throw new Error('El RTN ya está registrado');
        }
    }),
    body('estado').optional().isIn(['activo', 'inactivo']).withMessage(
        'El estado debe ser "activo" o "inactivo"'
    ),
    body('genero').optional().isIn(['M', 'F']).withMessage(
        'El género debe ser "M" o "F"'
    ),
    controladorCliente.eliminarCliente
)

module.exports = router;