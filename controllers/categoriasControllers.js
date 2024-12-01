const jwt = require("jsonwebtoken")
const db = require("../db/models");
require('dotenv').config()

module.exports =  class CategoriasController {
    // Método para criar uma categoria
    static async create(req, res) {
        const data = req.body;

        try {
            const dataMessage = await db.Categorias.create(data);
            return res.json({
                mensagem: "Categoria cadastrada com sucesso",
                data: dataMessage
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                mensagem: "Erro: Categoria não cadastrada com sucesso",
                detalhe: error.message
            });
        }
    }
    // Método para listar todas as categorias
    static async showAll(req, res) {
        try {
            const categorias = await db.Categorias.findAll({
                attributes: ['cat_id', 'cat_nome'], // Colunas que serão retornadas
                order: [['cat_id', 'ASC']] // Ordenação por ID crescente
            });

            if (categorias.length > 0) {
                return res.json({ categorias });
            } else {
                return res.status(400).json({
                    mensagem: "Erro: Nenhuma Categoria encontrada!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao listar categorias",
                detalhe: error.message
            });
        }
    }
    // Método para buscar uma categoria por ID
    static async getById(req, res) {
        const { cat_id } = req.params;

        try {
            const categoria = await db.Categorias.findOne({
                attributes: ['cat_id', 'cat_nome'],
                where: { cat_id }
            });

            if (categoria) {
                return res.json({ categoria });
            } else {
                return res.status(400).json({
                    mensagem: "Erro: Categoria não encontrada!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao buscar categoria",
                detalhe: error.message
            });
        }
    }
    // Método para editar uma categoria
    static async update(req, res) {
        const { cat_id } = req.params;  // Receber o cat_id da URL
        const dados = req.body;  // Receber os dados do corpo da requisição

        try {
            const [updated] = await db.Categorias.update(dados, { where: { cat_id } });

            if (updated) {
                return res.json({
                    mensagem: "Categoria editada com sucesso!"
                });
            } else {
                return res.status(400).json({
                    mensagem: "Erro: Categoria não encontrada ou não foi alterada!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao editar categoria",
                detalhe: error.message
            });
        }
    }
    // Método para deletar uma categoria
    static async delete(req, res) {
        const { cat_id } = req.params;

        try {
            const deleted = await db.Categorias.destroy({ where: { cat_id } });

            if (deleted) {
                return res.json({
                    mensagem: "Categoria apagada com sucesso!"
                });
            } else {
                return res.status(400).json({
                    mensagem: "Erro: Categoria não encontrada!"
                });
            }
        } catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao apagar categoria",
                detalhe: error.message
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

