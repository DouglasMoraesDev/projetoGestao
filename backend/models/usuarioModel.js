// backend/models/usuarioModel.js
// Model para gerenciamento de usuários

const bcrypt = require('bcryptjs');
const db = require('../db');

// Cria um novo usuário
exports.criar = async (nome, email, senha) => {
    try {
        // Criptografa a senha
        const hash = await bcrypt.hash(senha, 10);
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, hash],
                (err, result) => {
                    if (err) {
                        console.error("Erro ao cadastrar usuário:", err);
                        return reject(err);
                    }
                    resolve(result);
                }
            );
        });
    } catch (error) {
        console.error("Erro ao processar a senha:", error);
        throw error;
    }
};

