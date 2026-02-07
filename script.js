// ============================================
// MODERN SHOP - ADVANCED JAVASCRIPT
// ============================================

// Products Database with More Details
const products = [
    {
        id: 1,
        name: 'Premium Headphones',
        emoji: '🎧',
        price: 99.99,
        description: 'High-quality sound with noise cancellation',
        rating: 4.8,
        reviews: 245,
        stock: 15
    },
    {
        id: 2,
        name: 'Smartwatch Pro',
        emoji: '⌚',
        price: 199.99,
        description: 'Stay connected with style and fitness tracking',
        rating: 4.6,
        reviews: 189,
        stock: 12
    },
    {
        id: 3,
        name: 'Wireless Speaker',
        emoji: '🔊',
        price: 79.99,
        description: 'Portable and powerful sound quality',
        rating: 4.7,
        reviews: 312,
        stock: 20
    },
    {
        id: 4,
        name: 'Camera Pro',
        emoji: '📷',
        price: 299.99,
        description: 'Professional-grade photography made easy',
        rating: 4.9,
        reviews: 156,
        stock: 8
    },
    {
        id: 5,
        name: 'Tablet Ultra',
        emoji: '📱',
        price: 149.99,
        description: 'Portable power for work and entertainment',
        rating: 4.5,
        reviews: 423,
        stock: 18
    },
    {
        id: 6,
        name: 'Laptop Slim',
        emoji: '💻',
        price: 899.99,
        description: 'Lightweight yet powerful performance',
        rating: 4.9,
        reviews: 567,
        stock: 5
    }
];

let cart = [];
let wishlist = [];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ModernShop Initialized');
    renderProducts();
    setupHamburgerMenu();
    setupContactForm();
    loadCartFromStorage();
    loadWishlist();
    setupSearchFilter();
    setupPriceFilter();
});

// ============================================
// PRODUCT RENDERING WITH RATINGS & STOCK
// ============================================

function renderProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">No products found</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const stockStatus = product.stock <= 5 ? '<span style="color: #ef4444; font-weight: bold;">Low Stock!</span>' : '';

        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 class="product-name">${product.name}</h3>
                    <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                        ${isInWishlist ? '❤️' : '🤍'}
                    </button>
                </div>
                <p class="product-description">${product.description}</p>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="color: #f59e0b;">★ ${product.rating}</span>
                    <span style="color: #64748b; font-size: 0.85rem;">(${product.reviews} reviews)</span>
                </div>
                ${stockStatus}
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// ============================================
// SHOPPING CART FUNCTIONS
// ============================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product || product.stock === 0) {
        showNotification('❌ This product is out of stock!', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
            showNotification(`✅ ${product.name} quantity updated!`, 'success');
        } else {
            showNotification('⚠️ Maximum stock reached!', 'warning');
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        showNotification(`✅ ${product.name} added to cart!`, 'success');
    }

    updateCartDisplay();
    saveCartToStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCartToStorage();
    showNotification('🗑️ Item removed from cart', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCartDisplay();
        saveCartToStorage();
    }
}

function updateCartDisplay() {
    const cartIcon = document.querySelector('.cart-icon');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartIcon.textContent = `🛒 Cart (${totalItems})`;
    cartIcon.setAttribute('data-total', totalPrice.toFixed(2));
}

function getCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice: totalPrice.toFixed(2) };
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================

function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = wishlist.find(item => item.id === productId);

    if (existingItem) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification(`💔 Removed from wishlist`, 'info');
    } else {
        wishlist.push(product);
        showNotification(`❤️ Added to wishlist!`, 'success');
    }

    saveWishlist();
    renderProducts();
}

function loadWishlist() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// ============================================
// NOTIFICATIONS (Enhanced)
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    const colors = {
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        info: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
    };

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SEARCH & FILTER FUNCTIONALITY
// ============================================

function setupSearchFilter() {
    const productsSection = document.querySelector('.products');
    if (productsSection && !document.getElementById('searchBox')) {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'margin-bottom: 2rem; text-align: center;';
        searchContainer.innerHTML = `
            <input 
                type="text" 
                id="searchBox" 
                placeholder="🔍 Search products..." 
                style="
                    width: 100%;
                    max-width: 500px;
                    padding: 12px 15px;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                "
            >
        `;
        
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.parentElement.insertBefore(searchContainer, productsGrid);
        }

        const searchBox = document.getElementById('searchBox');
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            renderProducts(filtered);
        });

        searchBox.addEventListener('focus', function() {
            this.style.borderColor = '#6366f1';
            this.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
        });

        searchBox.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
        });
    }
}

function setupPriceFilter() {
    const productsSection = document.querySelector('.products');
    if (productsSection && !document.getElementById('priceFilter')) {
        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = 'margin-bottom: 2rem; text-align: center;';
        filterContainer.innerHTML = `
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button class="filter-btn active" onclick="filterByPrice(0, 100)">Under $100</button>
                <button class="filter-btn" onclick="filterByPrice(100, 300)">$100 - $300</button>
                <button class="filter-btn" onclick="filterByPrice(300, 1000)">$300+</button>
                <button class="filter-btn" onclick="renderProducts(products)">All Products</button>
            </div>
        `;
        
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.parentElement.insertBefore(filterContainer, productsGrid);
        }
    }
}

function filterByPrice(min, max) {
    const filtered = products.filter(product => product.price >= min && product.price <= max);
    renderProducts(filtered);
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// ============================================
// MOBILE MENU
// ============================================

function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-wrapper')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ============================================
// CONTACT FORM
// ============================================

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name') || 'Guest';

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '✅ Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification(`📧 Thanks ${name}! We received your message.`, 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

function saveCartToStorage() {
    localStorage.setItem('modernshop_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('modernshop_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', function(event) {
    if (event.key === '?') {
        showNotification('⌨️ Shortcuts: ? = Help | / = Search | C = Cart', 'info');
    }
    if (event.key === '/') {
        event.preventDefault();
        const searchBox = document.getElementById('searchBox');
        if (searchBox) searchBox.focus();
    }
    if (event.key === 'Escape') {
        const searchBox = document.getElementById('searchBox');
        if (searchBox && document.activeElement === searchBox) {
            searchBox.value = '';
            renderProducts();
        }
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getProductById(id) {
    return products.find(p => p.id === id);
}

function sortProductsByPrice(ascending = true) {
    const sorted = [...products].sort((a, b) => 
        ascending ? a.price - b.price : b.price - a.price
    );
    renderProducts(sorted);
}

function sortProductsByRating() {
    const sorted = [...products].sort((a, b) => b.rating - a.rating);
    renderProducts(sorted);
}

// ============================================
// ANIMATIONS
// ============================================

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .filter-btn {
        padding: 10px 20px;
        border: 2px solid #e2e8f0;
        background: white;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        color: #64748b;
    }

    .filter-btn:hover {
        border-color: #6366f1;
        color: #6366f1;
    }

    .filter-btn.active {
        background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
        color: white;
        border-color: transparent;
    }

    .wishlist-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .wishlist-btn:hover {
        transform: scale(1.2);
    }
`;
document.head.appendChild(animationStyles);

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================

console.log(
    '%c🛍️ Welcome to ModernShop! 🛍️',
    'font-size: 20px; font-weight: bold; color: #6366f1;'
);
console.log(
    '%cTip: Press "?" for keyboard shortcuts',
    'font-size: 12px; color: #64748b;'
);