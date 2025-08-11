// Script para eliminar en orden seguro todas las tablas relacionadas con usuarios y empleados en MySQL, incluyendo recuperaciones_password
const sequelize = require('../configuraciones/base_datos');
const Facturacion = require('../modelos/Facturacion');
const Venta = require('../modelos/Venta');
const Caja = require('../modelos/Caja');
const Empleado = require('../modelos/Empleado');
const Usuario = require('../modelos/Usuario');
const RecuperacionPassword = require('../modelos/RecuperacionPassword');

async function eliminarTodoFull() {
  try {
    await sequelize.authenticate();
    await Facturacion.destroy({ where: {} });
    await Caja.destroy({ where: {} });
    await Venta.destroy({ where: {} });
    await RecuperacionPassword.destroy({ where: {} });
    await Empleado.destroy({ where: {} });
    await Usuario.destroy({ where: {} });
    console.log('Todos los registros relacionados con usuarios y empleados han sido eliminados de MySQL.');
  } catch (error) {
    console.error('Error al eliminar datos:', error);
  } finally {
    await sequelize.close();
  }
}

eliminarTodoFull();
