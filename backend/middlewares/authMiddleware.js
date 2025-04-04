// backend/middlewares/authMiddleware.js
// Middleware para validação de token JWT

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Obtém o token do header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado! Token não fornecido." });
    }

    // Verifica a validade do token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido!" });
        }
        // Armazena os dados do token no objeto request
        req.user = decoded;
        next();
    });
};


