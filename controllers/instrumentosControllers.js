const jwt = require("jsonwebtoken")
const { Instrumentos, Categorias, Checklists } = require("../db/models");
const db = require("../db/models");
require('dotenv').config()

module.exports = class instrumentosController{
        // Método para criar Instrumentos
        static async create(req, res) {
            const data = req.body; // Receber os dados do corpo da requisição
    
            try {
                // Salvar o instrumento no banco de dados
                const instrumento = await Instrumentos.create(data);
    
                return res.status(201).json({
                    message: "Instrumento cadastrado com sucesso!",
                    data: instrumento,
                });
            } catch (error) {
                console.error("Erro ao cadastrar instrumento:", error);
                return res.status(500).json({
                    error: true,
                    message: "Erro: Instrumento não cadastrado com sucesso!",
                });
            }
        }
        // Método para listar Instrumentos
        static async showAll(req, res) {
            try {
                // Recuperar todos os instrumentos do banco de dados
                const instrumentos = await Instrumentos.findAll({
                    attributes: ['it_id', 'it_sts', 'it_nome'], // Colunas desejadas
                    include: [
                        {
                            model: Categorias,
                            as: 'categorias',
                            attributes: ['cat_id', 'cat_nome'],
                        },
                        {
                            model: Checklists,
                            as: 'checklists',
                            attributes: ['che_id'],
                            through: { attributes: [] }, // Excluir dados da tabela intermediária
                        },
                    ],
                    order: [['it_id', 'ASC']], // Ordenação
                });
    
                // Verificar se encontrou instrumentos
                if (instrumentos.length === 0) {
                    return res.status(400).json({
                        mensagem: "Erro: Nenhum instrumento encontrado!",
                    });
                }
    
                return res.json({ instrumentos });
            } catch (error) {
                console.error("Erro ao listar instrumentos:", error);
                return res.status(500).json({
                    mensagem: "Erro no servidor ao listar instrumentos.",
                    error: error.message,
                });
            }
        }
        // Método para listar Intrusmentos /id
        static async getById(req, res) {
            const { it_id } = req.params; // Receber o parâmetro enviado na URL
    
            try {
                // Recuperar o registro do banco de dados
                const instrumento = await Instrumentos.findOne({
                    attributes: ['it_id', 'it_sts', 'it_nome'], // Selecionar colunas
                    where: { it_id }, // Condição de busca
                });
    
                // Verificar se encontrou o instrumento
                if (instrumento) {
                    return res.json({ instrumento: instrumento.dataValues });
                } else {
                    return res.status(400).json({ mensagem: "Erro: Instrumento não encontrado!" });
                }
            } catch (error) {
                console.error("Erro ao buscar instrumento:", error);
                return res.status(500).json({
                    mensagem: "Erro no servidor ao buscar instrumento.",
                    error: error.message,
                });
            }
        }    
        // Método para editar Instrumentos 
        static async update(req, res) {
            const { it_id } = req.params; // Receber o parâmetro enviado na URL
            const dados = req.body; // Receber os dados enviados no corpo da requisição
        
            try {
                // Atualizar no banco de dados com a condição pelo parâmetro na URL
                const [updated] = await Instrumentos.update(dados, { where: { it_id } });
        
                if (updated) {
                    return res.json({
                        mensagem: "Instrumento editado com sucesso!",
                    });
                } else {
                    return res.status(400).json({
                        mensagem: "Erro: Instrumento não encontrado ou dados não foram alterados.",
                    });
                }
            } catch (error) {
                console.error("Erro ao editar instrumento:", error);
                return res.status(500).json({
                    mensagem: "Erro no servidor ao editar instrumento.",
                    error: error.message,
                });
            }
        }
        // Método para deletar Instrumentos
        static async delete(req, res) {
            const { it_id } = req.params; // Receber o parâmetro enviado na URL
    
            try {
                const deleted = await Instrumentos.destroy({
                    where: { it_id }, // Condição para excluir o instrumento
                });
    
                if (deleted) {
                    return res.json({
                        mensagem: "Instrumento apagado com sucesso!",
                    });
                } else {
                    return res.status(400).json({
                        mensagem: "Erro: Instrumento não encontrado!",
                    });
                }
            } catch (error) {
                console.error("Erro ao apagar instrumento:", error);
                return res.status(500).json({
                    mensagem: "Erro no servidor ao apagar instrumento.",
                    error: error.message,
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