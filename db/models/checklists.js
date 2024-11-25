'use strict';
const Tecnicos = require("./tecnicos");
const Supervisores = require("./supervisores");
const Instrumentos = require("./instrumentos");
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Checklists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Checklists.init({  
    che_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  che_sup_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  che_tec_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  che_it_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  che_createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  che_updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  } 
  }, {
    sequelize,
    modelName: 'Checklists',
    tableName: 'Checklists',
    timestamps: true, // Habilita createdAt e updatedAt automaticamente
    createdAt: 'che_createdAt',
    updatedAt: 'che_updatedAt',
  });

  // associação
  Checklists.associate = (models) => {
    //associação (1,1) um checklist contém um e somente um supervisor
    Checklists.belongsTo(models.Supervisores, { 
      foreignKey: 'che_sup_id',   // Nome da chave estrangeira no model Tecnico
      targetKey: 'sup_id',        // Nome da chave primária no model Supervisor
      as: 'supervisoresCheck'            // Alias do relacionamento
    });
  
    // associação (1,1) um checklist contém um e somente um técnico
      Checklists.belongsTo(models.Tecnicos, { 
        foreignKey: 'che_tec_id',   // Nome da chave estrangeira no model Tecnico
        targetKey: 'tec_id',        // Nome da chave primária no model Supervisor
        as: 'tecnicosCheck'            // Alias do relacionamento
      });
    
  //erro na associação n,n
  Checklists.belongsToMany(models.Instrumentos, {
    through: 'ChecklistInstrumento',  // Nome da tabela intermediária
    foreignKey: 'checklistId',        // Refere-se à chave estrangeira na tabela intermediária (mude para 'che_id')
    otherKey: 'instrumentoId',        // Refere-se à chave estrangeira na tabela intermediária (mude para 'it_id')
    as: 'instrumentos',               // Alias para o relacionamento
    timestamps: false // Opcional se for configurado no modelo intermediário
  });
  
    
  };
  
  return Checklists;
};