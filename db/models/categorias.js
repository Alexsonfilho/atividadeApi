'use strict';
const Instrumentos = require("./instrumentos")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categorias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  categorias.init({
    cat_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    cat_nome: {
      type: DataTypes.STRING,
      allowNull: true 
    },
  }, {
    sequelize,
    modelName: 'Categorias',
    tableName: 'Categorias',
    timestamps: true, // Habilita createdAt e updatedAt automaticamente
    createdAt: 'cat_createdAt',
    updatedAt: 'cat_updatedAt',
  });

 
  // associação 
  categorias.associate = function(models) {
    // associação (n,1) um supervisor pode cadastrar um ou n técnicos
   categorias.hasMany(models.Instrumentos, { foreignKey: 'it_cat_id', as: 'instrumentos' });
  };
  return categorias;
};