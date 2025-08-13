const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');
const Venta = require('./Venta');
const Producto = require('./Producto');

const Facturacion = sequelize.define('Facturacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas',
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
    allowNull: false,
    validate: {
      min: 1
    }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  descuento: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'facturacion',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

// Relaciones
Facturacion.belongsTo(Venta, { foreignKey: 'venta_id', as: 'venta' });
Venta.hasMany(Facturacion, { foreignKey: 'venta_id', as: 'detalles' });

Facturacion.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Facturacion, { foreignKey: 'producto_id', as: 'ventas' });

module.exports = Facturacion; 