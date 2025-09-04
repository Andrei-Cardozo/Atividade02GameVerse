const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});
const userArea = document.getElementById('userArea');
const isLoggedIn = false; // Simulação. Pode trocar pra true pra testar.


const cartIcon = document.getElementById('cartIcon');
const cartIconMobile = document.getElementById('cartIconMobile');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = cartModal.querySelector('.cart-items');
const cartTotal = cartModal.querySelector('.cart-total');
const closeModal = cartModal.querySelector('.close-modal');
const overlay = document.getElementById('overlay');

let cart = [];

// Botões "Comprar" (todos, inclusive promo)
const buyButtons = document.querySelectorAll('.btn-comprar');

buyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.game-card');

    // Pega o nome: tenta h3, h2 ou outro
    const nome = card.querySelector('h3, h2')?.innerText || 'Jogo';
    
    // Pega o valor: tenta h5, p ou outro
    const valorText = card.querySelector('h5, strong')?.innerText.replace('R$ ','').replace(',','.') || '0';
    const valor = parseFloat(valorText);

    // Checa se já existe no carrinho
    const existing = cart.find(i => i.nome === nome);
    if(existing) existing.qtd += 1;
    else cart.push({nome, valor, qtd: 1});

    updateCart();
  });
});

// Atualiza contador e modal
function updateCart() {
  const count = cart.reduce((acc, i) => acc + i.qtd, 0);
  cartIcon.setAttribute('data-count', count);
  if(cartIconMobile) cartIconMobile.setAttribute('data-count', count);

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <span>${item.nome} x${item.qtd}</span>
      <span>R$ ${(item.valor*item.qtd).toFixed(2)}</span>
      <button class="remove-item" data-index="${index}">X</button>
    `;
    cartItemsContainer.appendChild(div);
    total += item.valor * item.qtd;
  });

  cartTotal.innerText = `Total: R$ ${total.toFixed(2)}`;

  // Remove item
  cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      if(!isNaN(idx)) {
        cart.splice(idx, 1);
        updateCart();
      }
    });
  });
}

// Abre modal ao clicar no ícone desktop
cartIcon.addEventListener('click', (e) => {
  e.preventDefault();
  cartModal.style.display = 'block';
  overlay.style.display = 'block';
});

// Abre modal ao clicar no ícone mobile
if(cartIconMobile) {
  cartIconMobile.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'block';
    overlay.style.display = 'block';
  });
}

// Fecha modal
closeModal.addEventListener('click', () => {
  cartModal.style.display = 'none';
  overlay.style.display = 'none';
});

// Fecha modal clicando no overlay
overlay.addEventListener('click', () => {
  cartModal.style.display = 'none';
  overlay.style.display = 'none';
});


// Faz o mesmo que o cartIcon desktop
cartIconMobile.addEventListener('click', (e) => {
  e.preventDefault();
  cartModal.style.display = 'block';
  overlay.style.display = 'block';
});

const tabs = document.querySelectorAll('.tab');
const gameCards = document.querySelectorAll('#gameGrid .game-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Ativa o botão atual
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const selectedCategory = tab.dataset.category;

    // Filtra os jogos
    gameCards.forEach(card => {
      const cardCategory = card.dataset.category;
      if (selectedCategory === 'all' || selectedCategory === cardCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

const searchInput = document.getElementById('gameSearch');
const searchResults = document.getElementById('searchResults'); 

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = ''; // limpa resultados anteriores

  if (query === '') return; // se vazio, não mostra nada

  // seleciona apenas os cards que NÃO estão fixos (promo, semana, recentes)
  const allCards = document.querySelectorAll('.grid-games .game-card');

  allCards.forEach(card => {
    const title = card.querySelector('h3, h2')?.innerText.toLowerCase() || '';
    if(title.includes(query)) {
      const clone = card.cloneNode(true); // clona o card
      searchResults.appendChild(clone);
    }
  });
});



const recentCarousel = document.getElementById('recentCarousel');
const recentImages = recentCarousel.querySelectorAll('img');
const recentIndicators = document.getElementById('recentIndicators').children;

const overlayTitle = document.getElementById('overlayTitle');

// Array com títulos (ou descrições) dos jogos
const overlayTexts = [
  "Euro Truck Simulator 2",
  "Grand Theft Auto V",
  "The Walking Dead Definitive Edition"
];

let currentIndex = 0;

function showNextRecentImage() {
  // Avança a imagem
  currentIndex = (currentIndex + 1) % recentImages.length;
  recentCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Atualiza as bolinhas
  for (let i = 0; i < recentIndicators.length; i++) {
    recentIndicators[i].classList.remove('active');
  }
  recentIndicators[currentIndex].classList.add('active');

  // Atualiza overlay
  overlayTitle.textContent = overlayTexts[currentIndex];
}

setInterval(showNextRecentImage, 3000);
