// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle (if needed in future)
    const initMobileMenu = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    };

    // Filter Functionality for Reviews Page
    const initProductFilter = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const reviewCards = document.querySelectorAll('.review-card');

        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');

                reviewCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'grid';
                        card.style.animation = 'fadeInUp 0.5s ease-in-out';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    };

    // Smooth Scroll for Anchor Links
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Lazy Loading for Images
    const initLazyLoading = () => {
        const images = document.querySelectorAll('img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    };

    // Track Affiliate Link Clicks (Optional Analytics)
    const initAffiliateTracking = () => {
        const affiliateLinks = document.querySelectorAll('a[href*="amazon.com"]');
        
        affiliateLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Optional: Track clicks with Google Analytics or other tools
                console.log('Affiliate link clicked:', this.textContent);
                
                // You can add tracking code here like:
                // gtag('event', 'click', {
                //     'event_category': 'affiliate',
                //     'event_label': this.textContent
                // });
            });
        });
    };

    // Add Loading States for Better UX
    const initLoadingStates = () => {
        const buyBtns = document.querySelectorAll('.buy-btn');
        
        buyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const originalText = this.textContent;
                this.textContent = 'Redirecting to Amazon...';
                this.style.opacity = '0.7';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.opacity = '1';
                }, 2000);
            });
        });
    };

    // Header Scroll Effect
    const initHeaderScroll = () => {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#fff';
                header.style.backdropFilter = 'none';
            }
            
            lastScrollTop = scrollTop;
        });
    };

    // Search Functionality (Basic)
    const initSearch = () => {
        const searchInput = document.querySelector('.search-input');
        const productCards = document.querySelectorAll('.product-card, .review-card');

        if (!searchInput) return;

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            productCards.forEach(card => {
                const title = card.querySelector('.product-title, .product-name').textContent.toLowerCase();
                const description = card.querySelector('.product-description')?.textContent.toLowerCase() || '';

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    };

    // Star Rating Animation
    const initStarAnimation = () => {
        const starElements = document.querySelectorAll('.stars');
        
        starElements.forEach(stars => {
            stars.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            
            stars.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    };

    // Initialize all functions
    initMobileMenu();
    initProductFilter();
    initSmoothScroll();
    initLazyLoading();
    initAffiliateTracking();
    initLoadingStates();
    initHeaderScroll();
    initSearch();
    initStarAnimation();

    // Performance optimization
    window.addEventListener('load', function() {
        // Remove any loading overlays
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.display = 'none';
        }
    });
});

// Utility Functions
const utils = {
    // Format price for display
    formatPrice: (price) => {
        return `$${price.toFixed(2)}`;
    },
    
    // Generate star rating HTML
    generateStars: (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '★';
        }
        
        if (halfStar) {
            starsHTML += '☆';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '☆';
        }
        
        return starsHTML;
    },
    
    // Scroll to top function
    scrollToTop: () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Add scroll to top button functionality
const createScrollToTopBtn = () => {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s;
    `;
    
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', utils.scrollToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
};

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopBtn);
