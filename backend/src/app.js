const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configuraciones/swagger.js');
const sequelize = require('./configuraciones/base_datos');

const db = require('./configuraciones/base_datos.js');
const Usuario = require('./modelos/Usuario.js');
const Empleado = require('./modelos/Empleado.js');
const Venta = require('./modelos/Venta.js');
const Categoria = require('./modelos/categoria.js');
const Producto = require('./modelos/Producto.js');
const Facturacion = require('./modelos/Facturacion.js');
const Caja = require('./modelos/Caja.js');
const Inventario = require('./modelos/Inventario.js');
const Proveedor = require('./modelos/Proveedor.js');
const Compra = require('./modelos/Compra.js');
const CompraProducto = require('./modelos/CompraProducto.js');
const Cliente = require('./modelos/cliente.js');
const RecuperacionPassword = require('./modelos/RecuperacionPassword.js');
const sincronizarEmpleadosYClientes = require('./scripts/sincronizarEmpleadosYClientes');

require('dotenv').config();

const app = express();

// Bloque de sincronización de modelos
db.authenticate().then(async()=>{
    await Usuario.sync().then(()=>{console.log("El modelo usuario se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Empleado.sync().then(()=>{console.log("El modelo empleado se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Venta.sync().then(()=>{console.log("El modelo venta se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Categoria.sync().then(()=>{console.log("El modelo categoria se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Producto.sync().then(()=>{console.log("El modelo producto se creo correctamente");
    }).catch((er)=>{console.log(er);})    
    await Facturacion.sync().then(()=>{console.log("El modelo facturacion se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Caja.sync().then(()=>{console.log("El modelo caja se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Inventario.sync().then(()=>{console.log("El modelo inventario se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Proveedor.sync().then(()=>{console.log("El modelo proveedor se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Compra.sync().then(()=>{console.log("El modelo compra se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await CompraProducto.sync().then(()=>{console.log("El modelo compra producto se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await Cliente.sync().then(()=>{console.log("El modelo cliente se creo correctamente");
    }).catch((er)=>{console.log(er);})
    await RecuperacionPassword.sync().then(()=>{console.log("El modelo recuperacion password se creo correctamente");
    }).catch((er)=>{console.log(er);})
    console.log();

    // Sincronizar empleados y clientes
    await sincronizarEmpleadosYClientes();
    
    // Iniciar servidor
    const PUERTO = process.env.PUERTO || 3001;
    sequelize.sync()
      .then(() => {app.listen(PUERTO, () => {
          console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
        });
      }).catch(err => console.error('Error al conectar con la base de datos:', err));
})

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/autenticacion', require('./rutas/rutaAutenticacion.js')); //
app.use('/api/auth', require('./rutas/rutaRecuperacionPassword.js')); //
app.use('/api/usuario', require('./rutas/rutaUsuario.js')); //
app.use('/api/empleado', require('./rutas/rutaEmpleado.js')); //
app.use('/api/categoria', require('./rutas/rutaCategoria.js')); //
app.use('/api/producto', require('./rutas/rutaProducto.js')); //
app.use('/api/pedido', require('./rutas/rutaPedido.js'));
app.use('/api/caja', require('./rutas/rutaCaja.js'));
app.use('/api/cliente', require('./rutas/rutaCliente.js'));
app.use('/api/proveedor', require('./rutas/rutaProveedor.js'));
app.use('/api/compra', require('./rutas/rutaCompra.js'));
app.use('/api/inventario', require('./rutas/rutaInventario.js'));

// Documentacion de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/*Documentación Swagger
const documentoSwagger = yaml.load(path.join(__dirname, './documentacion/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentoSwagger));*/

module.exports = app;