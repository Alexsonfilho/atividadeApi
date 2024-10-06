'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Supervisores', {
      sup_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sup_nome: {
        type: Sequelize.STRING
      },
      sup_cpf: {
        type: Sequelize.STRING
      },
      sup_loginclaro: {
        type: Sequelize.STRING
      },
      sup_createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sup_updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Supervisores');
  }
};