'use strict';

module.exports = {
  async up(queryInterface, Sequelize) { // Função assíncrona aqui
    await queryInterface.createTable('ChecklistInstrumento', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      checklistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Checklists', // Nome da tabela referenciada
          key: 'che_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      instrumentoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Instrumentos', // Nome da tabela referenciada
          key: 'it_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) { // Função assíncrona aqui
    await queryInterface.dropTable('ChecklistInstrumento');
  },
};
