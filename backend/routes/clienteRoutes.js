// backend/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para criar um novo cliente (requer autenticação)
router.post('/criar', authMiddleware, clienteController.criarCliente);

// Rota para listar clientes (requer autenticação)
router.get('/listar', authMiddleware, clienteController.listarClientes);

module.exports = router;
