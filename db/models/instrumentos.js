'use strict';
const Checklists = require("./checklists");
const categorias = require("./categorias")
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instrumentos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Instrumentos.init({
      it_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      it_sts: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      it_nome: {
        type: DataTypes.STRING,
        allowNull: true 
      },
      it_che_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      it_cat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      it_createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      it_updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Instrumentos',
      tableName: 'Instrumentos',
      timestamps: true, // Habilita createdAt e updatedAt automaticamente
      createdAt: 'it_createdAt',
      updatedAt: 'it_updatedAt',
    });
 //erro na associação n,n
    Instrumentos.associate = function(models) { 
      Instrumentos.belongsToMany(models.Checklists, {
        through: 'ChecklistInstrumento',  // Nome da tabela intermediária
        foreignKey: 'instrumentoId',      // Refere-se à chave estrangeira na tabela intermediária
        otherKey: 'checklistId',          // Refere-se à chave estrangeira na tabela intermediária
        as: 'checklists',                  // Alias para o relacionamento
        timestamps: false // Opcional se for configurado no modelo intermediário
      });
      
    
   
    Instrumentos.belongsTo(models.Categorias, { 
      foreignKey: 'it_cat_id',   // Nome da chave estrangeira no model Tecnico
      targetKey: 'cat_id',        // Nome da chave primária no model Supervisor
      as: 'categorias'            // Alias do relacionamento
    });
  }
  return Instrumentos;
};