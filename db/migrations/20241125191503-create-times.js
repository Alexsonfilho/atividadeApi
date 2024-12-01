'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Times', {
      tm_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tm_sup_id: {
        type: Sequelize.INTEGER
      },
      tm_nome:{
        type: Sequelize.STRING
      },
      
      tm_createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      tm_updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Times');
  }
};