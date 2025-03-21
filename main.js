// Global variables
let menuItems = [];
let cartItems = [];
let orders = [];
let inventory = [];
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadData();
    
    // Update cart count
    updateCartCount();
    
    // Initialize featured items on homepage
    if (document.getElementById('featured-items')) {
        initializeFeaturedItems();
    }
});

// Load data from localStorage
function loadData() {
    // Load menu items
    const storedMenu = localStorage.getItem('menuItems');
    if (storedMenu) {
        menuItems = JSON.parse(storedMenu);
    } else {
        // Initialize with default menu items if none exist
        initializeDefaultMenu();
    }
    
    // Load cart items
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
        cartItems = JSON.parse(storedCart);
    }
    
    // Load orders
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    }
    
    // Load inventory
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
        inventory = JSON.parse(storedInventory);
    } else {
        // Initialize with default inventory if none exists
        initializeDefaultInventory();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Initialize default menu items
function initializeDefaultMenu() {
    menuItems = [
        {
            id: 1,
            name: "1-pc Chickenjoy",
            category: "Chicken",
            price: 95.00,
            description: "Crispylicious, Juicylicious Chickenjoy that is crispy on the outside, tender and juicy on the inside.",
            image: "1pc chicken.jpg", // Updated path
            available: true
        },
        {
            id: 2,
            name: "2-pc Chickenjoy",
            category: "Chicken",
            price: 175.00,
            description: "Crispylicious, Juicylicious Chickenjoy that is crispy on the outside, tender and juicy on the inside.",
            image: "./images/2pc-chickenjoy.png", // Updated path
            available: true
        },
        {
            id: 3,
            name: "Yumburger",
            category: "Burger",
            price: 45.00,
            description: "100% pure beef patty with special dressing on a fresh bun.",
            image: "yumburger.jpg", // Updated path
            available: true
        },
        {
            id: 4,
            name: "Jolly Spaghetti",
            category: "Rice Meals",
            price: 85.00,
            description: "Sweet-style spaghetti with ground meat, hotdog chunks, and cheese.",
            image: "spag.jpg", // Updated path
            available: true
        },
        {
            id: 5,
            name: "Peach Mango Pie",
            category: "Desserts",
            price: 39.00,
            description: "Crispy pie crust filled with real peach and mango chunks.",
            image: "peach.jpg", // Updated path
            available: true
        },
        {
            id: 6,
            name: "Jolly Crispy Fries",
            category: "Sides",
            price: 45.00,
            description: "Crispy and flavorful fries.",
            image: "./images/jolly-crispy-fries.png", // Updated path
            available: true
        },
        {
            id: 7,
            name: "Coke Regular",
            category: "Beverages",
            price: 35.00,
            description: "Refreshing Coca-Cola soda.",
            image: "./images/coke-regular.png", // Updated path
            available: true
        },
        {
            id: 8,
            name: "Palabok Fiesta",
            category: "Rice Meals",
            price: 120.00,
            description: "Filipino noodle dish with shrimp sauce, ground meat, and toppings.",
            image: "./images/palabok-family-pan.png", // Updated path
            available: true
        }
    ];
    
    saveData();
}

// Initialize default inventory
function initializeDefaultInventory() {
    inventory = [
        { id: 1, name: "Chicken", quantity: 100, unit: "pcs", reorderLevel: 20 },
        { id: 2, name: "Beef Patty", quantity: 150, unit: "pcs", reorderLevel: 30 },
        { id: 3, name: "Spaghetti Sauce", quantity: 50, unit: "liters", reorderLevel: 10 },
        { id: 4, name: "Peach Mango Filling", quantity: 40, unit: "kg", reorderLevel: 8 },
        { id: 5, name: "Burger Buns", quantity: 200, unit: "pcs", reorderLevel: 40 },
        { id: 6, name: "Potatoes", quantity: 80, unit: "kg", reorderLevel: 15 },
        { id: 7, name: "Coke Syrup", quantity: 30, unit: "liters", reorderLevel: 5 }
    ];
    
    saveData();
}

// Update cart count in the navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Initialize featured items on homepage
function initializeFeaturedItems() {
    const featuredContainer = document.getElementById('featured-items');
    const featuredIds = [1, 3, 4, 5]; // IDs of items to feature
    
    const featuredItems = menuItems.filter(item => featuredIds.includes(item.id) && item.available);
    
    featuredContainer.innerHTML = '';
    
    featuredItems.forEach(item => {
        const itemElement = createProductCard(item);
        featuredContainer.appendChild(itemElement);
    });
}

// Create a product card element
function createProductCard(item) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="product-image">
        <div class="product-info">
            <div class="product-name">${item.name}</div>
            <div class="product-category">${item.category}</div>
            <div class="product-price">₱${item.price.toFixed(2)}</div>
            <div class="product-description">${item.description}</div>
            <button class="btn add-to-cart" data-id="${item.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener to the Add to Cart button
    card.querySelector('.add-to-cart').addEventListener('click', function() {
        addToCart(item.id);
    });
    
    return card;
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    
    if (!item || !item.available) {
        alert('Sorry, this item is not available.');
        return;
    }
    
    // Check if item is already in cart
    const existingItem = cartItems.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveData();
    
    // Update cart count
    updateCartCount();
    
    // Show confirmation
    alert(`${item.name} added to cart!`);
}

// Format currency
function formatCurrency(amount) {
    return '₱' + amount.toFixed(2);
}

// Generate a unique ID
function generateId(prefix = '') {
    return prefix + Date.now() + Math.floor(Math.random() * 1000);
}
