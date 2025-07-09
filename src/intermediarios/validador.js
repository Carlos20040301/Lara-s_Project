const { body, param, validationResult } = require('express-validator');
const joya = require('../modelos/joya');

// Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errores.array()
    });
  }
  next();
};

// Validaciones para crear pedido
const validarCrearPedido = [
  body('joya_id')
    .notEmpty()
    .withMessage('El ID de la joya es obligatorio')
    .isString()
    .withMessage('El ID de la joya debe ser una cadena de texto')
    .custom(async (value) => {
      try {
        const joyaEncontrada = await joya.findById(value);
        if (!joyaEncontrada) {
          throw new Error('La joya especificada no existe');
        }
        return true;
      } catch (error) {
        throw new Error('Error al validar la joya');
      }
    })
    .withMessage('La joya especificada no existe'),

  body('cantidad')
    .notEmpty()
    .withMessage('La cantidad es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo mayor a 0'),

  body('total')
    .notEmpty()
    .withMessage('El total es obligatorio')
    .isFloat({ min: 0 })
    .withMessage('El total debe ser un número positivo'),

  body('estado')
    .optional()
    .isIn(['pendiente', 'pagado', 'enviado', 'cancelado'])
    .withMessage('El estado debe ser uno de: pendiente, pagado, enviado, cancelado'),

  body('admin_id')
    .notEmpty()
    .withMessage('El ID del administrador es obligatorio')
    .isInt({ min: 1 })
    .withMessage('El ID del administrador debe ser un número entero positivo'),

  manejarErroresValidacion
];

// Validaciones para actualizar pedido
const validarActualizarPedido = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del pedido debe ser un número entero positivo'),

  body('joya_id')
    .optional()
    .isString()
    .withMessage('El ID de la joya debe ser una cadena de texto')
    .custom(async (value) => {
      try {
        const joyaEncontrada = await joya.findById(value);
        if (!joyaEncontrada) {
          throw new Error('La joya especificada no existe');
        }
        return true;
      } catch (error) {
        throw new Error('Error al validar la joya');
      }
    })
    .withMessage('La joya especificada no existe'),

  body('cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo mayor a 0'),

  body('total')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El total debe ser un número positivo'),

  body('estado')
    .optional()
    .isIn(['pendiente', 'pagado', 'enviado', 'cancelado'])
    .withMessage('El estado debe ser uno de: pendiente, pagado, enviado, cancelado'),

  body('admin_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del administrador debe ser un número entero positivo'),

  manejarErroresValidacion
];

// Validaciones para obtener pedido por ID
const validarObtenerPedido = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del pedido debe ser un número entero positivo'),

  manejarErroresValidacion
];

// Validaciones para eliminar pedido
const validarEliminarPedido = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del pedido debe ser un número entero positivo'),

  manejarErroresValidacion
];

module.exports = {
  validarCrearPedido,
  validarActualizarPedido,
  validarObtenerPedido,
  validarEliminarPedido,
  manejarErroresValidacion
}; 