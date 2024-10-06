// Incluir as bibliotecas
// Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require("express");
// Chamar a função express
const app = express();

// Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

// Testar conexão com banco de dados
const db = require("./db/models");

// Incluir as CONTROLLERS
const supervisores = require("./controllers/supervisores");
const tecnicos = require("./controllers/tecnicos");
// Criar as rotas
app.use('/supervisores', supervisores);
app.use('/tecnicos', tecnicos);

// Iniciar o servidor na porta 8080, criar a função utilizando modelo Arrow function para retornar a mensagem de sucesso
app.listen(3001, () => {
    console.log("Servidor iniciado na porta 3001: http://localhost:3001");
});