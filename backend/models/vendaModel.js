// backend/models/vendaModel.js
// Model para gerenciamento de vendas, agora com novos campos para observação, parcelamento e formas de pagamento

const db = require('../db');

// Registra uma nova venda com os novos campos
exports.criar = (clienteId, produtoId, quantidade, total, observacao, parcelado, forma_pagamento, valor_entrada, parcelas, valor_parcela) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO vendas 
            (cliente_id, produto_id, quantidade, total, observacao, parcelado, forma_pagamento, valor_entrada, parcelas, valor_parcela) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [clienteId, produtoId, quantidade, total, observacao, parcelado, forma_pagamento, valor_entrada, parcelas, valor_parcela],
            (err, result) => {
                if (err) {
                    console.error("Erro ao cadastrar venda:", err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Lista todas as vendas
exports.listar = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM vendas', (err, results) => {
            if (err) {
                console.error("Erro ao listar vendas:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};
