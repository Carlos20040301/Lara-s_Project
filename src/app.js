const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');
const sequelize = require('./configuraciones/base_datos');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/autenticacion', require('./rutas/autenticacion'));
app.use('/api/usuarios', require('./rutas/usuarios'));
app.use('/api/empleados', require('./rutas/empleados'));
app.use('/api/categorias', require('./rutas/categorias'));
app.use('/api/productos', require('./rutas/productos'));
app.use('/api/pedidos', require('./rutas/pedidos'));
app.use('/api/caja', require('./rutas/caja'));
app.use('/api/clientes', require('./rutas/cliente'));
app.use('/api/reporteVenta', require('./rutas/reporteventa'));
app.use('/api/proveedor', require('./rutas/proveedor'));
app.use('/api/compraProducto', require('./rutas/compraproducto'));
app.use('/api/compra', require('./rutas/compra'));
app.use('/api/inventario', require('./rutas/inventario'));

// Documentación Swagger
const documentoSwagger = yaml.load(path.join(__dirname, './documentacion/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentoSwagger));

// Iniciar servidor
const PUERTO = process.env.PUERTO || 3000;
sequelize.sync()
  .then(() => {
    app.listen(PUERTO, () => {
      console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    });
  })
  .catch(err => console.error('Error al conectar con la base de datos:', err));

module.exports = app;