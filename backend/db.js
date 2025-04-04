// backend/db.js
// Configuração da conexão com o banco de dados MySQL

const mysql = require('mysql2');
require('dotenv').config();

// Cria a conexão com o banco utilizando as variáveis de ambiente
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conecta ao banco de dados e trata possíveis erros
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

module.exports = connection;
