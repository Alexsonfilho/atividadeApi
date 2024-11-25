'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tecnicos', {
      tec_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tec_sup_id:{
        type: Sequelize.INTEGER
      },
      tec_nome: {
        type: Sequelize.STRING
      },
      tec_cpf: {
        type: Sequelize.STRING
      },
      tec_loginclaro: {
        type: Sequelize.STRING
      },
      tec_senha: {
        type: Sequelize.STRING
      },
      tec_email: {
        type: Sequelize.STRING
      },
      tec_tel: {
        type: Sequelize.STRING
      },
      tec_placa: {
        type: Sequelize.STRING
      },
      tec_createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      tec_updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tecnicos');
  }
};