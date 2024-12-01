// models/ChecklistInstrumento.js
module.exports = (sequelize, DataTypes) => {
    const ChecklistInstrumento = sequelize.define('ChecklistInstrumento', {
      checklistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Checklists', // Assumindo que exista uma tabela 'Checklists'
          key: 'id',
        },
      },
      instrumentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Instrumentos', // Assumindo que exista uma tabela 'Instrumentos'
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Define o valor default para o timestamp
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    }, {
      timestamps: true,  // Garante que o Sequelize gerencie 'createdAt' e 'updatedAt'
      tableName: 'ChecklistInstrumento', // Nome da tabela
    });
  
    // Definir associações, se necessário (opcional)
    ChecklistInstrumento.associate = (models) => {
      // Associação com a tabela Checklists
      ChecklistInstrumento.belongsTo(models.Checklists, {
        foreignKey: 'checklistId',
        as: 'checklist',
      });
  
      // Associação com a tabela Instrumentos
      ChecklistInstrumento.belongsTo(models.Instrumentos, {
        foreignKey: 'instrumentoId',
        as: 'instrumento',
      });
    };
  
    return ChecklistInstrumento;
  };
  