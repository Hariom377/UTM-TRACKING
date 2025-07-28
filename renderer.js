// --- Data Fetching ---
async function fetchData() {
    try {
        const [siteConfigRes, productsRes] = await Promise.all([
            fetch('/config/site-config.json'),
            fetch('/config/products.json')
        ]);
        const siteConfig = await siteConfigRes.json();
        const productsData = await productsRes.json();
        return { siteConfig, productsData };
    } catch (error) {
        console.error("Failed to fetch config files:", error);
        return null;
    }
}

// --- SEO & Meta Tag Injection ---
function injectSEOTags(product, siteConfig) {
    const affiliateUrl = `${product.amazonUrl}?tag=${siteConfig.amazonAffiliateId}`;
    const pageTitle = `${product.name} Review | ${siteConfig.siteTitle}`;
    const metaDescription = `In-depth review of the ${product.name}. Discover its features, pros, cons, and see if it's the right choice for you. ${product.summary}`;
    const canonicalUrl = `${siteConfig.siteUrl}/products/${product.id}.html`;
    const imageUrl = `${siteConfig.siteUrl}/assets/images/products/${product.images[0]}`;

    document.title = pageTitle;

    // Standard Meta Tags
    createMetaTag('description', metaDescription);
    createMetaTag('keywords', product.keywords.join(', '));
    createLinkTag('canonical', canonicalUrl);

    // Open Graph (for social media)
    createMetaTag('og:title', pageTitle, 'property');
    createMetaTag('og:description', metaDescription, 'property');
    createMetaTag('og:image', imageUrl, 'property');
    createMetaTag('og:url', canonicalUrl, 'property');
    createMetaTag('og:type', 'article', 'property');
    
    // Twitter Card
    createMetaTag('twitter:card', 'summary_large_image');
    createMetaTag('twitter:title', pageTitle);
    createMetaTag('twitter:description', metaDescription);
    createMetaTag('twitter:image', imageUrl);

    // Inject Schemas
    injectProductSchema(product, siteConfig, affiliateUrl);
    injectFAQSchema(product, siteConfig);
}

// --- Schema Injection ---
function injectProductSchema(product, siteConfig, affiliateUrl) {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images.map(img => `${siteConfig.siteUrl}/assets/images/products/${img}`),
        "description": product.description,
        "sku": product.id,
        "review": {
          "@type": "Review",
          "reviewRating": { "@type": "Rating", "ratingValue": product.rating, "bestRating": "5" },
          "author": { "@type": "Person", "name": siteConfig.authorName }
        },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": product.rating, "reviewCount": "1" }, // Example count
        "offers": {
          "@type": "Offer",
          "url": affiliateUrl,
          "priceCurrency": "USD",
          "price": product.price,
          "availability": "https://schema.org/InStock"
        }
    };
    createSchemaTag(schema);
}

function injectFAQSchema(product, siteConfig) {
    if (!product.faqs || product.faqs.length === 0) return;
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": product.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
    createSchemaTag(schema);
}

// --- DOM Manipulation Helpers ---
function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setElementHref(id, url) {
    const el = document.getElementById(id);
    if (el) el.href = url;
}

function populateList(id, items) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

// --- HTML Component Generators ---
function createProductCard(product, siteConfig) {
    const affiliateUrl = `${product.amazonUrl}?tag=${siteConfig.amazonAffiliateId}`;
    return `
        <div class="product-card">
            <a href="/products/${product.id}.html" class="card-link">
                <img src="/assets/images/products/${product.images[0]}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <p>${product.summary}</p>
                <span class="rating">Rating: ${product.rating} / 5</span>
            </a>
            <a href="${affiliateUrl}" class="card-cta" target="_blank" rel="noopener sponsored">View on Amazon</a>
        </div>
    `;
}

// --- Main Page Renderers ---

async function renderProductPage(productId) {
    const data = await fetchData();
    if (!data) return;
    const { siteConfig, productsData } = data;
    
    const product = productsData.products.find(p => p.id === productId);
    if (!product) {
        document.getElementById('product-name').textContent = "Product not found!";
        return;
    }

    // 1. Inject SEO
    injectSEOTags(product, siteConfig);

    // 2. Populate Page Content
    const affiliateUrl = `${product.amazonUrl}?tag=${siteConfig.amazonAffiliateId}`;
    setElementText('product-name', product.name);
    setElementText('product-rating', `${product.rating} / 5`);
    setElementText('product-description', product.description);
    setElementHref('cta-button', affiliateUrl);
    populateList('pros-list', product.pros);
    populateList('cons-list', product.cons);

    // Populate Gallery
    const galleryEl = document.getElementById('product-gallery');
    galleryEl.innerHTML = product.images.map(img => 
        `<img src="../assets/images/products/${img}" alt="Image of ${product.name}">`
    ).join('');

    // Populate FAQs
    const faqSection = document.getElementById('faq-section');
    if (product.faqs) {
        faqSection.innerHTML += product.faqs.map(faq => `
            <div class="faq-item">
                <h4>${faq.question}</h4>
                <p>${faq.answer}</p>
            </div>
        `).join('');
    }

    // Populate Related Products
    const relatedGrid = document.getElementById('related-products-grid');
    const relatedProducts = productsData.products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3); // Show 3 related products
    
    relatedGrid.innerHTML = relatedProducts.map(p => createProductCard(p, siteConfig)).join('');
}

async function renderHomepage() {
    const data = await fetchData();
    if (!data) return;
    const { siteConfig, productsData } = data;

    // Render Featured Products
    const featuredGrid = document.getElementById('featured-products-grid');
    const featuredProducts = productsData.products.slice(0, 6); // Show first 6 products
    featuredGrid.innerHTML = featuredProducts.map(p => createProductCard(p, siteConfig)).join('');
    
    // Update site title for homepage
    document.title = `${siteConfig.siteTitle} - ${siteConfig.siteDescription}`;
}

// --- Utility functions for creating meta tags ---
function createMetaTag(name, content, attribute = 'name') {
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
}

function createLinkTag(rel, href) {
    const link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);
    document.head.appendChild(link);
}

function createSchemaTag(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
}
