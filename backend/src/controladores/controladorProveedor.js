const { validationResult } = require('express-validator');
const Proveedor = require('../modelos/Proveedor');

// GET todos los proveedores
const obtenerProveedores = [
  async (req, res) => {
    try {
      const proveedores = await Proveedor.findAll();
      res.json(proveedores);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// GET proveedor por ID
const obtenerProveedor = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const proveedor = await Proveedor.findByPk(req.query.id);
      if (!proveedor) {
        return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
      }
      res.json(proveedor);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

// POST crear proveedor
const crearProveedor = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { nombre, contacto, telefono, correo, direccion, activo } = req.body;
    try {
      const proveedor = await Proveedor.create({
        nombre,
        contacto,
        telefono,
        correo,
        direccion,
        activo
      });
      res.status(201).json(proveedor);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear el proveedor', error });
    }
  },
];

// PUT actualizar proveedor
const actualizarProveedor = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const proveedor = await Proveedor.findByPk(req.query.id);
      if (!proveedor) {
        return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
      }
      await proveedor.update(req.body);
      res.json({ mensaje: 'Proveedor actualizado', proveedor });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el proveedor', error });
    }
  },
];

// DELETE eliminar proveedor
const eliminarProveedor = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const proveedor = await Proveedor.findByPk(req.query.id);
      if (!proveedor) {
        return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
      }
      await proveedor.destroy();
      res.json({ mensaje: 'Proveedor eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar el proveedor', error });
    }
  },
];

module.exports = {
  obtenerProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};