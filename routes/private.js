const express = require ('express')
const router = express.Router()
const supervisoresController = require('../controllers/supervisoresControllers')
const tecnicosController = require('../controllers/tecnicosControllers')
const instrumentosController = require('../controllers/instrumentosControllers')
const CategoriasController = require('../controllers/categoriasControllers')
const ChecklistsController = require('../controllers/checklistsControllers')



// Rotas Supervisores Privadas
router.get('/supervisores', supervisoresController.validaToken,supervisoresController.showAll) // listar supervisores
router.get('/supervisores/:sup_nome', supervisoresController.validaToken,supervisoresController.getBySupNome) // listar por nome
router.delete('/supervisores/:sup_id', supervisoresController.validaToken ,supervisoresController.delete) // deletar supervisor
router.put('/supervisores/:sup_id', supervisoresController.validaToken,supervisoresController.update) // editar supervisor

// Rotas Técnicos Privadas
router.get('/tecnicos/listar',tecnicosController.validaToken, tecnicosController.showAll) // listar técnicos
router.get('/tecnicos/:tec_nome', tecnicosController.validaToken, tecnicosController.getByTecNome) // listar por nome
router.put('/tecnicos/:tec_id', tecnicosController.validaToken,tecnicosController.update) // editar técnico
router.delete('/tecnicos/:tec_id', tecnicosController.validaToken, tecnicosController.delete) // excluir técnico

// Rotas Instrumentos Privadas
router.post('/instrumentos/cadastrar',instrumentosController.validaToken, instrumentosController.create) // cadastrar instrumentos
router.get('/instrumentos', instrumentosController.validaToken, instrumentosController.showAll) // listar instrumentos
router.get('/instrumentos/:it_id',instrumentosController.validaToken, instrumentosController.getById) // listar por id instrumentos
router.delete('/instrumentos/:it_id',instrumentosController.validaToken, instrumentosController.delete) // deletar instrumentos
router.put('/instrumentos/:it_id',instrumentosController.validaToken, instrumentosController.update) // editar instrumentos

// Rotas Categorias Privadas 
router.post('/categorias/cadastrar', CategoriasController.validaToken, CategoriasController.create) // cadastra categorias
router.get('/categorias', CategoriasController.validaToken,CategoriasController.showAll) // listar categorias
router.get('/categorias/:cat_id', CategoriasController.validaToken,CategoriasController.getById) // listar por id categorias
router.put('/categorias/:cat_id',CategoriasController.validaToken, CategoriasController.update) // editar categorias 
router.delete('/categorias/:cat_id',CategoriasController.validaToken, CategoriasController.delete) // deletar categorias

// Rotas Checklists Privadas
router.post('/checklists/cadastrar', ChecklistsController.validaToken, ChecklistsController.create) // cadastrar checklists
router.get('/checklists',ChecklistsController.validaToken, ChecklistsController.showAll) // listar checklists
router.get('/checklists/:che_id',ChecklistsController.validaToken, ChecklistsController.getById) // listar por id checklists
router.put('/checklists/:che_id',ChecklistsController.validaToken, ChecklistsController.update) // editar checklists
router.delete('/checklists/:che_id',ChecklistsController.validaToken, ChecklistsController.delete) // deletar checklists

// Verifica acesso a Rotas Privadas
router.get('/privada', supervisoresController.validaToken, (req, res) =>{
    res.json({message: 'acesso a rota privada concedido'})
 })

module.exports = router