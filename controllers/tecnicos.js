// Incluir as biblibotecas

// Responsavel por gerenciar as requisições, rotas e URLs, entre outras funcionalidades
const express = require ('express')
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
 }
 */
// Criar a rota cadastrar 
router.post("/", async (req, res) =>{
    // Receber os dados
    var data = req.body;
    
    // Salvar no banco de dados
    await db.Tecnicos.create(data).then((dataMessage) => {
        return res.json({
            error: false,
            mensage: "Técnico cadastrado com sucesso",
            data: dataMessage
        })
    }).catch(()=>{
        return res.json({
            error: false,
            mensage: "Error: Técnico não cadastrado com sucesso",
            
        })
    })

    
})
// Criar a rota listar 
// Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos
router.get("/", async (req, res) => {

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
     

    // Recuperar todos os usuário do banco de dados
    const tecnicos = await db.Tecnicos.findAll({

        // Indicar quais colunas recuperar
        attributes: ['tec_id', 'tec_nome','tec_loginclaro','tec_cpf','tec_email','tec_tel'],
        include: [{
            model: db.Supervisores,  // Incluindo o modelo Supervisor
            as: 'supervisores',      // Alias definido no belongsTo
            attributes: ['sup_id', 'sup_nome']  // Defina os campos que quer incluir do supervisor
        }],

        // Ordenar os registros pela coluna id na forma decrescente
        order: [['tec_id', 'ASC']],
       

        // Calcular a partir de qual registro deve retonar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if ( tecnicos ) {
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


        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            tecnicos,
            pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum Técnico encontrado!"
        });
    }
});
// Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos/"1 ou id que você quer acessar"
// Criar a rota visualizar e recber o parâmetro id enviado na URL
router.get("/:tec_id", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { tec_id } = req.params;
    //console.log(id);

    // Recuperar o registro do banco de dados
    const tecnicos = await db.Tecnicos.findOne({
        // Indicar quais colunas recuperar
        attributes: ['tec_id', 'tec_nome','tec_loginclaro','tec_cpf','tec_email','tec_tel'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: { tec_id },
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
/**
  Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos/"1 ou id que você quer editar" 

 */
// Criar a rota editar 
router.put("/", async (req, res) =>{
    // Receber os dados enviados no corpo da requisição
    var dados = req.body

    // Editar no banco de dados
    await db.Tecnicos.update(dados, {where: {tec_id: dados.tec_id}})
    .then(() =>{
        // Pausar o processamento e retonar a mensagem 
        return res.json({
            mensagem: "Técnico editado com sucesso!"
        })
    }).catch(() => {
        // Pausar o processamento e retornar a mensgem
        return req.status(400).json({
            mensagem:"Erro: Técnico não editado!"
        })
    })

})
// Endereço para acessar através da aplicação externa: http://localhost:3001/tecnicos/"1 ou id que você quer apagar"
// Criar a rota apagar e receber o parãmetro id enviado na URL
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