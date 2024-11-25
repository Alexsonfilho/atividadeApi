// Incluir as biblibotecas
// Responsavel por gerenciar as requisições, rotas e URLs, entre outras funcionalidades
const express = require ('express')
// Incluir a conexão com o banco de dados
const db = require("../db/models");
// Chamar a função express
const router = express.Router();



// Endereço para acessar através da aplicação externa: http://localhost:3001/categorias
/**
 formato parar cadastrar:
 {	    
		"cat_nome": ".."
 }

 */
// Cria a rota cadastrar 
router.post("/", async (req, res) =>{
    // Receber os dados
    var data = req.body;

    // Salvar no banco de dados
    await db.Categorias.create(data).then((dataMessage) => {
        return res.json({
            mensage: "Categoria cadastrada com sucesso",
            data: dataMessage
        })
    }).catch(()=>{
        return res.json({
            error: false,
            mensage: "Error: Categoria não cadastrado com sucesso",
            
        })
    })

})


// Cria a rota listar 
// Endereço para acessar através da aplicação externa: http://localhost:3001/categorias
router.get("/", async (req, res) => {

    // Receber o número da página, quando não é enviado o número da página é atribuido página 1
    const { page  = 1 } = req.query
    //console.log(page)

    // Limite de registros em casa página 
    const limit = 10
    // variável com o número da última página
    var lasPage = 1 
    // Contar a quantidade de registro no banco de dados
    const countCategorias = await db.Categorias.count()
    //console.log(countTecnico)
    // Acessa o IF quando encontrar registro no banco de dados
    if(countCategorias !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countCategorias / limit)
        //console.log(lastPage)

    }else{
        return res.status(400).json({
            mensagem: "Erro: Nenhuma Categoria encontrada!"
        });

    }
     

    // Recuperar todos os usuário do banco de dados
    const categorias = await db.Categorias.findAll({

        // Indicar quais colunas recuperar
        attributes: ['cat_id','cat_nome'],
      
        // Ordenar os registros pela coluna id na forma decrescente
        order: [['cat_id', 'ASC']],

        // Calcular a partir de qual registro deve retonar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    });

    // Acessa o IF se encontrar o registro no banco de dados
    if ( categorias ) {
        // Criar objeto com as informações para paginação 
        var pagination = {
            //caminho
            path: '/categorias',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Última página
            lasPage,
            //Quantidade de registros
            total: countCategorias
        }


        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            categorias,
            pagination
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhuma categoria encontrada!"
        });
    }
});

// Endereço para acessar através da aplicação externa: http://localhost:3001/categorias/"1 ou id que você quer acessar"
// Cria a rota visualizar e recber o parâmetro id enviado na URL
router.get("/:cat_id", async (req, res) => {

    // Receber o parâmetro enviado na URL
    const { cat_id } = req.params;
    //console.log(id);

    // Recuperar o registro do banco de dados
    const categorias = await db.Categorias.findOne({
        // Indicar quais colunas recuperar
        attributes: ['cat_id','cat_nome'],

        // Acrescentado condição para indicar qual registro deve ser retornado do banco de dados
        where: { cat_id },
    });
    //console.log(user);

    // Acessa o IF se encontrar o registro no banco de dados
    if (categorias) {
        // Pausar o processamento e retornar os dados
        return res.json({
            categorias: categorias.dataValues
        });
    } else {
        // Pausar o processamento e retornar a mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Categoria não encontrada!"
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
    await db.Categorias.update(dados, {where: {cat_id: dados.cat_id}})
    .then(() =>{
        // Pausar o processamento e retonar a mensagem 
        return res.json({
            mensagem: "Categoria editada com sucesso!"
        })
    }).catch(() => {
        // Pausar o processamento e retornar a mensgem
        return req.status(400).json({
            mensagem:"Erro: Categoria não editada!"
        })
    })

})

// Endereço para acessar através da aplicação externa: http://localhost:3001/categorias/"1 ou id que você quer apagar"
// Cria a rota apagar e receber o parãmetro id enviado na URL
router.delete("/:cat_id", async (req, res) => {
    // Receber o parâmetro enviado na URL
    const { cat_id } = req.params
    // Apagar usuário no banco de dados utilizando a models supervisor
    await db.Categorias.destroy({
        // Acrescentar o WHERE na instrução SQL indicando qual registro exxcluir no BD
        where: {cat_id} 
    }).then(() => {
        // Pausa o processamento e retorna a mensagem 
        return res.json({
            mensagem: "Categoria apagada com sucesso!"
        })
    }).catch(() => {
            // Pausa o processamento e retorna a mensagem
            return res.status(400).json({
                menagem:"Error: Categoria não encontrada!"
            })
        })
})


module.exports = router; 