const Usuario = require('../modelos/Usuario');
const Cliente = require('../modelos/Cliente');
const Empleado = require('../modelos/Empleado');

async function sincronizarEmpleadosYClientes() {
  // Sincronizar clientes
  const usuariosClientes = await Usuario.findAll({ where: { rol: 'cliente' } });
  for (const usuario of usuariosClientes) {
    const cliente = await Cliente.findOne({ where: { usuario_id: usuario.id } });
    if (!cliente) {
      await Cliente.create({
        usuario_id: usuario.id,
        primerNombre: usuario.primerNombre,
        segundoNombre: usuario.segundoNombre,
        primerApellido: usuario.primerApellido,
        segundoApellido: usuario.segundoApellido,
        genero: usuario.genero,
        email: usuario.correo,
        estado: 'activo'
      });
    } else {
      // Si existe, comparar y actualizar usuario si hay diferencias
      let cambios = false;
      if (cliente.primerNombre !== usuario.primerNombre) { usuario.primerNombre = cliente.primerNombre; cambios = true; }
      if (cliente.segundoNombre !== usuario.segundoNombre) { usuario.segundoNombre = cliente.segundoNombre; cambios = true; }
      if (cliente.primerApellido !== usuario.primerApellido) { usuario.primerApellido = cliente.primerApellido; cambios = true; }
      if (cliente.segundoApellido !== usuario.segundoApellido) { usuario.segundoApellido = cliente.segundoApellido; cambios = true; }
      if (cliente.genero !== usuario.genero) { usuario.genero = cliente.genero; cambios = true; }
      if (cliente.email !== usuario.correo) { usuario.correo = cliente.email; cambios = true; }
      if (cambios) {
        await usuario.save();
        console.log(`Usuario ${usuario.id} actualizado según datos de cliente.`);
      }
    }
  }

 

  console.log('Sincronización de empleados y clientes completada.');
}

module.exports = sincronizarEmpleadosYClientes; 