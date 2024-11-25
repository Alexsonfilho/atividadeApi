// Incluir as biblibotecas
// Responsavel por gerenciar as requisições, rotas e URLs, entre outras funcionalidades
const express = require ('express')
// Incluir a conexão com o banco de dados
const db = require("../db/models")
const Checklists = require("../db/models")
// Chamar a função express
const router = express.Router();


// Endereço para acessar através da aplicação externa: http://localhost:3001/instrumentos
/**
 formato para cadastrar:
 {
    "it_sts":"..."
    "it_nome":"..."
    "it_che_id":"..."
 }
 */
// Cria a rota cadastrar 
router.post("/", async (req, res) =>{
    // Receber os dados
    var data = req.body;
    
    // Salvar no banco de dados
    await db.Instrumentos.create(data).then((dataMessage) => {
        return res.json({
            mensage: "Instrumento cadastrado com sucesso",
            data: dataMessage
        })
    }).catch(()=>{
        return res.json({
            error: false,
            mensage: "Error: Instrumento não cadastrado com sucesso",
            
        })
    })

    
})


// Cria a rota listar 
// Endereço para acessar através da aplicação externa: http://localhost:3001/instrumentos
router.get("/", async (req, res) => {

    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page  = 1 } = req.query
    //console.log(page)

    // Limite de registros em casa página 
    const limit = 10
    // variável com o número da última página
    var lasPage = 1 
    // Contar a quantidade de registro no banco de dados
    const countInstrumentos = await db.Instrumentos.count()
    //console.log(countTecnico)
    // Acessa o IF quando encontrar registro no banco de dados
    if(countInstrumentos !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countInstrumentos / limit)
        //console.log(lastPage)

    }else{
        return res.status(400).json({
            mensagem: "Erro: Nenhum Instrumento encontrado!"
        });

    }
     

    // Recuperar todos os usuário do banco de dados
    const instrumentos = await db.Instrumentos.findAll({

        // Indicar quais colunas recuperar
        attributes: ['it_id', 'it_sts','it_nome'],

        include: [{
            model: db.Categorias,
            as: 'categorias',
            attributes: ['cat_id','cat_nome'],

        },
       //erro na associação n,n
         {
            model: db.Checklists,  // Incluindo o modelo Supervisor
            as: 'checklists',      // Alias definido no belongsTo
            attributes: ['che_id'],  // Defina os campos que quer incluir do supervisor
            through: { attributes: [] } // Exclui os atributos da tabela intermediária
        }],
         

        // Ordenar os registros pela coluna id na forma decrescente
        order: [['it_id', 'ASC']],

        // Calcular a partir de qual registro deve retonar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if ( instrumentos ) {
        // Criar objeto com as informações para paginação 
        var pagination = {
            //caminho
            path: '/instrumentos',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Última página
            lasPage,
            //Quantidade de registros
            total: countInstrumentos
        }


        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            instrumentos,
            pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum Instrumentos encontrado!"
        });
    }
});

// Endereço para acessar através da aplicação externa: http://localhost:3001/instrumentos/"1 ou id que você quer acessar"
// Cria a rota visualizar e recber o parâmetro id enviado na URL
router.get("/:it_id", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { it_id } = req.params;
    //console.log(id);

    // Recuperar o registro do banco de dados
    const instrumentos = await db.Instrumentos.findOne({
        // Indicar quais colunas recuperar
        attributes: ['it_id', 'it_sts','it_nome'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: { it_id },
    });
    //console.log(user);

    // Acessa o IF se encontrar o registro no banco de dados
    if (instrumentos) {
        // Pausar o processamento e retornar os dados
        return res.json({
            instrumentos: instrumentos.dataValues
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Instrumentos não encontrado!"
        });
    }
});

/**
 formato para editar:
 {
    "it_id":".."
    "it_sts":"..."
    "it_nome":"..."
    "it_che_id":"..."
 }
 */

// Cria a rota editar 
router.put("/", async (req, res) =>{
    // Receber os dados enviados no corpo da requisição
    var dados = req.body

    // Editar no banco de dados
    await db.Instrumentos.update(dados, {where: {it_id: dados.it_id}})
    .then(() =>{
        // Pausar o processamento e retonar a mensagem 
        return res.json({
            mensagem: "Instrumento editado com sucesso!"
        })
    }).catch(() => {
        // Pausar o processamento e retornar a mensgem
        return req.status(400).json({
            mensagem:"Erro: Instrumento não editado!"
        })
    })

})


// Endereço para acessar através da aplicação externa: http://localhost:3001/instrumentos/"1 ou id que você quer apagar"
// Cria a rota apagar e receber o parãmetro id enviado na URL
router.delete("/:it_id", async (req, res) => {
    // Receber o parâmetro enviado na URL
    const { it_id } = req.params
    // Apagar usuário no banco de dados utilizando a models supervisor
    await db.Instrumentos.destroy({
        // Acrescentar o WHERE na instrução SQL indicando qual registro exxcluir no BD
        where: {it_id} 
    }).then(() => {
        // Pausa o processamento e retorna a mensagem 
        return res.json({
            mensagem: "Instrumento apagado com sucesso!"
        })
    }).catch(() => {
            // Pausa o processamento e retorna a mensagem
            return res.status(400).json({
                menagem:"Error: Instrumento não encontrado!"
            })
        })
})

// Exportar a instrução que está dentro da constante router  
module.exports = router; 