// backend/routes/transacaoRoutes.js
// Rotas para gerenciamento de transações

const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para adicionar uma nova transação (requer autenticação)
router.post('/add', authMiddleware, transacaoController.criarTransacao);

// Rota para listar transações do usuário autenticado
router.get('/listar', authMiddleware, transacaoController.listarTransacoes);

module.exports = router;
