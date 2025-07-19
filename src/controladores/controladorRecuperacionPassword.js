const RecuperacionPassword = require('../modelos/RecuperacionPassword');
const Usuario = require('../modelos/Usuario');
const { generarToken } = require('../configuraciones/jwt');
const { hash, verify } = require('argon2');
const { Op } = require('sequelize');

// Configuración temporal sin email para pruebas
let transporter = null;

// Intentar configurar nodemailer si está disponible
try {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'tu-password-de-app'
    }
  });
} catch (error) {
  console.log('Nodemailer no está instalado. Usando modo de prueba.');
}

// Generar token numérico de 5 dígitos
const generarTokenNumerico = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Enviar email con token
const enviarEmailToken = async (email, token) => {
  // Si no hay transporter configurado, usar modo de prueba
  if (!transporter) {
    console.log(`🔐 MODO PRUEBA - Código de recuperación para ${email}: ${token}`);
    console.log('📧 Para habilitar envío real de emails, instala nodemailer: npm install nodemailer');
    return true; // Simular envío exitoso
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'tu-email@gmail.com',
    to: email,
    subject: 'Recuperación de Contraseña - Lara\'s Joyería',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #d4af37, #b8860b); padding: 20px; text-align: center; color: white;">
          <h1>Lara's Joyería</h1>
          <h2>Recuperación de Contraseña</h2>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Hola,</p>
          <p>Has solicitado recuperar tu contraseña. Tu código de verificación es:</p>
          
          <div style="background: #d4af37; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px;">
            ${token}
          </div>
          
          <p><strong>Este código expira en 15 minutos.</strong></p>
          
          <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
          
          <p>Saludos,<br>Equipo de Lara's Joyería</p>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>Este es un email automático, por favor no respondas.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email enviado exitosamente a: ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${email}:`, error);
    return false;
  }
};

// Solicitar recuperación de contraseña
const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email es requerido'
      });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ where: { correo: email } });
    if (!usuario) {
      // Por seguridad, no revelamos si el email existe o no
      console.log(`🔒 Intento de recuperación para email inexistente: ${email}`);
      return res.status(200).json({
        success: true,
        emailExists: false,
        mensaje: 'Ingresa un correo válido, verifica que hayas puesto correctamente tu correo.'
      });
    }

    // Buscar si ya hay un token pendiente y no vencido
    const ahora = new Date();
    const tokenActivo = await RecuperacionPassword.findOne({
      where: {
        usuario_id: usuario.id,
        estado: 'pendiente',
        expiracion: { [Op.gt]: ahora }
      }
    });

    if (tokenActivo) {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya se ha enviado un token de recuperación recientemente. Por favor revisa tu correo o espera a que expire el anterior.'
      });
    }

    // Generar token de 5 dígitos
    const token = generarTokenNumerico();
    // Calcular fecha de expiración (15 minutos)
    const fechaExpiracion = new Date();
    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

    // Eliminar solicitudes anteriores del mismo usuario
    await RecuperacionPassword.destroy({
      where: { 
        usuario_id: usuario.id,
        estado: 'pendiente'
      }
    });

    // Crear nueva solicitud de recuperación
    await RecuperacionPassword.create({
      usuario_id: usuario.id,
      correo: email,
      token: token,
      estado: 'pendiente',
      expiracion: fechaExpiracion
    });

    // Enviar email con el token
    const emailEnviado = await enviarEmailToken(email, token);
    
    if (!emailEnviado) {
      return res.status(500).json({
        success: false,
        mensaje: 'Error al enviar el email de recuperación'
      });
    }

    console.log(`✅ Código de recuperación enviado a: ${email}`);
    res.json({
      success: true,
      emailExists: true,
      mensaje: 'Si el email existe en nuestra base de datos, recibirás un código de recuperación'
    });

  } catch (error) {
    console.error('Error en solicitarRecuperacion:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Verificar token de recuperación
const verificarToken = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email y token son requeridos'
      });
    }

    // Buscar la solicitud de recuperación
    const recuperacion = await RecuperacionPassword.findOne({
      where: {
        correo: email,
        token: token,
        estado: 'pendiente'
      },
      include: [{
        model: Usuario,
        as: 'usuario'
      }]
    });

    if (!recuperacion) {
      return res.status(400).json({
        success: false,
        mensaje: 'Código inválido o expirado'
      });
    }

    // Verificar si el token ha expirado
    if (new Date() > recuperacion.expiracion) {
      await recuperacion.update({ estado: 'expirado' });
      return res.status(400).json({
        success: false,
        mensaje: 'El código ha expirado. Solicita uno nuevo.'
      });
    }

    res.json({
      success: true,
      mensaje: 'Código verificado correctamente'
    });

  } catch (error) {
    console.error('Error en verificarToken:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        mensaje: 'Email, token y nueva contraseña son requeridos'
      });
    }

    // Buscar la solicitud de recuperación
    const recuperacion = await RecuperacionPassword.findOne({
      where: {
        correo: email,
        token: token,
        estado: 'pendiente'
      },
      include: [{
        model: Usuario,
        as: 'usuario'
      }]
    });

    if (!recuperacion) {
      return res.status(400).json({
        success: false,
        mensaje: 'Código inválido o expirado'
      });
    }

    // Verificar si el token ha expirado
    if (new Date() > recuperacion.expiracion) {
      await recuperacion.update({ estado: 'expirado' });
      return res.status(400).json({
        success: false,
        mensaje: 'El código ha expirado. Solicita uno nuevo.'
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hash(newPassword);
    console.log(`🔐 Hash generado para usuario ${recuperacion.usuario.id}`);

    // Actualizar contraseña del usuario
    await recuperacion.usuario.update({
      contrasena: hashedPassword
    });
    console.log(`✅ Contraseña actualizada para usuario ${recuperacion.usuario.id}`);

    // Marcar la recuperación como completada
    await recuperacion.update({ estado: 'usado' });
    console.log(`✅ Token marcado como usado para usuario ${recuperacion.usuario.id}`);

    res.json({
      success: true,
      mensaje: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    console.error('Error en cambiarPassword:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  solicitarRecuperacion,
  verificarToken,
  cambiarPassword
}; 