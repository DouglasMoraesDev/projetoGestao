// backend/server.js
// Configuração do servidor Express

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Middleware para habilitar CORS e interpretar JSON
app.use(cors());
app.use(express.json());

// Importa as rotas do sistema
const authRoutes = require('./routes/authRoutes');
const transacaoRoutes = require('./routes/transacaoRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const vendaRoutes = require('./routes/vendaRoutes');

// Define prefixos para as rotas
app.use('/auth', authRoutes);
app.use('/transacao', transacaoRoutes);
app.use('/produto', produtoRoutes);
app.use('/cliente', clienteRoutes);
app.use('/venda', vendaRoutes);

// Inicia o servidor na porta definida (ou 3000 por padrão)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
