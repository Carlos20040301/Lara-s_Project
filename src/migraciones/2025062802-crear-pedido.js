'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      joya_id: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'ID de la joya en MongoDB'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        },
        comment: 'Cantidad de joyas en el pedido'
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0
        },
        comment: 'Total del pedido'
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'pagado', 'enviado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente',
        comment: 'Estado actual del pedido'
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID del administrador que gestiona el pedido'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Agregar índices para mejorar el rendimiento
    await queryInterface.addIndex('pedidos', ['joya_id']);
    await queryInterface.addIndex('pedidos', ['admin_id']);
    await queryInterface.addIndex('pedidos', ['estado']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pedidos');
  }
}; 