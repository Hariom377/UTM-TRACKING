// CSS Loading Diagnostic Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Starting CSS diagnostic...');
    
    // Check if CSS file loaded
    function checkCSSLoaded() {
        const testElement = document.createElement('div');
        testElement.className = 'css-test';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement);
        const fontFamily = computedStyle.getPropertyValue('font-family');
        
        if (fontFamily.includes('Segoe UI')) {
            console.log('✅ CSS loaded successfully!');
            document.body.removeChild(testElement);
            return true;
        } else {
            console.log('❌ CSS not loaded properly');
            console.log('Font family detected:', fontFamily);
            document.body.removeChild(testElement);
            return false;
        }
    }
    
    // Check for CSS link tags
    function checkCSSLinks() {
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        console.log(`Found ${cssLinks.length} CSS link(s):`);
        
        cssLinks.forEach((link, index) => {
            console.log(`${index + 1}. ${link.href}`);
            
            // Check if CSS file exists
            fetch(link.href)
                .then(response => {
                    if (response.ok) {
                        console.log(`✅ CSS file ${index + 1} exists and is accessible`);
                    } else {
                        console.log(`❌ CSS file ${index + 1} returned status: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.log(`❌ CSS file ${index + 1} failed to load:`, error);
                });
        });
    }
    
    // Run diagnostics
    setTimeout(() => {
        console.log('🔧 Running CSS diagnostics...');
        checkCSSLinks();
        
        setTimeout(() => {
            const cssLoaded = checkCSSLoaded();
            
            if (!cssLoaded) {
                console.log('🚨 CSS LOADING ISSUE DETECTED!');
                console.log('Possible solutions:');
                console.log('1. Check if css/style.css exists in your repository');
                console.log('2. Verify the file path in HTML: <link rel="stylesheet" href="css/style.css">');
                console.log('3. Make sure the CSS file is uploaded to GitHub');
                console.log('4. Clear browser cache and refresh');
                
                // Show visual alert
                const alertDiv = document.createElement('div');
                alertDiv.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background: #dc3545;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                `;
                alertDiv.innerHTML = '⚠️ CSS not loading! Check browser console for details.';
                document.body.insertBefore(alertDiv, document.body.firstChild);
            }
        }, 1000);
    }, 500);
    
    // Rest of your existing JavaScript code...
    initializeWebsite();
});

// Main website initialization
function initializeWebsite() {
    // Filter Functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');

                reviewCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'grid';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Smooth Scroll
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

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });

    // Buy Button Animation
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Redirecting...';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 2000);
        });
    });

    console.log('🎉 Website initialized successfully!');
}
