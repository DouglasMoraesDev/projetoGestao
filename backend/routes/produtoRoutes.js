// backend/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para criar um novo produto (requer autenticação)
router.post('/criar', authMiddleware, produtoController.criarProduto);

// Rota para listar produtos (requer autenticação)
router.get('/listar', authMiddleware, produtoController.listarProdutos);

// Rota para atualizar um produto pelo ID (requer autenticação)
router.put('/atualizar/:id', authMiddleware, produtoController.atualizarProduto);

// Rota para deletar um produto pelo ID (requer autenticação)
router.delete('/deletar/:id', authMiddleware, produtoController.deletarProduto);

module.exports = router;
