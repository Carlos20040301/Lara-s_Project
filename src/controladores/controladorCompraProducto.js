const { body, param, validationResult } = require('express-validator');
const CompraProducto = require('../modelos/CompraProducto');
const Compra = require('../modelos/Compra');
const Producto = require('../modelos/Producto');

// Obtener todos los registros de productos comprados
const obtenerCompraProductos = [
  async (req, res) => {
    try {
      const compraProductos = await CompraProducto.findAll({
        include: [
          { model: Compra, as: 'compra' },
          { model: Producto, as: 'producto' }
        ]
      });
      res.json(compraProductos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  }
];

// Obtener un registro por ID
const obtenerCompraProducto = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const compraProducto = await CompraProducto.findByPk(req.params.id, {
        include: [
          { model: Compra, as: 'compra' },
          { model: Producto, as: 'producto' }
        ]
      });
      if (!compraProducto) {
        return res.status(404).json({ mensaje: 'CompraProducto no encontrado' });
      }
      res.json(compraProducto);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  }
];

// Crear un nuevo registro de compra-producto
const crearCompraProducto = [
  body('compra_id').isInt().withMessage('ID de compra inválido'),
  body('producto_id').isInt().withMessage('ID de producto inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
  body('precio_unitario').isDecimal().withMessage('El precio unitario debe ser un número válido'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { compra_id, producto_id, cantidad, precio_unitario } = req.body;
    const subtotal = cantidad * parseFloat(precio_unitario);

    try {
      // Validar que existan la compra y el producto
      const compra = await Compra.findByPk(compra_id);
      const producto = await Producto.findByPk(producto_id);

      if (!compra || !producto) {
        return res.status(400).json({ mensaje: 'Compra o producto no válidos' });
      }

      const compraProducto = await CompraProducto.create({
        compra_id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal
      });

      res.status(201).json(compraProducto);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear compraProducto', error });
    }
  }
];

// Actualizar un registro
const actualizarCompraProducto = [
  param('id').isInt().withMessage('ID inválido'),
  body('cantidad').optional().isInt({ min: 1 }).withMessage('Cantidad inválida'),
  body('precio_unitario').optional().isDecimal().withMessage('Precio unitario inválido'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { cantidad, precio_unitario } = req.body;

    try {
      const compraProducto = await CompraProducto.findByPk(req.params.id);
      if (!compraProducto) {
        return res.status(404).json({ mensaje: 'CompraProducto no encontrado' });
      }

      const nuevoSubtotal =
        (cantidad ?? compraProducto.cantidad) * parseFloat(precio_unitario ?? compraProducto.precio_unitario);

      await compraProducto.update({
        cantidad: cantidad ?? compraProducto.cantidad,
        precio_unitario: precio_unitario ?? compraProducto.precio_unitario,
        subtotal: nuevoSubtotal
      });

      res.json({ mensaje: 'CompraProducto actualizado', compraProducto });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  }
];

// Eliminar un registro
const eliminarCompraProducto = [
  param('id').isInt().withMessage('ID inválido'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const compraProducto = await CompraProducto.findByPk(req.params.id);
      if (!compraProducto) {
        return res.status(404).json({ mensaje: 'CompraProducto no encontrado' });
      }

      await compraProducto.destroy();
      res.json({ mensaje: 'CompraProducto eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  }
];

module.exports = {
  obtenerCompraProductos,
  obtenerCompraProducto,
  crearCompraProducto,
  actualizarCompraProducto,
  eliminarCompraProducto
};