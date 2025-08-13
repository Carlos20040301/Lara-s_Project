// Script para sincronizar un usuario de MongoDB a MySQL
// Ejecuta este script con: node src/scripts/sincronizarUsuarioMongoAMySQL.js

const sequelize = require('../configuraciones/base_datos');
const UsuarioSQL = require('../modelos/Usuario');
const Empleado = require('../modelos/Empleado');
const UsuarioMongo = require('../modelos/UsuarioMongo');

async function sincronizarUsuario(correo, cargo = 'vendedor', telefono = '00000000') {
  await sequelize.authenticate();
  const usuarioMongo = await UsuarioMongo.findOne({ correo });
  if (!usuarioMongo) {
    console.log('Usuario no encontrado en MongoDB');
    return;
  }
  // Verificar si ya existe en MySQL
  let usuarioSQL = await UsuarioSQL.findOne({ where: { correo } });
  let usuarioCreado = false;
  if (!usuarioSQL) {
    usuarioSQL = await UsuarioSQL.create({
      primerNombre: usuarioMongo.primerNombre,
      segundoNombre: usuarioMongo.segundoNombre,
      primerApellido: usuarioMongo.primerApellido,
      segundoApellido: usuarioMongo.segundoApellido,
      genero: usuarioMongo.genero,
      correo: usuarioMongo.correo,
      contrasena: usuarioMongo.contrasena, // hash compatible
      rol: usuarioMongo.rol
    });
    usuarioCreado = true;
    console.log('Usuario creado en MySQL:', usuarioSQL.id);
  } else {
    console.log('Usuario ya existe en MySQL:', usuarioSQL.id);
  }
  console.log('ID usuario MongoDB:', usuarioMongo._id?.toString());
  console.log('ID usuario MySQL:', usuarioSQL.id);
  // Si es empleado, crear registro en empleados si no existe
  if (usuarioSQL.rol === 'empleado') {
    let empleado = await Empleado.findOne({ where: { id_usuario: usuarioSQL.id } });
    if (!empleado) {
      empleado = await Empleado.create({
        id_usuario: usuarioSQL.id,
        cargo,
        telefono
      });
      console.log('Empleado creado en MySQL:', empleado.id);
      console.log('ID empleado MySQL:', empleado.id);
    } else {
      console.log('Empleado ya existe en MySQL:', empleado.id);
      console.log('ID empleado MySQL:', empleado.id);
    }
  }
  console.log('--- Recuerda: Para operaciones en MySQL (ventas, pedidos, etc) usa SIEMPRE el ID de MySQL, NO el de MongoDB. ---');
  process.exit();
}

// Cambia el correo y datos según el usuario que quieras sincronizar
sincronizarUsuario('fernandafunez27@gmail.com', 'admin', '89736638');
