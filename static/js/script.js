// Стан кошика та активної категорії
let cart = JSON.parse(localStorage.getItem('sportpit_cart')) || [];
let activeCategory = 'all';
let currentDetailProduct = null;


// DOM-елементи каталогу
const productGrid = document.getElementById('productGrid');
const productsCount = document.getElementById('productsCount');
const currentCategoryTitle = document.getElementById('currentCategoryTitle');
const emptyCatalogMsg = document.getElementById('emptyCatalogMsg');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryButtons = document.querySelectorAll('.cat-link');

// Перемикання Каталог / Адмін-панель
const catalogView = document.getElementById('catalogView');
const adminView = document.getElementById('adminView');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const backToShopBtn = document.getElementById('backToShopBtn');
const logoHome = document.getElementById('logoHome');
const adminProductsList = document.getElementById('adminProductsList');
const addProductForm = document.getElementById('addProductForm');

// Елементи кошика та модальних вікон
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartCount = document.getElementById('cartCount');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');

const thankYouModal = document.getElementById('thankYouModal');
const closeThankYouBtn = document.getElementById('closeThankYouBtn');

const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const tabLoginBtn = document.getElementById('tabLoginBtn');
const tabRegBtn = document.getElementById('tabRegBtn');
const loginForm = document.getElementById('loginForm');
const regForm = document.getElementById('regForm');

// =========================================================================
// 1. ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ КАРТОК ТОВАРІВ (НА БОЦІ JS)
// =========================================================================
function filterAndSortProducts() {
    const cards = Array.from(productGrid.querySelectorAll('.product-card'));
    const query = searchInput.value.toLowerCase().trim();
    const sortValue = sortSelect.value;
    let visible = [];

    cards.forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const desc = (card.dataset.description || '').toLowerCase();
        const cat = card.dataset.category || '';

        const matchCategory = activeCategory === 'all' || cat === activeCategory;
        const matchSearch = name.includes(query) || desc.includes(query);

        if (matchCategory && matchSearch) {
            card.style.display = 'flex';
            visible.push(card);
        } else {
            card.style.display = 'none';
        }
    });

    if (sortValue !== 'default') {
        visible.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price || 0);
            const priceB = parseFloat(b.dataset.price || 0);
            const nameA = a.dataset.name || '';
            const nameB = b.dataset.name || '';

            if (sortValue === 'price-asc') return priceA - priceB;
            if (sortValue === 'price-desc') return priceB - priceA;
            if (sortValue === 'name-asc') return nameA.localeCompare(nameB, 'uk');
            return 0;
        });
        visible.forEach(card => productGrid.appendChild(card));
    }
    productsCount.textContent = visible.length;
    emptyCatalogMsg.style.display = visible.length === 0 ? 'block' : 'none';
}

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeCategory = btn.dataset.category;
        currentCategoryTitle.textContent = activeCategory === 'all' ? 'Всі товари' : activeCategory;

        adminView.style.display = 'none';
        catalogView.style.display = 'block';

        filterAndSortProducts();
    });
});

searchInput.addEventListener('input', filterAndSortProducts);
sortSelect.addEventListener('change', filterAndSortProducts);

// =========================================================================
// 2. КОШИК ТА ОФОРМЛЕННЯ ЗАМОВЛЕННЯ БЕЗ ОПЛАТИ
// =========================================================================
function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
}

function buyProduct(btn) {
    const card = btn.closest('.product-card');
    const itemData = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseFloat(card.dataset.price || 0)
    };

    const existing = cart.find(i => String(i.id) === String(itemData.id));
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...itemData, qty: 1 });
    }

    renderCart();
    openCart();
}

function updateQty(id, delta) {
    const item = cart.find(i => String(i.id) === String(id));
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => String(i.id) !== String(id));
    }
    renderCart();
}

