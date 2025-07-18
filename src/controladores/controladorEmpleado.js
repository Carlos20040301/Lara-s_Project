const { validationResult } = require('express-validator');
const Empleado = require('../modelos/Empleado');
const Usuario = require('../modelos/Usuario');
const { enviarBienvenidaEmpleado } = require('../configuraciones/email');

const obtenerEmpleados = [
  async (req, res) => {
    try {
      const empleados = await Empleado.findAll({ include: [{ model: Usuario, attributes: ['nombre', 'correo'] }] });
      res.json(empleados);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const obtenerEmpleado = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const empleado = await Empleado.findByPk(req.query.id, { include: [{ model: Usuario, attributes: ['nombre', 'correo'] }] });
      if (!empleado) {
        return res.status(404).json({ mensaje: 'Empleado no encontrado' });
      }
      res.json(empleado);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const crearEmpleado = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { id_usuario, cargo, telefono } = req.body;
    try {
      const usuario = await Usuario.findByPk(id_usuario);
      if (!usuario || usuario.rol !== 'empleado') {
        return res.status(400).json({ mensaje: 'Usuario no válido o no es empleado' });
      }
      const empleado = await Empleado.create({ id_usuario, cargo, telefono });
      // Enviar correo de bienvenida
      try {
        await enviarBienvenidaEmpleado({ nombre: usuario.nombre, correo: usuario.correo, cargo });
      } catch (err) {
        console.error('No se pudo enviar el correo de bienvenida:', err);
      }
      res.status(201).json(empleado);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const actualizarEmpleado = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    const { cargo, telefono } = req.body;
    try {
      const empleado = await Empleado.findByPk(req.query.id);
      if (!empleado) {
        return res.status(404).json({ mensaje: 'Empleado no encontrado' });
      }
      await empleado.update({ cargo, telefono });
      res.json({ mensaje: 'Empleado actualizado', empleado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

const eliminarEmpleado = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    try {
      const empleado = await Empleado.findByPk(req.query.id);
      if (!empleado) {
        return res.status(404).json({ mensaje: 'Empleado no encontrado' });
      }
      await empleado.destroy();
      res.json({ mensaje: 'Empleado eliminado' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
  },
];

module.exports = { obtenerEmpleados, obtenerEmpleado, crearEmpleado, actualizarEmpleado, eliminarEmpleado };