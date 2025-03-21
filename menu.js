// Initialize the menu page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('menu-items-container')) {
        initializeMenuPage();
    }
});

// Initialize the menu page
function initializeMenuPage() {
    // Display all menu items
    displayMenuItems('all');
    
    // Add event listeners to category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category and display items
            const category = this.getAttribute('data-category');
            displayMenuItems(category);
        });
    });
}

// Display menu items by category
function displayMenuItems(category) {
    const menuContainer = document.getElementById('menu-items-container');
    
    // Filter items by category and availability
    let filteredItems;
    if (category === 'all') {
        filteredItems = menuItems.filter(item => item.available);
    } else {
        filteredItems = menuItems.filter(item => item.category === category && item.available);
    }
    
    // Clear container
    menuContainer.innerHTML = '';
    
    // Display items or show message if none
    if (filteredItems.length === 0) {
        menuContainer.innerHTML = '<p class="no-items">No items available in this category.</p>';
        return;
    }
    
    // Create and append product cards
    filteredItems.forEach(item => {
        const itemElement = createProductCard(item);
        menuContainer.appendChild(itemElement);
    });
}