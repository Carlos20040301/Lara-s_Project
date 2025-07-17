const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');
const Compra = require('./Compra');
const Producto = require('./Producto');

const CompraProducto = sequelize.define('CompraProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  compra_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'compras',
      key: 'id'
    }
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'compra_productos',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

// Relaciones
CompraProducto.belongsTo(Compra, { foreignKey: 'compra_id', as: 'compra' });
Compra.hasMany(CompraProducto, { foreignKey: 'compra_id', as: 'productos' });

CompraProducto.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(CompraProducto, { foreignKey: 'producto_id', as: 'compras' });

module.exports = CompraProducto;
