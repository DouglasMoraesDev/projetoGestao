const db = require('../db');

exports.criar = (descricao, valor, tipo, usuario_id) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO transacoes (descricao, valor, tipo, usuario_id) VALUES (?, ?, ?, ?)',
            [descricao, valor, tipo, usuario_id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
    });
};

exports.listar = (usuario_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM transacoes WHERE usuario_id = ?', [usuario_id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
    });
};
