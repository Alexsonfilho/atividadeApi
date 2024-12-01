// Incluir as bibliotecas
const db = require('../db/models'); // Acesso ao Sequelize e aos modelos

 
module.exports = class TimeController {
  // Método para criar um time
  static async create(req, res) {
    try {
      const { tm_nome, tm_sup_id } = req.body;

      // Verifique se os campos necessários estão presentes
      if (!tm_nome || !tm_sup_id) {
        return res.status(400).json({
          error: true,
          message: "Nome do time e supervisor não informados corretamente!"
        });
      }

      // Verifique se o supervisor existe
      const supervisor = await db.Supervisores.findOne({
        where: { sup_id: tm_sup_id }
      });

      if (!supervisor) {
        return res.status(404).json({
          error: true,
          message: "Supervisor não encontrado!"
        });
      }

      // Criação do time
      const newTime = await db.Times.create({
        tm_nome: tm_nome,
        tm_sup_id: tm_sup_id, // Associa o supervisor ao time
      });

      return res.status(201).json({
        message: "Time criado com sucesso",
        data: newTime
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: "Erro ao criar o time.",
      });
    }
  }
}
