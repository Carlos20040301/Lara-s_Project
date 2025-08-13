require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function enviarPrueba() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // te envía el correo a ti mismo
      subject: 'Prueba de correo desde nodemailer',
      text: 'Este es un correo de prueba para verificar la configuración SMTP.'
    });
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
}

enviarPrueba();
