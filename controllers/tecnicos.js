// Incluir as biblibotecas
// Responsavel por gerenciar as requisições, rotas e URLs, entre outras funcionalidades
const express = require ('express')
const bcrypt = require('bcrypt'); // Para utilizar o operador LIKE
const { Op } = require("sequelize");
// Incluir a conexão com o banco de dados
const db = require("../db/models")
const Supervisores = require("../db/models")
// Chamar a função express
const router = express.Router();

// Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos
/**
 formato para cadastrar:
 {
  	    "tec_sup_id":...,
		"tec_nome": "...",
        "tec_cpf": "..."0,
        "tec_loginclaro": "...",
		"tec_emial":"...",
		"tec_tel":"..."
        "tec_placa":"..."
 }
 */


// Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos

router.post("/cadastrar", async (req, res) => {
    var data = req.body;

    try {
        // Gera o hash da senha
        const salt = await bcrypt.genSalt(10);
        data.tec_senha = await bcrypt.hash(data.tec_senha, salt);

        // Salva o técnico no banco de dados
        const dataMessage = await db.Tecnicos.create(data);

        return res.json({
            mensagem: "Técnico cadastrado com sucesso!",
            data: dataMessage,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            mensagem: "Erro: Técnico não cadastrado com sucesso!",
        });
        
    }
});


// Rota para redefinir a senha
router.post("/redefinir", async (req, res) => {
    const { tec_email, tec_loginclaro } = req.body;
  
    try {
      // Verifica se o técnico existe com esse email
      const tecnicos = await db.Tecnicos.findOne({
        where: { tec_email: tec_email },
      });
  
      if (!tecnicos) {
        return res.status(404).json({ sucesso: false, mensagem: "Técnico não encontrado." });
      }
  
      // Criptografa a nova senha
      const salt = await bcrypt.genSalt(3);
      const senhaCriptografada = await bcrypt.hash(tec_loginclaro, salt);
  
      // Atualiza a senha do técnico no banco de dados
      await db.Tecnicos.update({ tec_loginclaro: senhaCriptografada }, {
        where: { tec_email: tec_email }
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
  

  router.post("/logintec", async (req, res) => {
    const { tec_nome, tec_loginclaro } = req.body;

    try {
        // Localizar o supervisor pelo nome
        const tecnico = await db.Tecnicos.findOne({
            where: { tec_nome },
        });

        if (!tecnico) {
            return res.status(404).json({
                success: false,
                mensagem: "Supervisor não encontrado!",
            });
        }

        // Verificar se a senha fornecida corresponde ao hash
        const senhaValida = await bcrypt.compare(tec_loginclaro, tecnico.tec_loginclaro);

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                mensagem: "Senha inválida!",
            });
        }

        return res.json({
            success: true,
            mensagem: "Login realizado com sucesso!",
            tecnico: tecnico.dataValues,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            mensagem: "Erro no servidor!",
        });
    }
});
// rota listar 
router.get("/", async (req, res) => {
/*
    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page  = 1 } = req.query
    //console.log(page)

    // Limite de registros em casa página 
    const limit = 10
    // variável com o número da última página
    var lasPage = 1 
    // Contar a quantidade de registro no banco de dados
    const countTecnicos = await db.Tecnicos.count()
    //console.log(countTecnico)
    // Acessa o IF quando encontrar registro no banco de dados
    if(countTecnicos !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countTecnicos / limit)
        //console.log(lastPage)

    }else{
        return res.status(400).json({
            mensagem: "Erro: Nenhum Técnico encontrado!"
        });

    }
     */
    // Recupera todos os usuário do banco de dados
    const tecnicos = await db.Tecnicos.findAll({

        // Indicar quais colunas recuperar
        attributes: ['tec_id', 'tec_nome','tec_loginclaro','tec_cpf','tec_email','tec_tel','tec_placa'],
        include: [{
            model: db.Supervisores,  // Incluindo o modelo Supervisor
            as: 'supervisores',      // Alias definido no belongsTo
            attributes: ['sup_id', 'sup_nome']  // Campos incluido do Supervisor
        }],

        // Ordenar os registros pela coluna id na forma decrescente
        order: [['tec_id', 'ASC']],

        // Calcular a partir de qual registro deve retonar e o limite de registros
       // offset: Number((page * limit) - limit),
        //limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if ( tecnicos ) {
        return res.json({
            tecnicos  // Retorna todos os técnicos
        })
       
        /*
        // Criar objeto com as informações para paginação 
        var pagination = {
            //caminho
            path: '/tecnicos',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Última página
            lasPage,
            //Quantidade de registros
            total: countTecnicos
    }
            */
        

        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            tecnicos,
            //pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum Técnico encontrado!"
        });
    }
});

// Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos/"1 ou id que você quer acessar"

// Cria a rota visualizar e receber o parâmetro id enviado na URL
router.get("/:tec_nome", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { tec_nome } = req.params;
    //console.log(id);

    // Recuperar o registro do banco de dados
    const tecnicos = await db.Tecnicos.findOne({
        // Indicar quais colunas recuperar
        attributes: ['tec_id', 'tec_nome','tec_loginclaro','tec_cpf','tec_email','tec_tel'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: { tec_nome },
    });
    //console.log(user);

    // Acessa o IF se encontrar o registro no banco de dados
    if (tecnicos) {
        // Pausar o processamento e retornar os dados
        return res.json({
            tecnicos: tecnicos.dataValues
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Técnico não encontrado!"
        });
    }
});
router.get('/search', async (req, res) => {
    const { tec_nome } = req.params;  // Pegando o parâmetro de busca da query string
    
    try {
      const whereCondition = {};
  
      // Se o parâmetro tec_nome for fornecido, fazemos a busca com LIKE
      if (tec_nome) {
        whereCondition.tec_nome = {
          [Op.like]: `%${tec_nome}%`, // Fazemos a busca por nome usando LIKE
        };
      }
  console.log(tec_nome)
      // Consulta no banco de dados com base no filtro (ou todos os técnicos)
      const tecnicos = await Tecnico.findAll({
        where: whereCondition,  // Passamos a condição de busca
        attributes: ['tec_id', 'tec_nome', 'tec_email', 'tec_tel'],  // Atributos que queremos retornar
        order: [['tec_id', 'ASC']],  // Ordenação pelo ID do técnico
      });
  
      // Retorna os técnicos encontrados
      if (tecnicos.length > 0) {
        return res.json({ tecnicos });
      } else {
        return res.status(404).json({ mensagem: 'Nenhum técnico encontrado.' });
      }
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao buscar técnicos.' });
    }
});
// Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos/"1 ou id que você quer apagar"

// Cria a rota apagar e receber o parãmetro id enviado na URL
router.delete("/:tec_id", async (req, res) => {
    // Receber o parâmetro enviado na URL
    const { tec_id } = req.params
    // Apagar usuário no banco de dados utilizando a models supervisor
    await db.Tecnicos.destroy({
        // Acrescentar o WHERE na instrução SQL indicando qual registro exxcluir no BD
        where: {tec_id} 
    }).then(() => {
        // Pausa o processamento e retorna a mensagem 
        return res.json({
            mensagem: "Técnico apagado com sucesso!"
        })
    }).catch(() => {
            // Pausa o processamento e retorna a mensagem
            return res.status(400).json({
                menagem:"Error: Técnico não encontrado!"
            })
        })
})

// Exportar a instrução que está dentro da constante router  
module.exports = router; 