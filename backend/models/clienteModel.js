// backend/models/clienteModel.js
// Model para gerenciamento de clientes, agora com CPF e endereço

const db = require('../db');

// Cria um novo cliente com os novos campos (cpf e endereco)
exports.criar = (nome, email, telefone, cpf, endereco) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO clientes (nome, email, telefone, cpf, endereco) VALUES (?, ?, ?, ?, ?)',
            [nome, email, telefone, cpf, endereco],
            (err, result) => {
                if (err) {
                    console.error("Erro ao cadastrar cliente:", err);
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Lista todos os clientes
exports.listar = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM clientes', (err, results) => {
            if (err) {
                console.error("Erro ao listar clientes:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Busca um cliente pelo nome (assumindo nomes únicos)
exports.buscarPorNome = (nome) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM clientes WHERE nome = ?', [nome], (err, results) => {
            if (err) {
                console.error("Erro ao buscar cliente:", err);
                return reject(err);
            }
            resolve(results[0]);
        });
    });
};
