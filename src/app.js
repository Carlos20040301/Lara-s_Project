const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const db = require('./configuraciones/db');

// Configuración de middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Servir archivos estáticos desde la raíz del proyecto
app.set('port', 3000);

// Configuración de vistas
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Ruta principal - servir el HTML de Lara Joyería
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Ruta para acceder directamente al HTML
app.get('/lara', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Ruta para verificar el estado del servidor
app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Lara Joyería - Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        port: app.get('port')
    });
});

// Conexión a la base de datos (opcional para la página web)
db.authenticate()
    .then(() => {
        console.log('✅ Base de datos conectada correctamente');
        console.log('📊 Base de datos lista para futuras funcionalidades');
    })
    .catch((err) => {
        console.error('❌ Error de conexión a la base de datos:', err);
        console.log('⚠️  La página web funcionará sin base de datos');
    });

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Página no encontrada',
        message: 'La ruta solicitada no existe',
        availableRoutes: ['/', '/lara', '/status']
    });
});

// Iniciar servidor
app.listen(app.get('port'), () => {
    console.log('🚀 Servidor Lara Joyería iniciado correctamente');
    console.log('📍 Puerto:', app.get('port'));
    console.log('🌐 URL principal: http://localhost:' + app.get('port'));
    console.log('🛍️  Tienda Lara: http://localhost:' + app.get('port') + '/lara');
    console.log('📊 Estado del servidor: http://localhost:' + app.get('port') + '/status');
    console.log('📁 Archivos estáticos servidos desde:', path.join(__dirname, '..'));
}); 