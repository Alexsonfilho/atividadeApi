// Incluir as biblibotecas
// Responsavel por gerenciar as requisições, rotas e URLs, entre outras funcionalidades
const express = require ('express')
// Incluir a conexão com o banco de dados
const db = require("../db/models");
const Tecnicos = require('../db/models');
const Supervisores = require("../db/models")
const Instrumentos = require("../db/models")
// Chamar a função express
const router = express.Router();



// Endereço para acessar através da aplicação externa: http://localhost:3001/checklists
/**
 formato parar cadastrar:
 {	    
		"che_tec_id": "..",
        "che_sup_id": ".."
 }

 */
// Cria a rota cadastrar 
router.post("/", async (req, res) =>{
    // Receber os dados
    var data = req.body;

    // Salvar no banco de dados
    await db.Checklists.create(data).then((dataMessage) => {
        return res.json({
            mensage: "Checklist realizado com sucesso",
            data: dataMessage
        })
    }).catch(()=>{
        return res.json({
            error: false,
            mensage: "Error: Realizado  não cadastrado com sucesso",
            
        })
    })

})


// Cria a rota listar 
// Endereço para acessar através da aplicação externa: http://localhost:3001/checklists
router.get("/", async (req, res) => {

    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page  = 1 } = req.query
    //console.log(page)

    // Limite de registros em casa página 
    const limit = 10
    // variável com o número da última página
    var lasPage = 1 
    // Contar a quantidade de registro no banco de dados
    const countChecklists = await db.Checklists.count()
    //console.log(countTecnico)
    // Acessa o IF quando encontrar registro no banco de dados
    if(countChecklists !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countChecklists / limit)
        //console.log(lastPage)

    }else{
        return res.status(400).json({
            mensagem: "Erro: Nenhum Checklist encontrado!"
        });

    }
     

    // Recuperar todos os usuário do banco de dados
    const checklists = await db.Checklists.findAll({

        // Indicar quais colunas recuperar
        attributes: ['che_id', 'che_tec_id','che_sup_id',],
        include: [{
            model: db.Supervisores,  // Incluindo o modelo Supervisor
            as: 'supervisoresCheck',      // Alias definido no belongsTo
            attributes: ['sup_id', 'sup_nome']  // Campos incluidos do supervisor
        },
        {
            model: db.Tecnicos,  // Incluindo o modelo Supervisor
            as: 'tecnicosCheck',      // Alias definido no belongsTo
            attributes: ['tec_id', 'tec_nome']  // Campos incluidos do tecnico
        },
        {
            model: db.Instrumentos,  // Incluindo o modelo Supervisor
            as: 'instrumentos',      // Alias definido no belongsTo
            attributes: ['it_id', 'it_nome'],  // Defina os campos que quer incluir do supervisor
            through: { attributes: [] } // Exclui os atributos da tabela intermediária
        }
        ],


        // Ordenar os registros pela coluna id na forma decrescente
        order: [['che_id', 'ASC']],

        // Calcular a partir de qual registro deve retonar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if ( checklists ) {
        // Criar objeto com as informações para paginação 
        var pagination = {
            //caminho
            path: '/checklists',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Última página
            lasPage,
            //Quantidade de registros
            total: countChecklists
        }


        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            checklists,
            pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum Checklist encontrado!"
        });
    }
});

// Endereço para acessar através da aplicação externa: http://localhost:3001/checklists/"1 ou id que você quer acessar"
// Cria a rota visualizar e recber o parâmetro id enviado na URL
router.get("/:che_id", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { che_id } = req.params;
    //console.log(id);

    // Recuperar o registro do banco de dados
    const checklists = await db.Checklists.findOne({
        // Indicar quais colunas recuperar
        attributes: ['che_id', 'che_tec_id','che_sup_id','che_createAt','che_updateAt'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: { che_id },
    });
    //console.log(user);

    // Acessa o IF se encontrar o registro no banco de dados
    if (checklists) {
        // Pausar o processamento e retornar os dados
        return res.json({
            checklists: checklists.dataValues
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Checklist não encontrado!"
        });
    }
});



/**
 formato parar editar:
 {	    
        "che_id":"..",
		"che_tec_id": "..",
        "che_sup_id": ".."
 }

 */
// Cria a rota editar 
router.put("/", async (req, res) =>{
    // Receber os dados enviados no corpo da requisição
    var dados = req.body

    // Editar no banco de dados
    await db.Checklists.update(dados, {where: {che_id: dados.che_id}})
    .then(() =>{
        // Pausar o processamento e retonar a mensagem 
        return res.json({
            mensagem: "Checklist editado com sucesso!"
        })
    }).catch(() => {
        // Pausar o processamento e retornar a mensgem
        return req.status(400).json({
            mensagem:"Erro: Checklist não editado!"
        })
    })

})

// Endereço para acessar através da aplicação externa: http://localhost:3001/checklists/"1 ou id que você quer apagar"
// Cria a rota apagar e receber o parãmetro id enviado na URL
router.delete("/:che_id", async (req, res) => {
    // Receber o parâmetro enviado na URL
    const { che_id } = req.params
    // Apagar usuário no banco de dados utilizando a models supervisor
    await db.Checklists.destroy({
        // Acrescentar o WHERE na instrução SQL indicando qual registro exxcluir no BD
        where: {che_id} 
    }).then(() => {
        // Pausa o processamento e retorna a mensagem 
        return res.json({
            mensagem: "Checklist apagado com sucesso!"
        })
    }).catch(() => {
            // Pausa o processamento e retorna a mensagem
            return res.status(400).json({
                menagem:"Error: Checklist não encontrado!"
            })
        })
})


module.exports = router; 