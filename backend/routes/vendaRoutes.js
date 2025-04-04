// backend/routes/vendaRoutes.js
const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para realizar uma venda (requer autenticação)
// Agora a venda é feita informando os nomes do cliente e do produto
router.post('/realizar', authMiddleware, vendaController.realizarVenda);

// Rota para listar todas as vendas (requer autenticação)
router.get('/listar', authMiddleware, vendaController.listarVendas);

module.exports = router;
