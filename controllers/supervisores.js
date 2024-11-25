// Incluir as biblibotecas
// Responsavel por gerenciar as requisições, rotas e URLs, entre outras funcionalidades
const express = require ('express')
const bcrypt = require('bcrypt');

// Incluir a conexão com o banco de dados
const db = require("../db/models");
const supervisores = require('../db/models/supervisores');
// Chamar a função express
const router = express.Router();


// Endereço para acessar através da aplicação externa: http://localhost:3001/supervisores
/**
 formato parar cadastrar:
 {	    
		"sup_nome": "...",
        "sup_cpf": "...",
        "sup_loginclaro": "..."	
 }

 */
// Cria a rota cadastrar 
// Cria a rota cadastrar 
router.post("/", async (req, res) => {
    var data = req.body;
    try {
        // Gera o hash da senha
        const salt = await bcrypt.genSalt(3);
        data.sup_senha = await bcrypt.hash(data.sup_senha, salt);

        // Salva o supervisor no banco de dados
        const dataMessage = await db.Supervisores.create(data);

        return res.json({
            mensagem: "Supervisor cadastrado com sucesso!",
            data: dataMessage,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            mensagem: "Erro: Supervisor não cadastrado com sucesso!",
        });
    }
});




// Rota para redefinir a senha
router.post("/redefinir", async (req, res) => {
    const { sup_cpf, sup_senha } = req.body;
  
    try {
      // Verifica se o técnico existe com esse email
      const supervisores = await db.Supervisores.findOne({
        where: { sup_cpf: sup_cpf },
      });
  
      if (!supervisores) {
        return res.status(404).json({ sucesso: false, mensagem: "Supervisor não encontrado." });
      }
  
      // Criptografa a nova senha
      const salt = await bcrypt.genSalt(3);
      const senhaCriptografada = await bcrypt.hash(sup_senha, salt);
  
      // Atualiza a senha do técnico no banco de dados
      await db.Supervisores.update({ sup_senha: senhaCriptografada }, {
        where: { sup_cpf: sup_cpf }
      });
  
      return res.json({
        sucesso: true,
        mensagem: "Senha redefinida com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao redefinir a senha.",
      });
    }
  });

  router.post("/redefiniratual", async (req, res) => {
    const { sup_cpf, sup_senha, senhaAtual } = req.body;

    // Verificação dos parâmetros
    if (!sup_cpf|| !senhaAtual || !sup_senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: "Todos os campos são obrigatórios.",
        });
    }

    console.log('Requisição recebida:', req.body);

    try {
        // Verifica se o supervisor existe com o login fornecido
        const supervisor = await db.Supervisores.findOne({
            where: { sup_cpf },
        });

        if (!supervisor) {
            return res.status(404).json({ 
                sucesso: false, 
                mensagem: "Supervisor não encontrado." 
            });
        }

        // Verifica se a senha atual está correta
        const senhaValida = await bcrypt.compare(senhaAtual, supervisor.sup_senha);
        if (!senhaValida) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Senha atual incorreta.",
            });
        }

        // Gera o hash da nova senha
        const salt = await bcrypt.genSalt(10); // Alterado para 10
        const novaSenhaCriptografada = await bcrypt.hash(sup_senha, salt);

        // Atualiza a senha no banco de dados
        await db.Supervisores.update(
            { sup_senha: novaSenhaCriptografada },
            { where: { sup_cpf: sup_cpf } }
        );

        return res.json({
            sucesso: true,
            mensagem: "Senha redefinida com sucesso!",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao redefinir a senha.",
        });
    }
});

router.post("/login", async (req, res) => {
    const { sup_nome, sup_senha } = req.body;

    try {
        // Localizar o supervisor pelo nome
        const supervisor = await db.Supervisores.findOne({
            where: { sup_nome },
        });

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

        return res.json({
            success: true,
            mensagem: "Login realizado com sucesso!",
            supervisor: supervisor.dataValues,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            mensagem: "Erro no servidor!",
        });
    }
});

