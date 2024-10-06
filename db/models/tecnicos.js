'use strict';

const Supervisores = require("./supervisores");
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tecnicos extends Model {
    /**
     * Métodos de associações podem ser definidos aqui.
     */
    static associate(models) {
      // Define associações aqui, se houver.
    }
  }

 Tecnicos.init({
    tec_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tec_nome: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    tec_cpf: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    tec_loginclaro: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tec_email: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    tec_tel: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    tec_createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tec_updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
    
  }, {
    sequelize,
    modelName: 'Tecnicos',
    tableName: 'Tecnicos',
    timestamps: true, // Habilita createdAt e updatedAt automaticamente
    createdAt: 'tec_createdAt',
    updatedAt: 'tec_updatedAt',
  });
 
 
  Tecnicos.associate = (models) => {
    Tecnicos.belongsTo(models.Supervisores, { 
      foreignKey: 'tec_sup_id',   // Nome da chave estrangeira no model Tecnico
      targetKey: 'sup_id',        // Nome da chave primária no model Supervisor
      as: 'supervisores'            // Alias do relacionamento
    });
  };

  return Tecnicos;
};