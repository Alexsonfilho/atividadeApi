const jwt = require("jsonwebtoken")
const db = require("../db/models");
require('dotenv').config()
module.exports = class ChecklistsController {

    // Método para criar um novo checklist
    static async create(req, res) {
        const data = req.body;

        try {
            const checklist = await db.Checklists.create(data);
            return res.json({
                message: "Checklist realizado com sucesso",
                data: checklist
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "Erro: Checklist não cadastrado com sucesso",
                details: error.message
            });
        }
    }
    // Método para listar todos os checklists 
    static async showAll(req, res) {
        try {
            const checklists = await db.Checklists.findAll({
                attributes: ['che_id', 'che_tec_id', 'che_sup_id'],
                include: [
                    {
                        model: db.Supervisores,
                        as: 'supervisoresCheck',
                        attributes: ['sup_id', 'sup_nome']
                    },
                    {
                        model: db.Tecnicos,
                        as: 'tecnicosCheck',
                        attributes: ['tec_id', 'tec_nome']
                    },
                    {
                        model: db.Instrumentos,
                        as: 'instrumentos',
                        attributes: ['it_id', 'it_nome'],
                        through: { attributes: [] }
                    }
                ],
                order: [['che_id', 'ASC']]
            });

            return res.json({ checklists });
        } catch (error) {
            return res.status(500).json({
                message: "Erro: Nenhum checklist encontrado",
                details: error.message
            });
        }
    }
    // Método para buscar checklist por ID
    static async getById(req, res) {
        const { che_id } = req.params;

        try {
            const checklist = await db.Checklists.findOne({
                attributes: ['che_id', 'che_tec_id', 'che_sup_id', ],
                where: { che_id }
            });

            if (checklist) {
                return res.json({ checklist: checklist.dataValues });
            } else {
                return res.status(400).json({
                    message: "Erro: Checklist não encontrado!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar checklist",
                details: error.message
            });
        }
    }
    // Método para editar um checklist 
    static async update(req, res) {
        const { che_id } = req.params; // Receber o che_id da URL
        const dados = req.body; // Dados para atualização

        try {
            const [updated] = await db.Checklists.update(dados, { where: { che_id } });

            if (updated) {
                return res.json({
                    message: "Checklist editado com sucesso!"
                });
            } else {
                return res.status(400).json({
                    message: "Erro: Checklist não encontrado ou não foi alterado!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao editar checklist",
                details: error.message
            });
        }
    }
    // Método para deletar um checklist
    static async delete(req, res) {
        const { che_id } = req.params;

        try {
            const deleted = await db.Checklists.destroy({
                where: { che_id }
            });

            if (deleted) {
                return res.json({
                    message: "Checklist apagado com sucesso!"
                });
            } else {
                return res.status(400).json({
                    message: "Erro: Checklist não encontrado!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao apagar checklist",
                details: error.message
            });
        }
    }
     // Middleware para validar o token
       static async  validaToken(req,res, next){
        const token = req.header('autorization')
        jwt.verify(token, process.env.JWT_KEY, async(error, success)=> {
            if(error){
                res.status(401).json({
            })}else{
                console.log("valida token ok",success)  
                    next()
                
            }
        })
    }
}
