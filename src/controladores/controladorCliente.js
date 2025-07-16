const { validationResult } = require('express-validator');
const Cliente = require('../modelos/cliente');
const { where } = require('sequelize');

exports.listarClientes = async (req, res) => {
    const buscarClientes = await Cliente.findAll();
    res.json(buscarClientes);
}

exports.guardarCliente = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    else {
        const { primerNombre, primerApellido } = req.body;
        const nuevoCliente = await Cliente.create({...req.body});
        res.status(201).json(nuevoCliente);
    }
};

exports.editarCliente = async (req, res) => {
    const errores = validationResult(req);
    if (errores.errors.length > 0) {
        res.status(400).json(errores);
    }
    else{
        const { id } = req.query;
        const { primerNombre, primerApellido } = req.body;
        const editarCliente = await Cliente.update({...req.body}, {where: { id }});
        res.status(200).json(editarCliente);
    }
}

exports.eliminarCliente = async (req, res) => {
    const { id } = req.query;
    const buscarCliente = await Cliente.findOne({
        where: { id }
    });
    if (!buscarCliente) {
        res.status(400).json({ msj: 'Cliente no encontrado' });
    }
    else{
        const eliminarCliente = await Cliente.destroy({
            where: { id }
        });
        res.status(200).json(eliminarCliente);
    }
    res.json({ datos: "Registro con id:" + id + " eliminado correctamente" });
}