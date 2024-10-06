'use strict';
const Tecnicos = require("./tecnicos");
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


  // Relacionamento hasMany
  Supervisores.associate = function(models) {
    Supervisores.hasMany(models.Tecnicos, { foreignKey: 'tec_sup_id', as: 'tecnicos' });
  };

  return Supervisores;
};
