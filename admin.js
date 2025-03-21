// Initialize the admin page
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.admin-panel')) {
        initializeAdminPage();
    }
});

// Initialize the admin page
function initializeAdminPage() {
    // Add event listener to login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Add event listener to logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Add event listeners to sidebar tabs
    const tabLinks = document.querySelectorAll('.admin-sidebar a[data-tab]');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            tabLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all tabs
            document.querySelectorAll('.admin-tab').forEach(tab => {
                tab.style.display = 'none';
            });
            
            // Show selected tab
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Add event listeners to add buttons
    const addMenuItemBtn = document.getElementById('add-menu-item-btn');
    if (addMenuItemBtn) {
        addMenuItemBtn.addEventListener('click', function() {
            document.getElementById('add-menu-modal').style.display = 'block';
        });
    }
    
    const addInventoryItemBtn = document.getElementById('add-inventory-item-btn');
    if (addInventoryItemBtn) {
        addInventoryItemBtn.addEventListener('click', function() {
            document.getElementById('add-inventory-modal').style.display = 'block';
        });
    }
    
    // Add event listeners to close buttons
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Add event listeners to forms
    const addMenuForm = document.getElementById('add-menu-form');
    if (addMenuForm) {
        addMenuForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addMenuItem();
        });
    }
    
    const addInventoryForm = document.getElementById('add-inventory-form');
    if (addInventoryForm) {
        addInventoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addInventoryItem();
        });
    }
    
    // Add event listener to filter orders button
    const filterOrdersBtn = document.getElementById('filter-orders-btn');
    if (filterOrdersBtn) {
        filterOrdersBtn.addEventListener('click', function() {
            displayOrders();
        });
    }
    
    // Add event listener to generate report button
    const generateReportBtn = document.getElementById('generate-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            generateSalesReport();
        });
    }
    
    // Add event listener to export report button
    const exportReportBtn = document.getElementById('export-report-btn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            exportSalesReport();
        });
    }
    
    // Check if user is already logged in
    checkLoginStatus();
}

// Handle login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in a real app, this would be server-side)
    if (username === 'admin' && password === 'jollibee123') {
        // Set current user
        currentUser = {
            username: username,
            role: 'admin'
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Show admin dashboard
        showAdminDashboard();
        
        // Load initial data
        displayOrders();
        displayMenuItems();
        displayInventory();
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Handle logout
function handleLogout() {
    // Clear current user
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Show login form
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
}

// Check login status
function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showAdminDashboard();
        
        // Load initial data
        displayOrders();
        displayMenuItems();
        displayInventory();
    }
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
}

// Display orders
function displayOrders() {
    const ordersTableBody = document.getElementById('orders-table-body');
    const statusFilter = document.getElementById('order-status-filter').value;
    const dateFilter = document.getElementById('order-date-filter').value;
    
    // Filter orders
    let filteredOrders = [...orders];
    
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filterDate.setHours(0, 0, 0, 0);
        
        filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.timestamp);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === filterDate.getTime();
        });
    }
    
    // Sort orders by timestamp (newest first)
    filteredOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Clear table
    ordersTableBody.innerHTML = '';
    
    // Add orders to table
    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        
        // Format date
        const orderDate = new Date(order.timestamp);
        const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
        
        // Format items
        const itemsText = order.items.map(item => `${item.name} x${item.quantity}`).join(', ');
        
        // Create status select
        const statusSelect = `
            <select class="order-status-select" data-id="${order.id}">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
        `;
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer.name}</td>
            <td>${itemsText}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${statusSelect}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn view-order-btn" data-id="${order.id}">View</button>
            </td>
        `;
        
        ordersTableBody.appendChild(row);
    });
    
    // Add event listeners to status selects
    const statusSelects = document.querySelectorAll('.order-status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const orderId = this.getAttribute('data-id');
            const newStatus = this.value;
            updateOrderStatus(orderId, newStatus);
        });
    });
    
    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll('.view-order-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrderDetails(orderId);
        });
    });
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(order => order.id === orderId);
    
    if (order) {
        order.status = newStatus;
        saveData();
        alert(`Order ${orderId} status updated to ${newStatus}`);
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(order => order.id === orderId);
    
    if (order) {
        // Create a modal to show order details
        // This is a simplified version - in a real app, you'd have a proper modal
        alert(`
            Order ID: ${order.id}
            Customer: ${order.customer.name}
            Phone: ${order.customer.phone}
            Order Type: ${order.orderType}
            ${order.deliveryAddress ? `Delivery Address: ${order.deliveryAddress}` : ''}
            Payment Method: ${order.paymentMethod}
            Total: ${formatCurrency(order.total)}
            Status: ${order.status}
            Date: ${new Date(order.timestamp).toLocaleString()}
        `);
    }
}

// Display menu items
function displayMenuItems() {
    const menuTableBody = document.getElementById('menu-table-body');
    
    // Clear table
    menuTableBody.innerHTML = '';
    
    // Add menu items to table
    menuItems.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${item.available ? '<span class="status-available">Available</span>' : '<span class="status-unavailable">Unavailable</span>'}</td>
            <td>
                <button class="btn edit-menu-btn" data-id="${item.id}">Edit</button>
                <button class="btn toggle-menu-btn" data-id="${item.id}">${item.available ? 'Disable' : 'Enable'}</button>
            </td>
        `;
        
        menuTableBody.appendChild(row);
    });
    
    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll('.edit-menu-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            editMenuItem(itemId);
        });
    });
    
    // Add event listeners to toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-menu-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            toggleMenuItemAvailability(itemId);
        });
    });
}

