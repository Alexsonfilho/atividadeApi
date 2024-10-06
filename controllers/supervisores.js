// Incluir as biblibotecas

// Responsavel por gerenciar as requisições, rotas e URLs, entre outras funcionalidades
const express = require ('express')
// Incluir a conexão com o banco de dados
const db = require("../db/models")
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
// Criar a rota cadastrar 
router.post("/", async (req, res) =>{
    // Receber os dados
    var data = req.body;


    // Salvar no banco de dados
    
    // Salvar no banco de dados
    await db.Supervisores.create(data).then((dataMessage) => {
        return res.json({
            error: false,
            mensage: "Supervisor cadastrado com sucesso",
            data: dataMessage
        })
    }).catch(()=>{
        return res.json({
            error: false,
            mensage: "Error: Supervisor  não cadastrado com sucesso",
            
        })
    })

})


// Criar a rota listar 
// Endereço para acessar através da aplicação externa: http://localhost:3001/supervisores
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
// Criar a rota visualizar e recber o parâmetro id enviado na URL
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
// Criar a rota editar 
router.put("/", async (req, res) =>{
    // Receber os dados enviados no corpo da requisição
    var dados = req.body

    // Editar no banco de dados
    await db.Supervisores.update(dados, {where: {sup_id: dados.sup_id}})
    .then(() =>{
        // Pausar o processamento e retonar a mensagem 
        return res.json({
            mensagem: "Supervisor editado com sucesso!"
        })
    }).catch(() => {
        // Pausar o processamento e retornar a mensgem
        return req.status(400).json({
            mensagem:"Erro: Supervisor não editado!"
        })
    })

})
// Endereço para acessar através da aplicação externa: http://localhost:3001/supervisores/"1 ou id que você quer apagar"
// Criar a rota apagar e receber o parãmetro id enviado na URL
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