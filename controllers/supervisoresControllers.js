const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { Supervisores } = require("../db/models");
const db = require("../db/models");
require('dotenv').config()

module.exports = class supervisoresController{
    // método para cadastrar supervisor
    static async create(req, res) {
        const data = req.body;
    
        try {
          const salt = await bcrypt.genSalt(10);
          data.sup_senha = await bcrypt.hash(data.sup_senha, salt);
    
          const supervisor = await Supervisores.create(data);
    
          return res.status(201).json({
            mensagem: "Supervisor cadastrado com sucesso!",
            supervisor,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            mensagem: "Erro: Supervisor não cadastrado!",
            error: error.message,
          });
        }
    }
    // Método para listar supervisor
     static async showAll(req, res){
    try {
        const supervisores = await db.Supervisores.findAll({

            // Indicar quais colunas recuperar
            attributes: ['sup_id', 'sup_nome','sup_loginclaro','sup_cpf'],
    
            // Ordenar os registros pela coluna id na forma decrescente
            order: [['sup_id', 'ASC']],
      });
      return res.status(200).json(supervisores);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        mensagem: "Erro ao listar supervisores.",
      });
    }
    }
    // Método para redefinir senha
    static async resetPassword(req, res) {
    const { sup_cpf, sup_senha } = req.body;

    try {
      const supervisor = await Supervisores.findOne({ where: { sup_cpf } });

      if (!supervisor) {
        return res.status(404).json({ mensagem: "Supervisor não encontrado." });
      }

      const salt = await bcrypt.genSalt(10);
      const novaSenha = await bcrypt.hash(sup_senha, salt);

      await supervisor.update({ sup_senha: novaSenha });

      return res.json({ mensagem: "Senha redefinida com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao redefinir a senha." });
    }
    }
    // Método para login 
    static async login(req, res) {
    const { sup_nome, sup_senha } = req.body;

    try {
        // Buscar supervisor pelo nome
        const supervisor = await Supervisores.findOne({
            where: { sup_nome },
        });

        // Verificar se o supervisor existe
        if (!supervisor) {
            return res.status(404).json({
                success: false,
                mensagem: "Supervisor não encontrado!",
            });
        }

        // Verificar se a senha fornecida corresponde ao hash
        const senhaValida = await bcrypt.compare(sup_senha, supervisor.sup_senha);

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                mensagem: "Senha inválida!",
            });
        }

        // Gerar o token JWT
        const token = jwt.sign(
            { id: supervisor.sup_id }, // Payload do token
            process.env.JWT_KEY, // Chave secreta (definida no arquivo .env)
            { expiresIn: '1h' } // Token válido por 1 hora
        );

        // Retornar sucesso com o token
        return res.json({
            success: true,
            mensagem: "Login realizado com sucesso!",
            token, // Enviar o token para autenticação futura
        });
    } catch (error) {
        console.error("Erro no login do supervisor:", error);
        return res.status(500).json({
            success: false,
            mensagem: "Erro no servidor!",
            error: error.message,
        });
    }
    }
    // Método para listar por nome
    static async getBySupNome(req, res) {
    const { sup_nome } = req.params; // Receber o parâmetro enviado na URL

    try {
        // Recuperar o registro do banco de dados
        const supervisor = await Supervisores.findOne({
            attributes: ["sup_id", "sup_nome", "sup_cpf", "sup_senha", "sup_loginclaro"], // Selecionar colunas
            where: { sup_nome }, // Condição de busca
        });

        // Verificar se encontrou o técnico
        if (supervisor) {
            return res.json({ supervisor: supervisor.dataValues });
        } else {
            return res.status(400).json({ mensagem: "Erro: Supervisor não encontrado!" });
        }
    } catch (error) {
        console.error("Erro ao buscar supervisor:", error);
        return res.status(500).json({
            mensagem: "Erro no servidor ao buscar supervisor.",
        });
    }
     }
    // Método para editar técnico
     static async update(req, res) {
    const { sup_id } = req.params; // Identificar o técnico pelo ID (parâmetro na URL)
    const { sup_nome, sup_cpf, sup_senha, sup_loginclaro } = req.body; // Dados para atualização

    try {
        // Verificar se o técnico existe
        const supervisor = await Supervisores.findByPk(sup_id);

        if (!supervisor) {
            return res.status(404).json({ mensagem: "Técnico não encontrado!" });
        }

        // Se o campo sup_senha foi enviado, hash a senha
        let hashedPassword = supervisor.sup_senha; // Manter a senha antiga por padrão
        if (sup_senha) {
            hashedPassword = await bcrypt.hash(sup_senha, 10); // Criptografar a nova senha
        }

        // Atualizar as informações do técnico
        await supervisor.update({
            sup_nome,
            sup_cpf,
            sup_senha: hashedPassword, // Salvar a senha criptografada
            sup_loginclaro
        });

        return res.json({
            mensagem: "Supervisor atualizado com sucesso!",
            supervisor: supervisor.dataValues,
        });
    } catch (error) {
        console.error("Erro ao atualizar supervisor:", error);
        return res.status(500).json({
            mensagem: "Erro no servidor ao atualizar supervisor.",
        });
    }
    }
    // Método para exclusão 
    static async delete(req, res) {
        const { sup_id } = req.params; // Receber o ID do técnico enviado na URL
    
        try {
            // Tentar excluir o técnico pelo ID
            const result = await Supervisores.destroy({
                where: { sup_id },
            });
    
            // Verificar se algum registro foi excluído
            if (result === 0) {
                return res.status(404).json({
                    mensagem: "Erro: Supervisor não encontrado!",
                });
            }
    
            // Sucesso na exclusão
            return res.json({
                mensagem: "Supervisor apagado com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao apagar supervisor:", error);
            return res.status(500).json({
                mensagem: "Erro no servidor ao apagar Supervisor.",
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
