// backend/controllers/clienteController.js
// Controladores para gerenciamento de clientes, atualizados para receber CPF e endereço

const clienteModel = require('../models/clienteModel');

// Cria um novo cliente
exports.criarCliente = async (req, res) => {
    const { nome, email, telefone, cpf, endereco } = req.body;

    // Valida os campos obrigatórios
    if (!nome || !email || !telefone || !cpf || !endereco) {
        return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    try {
        await clienteModel.criar(nome, email, telefone, cpf, endereco);
        res.status(201).json({ message: "Cliente cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        res.status(500).json({ error: "Erro ao cadastrar cliente" });
    }
};

// Lista todos os clientes
exports.listarClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.listar();
        res.json(clientes);
    } catch (error) {
        console.error("Erro ao listar clientes:", error);
        res.status(500).json({ error: "Erro ao listar clientes" });
    }
};
