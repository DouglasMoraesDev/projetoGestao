// backend/controllers/vendaController.js
// Controladores para processamento de vendas, agora utilizando nomes de cliente e produto
// e realizando cálculos para vendas parceladas.

const db = require('../db');
const produtoModel = require('../models/produtoModel');
const vendaModel = require('../models/vendaModel');
const clienteModel = require('../models/clienteModel');

exports.realizarVenda = async (req, res) => {
  // Recebe os dados da venda. Agora o usuário informa o nome do cliente e do produto.
  const {
    clienteNome,
    produtoNome,
    quantidade,
    observacao = "",
    parcelado = false,
    forma_pagamento = "",
    valor_entrada = 0,
    parcelas = 0
  } = req.body;
  
  const usuario_id = req.user.id; // Obtido do middleware de autenticação

  // Validação dos campos obrigatórios
  if (!clienteNome || !produtoNome || !quantidade) {
    return res.status(400).json({ error: "Preencha os campos obrigatórios: cliente, produto e quantidade." });
  }
  
  try {
    // Busca o cliente pelo nome
    const cliente = await clienteModel.buscarPorNome(clienteNome);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    
    // Busca o produto pelo nome
    const produto = await produtoModel.buscarPorNome(produtoNome);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }
    
    // Verifica se há estoque suficiente
    if (produto.estoque < quantidade) {
      return res.status(400).json({ error: "Estoque insuficiente." });
    }
    
    // Calcula o valor total da venda
    const total = produto.preco * quantidade;
    
    // Variáveis para venda parcelada
    let valor_parcela = 0;
    if (parcelado) {
      // Se for parcelado, valor_entrada e parcelas devem ser informados
      if (!valor_entrada || !parcelas) {
        return res.status(400).json({ error: "Para vendas parceladas, informe o valor de entrada e o número de parcelas." });
      }
      // Calcula o valor restante e o valor de cada parcela
      const restante = total - valor_entrada;
      valor_parcela = restante / parcelas;
    }
    
    // Atualiza o estoque do produto
    await produtoModel.atualizarEstoque(produto.id, quantidade);
    
    // Registra a venda com os novos campos
    await vendaModel.criar(
      cliente.id,
      produto.id,
      quantidade,
      total,
      observacao,
      parcelado,
      forma_pagamento,
      valor_entrada,
      parcelas,
      valor_parcela
    );
    
    // Registra a transação de entrada (se a venda não for parcelada, ou considera o total)
    const descricao = `Venda de ${produto.nome} para ${cliente.nome}, Quantidade: ${quantidade}`;
    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO transacoes (descricao, valor, tipo, usuario_id) VALUES (?, ?, ?, ?)',
        [descricao, total, 'entrada', usuario_id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
    
    res.status(201).json({ message: "Venda realizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao realizar venda:", error);
    res.status(500).json({ error: "Erro ao realizar venda" });
  }
};

exports.listarVendas = async (req, res) => {
  try {
    const vendas = await vendaModel.listar();
    res.json(vendas);
  } catch (error) {
    console.error("Erro ao listar vendas:", error);
    res.status(500).json({ error: "Erro ao listar vendas" });
  }
};
