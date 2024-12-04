const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { Tecnicos } = require("../db/models");
const { Supervisores } = require("../db/models");
const db = require("../db/models");
require('dotenv').config()

module.exports = class tecnicosController{

  // Método para cadastrar técnico
  static async create(req, res) {
    const data = req.body;

    try {
      const salt = await bcrypt.genSalt(10);
      data.tec_senha = await bcrypt.hash(data.tec_senha, salt);

      const tecnico = await Tecnicos.create(data);

      return res.status(201).json({
        mensagem: "Técnico cadastrado com sucesso!",
        tecnico,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        mensagem: "Erro: Técnico não cadastrado!",
        error: error.message,
      });
    }
  }
  // Método para listar todos os técnicos
  static async showAll(req, res){
    try {
      const tecnicos = await Tecnicos.findAll({
        attributes: ["tec_id", "tec_nome", "tec_cpf", "tec_senha", "tec_loginclaro", "tec_email", "tec_tel", "tec_placa"],
        include: [
          {
            model: Supervisores,
            as: "supervisores",
            attributes: ["sup_id", "sup_nome"],
          },
        ],
        order: [["tec_id", "ASC"]],
      });
      return res.status(200).json(tecnicos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        mensagem: "Erro ao listar técnicos.",
      });
    }
  }
  // Método para redefinir senha
  static async resetPassword(req, res) {
    const { tec_email, tec_senha } = req.body;

    try {
      const tecnico = await Tecnicos.findOne({ where: { tec_email } });

      if (!tecnico) {
        return res.status(404).json({ mensagem: "Técnico não encontrado." });
      }

      const salt = await bcrypt.genSalt(10);
      const novaSenha = await bcrypt.hash(tec_senha, salt);

      await tecnico.update({ tec_senha: novaSenha });

      return res.json({ mensagem: "Senha redefinida com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro ao redefinir a senha." });
    }
  }
  // Método para login 
  static async login(req, res) {
    const { tec_nome, tec_senha } = req.body;

    try {
        // Localizar o técnico pelo nome
        const tecnico = await db.Tecnicos.findOne({
            where: { tec_nome },
        });

        if (!tecnico) {
            return res.status(404).json({
                success: false,
                mensagem: "Técnico não encontrado!",
            });
        }

        // Verificar se a senha fornecida corresponde ao hash
        const senhaValida = await bcrypt.compare(tec_senha, tecnico.tec_senha);

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                mensagem: "Senha inválida!",
            });
        }
         // Gerar o token JWT
         const token = jwt.sign(
          { id: tecnico.tec_id }, // Payload do token
          process.env.JWT_KEY, // Chave secreta (definida no arquivo .env)
          { expiresIn: '1h' } // Token válido por 1 hora
      );

        return res.json({
            success: true,
            mensagem: "Login realizado com sucesso!",
            token
            // caso queira informar os dados do técnico na hora do login
            // tecnico: tecnico.dataValues
        });
    } catch (error) {
        console.error("Erro no login do técnico:", error);
        return res.status(500).json({
            success: false,
            mensagem: "Erro no servidor!",
            error: error.message,
        });
    }
  }
  // Método para listar por nome
  static async getByTecNome(req, res) {
    const { tec_nome } = req.params; // Receber o parâmetro enviado na URL

    try {
        // Recuperar o registro do banco de dados
        const tecnico = await Tecnicos.findOne({
            attributes: ["tec_id", "tec_nome", "tec_cpf", "tec_senha", "tec_loginclaro", "tec_email", "tec_tel", "tec_placa"], // Selecionar colunas
            where: { tec_nome }, // Condição de busca
        });

        // Verificar se encontrou o técnico
        if (tecnico) {
            return res.json({ tecnico: tecnico.dataValues });
        } else {
            return res.status(400).json({ mensagem: "Erro: Técnico não encontrado!" });
        }
    } catch (error) {
        console.error("Erro ao buscar técnico:", error);
        return res.status(500).json({
            mensagem: "Erro no servidor ao buscar técnico.",
        });
    }
  }
  // Método para editar técnico
  static async update(req, res) {
    const { tec_id } = req.params; // Identificar o técnico pelo ID (parâmetro na URL)
    const { tec_nome, tec_cpf, tec_senha, tec_loginclaro, tec_email, tec_tel, tec_placa } = req.body; // Dados para atualização

    try {
        // Verificar se o técnico existe
        const tecnico = await Tecnicos.findByPk(tec_id);

        if (!tecnico) {
            return res.status(404).json({ mensagem: "Técnico não encontrado!" });
        }

        // Se o campo tec_senha foi enviado, hash a senha
        let hashedPassword = tecnico.tec_senha; // Manter a senha antiga por padrão
        if (tec_senha) {
            hashedPassword = await bcrypt.hash(tec_senha, 10); // Criptografar a nova senha
        }

        // Atualizar as informações do técnico
        await tecnico.update({
            tec_nome,
            tec_cpf,
            tec_senha: hashedPassword, // Salvar a senha criptografada
            tec_loginclaro,
            tec_email,
            tec_tel,
            tec_placa
        });

        return res.json({
            mensagem: "Técnico atualizado com sucesso!",
            tecnico: tecnico.dataValues,
        });
    } catch (error) {
        console.error("Erro ao atualizar técnico:", error);
        return res.status(500).json({
            mensagem: "Erro no servidor ao atualizar técnico.",
        });
    }
  }
  // Método para exclusão 
  static async delete(req, res) {
    const { tec_id } = req.params; // Receber o ID do técnico enviado na URL

    try {
        // Tentar excluir o técnico pelo ID
        const result = await Tecnicos.destroy({
            where: { tec_id },
        });

        // Verificar se algum registro foi excluído
        if (result === 0) {
            return res.status(404).json({
                mensagem: "Erro: Técnico não encontrado!",
            });
        }

        // Sucesso na exclusão
        return res.json({
            mensagem: "Técnico apagado com sucesso!",
        });
    } catch (error) {
        console.error("Erro ao apagar técnico:", error);
        return res.status(500).json({
            mensagem: "Erro no servidor ao apagar técnico.",
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