// SEO Optimization and Auto-Ranking Features
class SEOOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.generateMetaTags();
        this.generateStructuredData();
        this.optimizeImages();
        this.generateSitemap();
        this.setupInternalLinking();
        this.monitorPerformance();
    }

    generateMetaTags() {
        const page = this.getCurrentPageType();
        const product = this.getCurrentProduct();
        
        if (product) {
            this.setProductMetaTags(product);
        } else {
            this.setDefaultMetaTags(page);
        }
    }

    getCurrentPageType() {
        const path = window.location.pathname;
        if (path.includes('/products/')) return 'product';
        if (path.includes('/blog/')) return 'blog';
        if (path === '/') return 'home';
        return 'page';
    }

    getCurrentProduct() {
        // Extract product ID from URL and return product data
        const pathParts = window.location.pathname.split('/');
        const productSlug = pathParts[pathParts.length - 1].replace('.html', '');
        
        // This would typically fetch from products.json
        return null; // Placeholder
    }

    setProductMetaTags(product) {
        const title = `${product.name} - Review & Price Comparison`;
        const description = `Detailed review of ${product.name}. ${product.description.substring(0, 120)}...`;
        
        document.title = title;
        this.updateMetaTag('description', description);
        this.updateMetaTag('og:title', title);
        this.updateMetaTag('og:description', description);
        this.updateMetaTag('og:image', `/assets/images/products/${product.images[0]}`);
        this.updateMetaTag('og:url', window.location.href);
        
        // Update canonical URL
        document.getElementById('canonical-url').href = window.location.href;
    }

    setDefaultMetaTags(pageType) {
        const metaData = {
            home: {
                title: 'Best Product Reviews & Recommendations',
                description: 'Discover top-rated products with detailed reviews and honest recommendations. Find the perfect products for your needs.'
            },
            product: {
                title: 'Product Reviews & Comparisons',
                description: 'Compare products and read detailed reviews to make informed purchasing decisions.'
            },
            blog: {
                title: 'Latest Product Reviews & Buying Guides',
                description: 'Stay updated with the latest product reviews, buying guides, and recommendations.'
            }
        };

        const meta = metaData[pageType] || metaData.home;
        document.title = meta.title;
        this.updateMetaTag('description', meta.description);
    }

    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`) || 
                  document.querySelector(`meta[property="${name}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            if (name.startsWith('og:')) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
    }

    generateStructuredData() {
        const pageType = this.getCurrentPageType();
        let structuredData = {};

        switch (pageType) {
            case 'product':
                structuredData = this.generateProductSchema();
                break;
            case 'blog':
                structuredData = this.generateArticleSchema();
                break;
            case 'home':
                structuredData = this.generateWebsiteSchema();
                break;
        }

        if (Object.keys(structuredData).length > 0) {
            const script = document.getElementById('schema-markup') || document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'schema-markup';
            script.textContent = JSON.stringify(structuredData);
            
            if (!script.parentNode) {
                document.head.appendChild(script);
            }
        }
    }

    generateProductSchema() {
        // This would use actual product data
        return {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "Product Name",
            "image": "product-image-url",
            "description": "Product description",
            "brand": {
                "@type": "Brand",
                "name": "Brand Name"
            },
            "offers": {
                "@type": "Offer",
                "url": "product-url",
                "priceCurrency": "USD",
                "price": "99.99",
                "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5",
                "reviewCount": "100"
            }
        };
    }

    generateArticleSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": document.title,
            "description": document.querySelector('meta[name="description"]').content,
            "author": {
                "@type": "Person",
                "name": "Author Name"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Site Name",
                "logo": {
                    "@type": "ImageObject",
                    "url": "logo-url"
                }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString()
        };
    }

    generateWebsiteSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": document.title,
            "url": window.location.origin,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };
    }

    optimizeImages() {
        // Add loading attributes and optimize alt text
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            if (!img.alt) {
                const altText = this.generateAltText(img);
                img.alt = altText;
            }
        });
    }

    generateAltText(img) {
        const src = img.src;
        const fileName = src.split('/').pop().split('.')[0];
        return fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    generateSitemap() {
        // Generate dynamic sitemap (this would typically be done server-side)
        const urls = [
            '/',
            '/products/',
            '/blog/',
            '/about.html',
            '/contact.html',
            '/privacy-policy.html'
        ];

        // Add product URLs
        // This would fetch from products.json in a real implementation
        
        console.log('Sitemap would include:', urls);
    }

    setupInternalLinking() {
        // Automatically add related product links
        this.addRelatedProductLinks();
        this.addBreadcrumbs();
    }

    addRelatedProductLinks() {
        const content = document.querySelector('main');
        if (!content) return;

        // Find product mentions in text and add links
        const productKeywords = ['smartphone', 'laptop', 'headphones', 'camera'];
        
        productKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            content.innerHTML = content.innerHTML.replace(regex, match => {
                if (match.closest('a')) return match; // Don't link if already in a link
                return `<a href="/products/?search=${keyword}" title="Browse ${keyword}">${match}</a>`;
            });
        });
    }

    addBreadcrumbs() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(part => part);
        
        if (parts.length <= 1) return;

        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.className = 'breadcrumbs';
        breadcrumbContainer.innerHTML = '<ol itemscope itemtype="https://schema.org/BreadcrumbList"></ol>';
        
        const ol = breadcrumbContainer.querySelector('ol');
        
        // Add home
        ol.innerHTML += `
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a itemprop="item" href="/"><span itemprop="name">Home</span></a>
                <meta itemprop="position" content="1" />
            </li>
        `;

        // Add path parts
        let currentPath = '';
        parts.forEach((part, index) => {
            currentPath += '/' + part;
            const isLast = index === parts.length - 1;
            const name = part.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            ol.innerHTML += `
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    ${isLast ? 
                        `<span itemprop="name">${name}</span>` : 
                        `<a itemprop="item" href="${currentPath}"><span itemprop="name">${name}</span></a>`
                    }
                    <meta itemprop="position" content="${index + 2}" />
                </li>
            `;
        });

        // Insert breadcrumbs at the top of main content
        const main = document.querySelector('main');
        if (main && main.firstChild) {
            main.insertBefore(breadcrumbContainer, main.firstChild);
        }
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            try {
                // Largest Contentful Paint
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        console.log('LCP:', entry.startTime);
                        this.reportMetric('LCP', entry.startTime);
                    }
                }).observe({entryTypes: ['largest-contentful-paint']});

                // First Input Delay
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        console.log('FID:', entry.processingStart - entry.startTime);
                        this.reportMetric('FID', entry.processingStart - entry.startTime);
                    }
                }).observe({entryTypes: ['first-input']});

                // Cumulative Layout Shift
                new PerformanceObserver((entryList) => {
                    let clsValue = 0;
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    console.log('CLS:', clsValue);
                    this.reportMetric('CLS', clsValue);
                }).observe({entryTypes: ['layout-shift']});

            } catch (e) {
                console.log('Performance monitoring not supported');
            }
        }
    }

    reportMetric(name, value) {
        // Send metrics to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', name, {
                event_category: 'Web Vitals',
                value: Math.round(value),
                non_interaction: true,
            });
        }
    }

    // Keyword optimization
    analyzeKeywords() {
        const content = document.body.textContent;
        const words = content.toLowerCase().match(/\b\w+\b/g);
        const frequency = {};
        
        words.forEach(word => {
            if (word.length > 3) {
                frequency[word] = (frequency[word] || 0) + 1;
            }
        });

        const sortedWords = Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        console.log('Top keywords:', sortedWords);
        return sortedWords;
    }

    // Content scoring
    scoreContent() {
        const score = {
            title: this.scoreTitleTag(),
            meta: this.scoreMetaDescription(),
            headings: this.scoreHeadings(),
            images: this.scoreImages(),
            links: this.scoreLinks(),
            content: this.scoreContentLength()
        };

        const totalScore = Object.values(score).reduce((sum, val) => sum + val, 0) / Object.keys(score).length;
        console.log('SEO Score:', Math.round(totalScore), '%');
        console.log('Detailed scores:', score);
        
        return totalScore;
    }

    scoreTitleTag() {
        const title = document.title;
        if (!title) return 0;
        if (title.length < 30) return 50;
        if (title.length > 60) return 70;
        return 100;
    }

    scoreMetaDescription() {
        const meta = document.querySelector('meta[name="description"]');
        if (!meta) return 0;
        const content = meta.getAttribute('content');
        if (!content) return 0;
        if (content.length < 120) return 50;
        if (content.length > 160) return 70;
        return 100;
    }

    scoreHeadings() {
        const h1s = document.querySelectorAll('h1');
        const h2s = document.querySelectorAll('h2');
        
        if (h1s.length !== 1) return 50;
        if (h2s.length < 2) return 70;
        return 100;
    }

    scoreImages() {
        const images = document.querySelectorAll('img');
        const imagesWithAlt = document.querySelectorAll('img[alt]');
        
        if (images.length === 0) return 100;
        return (imagesWithAlt.length / images.length) * 100;
    }

    scoreLinks() {
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href^="' + window.location.origin + '"])');
        
        if (internalLinks.length < 3) return 50;
        if (externalLinks.length === 0) return 80;
        return 100;
    }

    scoreContentLength() {
        const content = document.body.textContent.length;
        if (content < 300) return 30;
        if (content < 500) return 60;
        if (content < 1000) return 80;
        return 100;
    }
}

// Initialize SEO optimizer
document.addEventListener('DOMContentLoaded', () => {
    new SEOOptimizer();
});
