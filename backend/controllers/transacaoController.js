// backend/controllers/transacaoController.js
// Controladores para gerenciamento de transações

const db = require('../db');

// Cria uma nova transação
exports.criarTransacao = (req, res) => {
    const { descricao, valor, tipo } = req.body;
    const usuario_id = req.user.id; // Obtido a partir do middleware de autenticação

    // Valida os campos obrigatórios
    if (!descricao || !valor || !tipo) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    db.query(
        'INSERT INTO transacoes (descricao, valor, tipo, usuario_id) VALUES (?, ?, ?, ?)',
        [descricao, valor, tipo, usuario_id],
        (error, results) => {
            if (error) {
                console.error("Erro ao salvar transação:", error);
                return res.status(500).json({ error: "Erro ao salvar transação" });
            }
            res.status(201).json({ message: "Transação salva com sucesso!" });
        }
    );
};

// Lista as transações do usuário autenticado
exports.listarTransacoes = (req, res) => {
    const usuario_id = req.user.id;

    db.query(
        'SELECT * FROM transacoes WHERE usuario_id = ?',
        [usuario_id],
        (error, results) => {
            if (error) {
                console.error("Erro ao buscar transações:", error);
                return res.status(500).json({ error: "Erro ao buscar transações" });
            }
            res.json(results);
        }
    );
};
