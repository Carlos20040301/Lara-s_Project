const { validationResult } = require('express-validator');
const Inventario = require('../modelos/Inventario');
const Producto = require('../modelos/Producto');
const Empleado = require('../modelos/Empleado');

// Obtener todos los registros de inventario
const obtenerInventarios = [
  async (req, res) => {
    try {
      const inventarios = await Inventario.findAll({
        include: [
          { model: Producto, as: 'producto', attributes: ['nombre', 'precio'] },
          { model: Empleado, as: 'empleado', attributes: ['id', 'cargo'] }
        ]
      });
      res.json(inventarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// Obtener un registro de inventario por ID
const obtenerInventario = [
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const inventario = await Inventario.findByPk(req.query.id, {
        include: [
          { model: Producto, as: 'producto', attributes: ['nombre', 'precio'] },
          { model: Empleado, as: 'empleado', attributes: ['id', 'cargo'] }
        ]
      });
      if (!inventario) {
        return res.status(404).json({ mensaje: 'Registro de inventario no encontrado' });
      }
      res.json(inventario);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// Crear un nuevo movimiento de inventario
const crearInventario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const {
      tipo,
      origen = 'otro',
      cantidad,
      motivo,
      referencia = null,
      producto_id,
      empleado_id
    } = req.body;
    // Verifica existencia de producto
    const producto = await Producto.findByPk(producto_id);
    if (!producto) {
      return res.status(400).json({ mensaje: 'Producto no encontrado' });
    }
    // Verifica existencia de empleado
    const empleado = await Empleado.findByPk(empleado_id);
    if (!empleado) {
      return res.status(400).json({ mensaje: 'Empleado no encontrado' });
    }
    // Calcular nuevo stock
    let nuevoStock = producto.stock;
    if (tipo === 'entrada') nuevoStock += cantidad;
    else if (tipo === 'salida') nuevoStock -= cantidad;
    // 'ajuste' lo puedes manejar según lógica extra
    if (nuevoStock < 0) {
      return res.status(400).json({ mensaje: 'El stock no puede ser negativo' });
    }
    // Registrar movimiento
    const nuevoMovimiento = await Inventario.create({
      tipo,
      origen,
      cantidad,
      motivo,
      referencia,
      stock_actual: nuevoStock,
      producto_id,
      empleado_id
    });
    // Actualizar stock del producto
    await producto.update({ stock: nuevoStock });
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};

// Actualizar un movimiento de inventario
const actualizarInventario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const inventario = await Inventario.findByPk(req.query.id);
    if (!inventario) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    const {
      tipo,
      origen,
      cantidad,
      motivo,
      referencia,
      producto_id,
      empleado_id
    } = req.body;
    // Obtener el producto original
    const productoAnterior = await Producto.findByPk(inventario.producto_id);
    if (!productoAnterior) return res.status(400).json({ mensaje: 'Producto original no válido' });
    // Obtener nuevo producto si cambió
    const productoNuevo = producto_id && producto_id !== inventario.producto_id
      ? await Producto.findByPk(producto_id)
      : productoAnterior;
    if (!productoNuevo) return res.status(400).json({ mensaje: 'Producto nuevo no válido' });
    // Validar empleado si se modifica
    if (empleado_id) {
      const empleado = await Empleado.findByPk(empleado_id);
      if (!empleado) return res.status(400).json({ mensaje: 'Empleado no válido' });
    }
    // Revertir efecto del inventario anterior
    let stockTemp = productoAnterior.stock;
    if (inventario.tipo === 'entrada') stockTemp -= inventario.cantidad;
    else if (inventario.tipo === 'salida') stockTemp += inventario.cantidad;
    // Aplicar nuevo movimiento
    if (tipo === 'entrada') stockTemp += cantidad;
    else if (tipo === 'salida') stockTemp -= cantidad;
    if (stockTemp < 0) {
      return res.status(400).json({ mensaje: 'Stock resultante no puede ser negativo' });
    }
    // Actualizar inventario
    const actualizado = await inventario.update({
      tipo,
      origen: origen || inventario.origen,
      cantidad,
      motivo,
      referencia,
      stock_actual: stockTemp,
      producto_id: productoNuevo.id,
      empleado_id
    });
    // Actualizar stock del producto nuevo
    await productoNuevo.update({ stock: stockTemp });
    res.json({ mensaje: 'Registro actualizado', inventario: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};

// Eliminar un registro de inventario
const eliminarInventario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const id = req.query.id;
    const inventario = await Inventario.findByPk(id);
    if (!inventario) {
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    }
    // Obtener el producto relacionado
    const producto = await Producto.findByPk(inventario.producto_id);
    if (!producto) {
      return res.status(400).json({ mensaje: 'Producto relacionado no encontrado' });
    }
    // Revertir efecto del movimiento
    let stockNuevo = producto.stock;
    if (inventario.tipo === 'entrada') stockNuevo -= inventario.cantidad;
    else if (inventario.tipo === 'salida') stockNuevo += inventario.cantidad;
    if (stockNuevo < 0) {
      return res.status(400).json({
        mensaje: `No se puede eliminar el movimiento porque dejaría el stock negativo (${stockNuevo})`
      });
    }
    // Eliminar movimiento de inventario
    await inventario.destroy();
    // Actualizar stock del producto
    await producto.update({ stock: stockNuevo });
    res.json({
      mensaje: 'Registro eliminado correctamente',
      stock_actualizado: stockNuevo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};

module.exports = {
  obtenerInventarios,
  obtenerInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
};
