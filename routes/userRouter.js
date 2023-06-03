const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.listar);
router.post('/', userController.salvar);
router.post('/busca/', userController.buscarFiltro);
router.get('/:codigo', userController.buscarPorCodigo);
router.put('/:codigo', userController.atualizar);
router.delete('/:codigo', userController.excluir);

module.exports = router;