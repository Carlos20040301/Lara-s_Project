const nodemailer = require('nodemailer');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Función para enviar email
const enviarEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, '') // Convertir HTML a texto plano si no se proporciona
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }
};

// Función para enviar email de confirmación de pedido
const enviarConfirmacionPedido = async (pedido) => {
  const { numero_pedido, cliente_nombre, cliente_email, total, detalles } = pedido;
  
  const productosHTML = detalles.map(detalle => `
    <tr>
      <td>${detalle.producto.nombre}</td>
      <td>${detalle.cantidad}</td>
      <td>$${detalle.precio_unitario.toFixed(2)}</td>
      <td>$${detalle.total.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">¡Gracias por tu pedido en Joyería Lara's!</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Detalles del Pedido</h3>
        <p><strong>Número de Pedido:</strong> ${numero_pedido}</p>
        <p><strong>Cliente:</strong> ${cliente_nombre}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        <p><strong>Estado:</strong> Pendiente</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #333;">Productos</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #007bff; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Cantidad</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Precio Unit.</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>
      </div>

      <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; text-align: right;">
        <h3 style="margin: 0; color: #333;">Total: $${total.toFixed(2)}</h3>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0; color: #666;">
          Te notificaremos cuando tu pedido esté listo para recoger o envío.
          Si tienes alguna pregunta, no dudes en contactarnos.
        </p>
      </div>

      <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>Joyería Lara's - Tu joyería de confianza</p>
      </div>
    </div>
  `;

  return await enviarEmail({
    to: cliente_email,
    subject: `Confirmación de Pedido - ${numero_pedido}`,
    html: html
  });
};

// Función para enviar email de actualización de estado
const enviarActualizacionEstado = async (pedido, nuevoEstado) => {
  const { numero_pedido, cliente_nombre, cliente_email } = pedido;
  
  const estados = {
    'confirmado': 'confirmado y está siendo procesado',
    'en_proceso': 'en proceso de preparación',
    'enviado': 'enviado y está en camino',
    'entregado': 'entregado exitosamente',
    'cancelado': 'cancelado'
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Actualización de tu Pedido</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Número de Pedido:</strong> ${numero_pedido}</p>
        <p><strong>Cliente:</strong> ${cliente_nombre}</p>
        <p><strong>Nuevo Estado:</strong> ${estados[nuevoEstado] || nuevoEstado}</p>
        <p><strong>Fecha de Actualización:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <p style="margin: 0; color: #666;">
          Tu pedido ha sido ${estados[nuevoEstado] || nuevoEstado}.
          ${nuevoEstado === 'entregado' ? '¡Esperamos que disfrutes tu compra!' : 'Te mantendremos informado sobre cualquier cambio.'}
        </p>
      </div>

      <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>Joyería Lara's - Tu joyería de confianza</p>
      </div>
    </div>
  `;

  return await enviarEmail({
    to: cliente_email,
    subject: `Actualización de Pedido ${numero_pedido}`,
    html: html
  });
};

module.exports = {
  enviarEmail,
  enviarConfirmacionPedido,
  enviarActualizacionEstado
}; 