// Incluir as bibliotecas
const express = require("express");
const cors = require('cors');
require('dotenv').config();

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

app.use('/', publicRoutes)
app.use('/', ChecklistsController.validaToken, categoriasController.validaToken, instrumentosController.validaToken, supervisoresController.validaToken, tecnicosController.validaToken,privaterRoutes)

// Iniciar o servidor na porta 3001, criar a função utilizando modelo Arrow function para retornar a mensagem de sucesso
app.listen (process.env.PORT, ()=>{
    console.log (`Servidor Rodando na porta ${process.env.PORT}`)
})