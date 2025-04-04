// backend/controllers/produtoController.js
// Controladores para gerenciamento de produtos, atualizados para receber foto

const produtoModel = require('../models/produtoModel');

// Cria um novo produto
exports.criarProduto = async (req, res) => {
    const { nome, preco, estoque, foto } = req.body;

    // Valida os campos obrigatórios (foto pode ser opcional, se preferir)
    if (!nome || !preco || estoque === undefined) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios!" });
    }
    try {
        await produtoModel.criar(nome, preco, estoque, foto);
        res.status(201).json({ message: "Produto cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        res.status(500).json({ error: "Erro ao cadastrar produto" });
    }
};

// Lista todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await produtoModel.listar();
        res.json(produtos);
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        res.status(500).json({ error: "Erro ao listar produtos" });
    }
};

// Atualiza um produto pelo ID
exports.atualizarProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, preco, estoque, foto } = req.body;
    
    if (!nome || !preco || estoque === undefined) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios!" });
    }
    
    try {
        await produtoModel.atualizar(id, nome, preco, estoque, foto);
        res.json({ message: "Produto atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
};

// Deleta um produto pelo ID
exports.deletarProduto = async (req, res) => {
    const { id } = req.params;
    try {
        await produtoModel.deletar(id);
        res.json({ message: "Produto deletado com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ error: "Erro ao deletar produto" });
    }
};
