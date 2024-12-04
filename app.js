// Incluir as bibliotecas
const express = require("express");
const cors = require('cors');
require('dotenv').config();


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerDocs.json');

// Chamar a função express
const app = express();

const publicRoutes = require('./routes/public');
const privaterRoutes = require('./routes/private');

const supervisoresController = require("./controllers/supervisoresControllers");
const tecnicosController = require("./controllers/tecnicosControllers");
const instrumentosController = require("./controllers/instrumentosControllers");
const categoriasController = require("./controllers/categoriasControllers");
const ChecklistsController = require("./controllers/checklistsControllers");

// Configurar o CORS para permitir todas as origens
app.use(cors());
app.use (express.urlencoded({extended:true}))


// Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

// Testar conexão com banco de dados
const db = require("./db/models");


// Definindo as opções para o Swagger JSDoc
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Acadêmico',
            version: '1.0.0',
            description: 'API de atividade Backend',
        },
        servers: [
            {
                url: 'http://localhost:3001', // Alterar para o seu domínio e porta
            },
        ],
    },
    // Caminho para o arquivo que contém os comentários Swagger (sua documentação)
    apis: ["./swaggerDocs.json"], // Caminho para o arquivo com seus comentários Swagger
};


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', publicRoutes)
app.use('/', ChecklistsController.validaToken, categoriasController.validaToken, instrumentosController.validaToken, supervisoresController.validaToken, tecnicosController.validaToken,privaterRoutes)

// Iniciar o servidor na porta 3001, criar a função utilizando modelo Arrow function para retornar a mensagem de sucesso
app.listen (process.env.PORT, ()=>{
    console.log (`Servidor Rodando na porta ${process.env.PORT}`)
})