// Incluir as bibliotecas
// Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require("express");
const cors = require('cors');
// Chamar a função express
const app = express();

// Configurar o CORS para permitir todas as origens
app.use(cors());

const bodyParser = require('body-parser');
// Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

// Testar conexão com banco de dados
const db = require("./db/models");

// Incluir as CONTROLLERS
const supervisores = require("./controllers/supervisores");
const tecnicos = require("./controllers/tecnicos");
const checklists = require("./controllers/checklists");
const instrumentos = require("./controllers/instrumentos");
const relacionamentos = require("./controllers/relacionamentos")
const login = require("./controllers/supervisores")
const logintec = require("./controllers/tecnicos")
const cadastrar = require("./controllers/tecnicos")
const categorias = require("./controllers/categorias")
const redefinir = require("./controllers/tecnicos")
const redefinirsup = require("./controllers/supervisores")
const search = require("./controllers/tecnicos")
const redefiniratual = require("./controllers/supervisores")
// Criar as rotas
app.use('/supervisores', supervisores);
app.use('/tecnicos', tecnicos);
app.use('/checklists', checklists);
app.use('/instrumentos', instrumentos);
app.use('/relacionamentos', relacionamentos);
app.use('/login', login);
app.use('/logintec', logintec);
app.use('/cadastrar', cadastrar)
app.use('/categorias', categorias);
app.use('/redefinir', redefinir);
app.use('/redefinir', redefinirsup);
app.use('/redefiniratual', redefiniratual);
app.use('/search', search)

// Iniciar o servidor na porta 3001, criar a função utilizando modelo Arrow function para retornar a mensagem de sucesso
app.listen(3001, () => {
    console.log("Servidor iniciado na porta 3001: http://localhost:3001");
});