module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChecklistInstrumento', {
      checklistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Checklists',
          key: 'che_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      instrumentoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Instrumentos',
          key: 'it_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ChecklistInstrumento');
  },
};
