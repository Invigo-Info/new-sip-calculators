/* Navigation Component JavaScript */
/* Include this JS file in your HTML pages for dropdown functionality */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mega menu functionality
    initializeMegaMenu();
    
    // Set active link based on current page
    setActiveLink();
});

function initializeMegaMenu() {
    const megaMenu = document.querySelector('.mega-menu');
    const megaMenuBtn = document.querySelector('.mega-menu-btn');
    
    if (!megaMenu || !megaMenuBtn) {
        console.warn('Mega menu elements not found');
        return;
    }
    
    // Check if mega menu is already initialized (to avoid conflicts with existing JS)
    if (megaMenuBtn.hasAttribute('data-nav-initialized')) {
        console.log('Mega menu already initialized by existing script');
        return;
    }
    
    console.log('Nav component initialized successfully');
    
    // Mark as initialized by nav component
    megaMenuBtn.setAttribute('data-nav-initialized', 'true');
    
    // Toggle menu on button click
    megaMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        megaMenu.classList.toggle('open');
        console.log('Dropdown toggled, open state:', megaMenu.classList.contains('open'));
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!megaMenu.contains(e.target)) {
            megaMenu.classList.remove('open');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            megaMenu.classList.remove('open');
        }
    });
    
    // Prevent menu from closing when clicking inside the content
    const megaMenuContent = megaMenu.querySelector('.mega-menu-content');
    if (megaMenuContent) {
        megaMenuContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close menu when clicking on a link
    const megaLinks = document.querySelectorAll('.mega-link');
    megaLinks.forEach(link => {
        link.addEventListener('click', function() {
            megaMenu.classList.remove('open');
        });
    });
}

function setActiveLink() {
    const currentPath = window.location.pathname;
    const megaLinks = document.querySelectorAll('.mega-link');
    
    // Remove any existing active classes
    megaLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and set active link
    megaLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        }
    });
}