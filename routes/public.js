const express = require ('express')
const router = express.Router()
const tecnicosController = require('../controllers/tecnicosControllers')
const supervisoresController = require('../controllers/supervisoresControllers')
const relacionamentos = require('../controllers/relacionamentosControllers')
const timesController = require('../controllers/timesControllers')

router.use (express.static('public'))

// rotas afins de testes
router.post('/relacionamentos/associarMultiplosChePinst', relacionamentos.associarMultiplosChePinst) // associar um único checklist a vários instrumentos
router.post('/relacionamentos/associarMultiploInstPchet', relacionamentos.associarMultiploInstPche) //associar um único instrumento a vários checklists:
router.post('/times/cadastrar', timesController.create) // cadastrar times

//rotas supervisores
router.post('/supervisores/cadastrar', supervisoresController.create) // cadastrar supervisor
router.post('/supervisores/redefinir', supervisoresController.resetPassword) // redefinir senha
router.post('/supervisores/login', supervisoresController.login) // login supervisor

// rotas técnicos
router.post('/tecnicos/cadastrar',tecnicosController.create) // cadastrar técnico
router.post('/tecnicos/resetPassword', tecnicosController.resetPassword) // redefinir senha
router.post('/tecnicos/login', tecnicosController.login) // login técnico

module.exports = router