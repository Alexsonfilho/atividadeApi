'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Times extends Model {
    /**
     * Métodos de associações podem ser definidos aqui.
     */
    static associate(models) {
      // Define associações aqui, se houver.
    }
  }

  Times.init({
    tm_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    tm_sup_id: {
      type: DataTypes.INTEGER,
      allowNull: true 
    },
    tm_nome:{
      type: DataTypes.STRING,
      allowNull: true 
    }
  
  }, {
    sequelize,
    modelName: 'Times',
    tableName: 'Times',
    timestamps: true, // Habilita createdAt e updatedAt automaticamente
    createdAt: 'tm_createdAt',
    updatedAt: 'tm_updatedAt',
  });


  // associação 
  Times.associate = function(models) {

     // associação (n,1) um time pode obter um ou n técnicos
     Times.hasMany(models.Tecnicos, {
      foreignKey: 'tec_tm_id', // Nome da coluna de chave estrangeira no model Tecnicos
      as: 'tecnicosTimes', // Alias único para a relação
    });
     
      // associação (1,1) um time pode ter somente um supervisor
    Times.belongsTo(models.Supervisores, {
      foreignKey: 'tm_sup_id', // Nome da chave estrangeira no model Times
      as: 'supervisoresTimes', // Alias para acessar o supervisor de um time
    });

    };
  

  return Times;
};
