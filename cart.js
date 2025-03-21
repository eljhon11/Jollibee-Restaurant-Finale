// Initialize the cart page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('cart-items')) {
        initializeCartPage();
    }
});

// Initialize the cart page
function initializeCartPage() {
    // Display cart items
    displayCartItems();
    
    // Add event listener to checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
    
    // Add event listener to order type select
    const orderTypeSelect = document.getElementById('order-type');
    if (orderTypeSelect) {
        orderTypeSelect.addEventListener('change', function() {
            const deliveryAddressGroup = document.getElementById('delivery-address-group');
            if (this.value === 'delivery') {
                deliveryAddressGroup.style.display = 'block';
                document.getElementById('delivery-address').setAttribute('required', 'required');
            } else {
                deliveryAddressGroup.style.display = 'none';
                document.getElementById('delivery-address').removeAttribute('required');
            }
        });
    }
    
    // Add event listeners to modal buttons
    const closeModalBtn = document.querySelector('.modal .close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('order-confirmation').style.display = 'none';
        });
    }
    
    const printReceiptBtn = document.getElementById('print-receipt-btn');
    if (printReceiptBtn) {
        printReceiptBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    const newOrderBtn = document.getElementById('new-order-btn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', function() {
            document.getElementById('order-confirmation').style.display = 'none';
            window.location.href = 'menu.html';
        });
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty-message');
    const cartSummary = document.getElementById('cart-summary');
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmptyMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    // Cart has items
    cartItemsContainer.style.display = 'block';
    cartEmptyMessage.style.display = 'none';
    cartSummary.style.display = 'block';
    
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    // Add each item to the cart
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add event listeners to quantity buttons and remove buttons
    addCartItemEventListeners();
    
    // Update cart summary
    updateCartSummary();
}

// Add event listeners to cart item elements
function addCartItemEventListeners() {
    // Decrease quantity buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(itemId, -1);
        });
    });
    
    // Increase quantity buttons
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(itemId, 1);
        });
    });
    
    // Quantity input fields
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const newQuantity = parseInt(this.value);
            
            if (newQuantity < 1) {
                this.value = 1;
                return;
            }
            
            setCartItemQuantity(itemId, newQuantity);
        });
    });
    
    // Remove item buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeCartItem(itemId);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    
    if (!item) return;
    
    item.quantity += change;
    
    // Ensure quantity is at least 1
    if (item.quantity < 1) {
        item.quantity = 1;
    }
    
    // Save cart and update display
    saveData();
    displayCartItems();
    updateCartCount();
}

// Set cart item quantity to a specific value
function setCartItemQuantity(itemId, quantity) {
    const item = cartItems.find(item => item.id === itemId);
    
    if (!item) return;
    
    item.quantity = quantity;
    
    // Save cart and update display
    saveData();
    displayCartItems();
    updateCartCount();
}

// Remove item from cart
function removeCartItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    // Save cart and update display
    saveData();
    displayCartItems();
    updateCartCount();
}

// Update cart summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate tax (12%)
    const tax = subtotal * 0.12;
    
    // Calculate total
    const total = subtotal + tax;
    
    // Update elements
    subtotalElement.textContent = formatCurrency(subtotal);
    taxElement.textContent = formatCurrency(tax);
    totalElement.textContent = formatCurrency(total);
}

// Process the order
function processOrder() {
    // Get customer information
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const orderType = document.getElementById('order-type').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    let deliveryAddress = '';
    if (orderType === 'delivery') {
        deliveryAddress = document.getElementById('delivery-address').value;
    }
    
    // Calculate order totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;
    
    // Create order object
    const order = {
        id: generateId('ORD'),
        customer: {
            name: customerName,
            phone: customerPhone
        },
        items: [...cartItems],
        orderType: orderType,
        deliveryAddress: deliveryAddress,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Add order to orders array
    orders.push(order);
    
    // Clear cart
    cartItems = [];
    
    // Save data
    saveData();
    
    // Update cart count
    updateCartCount();
    
    // Show order confirmation
    showOrderConfirmation(order);
}

// Show order confirmation
function showOrderConfirmation(order) {
    const orderDetailsElement = document.getElementById('order-details');
    
    // Format date
    const orderDate = new Date(order.timestamp);
    const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
    
    // Create HTML for order details
    let orderItemsHtml = '';
    order.items.forEach(item => {
        orderItemsHtml += `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `;
    });
    
    orderDetailsElement.innerHTML = `
        <div class="order-info">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Order Type:</strong> ${order.orderType}</p>
            ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ''}
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>
        <div class="order-items">
            <h3>Order Items</h3>
            ${orderItemsHtml}
        </div>
        <div class="order-totals">
            <div class="summary-row"><span>Subtotal:</span><span>${formatCurrency(order.subtotal)}</span></div>
            <div class="summary-row"><span>Tax (12%):</span><span>${formatCurrency(order.tax)}</span></div>
            <div class="summary-row total"><span>Total:</span><span>${formatCurrency(order.total)}</span></div>
        </div>
    `;
    
    // Show the modal
    document.getElementById('order-confirmation').style.display = 'block';
}