// Add menu item
function addMenuItem() {
    const name = document.getElementById('menu-name').value;
    const category = document.getElementById('menu-category').value;
    const price = parseFloat(document.getElementById('menu-price').value);
    const description = document.getElementById('menu-description').value;
    const image = document.getElementById('menu-image').value || 'https://via.placeholder.com/150';
    
    // Generate new ID
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    
    // Create new menu item
    const newItem = {
        id: newId,
        name: name,
        category: category,
        price: price,
        description: description,
        image: image,
        available: true
    };
    
    // Add to menu items
    menuItems.push(newItem);
    
    // Save data
    saveData();
    
    // Update display
    displayMenuItems();
    
    // Close modal and reset form
    document.getElementById('add-menu-modal').style.display = 'none';
    document.getElementById('add-menu-form').reset();
    
    alert(`Menu item "${name}" added successfully!`);
}

// Edit menu item
function editMenuItem(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    
    if (item) {
        // In a real app, you'd open a modal with a form pre-filled with item data
        // This is a simplified version
        const newName = prompt('Enter new name:', item.name);
        if (newName === null) return;
        
        const newPrice = parseFloat(prompt('Enter new price:', item.price));
        if (isNaN(newPrice)) return;
        
        const newDescription = prompt('Enter new description:', item.description);
        if (newDescription === null) return;
        
        // Update item
        item.name = newName;
        item.price = newPrice;
        item.description = newDescription;
        
        // Save data
        saveData();
        
        // Update display
        displayMenuItems();
        
        alert(`Menu item updated successfully!`);
    }
}

// Toggle menu item availability
function toggleMenuItemAvailability(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    
    if (item) {
        item.available = !item.available;
        
        // Save data
        saveData();
        
        // Update display
        displayMenuItems();
        
        alert(`Menu item "${item.name}" is now ${item.available ? 'available' : 'unavailable'}.`);
    }
}

