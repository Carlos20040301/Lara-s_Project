const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración del transportador de correo con valores por defecto
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER || 'tu_email@gmail.com',
    pass: process.env.SMTP_PASS || 'tu_password_de_aplicacion',
  },
});

// Función para verificar si el correo está configurado
const correoConfigurado = () => {
  return process.env.SMTP_USER && process.env.SMTP_PASS;
};

// Función para enviar correo de notificación de nuevo pedido
const enviarCorreoNuevoPedido = async (pedido, joya, admin) => {
  try {
    // Verificar si el correo está configurado
    if (!correoConfigurado()) {
      console.log('⚠️ Correo no configurado. Saltando envío de notificación.');
      return true;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Correo del administrador
      subject: '🛍️ Nuevo Pedido Recibido - Lara\'s Project',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🛍️ Nuevo Pedido Recibido</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Lara's Project - Sistema de Gestión</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">📋 Detalles del Pedido</h2>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p><strong>🆔 ID del Pedido:</strong> #${pedido.id}</p>
              <p><strong>💍 Joya:</strong> ${joya.nombre} (${joya.categoria})</p>
              <p><strong>📦 Cantidad:</strong> ${pedido.cantidad} unidades</p>
              <p><strong>💰 Total:</strong> $${pedido.total}</p>
              <p><strong>📊 Estado:</strong> <span style="color: #e74c3c; font-weight: bold;">${pedido.estado}</span></p>
              <p><strong>👤 Administrador:</strong> ${admin.nombre} (${admin.email})</p>
              <p><strong>📅 Fecha:</strong> ${new Date(pedido.createdAt).toLocaleString('es-ES')}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #27ae60;">
              <h3 style="margin-top: 0; color: #27ae60;">✅ Acción Requerida</h3>
              <p style="margin-bottom: 0;">Por favor, revisa y procesa este pedido en el panel de administración.</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Este es un correo automático del sistema Lara's Project</p>
            <p>No respondas a este correo</p>
          </div>
        </div>
      `,
      text: `
Nuevo Pedido Recibido - Lara's Project

Detalles del Pedido:
- ID: #${pedido.id}
- Joya: ${joya.nombre} (${joya.categoria})
- Cantidad: ${pedido.cantidad} unidades
- Total: $${pedido.total}
- Estado: ${pedido.estado}
- Administrador: ${admin.nombre} (${admin.email})
- Fecha: ${new Date(pedido.createdAt).toLocaleString('es-ES')}

Por favor, revisa y procesa este pedido en el panel de administración.

Este es un correo automático del sistema Lara's Project
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Correo enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    return false;
  }
};

// Función para enviar correo de actualización de estado
const enviarCorreoActualizacionEstado = async (pedido, joya, admin, estadoAnterior) => {
  try {
    // Verificar si el correo está configurado
    if (!correoConfigurado()) {
      console.log('⚠️ Correo no configurado. Saltando envío de notificación de actualización.');
      return true;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: '🔄 Actualización de Estado - Pedido #' + pedido.id,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🔄 Estado Actualizado</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Pedido #${pedido.id}</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p><strong>🆔 ID del Pedido:</strong> #${pedido.id}</p>
              <p><strong>💍 Joya:</strong> ${joya.nombre} (${joya.categoria})</p>
              <p><strong>📦 Cantidad:</strong> ${pedido.cantidad} unidades</p>
              <p><strong>💰 Total:</strong> $${pedido.total}</p>
              <p><strong>📊 Estado Anterior:</strong> <span style="color: #e67e22;">${estadoAnterior}</span></p>
              <p><strong>📊 Estado Actual:</strong> <span style="color: #27ae60; font-weight: bold;">${pedido.estado}</span></p>
              <p><strong>👤 Administrador:</strong> ${admin.nombre} (${admin.email})</p>
              <p><strong>📅 Fecha de Actualización:</strong> ${new Date(pedido.updatedAt).toLocaleString('es-ES')}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Este es un correo automático del sistema Lara's Project</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Correo de actualización enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo de actualización:', error);
    return false;
  }
};

module.exports = {
  transporter,
  enviarCorreoNuevoPedido,
  enviarCorreoActualizacionEstado,
  correoConfigurado
}; 