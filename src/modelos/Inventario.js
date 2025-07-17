const { DataTypes } = require('sequelize');
const sequelize = require('../configuraciones/base_datos');
const Producto = require('./Producto');
const Empleado = require('./Empleado');

const Inventario = sequelize.define('Inventario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  motivo: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id'
    }
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'empleados',
      key: 'id'
    }
  }
}, {
  tableName: 'inventarios',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

Inventario.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
Producto.hasMany(Inventario, { foreignKey: 'producto_id', as: 'movimientos_inventario' });

Inventario.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });
Empleado.hasMany(Inventario, { foreignKey: 'empleado_id', as: 'movimientos_inventario' });

module.exports = Inventario;
