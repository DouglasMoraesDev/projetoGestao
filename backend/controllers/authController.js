// backend/controllers/authController.js
// Controladores para autenticação: registro e login de usuários

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Registra um novo usuário
exports.register = (req, res) => {
    const { nome, email, senha } = req.body;

    // Valida os campos obrigatórios
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    // Criptografa a senha do usuário
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            console.error("Erro ao criptografar senha:", err);
            return res.status(500).json({ error: "Erro ao criptografar senha" });
        }

        // Insere o usuário no banco de dados
        db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hash],
            (error, results) => {
                if (error) {
                    console.error("Erro ao cadastrar usuário:", error);
                    return res.status(500).json({ error: "Erro ao cadastrar usuário" });
                }
                res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
            }
        );
    });
};

// Realiza o login do usuário
exports.login = (req, res) => {
    const { email, senha } = req.body;

    // Valida os campos obrigatórios
    if (!email || !senha) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    // Consulta o usuário pelo email
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error("Erro no servidor:", error);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const user = results[0];

        // Compara a senha informada com a senha armazenada
        bcrypt.compare(senha, user.senha, (err, match) => {
            if (err) {
                console.error("Erro ao verificar senha:", err);
                return res.status(500).json({ error: "Erro ao verificar senha" });
            }
            if (!match) {
                return res.status(401).json({ error: "Senha incorreta" });
            }

            // Gera um token JWT válido por 1 hora
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: "Login realizado com sucesso", token });
        });
    });
};
