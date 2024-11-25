'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Instrumentos', {
      it_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      it_sts: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      it_nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      it_che_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      it_cat_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      it_createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      it_updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Instrumentos');
  }
};