// Display inventory
function displayInventory() {
    const inventoryTableBody = document.getElementById('inventory-table-body');
    
    // Clear table
    inventoryTableBody.innerHTML = '';
    
    // Add inventory items to table
    inventory.forEach(item => {
        const row = document.createElement('tr');
        
        // Determine status based on quantity and reorder level
        let status = 'In Stock';
        let statusClass = 'status-available';
        
        if (item.quantity <= 0) {
            status = 'Out of Stock';
            statusClass = 'status-unavailable';
        } else if (item.quantity <= item.reorderLevel) {
            status = 'Low Stock';
            statusClass = 'status-warning';
        }
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${item.reorderLevel} ${item.unit}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>
                <button class="btn update-inventory-btn" data-id="${item.id}">Update</button>
            </td>
        `;
        
        inventoryTableBody.appendChild(row);
    });
    
    // Add event listeners to update buttons
    const updateButtons = document.querySelectorAll('.update-inventory-btn');
    updateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            updateInventoryItem(itemId);
        });
    });
}

// Add inventory item
function addInventoryItem() {
    const name = document.getElementById('inventory-name').value;
    const quantity = parseInt(document.getElementById('inventory-quantity').value);
    const unit = document.getElementById('inventory-unit').value;
    const reorderLevel = parseInt(document.getElementById('inventory-reorder-level').value);
    
    // Generate new ID
    const newId = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;
    
    // Create new inventory item
    const newItem = {
        id: newId,
        name: name,
        quantity: quantity,
        unit: unit,
        reorderLevel: reorderLevel
    };
    
    // Add to inventory
    inventory.push(newItem);
    
    // Save data
    saveData();
    
    // Update display
    displayInventory();
    
    // Close modal and reset form
    document.getElementById('add-inventory-modal').style.display = 'none';
    document.getElementById('add-inventory-form').reset();
    
    alert(`Inventory item "${name}" added successfully!`);
}

// Update inventory item
function updateInventoryItem(itemId) {
    const item = inventory.find(item => item.id === itemId);
    
    if (item) {
        // In a real app, you'd open a modal with a form pre-filled with item data
        // This is a simplified version
        const newQuantity = parseInt(prompt(`Enter new quantity for ${item.name} (${item.unit}):`, item.quantity));
        if (isNaN(newQuantity)) return;
        
        // Update item
        item.quantity = newQuantity;
        
        // Save data
        saveData();
        
        // Update display
        displayInventory();
        
        alert(`Inventory updated successfully!`);
    }
}

// Generate sales report
function generateSalesReport() {
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }
    
    // Convert to Date objects
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    // Filter orders by date range
    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.timestamp);
        return orderDate >= start && orderDate <= end;
    });
    
    // Calculate total sales
    const totalSales = filteredOrders.reduce((total, order) => total + order.total, 0);
    
    // Calculate total orders
    const totalOrders = filteredOrders.length;
    
    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Count orders by type
    const dineInOrders = filteredOrders.filter(order => order.orderType === 'dine-in').length;
    const takeoutOrders = filteredOrders.filter(order => order.orderType === 'takeout').length;
    const deliveryOrders = filteredOrders.filter(order => order.orderType === 'delivery').length;
    
    // Count orders by status
    const completedOrders = filteredOrders.filter(order => order.status === 'delivered' || order.status === 'ready').length;
    const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled').length;
    
    // Calculate top selling items
    const itemSales = {};
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            if (itemSales[item.name]) {
                itemSales[item.name] += item.quantity;
            } else {
                itemSales[item.name] = item.quantity;
            }
        });
    });
    
    // Convert to array and sort
    const topItems = Object.entries(itemSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    
    // Update summary cards
    document.getElementById('total-sales').textContent = formatCurrency(totalSales);
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('average-order').textContent = formatCurrency(averageOrderValue);
    
    // Update charts (in a real app, you'd use a charting library)
    // For this example, we'll just update text representations
    
    // Order types chart
    const orderTypesChart = document.getElementById('order-types-chart');
    orderTypesChart.innerHTML = `
        <div>Dine-in: ${dineInOrders} (${Math.round(dineInOrders / totalOrders * 100) || 0}%)</div>
        <div>Takeout: ${takeoutOrders} (${Math.round(takeoutOrders / totalOrders * 100) || 0}%)</div>
        <div>Delivery: ${deliveryOrders} (${Math.round(deliveryOrders / totalOrders * 100) || 0}%)</div>
    `;
    
    // Order status chart
    const orderStatusChart = document.getElementById('order-status-chart');
    orderStatusChart.innerHTML = `
        <div>Completed: ${completedOrders} (${Math.round(completedOrders / totalOrders * 100) || 0}%)</div>
        <div>Cancelled: ${cancelledOrders} (${Math.round(cancelledOrders / totalOrders * 100) || 0}%)</div>
        <div>Other: ${totalOrders - completedOrders - cancelledOrders} (${Math.round((totalOrders - completedOrders - cancelledOrders) / totalOrders * 100) || 0}%)</div>
    `;
    
    // Top items chart
    const topItemsChart = document.getElementById('top-items-chart');
    topItemsChart.innerHTML = topItems.map(item => 
        `<div>${item.name}: ${item.quantity} units</div>`
    ).join('');
    
    // Update sales table
    const salesTableBody = document.getElementById('sales-table-body');
    salesTableBody.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        
        // Format date
        const orderDate = new Date(order.timestamp);
        const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer.name}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${order.orderType}</td>
            <td>${order.status}</td>
            <td>${formattedDate}</td>
        `;
        
        salesTableBody.appendChild(row);
    });
}

// Export sales report
function exportSalesReport() {
    // In a real app, this would generate a CSV or PDF file
    // For this example, we'll just show an alert
    alert('Report exported successfully!');
}
