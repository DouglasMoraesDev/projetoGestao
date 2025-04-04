// backend/models/produtoModel.js
// Model para gerenciamento de produtos, agora com campo foto

const db = require('../db');

// Cria um novo produto com foto
exports.criar = (nome, preco, estoque, foto) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO produtos (nome, preco, estoque, foto) VALUES (?, ?, ?, ?)',
            [nome, preco, estoque, foto],
            (err, result) => {
                if (err) {
                    console.error("Erro ao cadastrar produto:", err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Lista todos os produtos
exports.listar = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM produtos', (err, results) => {
            if (err) {
                console.error("Erro ao listar produtos:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Atualiza um produto
exports.atualizar = (id, nome, preco, estoque, foto) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE produtos SET nome = ?, preco = ?, estoque = ?, foto = ? WHERE id = ?',
            [nome, preco, estoque, foto, id],
            (err, result) => {
                if (err) {
                    console.error("Erro ao atualizar produto:", err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Atualiza o estoque do produto (subtrai a quantidade vendida)
exports.atualizarEstoque = (id, quantidadeVendida) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
            [quantidadeVendida, id],
            (err, result) => {
                if (err) {
                    console.error("Erro ao atualizar estoque:", err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Deleta um produto
exports.deletar = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM produtos WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error("Erro ao deletar produto:", err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Busca um produto pelo nome (assumindo nomes únicos)
exports.buscarPorNome = (nome) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM produtos WHERE nome = ?', [nome], (err, results) => {
            if (err) {
                console.error("Erro ao buscar produto:", err);
                return reject(err);
            }
            resolve(results[0]);
        });
    });
};
