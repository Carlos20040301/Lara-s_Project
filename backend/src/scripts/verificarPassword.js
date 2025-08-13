const { hash, verify } = require('argon2');
const Usuario = require('../modelos/Usuario');
const sequelize = require('../configuraciones/base_datos');

async function verificarPassword() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar un usuario de prueba
    const usuario = await Usuario.findOne({ where: { correo: 'carlosecastro04@gmail.com' } });
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`👤 Usuario encontrado: ${usuario.nombre}`);
    console.log(`📧 Email: ${usuario.correo}`);
    console.log(`🔐 Contraseña actual: ${usuario.contrasena.substring(0, 20)}...`);

    // Probar con una contraseña de prueba
    const passwordPrueba = '123456';
    const hashPrueba = await hash(passwordPrueba);
    
    console.log(`🔐 Hash de prueba generado: ${hashPrueba.substring(0, 20)}...`);

    // Verificar si la contraseña actual coincide con la de prueba
    const esValida = await verify(usuario.contrasena, passwordPrueba);
    console.log(`✅ ¿Contraseña de prueba válida?: ${esValida}`);

    // Actualizar con la contraseña de prueba
    await usuario.update({ contrasena: hashPrueba });
    console.log('✅ Contraseña actualizada en la base de datos');

    // Verificar que la nueva contraseña funciona
    const nuevaContrasena = await Usuario.findOne({ where: { correo: 'carlosecastro04@gmail.com' } });
    const esNuevaValida = await verify(nuevaContrasena.contrasena, passwordPrueba);
    console.log(`✅ ¿Nueva contraseña válida?: ${esNuevaValida}`);

    console.log('🎯 Prueba completada exitosamente');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await sequelize.close();
  }
}

verificarPassword(); 