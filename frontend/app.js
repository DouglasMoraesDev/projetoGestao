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

// Função para criar produto
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

// Função para listar produtos
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

// Função para criar cliente
// Função para criar cliente
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


// Função para listar clientes
function listarClientes() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/cliente/listar', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('listaClientes');
        lista.innerHTML = '';
        data.forEach(cli => {
            const p = document.createElement('p');
            p.textContent = `${cli.id} - ${cli.nome} - ${cli.email} - ${cli.telefone}`;
            lista.appendChild(p);
        });
    })
    .catch(error => console.error("Erro ao listar clientes:", error));
}

// Função para realizar venda
function realizarVenda() {
    const clienteId = parseInt(document.getElementById('clienteId').value);
    const produtoId = parseInt(document.getElementById('produtoId').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const observacao = document.getElementById('observacao').value.trim();
    const parcelado = document.getElementById('parcelado').checked;
    const formaPagamento = document.getElementById('formaPagamento').value.trim();
    const valorEntrada = parseFloat(document.getElementById('valorEntrada').value);
    const parcelas = parseInt(document.getElementById('parcelas').value);
    const valorParcela = parseFloat(document.getElementById('valorParcela').value);
    const token = localStorage.getItem('token');

    // Verificação dos campos obrigatórios
    if (isNaN(clienteId) || isNaN(produtoId) || isNaN(quantidade) || !formaPagamento) {
        alert("Preencha todos os campos obrigatórios corretamente!");
        return;
    }

    // Criando objeto com os dados da venda
    const vendaData = {
        clienteId,
        produtoId,
        quantidade,
        observacao: observacao || null,
        parcelado,
        formaPagamento,
        valorEntrada: isNaN(valorEntrada) ? 0 : valorEntrada,
        parcelas: isNaN(parcelas) ? 0 : parcelas,
        valorParcela: isNaN(valorParcela) ? 0 : valorParcela
    };

    fetch('http://localhost:3000/venda/realizar', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vendaData)
    })
    .then(async (res) => {
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || "Erro ao realizar venda!");
        }
        
        alert(data.message || "Venda realizada com sucesso!");
        listarVendas(); // Atualiza a lista após a venda
    })
    .catch(error => {
        console.error("Erro ao realizar venda:", error);
        alert(error.message);
    });
}

// Função para listar vendas
function listarVendas() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/venda/listar', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('listaVendas');
        lista.innerHTML = '';
        data.forEach(venda => {
            const p = document.createElement('p');
            p.textContent = `Venda ID: ${venda.id} - Cliente: ${venda.cliente_id} - Produto: ${venda.produto_id} - Quantidade: ${venda.quantidade} - Total: R$ ${venda.total}`;
            lista.appendChild(p);
        });
    })
    .catch(error => console.error("Erro ao listar vendas:", error));
}

// Se estivermos na páginas de listagem, chamar a função correspondente ao carregar
if (window.location.pathname.includes('produtos.html')) {
    listarProdutos();
}

if (window.location.pathname.includes('clientes.html')) {
    listarClientes();
}

if (window.location.pathname.includes('vendas.html')) {
    listarVendas();
}
