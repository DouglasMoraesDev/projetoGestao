// ================== AUTENTICAÇÃO ==================

// Função para login
function fazerLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = "home.html";
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error("Erro no login:", error));
}

// Função para registro
function registrar() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
        if (data.message === "Usuário cadastrado com sucesso!") {
            window.location.href = "login.html";
        }
    })
    .catch(error => console.error("Erro no registro:", error));
}

// Função para logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = "login.html";
}

// ================== PRODUTOS ==================

// Criar produto
function criarProduto() {
    const nome = document.getElementById('nomeProduto').value;
    const preco = parseFloat(document.getElementById('precoProduto').value);
    const estoque = parseInt(document.getElementById('estoqueProduto').value);
    const token = localStorage.getItem('token');

    if (!nome || isNaN(preco) || isNaN(estoque)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    fetch('http://localhost:3000/produto/criar', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nome, preco, estoque })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
        listarProdutos();
    })
    .catch(error => console.error("Erro ao criar produto:", error));
}

// Listar produtos
function listarProdutos() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/produto/listar', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('listaProdutos');
        lista.innerHTML = '';
        data.forEach(prod => {
            const p = document.createElement('p');
            p.textContent = `${prod.id} - ${prod.nome} - R$ ${prod.preco} - Estoque: ${prod.estoque}`;
            lista.appendChild(p);
        });
    })
    .catch(error => console.error("Erro ao listar produtos:", error));
}

// Carregar produtos no select de vendas
function carregarProdutos() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/produto/listar', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(produtos => {
        const select = document.getElementById('produtoId');
        select.innerHTML = '<option value="">Selecione um Produto</option>';
        produtos.forEach(prod => {
            const option = document.createElement('option');
            option.value = prod.id;
            option.textContent = `${prod.nome} - R$ ${prod.preco}`;
            select.appendChild(option);
        });
    })
    .catch(error => console.error("Erro ao carregar produtos:", error));
}

// ================== CLIENTES ==================

// Criar cliente
function criarCliente() {
    const nome = document.getElementById('nomeCliente').value;
    const email = document.getElementById('emailCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    const cpf = document.getElementById('cpfCliente').value;
    const endereco = document.getElementById('enderecoCliente').value;
    const token = localStorage.getItem('token');

    if (!nome || !email || !telefone || !cpf || !endereco) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch('http://localhost:3000/cliente/criar', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ nome, email, telefone, cpf, endereco })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => { throw err; });
        }
        return res.json();
    })
    .then(data => {
        alert(data.message || "Cliente criado com sucesso!");
        listarClientes();
    })
    .catch(error => {
        console.error("Erro ao criar cliente:", error);
        alert(error.error || "Erro ao criar cliente.");
    });
}

// Listar clientes
function listarClientes() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/cliente/listar', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('listaClientes');
        if (lista) {
            lista.innerHTML = '';
            data.forEach(cli => {
                const p = document.createElement('p');
                p.textContent = `${cli.id} - ${cli.nome} - ${cli.email}`;
                lista.appendChild(p);
            });
        }
    })
    .catch(error => console.error("Erro ao listar clientes:", error));
}

// Carregar clientes no select de vendas
function carregarClientes() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/cliente/listar', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(clientes => {
        const select = document.getElementById('clienteId');
        select.innerHTML = '<option value="">Selecione um Cliente</option>';
        clientes.forEach(cli => {
            const option = document.createElement('option');
            option.value = cli.id;
            option.textContent = `${cli.nome} - ${cli.email}`;
            select.appendChild(option);
        });
    })
    .catch(error => console.error("Erro ao carregar clientes:", error));
}

// ================== VENDAS ==================

// Criar venda
function realizarVenda() {
    const clienteId = parseInt(document.getElementById('clienteId').value);
    const produtoId = parseInt(document.getElementById('produtoId').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const observacao = document.getElementById('observacao').value.trim();
    const parcelado = document.getElementById('parcelado').checked;
    const formaPagamento = document.getElementById('formaPagamento').value.trim();
    const valorEntrada = parseFloat(document.getElementById('valorEntrada').value) || 0;
    const parcelas = parseInt(document.getElementById('parcelas').value) || 0;
    const valorParcela = parseFloat(document.getElementById('valorParcela').value) || 0;
    const token = localStorage.getItem('token');

    if (!clienteId || !produtoId || !quantidade || !formaPagamento) {
        alert("Preencha todos os campos obrigatórios corretamente!");
        return;
    }

    const vendaData = {
        clienteId,
        produtoId,
        quantidade,
        observacao: observacao || null,
        parcelado,
        formaPagamento,
        valorEntrada,
        parcelas,
        valorParcela
    };

    fetch('http://localhost:3000/venda/realizar', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vendaData)
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao realizar venda!");
        alert(data.message || "Venda realizada com sucesso!");
        listarVendas();
    })
    .catch(error => {
        console.error("Erro ao realizar venda:", error);
        alert(error.message);
    });
}

// Listar vendas
function listarVendas() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/venda/listar', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('listaVendas');
        if (lista) {
            lista.innerHTML = '';
            data.forEach(venda => {
                const p = document.createElement('p');
                p.textContent = `Venda ID: ${venda.id} - Cliente: ${venda.cliente_id} - Produto: ${venda.produto_id} - Quantidade: ${venda.quantidade} - Total: R$ ${venda.total}`;
                lista.appendChild(p);
            });
        }
    })
    .catch(error => console.error("Erro ao listar vendas:", error));
}

// ================== CONTROLE DE PÁGINAS ==================

// Executa funções ao carregar páginas específicas
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('produtos.html')) listarProdutos();
    if (path.includes('clientes.html')) listarClientes();
    if (path.includes('vendas.html')) {
        carregarClientes();
        carregarProdutos();
        listarVendas();
    }
});
