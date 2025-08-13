// Script para crear empleados a partir de usuarios que no tienen registro en la tabla empleados

const { Usuario, Empleado } = require('../src/modelos/Usuario');
const EmpleadoModel = require('../src/modelos/Empleado');
const sequelize = require('../src/configuraciones/base_datos');

async function crearEmpleadosFaltantes() {
  try {
    await sequelize.authenticate();
    // Busca todos los usuarios con rol 'empleado' que no están en la tabla empleados
    const [results] = await sequelize.query(`
      SELECT u.id, u.primerNombre, u.primerApellido, u.correo
      FROM usuarios u
      LEFT JOIN empleados e ON u.id = e.id_usuario
      WHERE u.rol = 'empleado' AND e.id IS NULL
    `);
    if (results.length === 0) {
      console.log('No hay usuarios empleados sin registro en empleados.');
      return;
    }
    for (const usuario of results) {
      await EmpleadoModel.create({
        id_usuario: usuario.id,
        cargo: 'cajero', 
        telefono: '00000000' 
      });
      console.log(`Empleado creado para usuario: ${usuario.primerNombre} ${usuario.primerApellido} (${usuario.correo})`);
    }
    console.log('Proceso finalizado.');
  } catch (err) {
    console.error('Error al crear empleados faltantes:', err);
  } finally {
    await sequelize.close();
  }
}

crearEmpleadosFaltantes();
