<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 830d806 (Parte de Fernanda, parte 1, editando también partes de los archivos ya subidos)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracion/db');
const Usuario = require('./Usuario');

// Modelo de Pedido relacionado con Usuario (admin)
const Pedido = sequelize.define(
  'Pedido',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id',
      },
    },
  },
  {
    tableName: 'pedidos',
    timestamps: false,
  }
);

// Relación 1:N (un usuario puede tener muchos pedidos)
Usuario.hasMany(Pedido, { foreignKey: 'admin_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'admin_id' });

<<<<<<< HEAD
=======
const { DataTypes } = require('sequelize');
const { sequelize } = require('../configuracion/db');
const Usuario = require('./Usuario');

// Modelo de Pedido relacionado con Usuario (admin)
const Pedido = sequelize.define(
  'Pedido',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id',
      },
    },
  },
  {
    tableName: 'pedidos',
    timestamps: false,
  }
);

// Relación 1:N (un usuario puede tener muchos pedidos)
Usuario.hasMany(Pedido, { foreignKey: 'admin_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'admin_id' });

>>>>>>> ca053c240583f5d6c8272b463ebcb0a57060675b
=======

>>>>>>> 830d806 (Parte de Fernanda, parte 1, editando también partes de los archivos ya subidos)
module.exports = Pedido;