function renderCart() {
    localStorage.setItem('sportpit_cart', JSON.stringify(cart));
    cartItemsContainer.innerHTML = '';

    let count = 0;
    let total = 0;

    cart.forEach(item => {
        count += item.qty;
        total += item.price * item.qty;

        const div = document.createElement('div');
        div.className = 'cart-row';
        div.innerHTML = `
            <div>
                <div class="cart-row-title">${item.name}</div>
                <div class="cart-row-sub">${item.qty} шт. × ${item.price} ₴</div>
            </div>
            <div class="qty-box">
                <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--text-secondary);">Кошик порожній.</p>';
    }

    cartCount.textContent = count;
    cartTotalPrice.textContent = `${total} ₴`;
}

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    cart = [];
    renderCart();
    closeCart();
    thankYouModal.classList.add('open');
});

closeThankYouBtn.addEventListener('click', () => {
    thankYouModal.classList.remove('open');
});

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// =========================================================================
// 3. ВХІД ТА ВІДКРИТТЯ АДМІН-ПАНЕЛІ
// =========================================================================
if (openAuthBtn) {
    openAuthBtn.addEventListener('click', () => authModal.classList.add('open'));
    closeAuthBtn.addEventListener('click', () => authModal.classList.remove('open'));
}

tabLoginBtn.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabRegBtn.classList.remove('active');
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
});

tabRegBtn.addEventListener('click', () => {
    tabRegBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    regForm.style.display = 'block';
    loginForm.style.display = 'none';
});

if(adminPanelBtn){
    adminPanelBtn.addEventListener('click', () => {
        catalogView.style.display = 'none';
        adminView.style.display = 'block';
        // renderAdminProductsTable();
    });
}

backToShopBtn.addEventListener('click', () => {
    adminView.style.display = 'none';
    catalogView.style.display = 'block';
});

logoHome.addEventListener('click', (e) => {
    e.preventDefault();
    adminView.style.display = 'none';
    catalogView.style.display = 'block';
});

// =========================================================================
// 4. ТАБЛИЦЯ ТОВАРІВ В АДМІН-ПАНЕЛІ
// =========================================================================
function renderAdminProductsTable() {
    const cards = Array.from(productGrid.querySelectorAll('.product-card'));
    adminProductsList.innerHTML = '';

    cards.forEach(card => {
        const id = card.dataset.id;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${id}</td>
            <td>${card.dataset.name}</td>
            <td>${card.dataset.category}</td>
            <td>${card.dataset.price} ₴</td>
            <td><button class="del-link" onclick="removeProductCard('${id}')">Видалити</button></td>
        `;
        adminProductsList.appendChild(tr);
    });
}

function removeProductCard(id) {
    const card = productGrid.querySelector(`.product-card[data-id="${id}"]`);
    if (card) card.remove();
    // renderAdminProductsTable();
    filterAndSortProducts();
}

filterAndSortProducts();
renderCart();

// =========================================================================
// 5. ДЕТАЛЬНИЙ ПЕРЕГЛЯД КАРТКИ ТОВАРУ (READ)
// =========================================================================
const productDetailView = document.getElementById('productDetailView');
const backFromDetailBtn = document.getElementById('backFromDetailBtn');
const detailPhoto = document.getElementById('detailPhoto');
const detailCategory = document.getElementById('detailCategory');
const detailId = document.getElementById('detailId');
const detailName = document.getElementById('detailName');
const detailPrice = document.getElementById('detailPrice');
const detailDescription = document.getElementById('detailDescription');
const detailBuyBtn = document.getElementById('detailBuyBtn');


function openProductDetail(cardElement) {
    currentDetailProduct = {
        id: cardElement.dataset.id,
        name: cardElement.dataset.name,
        description: cardElement.dataset.description,
        price: parseFloat(cardElement.dataset.price || 0),
        category: cardElement.dataset.category,
        photo: cardElement.dataset.photo
    };

    detailId.textContent = currentDetailProduct.id;
    detailName.textContent = currentDetailProduct.name;
    detailDescription.textContent = currentDetailProduct.description;
    detailPrice.textContent = `${currentDetailProduct.price} ₴`;
    detailCategory.textContent = currentDetailProduct.category;
    detailPhoto.src = currentDetailProduct.photo;
    detailPhoto.alt = currentDetailProduct.name;

    catalogView.style.display = 'none';
    adminView.style.display = 'none';
    productDetailView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (backFromDetailBtn) {
    backFromDetailBtn.addEventListener('click', () => {
        productDetailView.style.display = 'none';
        catalogView.style.display = 'block';
    });
}

if (detailBuyBtn) {
    detailBuyBtn.addEventListener('click', () => {
        if (!currentDetailProduct) return;

        const existing = cart.find(i => String(i.id) === String(currentDetailProduct.id));
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: currentDetailProduct.id,
                name: currentDetailProduct.name,
                price: currentDetailProduct.price,
                qty: 1
            });
        }

        renderCart();
        openCart();
    });
}

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (productDetailView) productDetailView.style.display = 'none';
    });
});

if (logoHome) {
    logoHome.addEventListener('click', () => {
        if (productDetailView) productDetailView.style.display = 'none';
    });
}

if (adminPanelBtn) {
    adminPanelBtn.addEventListener('click', () => {
        if (productDetailView) productDetailView.style.display = 'none';
    });
}

// =========================================================================
// 6. МОДАЛЬНЕ ВІКНО РЕДАГУВАННЯ ТОВАРУ В АДМІНЦІ (UPDATE)
// =========================================================================
const editProductModal = document.getElementById('editProductModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');

function openEditModal(btnElement) {
    document.getElementById('editId').value = btnElement.dataset.id;
    document.getElementById('editName').value = btnElement.dataset.name;
    document.getElementById('editPrice').value = btnElement.dataset.price;
    document.getElementById('editCategory').value = btnElement.dataset.category;
    document.getElementById('editPhoto').value = btnElement.dataset.photo;
    document.getElementById('editDesc').value = btnElement.dataset.description;

    editProductModal.classList.add('open');
}

if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', () => {
        editProductModal.classList.remove('open');
    });
}