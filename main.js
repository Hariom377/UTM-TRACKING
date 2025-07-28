// Site Configuration and Main JavaScript
class AffiliateWebsite {
    constructor() {
        this.config = {};
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadConfig();
        await this.loadProducts();
        this.setupEventListeners();
        this.renderContent();
        this.initializeFeatures();
    }

    async loadConfig() {
        try {
            const response = await fetch('/config/site-config.json');
            this.config = await response.json();
            this.updateSiteConfig();
        } catch (error) {
            console.error('Failed to load site configuration:', error);
            this.setDefaultConfig();
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/config/products.json');
            const data = await response.json();
            this.products = data.products || [];
        } catch (error) {
            console.error('Failed to load products:', error);
            this.products = [];
        }
    }

    updateSiteConfig() {
        // Update site title and meta information
        if (this.config.siteTitle) {
            document.title = this.config.siteTitle;
            document.getElementById('site-title').textContent = this.config.siteTitle;
            document.getElementById('footer-site-name').textContent = this.config.siteTitle;
        }

        // Update meta description
        if (this.config.siteDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', this.config.siteDescription);
        }

        // Update social media links
        this.updateSocialLinks();

        // Update Google Analytics
        if (this.config.analytics) {
            this.initializeAnalytics();
        }
    }

    updateSocialLinks() {
        const socialContainer = document.getElementById('social-links');
        if (!socialContainer || !this.config.socialMedia) return;

        socialContainer.innerHTML = '';
        
        Object.entries(this.config.socialMedia).forEach(([platform, url]) => {
            if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.innerHTML = this.getSocialIcon(platform);
                link.setAttribute('aria-label', `Follow us on ${platform}`);
                socialContainer.appendChild(link);
            }
        });
    }

    getSocialIcon(platform) {
        const icons = {
            facebook: '📘',
            instagram: '📷',
            twitter: '🐦',
            youtube: '📺',
            linkedin: '💼'
        };
        return icons[platform] || '🔗';
    }

    renderContent() {
        this.renderFeaturedProducts();
        this.renderCategories();
        this.renderRecentPosts();
    }

    renderFeaturedProducts() {
        const container = document.getElementById('featured-products-grid');
        if (!container) return;

        const featuredProducts = this.products.slice(0, 8);
        container.innerHTML = '';

        featuredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-image" 
                 src="assets/images/products/${product.images[0]}" 
                 alt="${product.name}"
                 loading="lazy">
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${this.generateStars(product.rating)}</span>
                    <span>${product.rating}/5</span>
                </div>
                <div class="product-price">${product.price}</div>
                <a href="${product.amazonUrl}" 
                   class="buy-button" 
                   target="_blank" 
                   rel="noopener noreferrer sponsored">
                   Buy on Amazon
                </a>
            </div>
        `;
        return card;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '⭐';
        }
        if (halfStar) {
            stars += '⭐';
        }
        
        return stars;
    }

    renderCategories() {
        const container = document.getElementById('categories-grid');
        if (!container) return;

        const categories = [...new Set(this.products.map(p => p.category))];
        container.innerHTML = '';

        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'product-card';
            categoryCard.innerHTML = `
                <div class="product-content">
                    <h3 class="product-title">${category}</h3>
                    <a href="/products/?category=${encodeURIComponent(category)}" 
                       class="buy-button">
                       View Products
                    </a>
                </div>
            `;
            container.appendChild(categoryCard);
        });
    }

    renderRecentPosts() {
        const container = document.getElementById('recent-posts-grid');
        if (!container) return;

        // This would typically load from a blog posts JSON file
        const samplePosts = [
            {
                title: "Best Budget Tech Products of 2025",
                excerpt: "Discover amazing tech products that won't break the bank...",
                url: "/blog/best-budget-tech-2025.html",
                image: "blog-post-1.jpg"
            },
            {
                title: "Ultimate Buying Guide: Smart Home Devices",
                excerpt: "Everything you need to know about smart home automation...",
                url: "/blog/smart-home-guide.html",
                image: "blog-post-2.jpg"
            }
        ];

        container.innerHTML = '';
        samplePosts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'product-card';
            postCard.innerHTML = `
                <img class="product-image" 
                     src="assets/images/blog/${post.image}" 
                     alt="${post.title}"
                     loading="lazy">
                <div class="product-content">
                    <h3 class="product-title">${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.url}" class="buy-button">Read More</a>
                </div>
            `;
            container.appendChild(postCard);
        });
    }

    setupEventListeners() {
        // Mobile menu toggle
        const navbarBurger = document.querySelector('.navbar-burger');
        const navbarMenu = document.querySelector('.navbar-menu');

        if (navbarBurger && navbarMenu) {
            navbarBurger.addEventListener('click', () => {
                navbarBurger.classList.toggle('is-active');
                navbarMenu.classList.toggle('is-active');
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        }

        // Search functionality
        this.setupSearch();

        // Lazy loading for images
        this.setupLazyLoading();
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Here you would typically integrate with an email service
        console.log('Newsletter subscription:', email);
        alert('Thank you for subscribing!');
        e.target.reset();
    }

    setupSearch() {
        // Add search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.performSearch.bind(this), 300));
        }
    }

    performSearch(query) {
        if (query.length < 3) return;

        const results = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.keywords.some(keyword => 
                keyword.toLowerCase().includes(query.toLowerCase())
            )
        );

        this.displaySearchResults(results);
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    initializeFeatures() {
        // Initialize additional features
        this.setupScrollToTop();
        this.setupPerformanceMonitoring();
        this.setupA11yFeatures();
    }

    setupScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.className = 'scroll-to-top';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
        `;

        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
            } else {
                scrollButton.style.opacity = '0';
            }
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vitals' in window) {
            // This would typically use the web-vitals library
            console.log('Performance monitoring initialized');
        }
    }

    setupA11yFeatures() {
        // Skip link for keyboard navigation
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link sr-only';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    initializeAnalytics() {
        // Google Analytics 4 integration
        if (this.config.analytics) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.analytics}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', this.config.analytics);
        }
    }

    setDefaultConfig() {
        this.config = {
            siteTitle: "Product Reviews",
            siteDescription: "Honest product reviews and recommendations",
            authorName: "Product Reviewer",
            amazonAffiliateId: "your-affiliate-id",
            socialMedia: {},
            contactEmail: "contact@example.com"
        };
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AffiliateWebsite();
});

// Service Worker for caching (PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
