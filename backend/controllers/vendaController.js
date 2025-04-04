const db = require('../db');
const produtoModel = require('../models/produtoModel');
const vendaModel = require('../models/vendaModel');
const clienteModel = require('../models/clienteModel');

exports.realizarVenda = async (req, res) => {
  // Recebe os dados da venda. Agora o usuário informa os IDs do cliente e do produto.
  const {
    clienteId,
    produtoId,
    quantidade,
    observacao = "",
    parcelado = false,
    formaPagamento = "",
    valorEntrada = 0,
    parcelas = 0
  } = req.body;
  
  const usuario_id = req.user.id; // Obtido do middleware de autenticação

  // Validação dos campos obrigatórios: cliente, produto e quantidade
  if (!clienteId || !produtoId || !quantidade) {
    return res.status(400).json({ error: "Preencha os campos obrigatórios: cliente, produto e quantidade." });
  }
  
  try {
    // Busca o cliente pelo ID
    const cliente = await clienteModel.buscarPorId(clienteId);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    
    // Busca o produto pelo ID
    const produto = await produtoModel.buscarPorId(produtoId);
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
    let valorParcela = 0;
    if (parcelado) {
      // Se for parcelado, valorEntrada e parcelas devem ser informados
      if (!valorEntrada || !parcelas) {
        return res.status(400).json({ error: "Para vendas parceladas, informe o valor de entrada e o número de parcelas." });
      }
      // Calcula o valor restante e o valor de cada parcela
      const restante = total - valorEntrada;
      valorParcela = restante / parcelas;
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
      formaPagamento,
      valorEntrada,
      parcelas,
      valorParcela
    );
    
    // Registra a transação de entrada (inclui informações do cliente, produto e pagamento)
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
