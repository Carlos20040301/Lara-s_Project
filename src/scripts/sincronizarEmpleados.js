const Usuario = require('../modelos/Usuario');
const Empleado = require('../modelos/Empleado');

(async (req, res) => {
  try {

    const usuarios = await Usuario.findAll({ where: { rol: 'empleado' } });
    for (const usuario of usuarios) {
      const yaExiste = await Empleado.findOne({ where: { id_usuario: usuario.id } });
      if (!yaExiste) {
        await Empleado.create({
          id_usuario: usuario.id,
          cargo: 'Cargo por defecto',
          telefono: '0000-0000'
        });
        console.log(`Empleado creado para el usuario: ${usuario.nombre}`);
      }
    }

    console.log('Sincronización completa');
    process.exit();
  } catch (err) {
    console.error('Error al sincronizar:', err);
    process.exit(1);
  }
})();