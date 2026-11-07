let produtosDB = [];

// Busca os dados reais do MySQL via Express
async function carregarProdutos() {
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        produtosDB = await response.json();
        renderMenu();
    } catch (error) {
        console.error('Erro ao buscar o cardápio:', error);
    }
}

let carrinho = [];

// Inicialização atualizada
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    atualizarCarrinhoUI();
});

// Formatar Moeda
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Renderizar Menu na tela
function renderMenu() {
  const menuGrid = document.getElementById("menu-grid");
  menuGrid.innerHTML = ""; // Limpa o grid

  produtosDB.forEach((produto) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col";

    card.innerHTML = `
                    <div class="h-48 overflow-hidden relative">
                        <img src="${produto.imagem_url}" alt="${produto.nome}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="text-xl font-bold text-sushi-dark mb-2">${produto.nome}</h3>
                        <p class="text-gray-500 text-sm mb-4 flex-grow">${produto.descricao}</p>
                        <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                            <span class="text-xl font-bold text-sushi-red">${formatarMoeda(produto.preco)}</span>
                            <button onclick="adicionarAoCarrinho(${produto.id})" class="bg-sushi-dark hover:bg-gray-800 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow" aria-label="Adicionar ${produto.nome}">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
    menuGrid.appendChild(card);
  });
}

// Lógica do Carrinho
function adicionarAoCarrinho(idProduto) {
  const produto = produtosDB.find((p) => p.id === idProduto);
  if (!produto) return;

  const itemExistente = carrinho.find((item) => item.id === idProduto);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  atualizarCarrinhoUI();

  // Feedback visual rápido
  abrirCarrinho();
}

function alterarQuantidade(idProduto, mudanca) {
  const item = carrinho.find((item) => item.id === idProduto);
  if (!item) return;

  item.quantidade += mudanca;

  if (item.quantidade <= 0) {
    removerDoCarrinho(idProduto);
  } else {
    atualizarCarrinhoUI();
  }
}

function removerDoCarrinho(idProduto) {
  carrinho = carrinho.filter((item) => item.id !== idProduto);
  atualizarCarrinhoUI();
}

// Atualização da Interface do Carrinho
function atualizarCarrinhoUI() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  // Atualiza Badge do carrinho no Header
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  cartCount.textContent = totalItens;

  // Limpa o contentor e repõe a mensagem de vazio (oculta por padrão)
  cartItemsContainer.innerHTML = `
    <div class="text-center text-gray-500 mt-10" id="empty-cart-msg" style="display: none;">
        <i class="fa-solid fa-basket-shopping text-4xl mb-3 text-gray-300"></i>
        <p>Seu carrinho está vazio.</p>
    </div>
  `;

  const emptyMsg = document.getElementById("empty-cart-msg");

  if (carrinho.length === 0) {
    emptyMsg.style.display = "block";
    cartTotal.textContent = formatarMoeda(0);
    return;
  }

  let valorTotal = 0;

  carrinho.forEach((item) => {
    valorTotal += item.preco * item.quantidade;

    const itemDiv = document.createElement("div");
    itemDiv.className =
      "flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm";

    itemDiv.innerHTML = `
                    <img src="${item.imagem_url}" alt="${item.nome}" class="w-16 h-16 object-cover rounded-md">
                    <div class="flex-grow flex flex-col justify-between">
                        <div class="flex justify-between items-start">
                            <h4 class="font-semibold text-sm text-sushi-dark leading-tight">${item.nome}</h4>
                            <button onclick="removerDoCarrinho(${item.id})" class="text-gray-400 hover:text-sushi-red text-sm">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                            <span class="font-bold text-sushi-red text-sm">${formatarMoeda(item.preco * item.quantidade)}</span>
                            
                            <!-- Controles de Quantidade -->
                            <div class="flex items-center bg-gray-100 rounded-lg p-1">
                                <button onclick="alterarQuantidade(${item.id}, -1)" class="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-sushi-red">-</button>
                                <span class="w-8 text-center text-sm font-medium">${item.quantidade}</span>
                                <button onclick="alterarQuantidade(${item.id}, 1)" class="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-600">+</button>
                            </div>
                        </div>
                    </div>
                `;
    cartItemsContainer.appendChild(itemDiv);
  });

  // Atualiza Total
  cartTotal.textContent = formatarMoeda(valorTotal);
}

// Controle de Abertura/Fechamento da Sidebar (Carrinho)
const sidebar = document.getElementById("cart-sidebar");
const overlay = document.getElementById("cart-overlay");

function toggleCart() {
  if (sidebar.classList.contains("open")) {
    fecharCarrinho();
  } else {
    abrirCarrinho();
  }
}

function abrirCarrinho() {
  sidebar.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden"; // Impede scroll do body
}

function fecharCarrinho() {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
  document.body.style.overflow = ""; // Restaura scroll do body
}

async function checkout() {
    if (carrinho.length === 0) return;

    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) {
        alert('Por favor, faça login para finalizar seu pedido.');
        window.location.href = 'pages/login.html';
        return;
    }

    const usuario = JSON.parse(usuarioStr);
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const btn = document.querySelector('button[onclick="checkout()"]');
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

    try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuario.id, carrinho, total })
        });

        if (response.ok) {
            carrinho = [];
            atualizarCarrinhoUI();
            fecharCarrinho();
            window.location.href = 'pages/pedidos.html'; // Redireciona para a tela de pedidos
        } else {
            alert('Erro ao processar pedido.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
    
    btn.innerHTML = 'Finalizar Pedido <i class="fa-solid fa-arrow-right"></i>';
}

