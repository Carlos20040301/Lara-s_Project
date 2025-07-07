const express = require('express');
const app = express();
const { sequelize } = require('./configuracion/db');
require('dotenv').config();
const passport = require('./configuracion/passport');
app.use(passport.initialize());

// Cargar conexión a MongoDB 
const conectarMongoDB = require('./configuracion/baseDeDatosMongo');
conectarMongoDB(); // Esto inicia la conexión a MongoDB

require('./modelos/Usuario');
require('./modelos/Pedido');

// Importar y usar las rutas 
const usuariosRoutes = require('./rutas/usuarios');
app.use(express.json());
app.use('/api/usuarios', usuariosRoutes);

// Importar y usar las rutas de joyas
const joyasRutas = require('./rutas/joyas');
app.use('/api/joyas', joyasRutas);

// Importar y usar las rutas de pedidos
const pedidosRutas = require('./rutas/pedidos');
app.use('/api/pedidos', pedidosRutas);

console.log('⏳ Conectando a la base de datos MySQL...');

// Sincroniza modelos con la base de datos (crea las tablas si no existen)
sequelize.sync()
  .then(() => {
    console.log('✅ Base de datos conectada correctamente');
    console.log('📦 Tablas sincronizadas:');
    console.log('   - usuarios');
    console.log('   - pedidos');
    // Inicia el servidor en el puerto 3001
    app.listen(3001, () => {
      console.log('🚀 Servidor escuchando en http://localhost:3001');
      console.log('👉 Endpoints disponibles:');
      console.log('   POST   /api/usuarios/registro');
      console.log('   GET    /api/usuarios');
      console.log('   GET    /api/usuarios/:id');
      console.log('   PUT    /api/usuarios/:id');
      console.log('   DELETE /api/usuarios/:id');
      console.log('   POST   /api/pedidos');
      console.log('   GET    /api/pedidos');
      console.log('   GET    /api/pedidos/:id');
      console.log('   PUT    /api/pedidos/:id');
      console.log('   DELETE /api/pedidos/:id');
      console.log('   GET    /api/pedidos/estado/:estado');
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
  });