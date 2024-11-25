'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Checklists', {
      che_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      che_tec_id: {
        type: Sequelize.INTEGER
      },
      che_sup_id: {
        type: Sequelize.INTEGER
      },
      che_it_id: {
        type: Sequelize.INTEGER
      },
      che_createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      che_updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Checklists');
  }
};