// Endereço para acessar através da aplicação externa: http://localhost:3001/supervisores
// http://localhost:3001/tecnicos?page=3
// Cria a rota listar 
router.get("/", async (req, res) => {
    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page  = 1 } = req.query
    //console.log(page)

    // Limite de registros em casa página 
    const limit = 10
    // variável com o número da última página
    var lasPage = 1 
    // Contar a quantidade de registro no banco de dados
    const countSupervisores = await db.Supervisores.count()
    //console.log(countTecnico)
    // Acessa o IF quando encontrar registro no banco de dados
    if(countSupervisores !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countSupervisores / limit)
        //console.log(lastPage)

    }else{
        return res.status(400).json({
            mensagem: "Erro: Nenhum Supervisor encontrado!"
        });

    }
     
    // Recuperar todos os usuário do banco de dados
    const supervisores = await db.Supervisores.findAll({

        // Indicar quais colunas recuperar
        attributes: ['sup_id', 'sup_nome','sup_loginclaro','sup_cpf'],

        // Ordenar os registros pela coluna id na forma decrescente
        order: [['sup_id', 'ASC']],

        // Calcular a partir de qual registro deve retonar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if ( supervisores ) {
        // Criar objeto com as informações para paginação 
        var pagination = {
            //caminho
            path: '/supervisores',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Última página
            lasPage,
            //Quantidade de registros
            total: countSupervisores
        }


        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            supervisores,
            pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum Supervisor encontrado!"
        });
    }
});

// Endereço para acessar através da aplicação externa: http://localhost:3001/supervisores/"1 ou id que você quer acessar"

// Cria a rota visualizar e recber o parâmetro id enviado na URL
router.get("/:sup_id", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { sup_id } = req.params;
    //console.log(id);

    // Recuperar o registro do banco de dados
    const supervisores = await db.Supervisores.findOne({
        // Indicar quais colunas recuperar
        attributes: ['sup_id','sup_nome','sup_loginclaro','sup_cpf'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: { sup_id },
    });
    //console.log(user);

    // Acessa o IF se encontrar o registro no banco de dados
    if (supervisores) {
        // Pausar o processamento e retornar os dados
        return res.json({
            supervisores: supervisores.dataValues
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Supervisor não encontrado!"
        });
    }
});
// Endereço para acessar através da aplicação externa: http://localhost:3001/supervisores
/**
  formator para editar
    {
	"sup_id":...,
	"sup_nome": "...",
    "sup_loginclaro": "..."
    }
 */
// Cria a rota editar 
router.put("/", async (req, res) => {
    var dados = req.body;

    try {
        // Verificar se a senha foi enviada para ser atualizada
        if (dados.sup_loginclaro) {
            const salt = await bcrypt.genSalt(10);
            dados.sup_loginclaro = await bcrypt.hash(dados.sup_loginclaro, salt);
        }

        // Atualizar no banco de dados
        await db.Supervisores.update(dados, { where: { sup_id: dados.sup_id } });

        return res.json({
            mensagem: "Supervisor editado com sucesso!",
        });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro: Supervisor não editado!",
        });
    }
});

// Endereço para acessar através da aplicação externa: http://localhost:3001/supervisores/"1 ou id que você quer apagar"
// Cria a rota apagar e receber o parãmetro id enviado na URL
router.delete("/:sup_id", async (req, res) => {
    // Receber o parâmetro enviado na URL
    const { sup_id } = req.params
    // Apagar usuário no banco de dados utilizando a models supervisor
    await db.Supervisores.destroy({
        // Acrescentar o WHERE na instrução SQL indicando qual registro exxcluir no BD
        where: {sup_id} 
    }).then(() => {
        // Pausa o processamento e retorna a mensagem 
        return res.json({
            mensagem: "Supervisor apagado com sucesso!"
        })
    }).catch(() => {
            // Pausa o processamento e retorna a mensagem
            return res.status(400).json({
                menagem:"Error: Supervisor não encontrado!"
            })
        })
})

module.exports = router; 