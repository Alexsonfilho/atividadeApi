'use strict';
const Tecnicos = require("./tecnicos");
const Checklists = require("./checklists");
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supervisores extends Model {
    /**
     * Métodos de associações podem ser definidos aqui.
     */
    static associate(models) {
      // Define associações aqui, se houver.
    }
  }

  Supervisores.init({
    sup_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    sup_nome: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    sup_cpf: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    sup_loginclaro: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    sup_senha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sup_createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sup_updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Supervisores',
    tableName: 'Supervisores',
    timestamps: true, // Habilita createdAt e updatedAt automaticamente
    createdAt: 'sup_createdAt',
    updatedAt: 'sup_updatedAt',
  });


  // associação 
  Supervisores.associate = function(models) {
     // associação (n,1) um supervisor pode cadastrar um ou n técnicos
    Supervisores.hasMany(models.Tecnicos, { foreignKey: 'tec_sup_id', as: 'tecnicos' });
  
    // associação (n,1) um supervisor pode estar em um ou n checklists
      Supervisores.hasMany(models.Checklists, { foreignKey: 'che_sup_id', as: 'checklistSup' });

    // associação (1,1) um supervisor pode estar em somente um time
      Supervisores.hasOne(models.Times, {
        foreignKey: 'tm_sup_id', // Nome da chave estrangeira no model Times
        as: 'timeSup', // Alias para acessar o time associado ao supervisor
      });
    };
  

  return Supervisores;
};
