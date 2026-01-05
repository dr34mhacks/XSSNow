/**
 * XSSNow SEO Framework
 * Implements programmatic SEO with dynamic metadata, internal linking, and performance optimization
 */

class SEOFramework {
    constructor() {
        this.baseUrl = 'https://xssnow.in';
        this.currentPath = window.location.pathname;
        this.pageType = this.detectPageType();
        this.keywords = this.getPageKeywords();
        this.contentStructure = this.analyzeContentStructure();

        this.init();
    }

    init() {
        this.optimizeMetadata();
        this.implementStructuredData();
        this.createInternalLinking();
        this.optimizePerformance();
    }

    // Page Type Detection for Dynamic SEO
    detectPageType() {
        const path = this.currentPath.toLowerCase();
        const pageTypes = {
            '/': 'home',
            '/index.html': 'home',
            '/docs.html': 'documentation',
            '/payloads.html': 'payload-database',
            '/xss-payload-generator.html': 'generator',
            '/contributors.html': 'contributors'
        };

        return pageTypes[path] || 'general';
    }

    // Dynamic Keywords Based on Page Content
    getPageKeywords() {
        const keywordMap = {
            home: [
                'XSS vulnerability scanner', 'cross-site scripting', 'web security testing',
                'penetration testing tools', 'bug bounty', 'ethical hacking',
                'XSS payload database', 'security research', 'OWASP XSS',
                'web application security', 'XSS prevention', 'cybersecurity tools'
            ],
            documentation: [
                'XSS documentation', 'cross-site scripting guide', 'XSS bypass techniques',
                'web security tutorial', 'XSS prevention methods', 'DOM XSS',
                'reflected XSS', 'stored XSS', 'CSP bypass', 'WAF evasion',
                'XSS exploitation', 'security research methodology'
            ],
            'payload-database': [
                'XSS payloads', 'cross-site scripting payloads', 'XSS payload list',
                'security testing payloads', 'XSS vectors', 'web attack vectors',
                'penetration testing payloads', 'bug bounty payloads', 'XSS cheat sheet'
            ],
            generator: [
                'XSS payload generator', 'custom XSS payloads', 'XSS testing tool',
                'security payload creator', 'WAF bypass generator', 'XSS obfuscation',
                'dynamic XSS payloads', 'context-aware XSS'
            ],
            contributors: [
                'XSS security researchers', 'bug bounty hunters', 'cybersecurity contributors',
                'open source security', 'security community', 'vulnerability research'
            ]
        };

        return keywordMap[this.pageType] || keywordMap.home;
    }

    // Dynamic Metadata Optimization
    optimizeMetadata() {
        const metadata = this.generateMetadata();

        // Update title
        document.title = metadata.title;

        // Update or create meta tags
        this.setMetaTag('description', metadata.description);
        this.setMetaTag('keywords', metadata.keywords.join(', '));
        this.setMetaTag('author', 'XSSNow Security Research Team');
        this.setMetaTag('robots', 'index, follow');
        this.setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
        this.setMetaTag('theme-color', '#00ff41');

        // Open Graph tags
        this.setMetaProperty('og:title', metadata.title);
        this.setMetaProperty('og:description', metadata.description);
        this.setMetaProperty('og:type', 'website');
        this.setMetaProperty('og:url', window.location.href);
        this.setMetaProperty('og:site_name', 'XSSNow - XSS Security Research Platform');
        this.setMetaProperty('og:image', `${this.baseUrl}/assets/og-image-${this.pageType}.jpg`);
        this.setMetaProperty('og:locale', 'en_US');

        // Twitter Card tags
        this.setMetaName('twitter:card', 'summary_large_image');
        this.setMetaName('twitter:site', '@XSSNow');
        this.setMetaName('twitter:title', metadata.title);
        this.setMetaName('twitter:description', metadata.description);
        this.setMetaName('twitter:image', `${this.baseUrl}/assets/twitter-card-${this.pageType}.jpg`);

        // Additional SEO tags
        this.setMetaName('application-name', 'XSSNow');
        this.setMetaName('msapplication-TileColor', '#00ff41');
        this.setMetaName('format-detection', 'telephone=no');

        // Canonical URL
        this.setLinkTag('canonical', window.location.href);

        // Preconnect to external resources
        this.setLinkTag('preconnect', 'https://fonts.googleapis.com', 'crossorigin');
        this.setLinkTag('preconnect', 'https://cdnjs.cloudflare.com', 'crossorigin');

        // DNS prefetch for performance
        this.setLinkTag('dns-prefetch', 'https://fonts.gstatic.com');
        this.setLinkTag('dns-prefetch', 'https://cdn.jsdelivr.net');
    }

    // Generate Dynamic Metadata Based on Page Type and Content
    generateMetadata() {
        const metadataMap = {
            home: {
                title: 'XSSNow - Ultimate XSS Payload Arsenal & Security Research Platform',
                description: 'Comprehensive XSS vulnerability testing platform with 1000+ payloads, advanced generator, bypass techniques, and security research tools. Perfect for penetration testing and bug bounty hunting.',
                keywords: this.keywords
            },
            documentation: {
                title: 'Complete XSS Security Documentation - Bypass Techniques & Prevention Guide',
                description: 'In-depth XSS security documentation covering exploitation techniques, bypass methods, prevention strategies, and latest research. Essential guide for security professionals.',
                keywords: this.keywords
            },
            'payload-database': {
                title: 'XSS Payload Database - 1000+ Cross-Site Scripting Vectors & Exploits',
                description: 'Extensive collection of XSS payloads with advanced filtering, context-aware vectors, and WAF bypass techniques. Updated database for security testing.',
                keywords: this.keywords
            },
            generator: {
                title: 'XSS Payload Generator - Custom Cross-Site Scripting Attack Vectors',
                description: 'Advanced XSS payload generator with context awareness, WAF evasion, character restrictions, and custom obfuscation for penetration testing.',
                keywords: this.keywords
            },
            contributors: {
                title: 'XSS Security Researchers & Contributors - Bug Bounty Community',
                description: 'Meet the security researchers, bug bounty hunters, and contributors who make XSSNow possible. Join our community of ethical hackers.',
                keywords: this.keywords
            }
        };

        return metadataMap[this.pageType] || metadataMap.home;
    }

    // Structured Data Implementation
    implementStructuredData() {
        const structuredData = this.generateStructuredData();

        // Create JSON-LD script tag
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    generateStructuredData() {
        const baseStructuredData = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": `${this.baseUrl}/#website`,
                    "url": this.baseUrl,
                    "name": "XSSNow",
                    "description": "Ultimate XSS Payload Arsenal & Security Research Platform",
                    "potentialAction": [{
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": `${this.baseUrl}/payloads.html?search={search_term_string}`
                        },
                        "query-input": "required name=search_term_string"
                    }],
                    "inLanguage": "en-US"
                },
                {
                    "@type": "Organization",
                    "@id": `${this.baseUrl}/#organization`,
                    "name": "XSSNow Security Research",
                    "url": this.baseUrl,
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${this.baseUrl}/assets/ninja.svg`
                    },
                    "sameAs": [
                        "https://github.com/dr34mhacks/XSSNow",
                        "https://twitter.com/dr34mhacks"
                    ]
                }
            ]
        };

        // Add page-specific structured data
        const pageSpecificData = this.getPageSpecificStructuredData();
        if (pageSpecificData) {
            baseStructuredData["@graph"].push(pageSpecificData);
        }

        return baseStructuredData;
    }

    getPageSpecificStructuredData() {
        const pageDataMap = {
            documentation: {
                "@type": "TechArticle",
                "@id": `${this.baseUrl}/docs.html#article`,
                "headline": "Complete XSS Security Documentation",
                "description": "Comprehensive guide to cross-site scripting vulnerabilities, bypass techniques, and prevention methods",
                "author": {
                    "@type": "Organization",
                    "name": "XSSNow Security Research Team"
                },
                "datePublished": "2024-01-01",
                "dateModified": new Date().toISOString().split('T')[0],
                "articleSection": "Cybersecurity",
                "keywords": this.keywords.join(", "),
                "inLanguage": "en-US"
            },
            generator: {
                "@type": "SoftwareApplication",
                "@id": `${this.baseUrl}/xss-payload-generator.html#application`,
                "name": "XSS Payload Generator",
                "description": "Advanced tool for generating custom XSS payloads with context awareness and WAF bypass capabilities",
                "applicationCategory": "SecurityApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                }
            },
            'payload-database': {
                "@type": "Dataset",
                "@id": `${this.baseUrl}/payloads.html#dataset`,
                "name": "XSS Payload Database",
                "description": "Comprehensive collection of cross-site scripting payloads for security testing",
                "keywords": this.keywords.join(", "),
                "license": "https://creativecommons.org/licenses/by-sa/4.0/",
                "creator": {
                    "@type": "Organization",
                    "name": "XSSNow Security Research"
                }
            }
        };

        return pageDataMap[this.pageType];
    }

    // Internal Linking System
    createInternalLinking() {
        // Skip internal linking on homepage to avoid issues
        if (this.pageType !== 'home') {
            this.addAutomaticInternalLinks();
        }
        this.createRelatedContent();
        this.implementBreadcrumbNavigation();
    }

    addAutomaticInternalLinks() {
        const linkPatterns = {
            'XSS payload': '/payloads.html',
            'payload generator': '/xss-payload-generator.html',
            'XSS documentation': '/docs.html',
            'security researchers': '/contributors.html',
            'vulnerability testing': '/docs.html#detection-techniques',
            'bypass techniques': '/docs.html#bypass-techniques',
            'WAF evasion': '/docs.html#waf-bypasses',
            'CSP bypass': '/docs.html#csp-bypasses'
        };

        // Find and link relevant terms in content, but be more selective
        const contentElements = document.querySelectorAll('p:not(.hero-description):not(.footer-text), li:not(.nav-menu li), td');
        contentElements.forEach(element => {
            // Skip if element already has links or is in navigation/footer
            if (element.querySelector('a') || element.closest('.navbar') || element.closest('.footer')) {
                return;
            }

            let html = element.innerHTML;
            let modified = false;

            Object.entries(linkPatterns).forEach(([term, url]) => {
                const regex = new RegExp(`\\b${term}\\b`, 'gi');
                if (regex.test(html)) {
                    html = html.replace(regex, `<a href="${url}" class="auto-link">${term}</a>`);
                    modified = true;
                }
            });

            if (modified) {
                element.innerHTML = html;
            }
        });
    }

    createRelatedContent() {
        const relatedContentMap = {
            home: [
                { title: 'XSS Documentation', url: '/docs.html', description: 'Complete security guide' },
                { title: 'Payload Database', url: '/payloads.html', description: '1000+ XSS vectors' },
                { title: 'Payload Generator', url: '/xss-payload-generator.html', description: 'Custom payload creation' }
            ],
            documentation: [
                { title: 'Try Payload Generator', url: '/xss-payload-generator.html', description: 'Generate custom payloads' },
                { title: 'Browse Payload Database', url: '/payloads.html', description: 'Explore 1000+ payloads' },
                { title: 'Meet Contributors', url: '/contributors.html', description: 'Security research team' }
            ],
            'payload-database': [
                { title: 'Generate Custom Payloads', url: '/xss-payload-generator.html', description: 'Create tailored vectors' },
                { title: 'Learn XSS Techniques', url: '/docs.html', description: 'Complete documentation' },
                { title: 'Contribute Payloads', url: '/contributors.html', description: 'Join the community' }
            ]
        };

        const relatedContent = relatedContentMap[this.pageType];
        if (relatedContent) {
            this.insertRelatedContentSection(relatedContent);
        }
    }

    insertRelatedContentSection(relatedContent) {
        const relatedSection = document.createElement('section');
        relatedSection.className = 'related-content-section';
        relatedSection.innerHTML = `
            <div class="container">
                <h2>🔗 Related Resources</h2>
                <div class="related-content-grid">
                    ${relatedContent.map(item => `
                        <a href="${item.url}" class="related-content-item">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <span class="related-arrow">→</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(relatedSection, footer);
        }
    }

    implementBreadcrumbNavigation() {
        // Create breadcrumb navigation based on current page
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;

        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbContainer.innerHTML = breadcrumbs.map(crumb =>
            `<li><a href="${crumb.url}">${crumb.title}</a></li>`
        ).join('');
    }

    generateBreadcrumbs() {
        const path = window.location.pathname;
        const breadcrumbs = [{ title: 'Home', url: '/' }];

        if (path.includes('payloads')) {
            breadcrumbs.push({ title: 'Payloads', url: '/payloads.html' });
        } else if (path.includes('generator')) {
            breadcrumbs.push({ title: 'Generator', url: '/xss-payload-generator.html' });
        } else if (path.includes('docs')) {
            breadcrumbs.push({ title: 'Documentation', url: '/docs.html' });
        } else if (path.includes('contributors')) {
            breadcrumbs.push({ title: 'Contributors', url: '/contributors.html' });
        }

        return breadcrumbs;
    }

    // Performance Optimization
    optimizePerformance() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.implementServiceWorker();
        this.optimizeWebFonts();
    }

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/css/styles.css',
            '/css/animations.css',
            '/js/app.js',
            '/assets/ninja.svg'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' :
                     resource.endsWith('.js') ? 'script' : 'image';
            document.head.appendChild(link);
        });
    }

    optimizeWebFonts() {
        // Preload critical fonts
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap'
        ];

        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = font;
            link.as = 'style';
            link.onload = () => {
                link.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
    }

    deferNonCriticalJS() {
        // Defer non-critical JavaScript
        const nonCriticalScripts = [
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js',
            'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js'
        ];

        nonCriticalScripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            document.head.appendChild(script);
        });
    }

    // Analytics and Performance Monitoring
    setupAnalytics() {
        // Performance monitoring
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        this.trackPagePerformance(entry);
                    }
                }
            });
            observer.observe({ entryTypes: ['navigation'] });
        }

        // Core Web Vitals tracking
        this.trackCoreWebVitals();
    }

    trackCoreWebVitals() {
        // Track LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Track FID (First Input Delay)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                });
            }).observe({ entryTypes: ['first-input'] });

            // Track CLS (Cumulative Layout Shift)
            new PerformanceObserver((entryList) => {
                let cls = 0;
                entryList.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        cls += entry.value;
                    }
                });
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Sitemap Generation
    generateSitemap() {
        const pages = [
            { url: '/', priority: 1.0, changefreq: 'weekly' },
            { url: '/docs.html', priority: 0.9, changefreq: 'monthly' },
            { url: '/payloads.html', priority: 0.8, changefreq: 'weekly' },
            { url: '/xss-payload-generator.html', priority: 0.7, changefreq: 'monthly' },
            { url: '/contributors.html', priority: 0.6, changefreq: 'monthly' }
        ];

        const sitemap = this.createXMLSitemap(pages);
        this.storeSitemap(sitemap);
    }

    createXMLSitemap(pages) {
        const now = new Date().toISOString().split('T')[0];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        pages.forEach(page => {
            sitemap += `
    <url>
        <loc>${this.baseUrl}${page.url}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`;
        });

        sitemap += `
</urlset>`;

        return sitemap;
    }

    // Breadcrumb Implementation
    implementBreadcrumbs() {
        const breadcrumbData = this.generateBreadcrumbData();
        if (breadcrumbData.length > 1) {
            this.insertBreadcrumbs(breadcrumbData);
        }
    }

    generateBreadcrumbData() {
        const pathSegments = this.currentPath.split('/').filter(segment => segment);
        const breadcrumbs = [{ name: 'Home', url: '/' }];

        const pageNames = {
            'docs.html': 'Documentation',
            'payloads.html': 'Payload Database',
            'xss-payload-generator.html': 'Payload Generator',
            'contributors.html': 'Contributors'
        };

        pathSegments.forEach(segment => {
            if (pageNames[segment]) {
                breadcrumbs.push({
                    name: pageNames[segment],
                    url: `/${segment}`
                });
            }
        });

        return breadcrumbs;
    }

    insertBreadcrumbs(breadcrumbData) {
        const breadcrumbNav = document.createElement('nav');
        breadcrumbNav.className = 'breadcrumb-nav';
        breadcrumbNav.innerHTML = `
            <div class="container">
                <ol class="breadcrumb">
                    ${breadcrumbData.map((item, index) => `
                        <li class="breadcrumb-item${index === breadcrumbData.length - 1 ? ' active' : ''}">
                            ${index === breadcrumbData.length - 1
                                ? item.name
                                : `<a href="${item.url}">${item.name}</a>`
                            }
                        </li>
                    `).join('')}
                </ol>
            </div>
        `;

        // Insert after navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.parentNode.insertBefore(breadcrumbNav, navbar.nextSibling);
        }
    }

    // Utility Methods
    setMetaTag(name, content) {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    setMetaProperty(property, content) {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    setMetaName(name, content) {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            document.head.appendChild(tag);
        }
        tag.content = content;
    }

    setLinkTag(rel, href, crossorigin = null) {
        let tag = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
        if (!tag) {
            tag = document.createElement('link');
            tag.rel = rel;
            tag.href = href;
            if (crossorigin) tag.crossOrigin = crossorigin;
            document.head.appendChild(tag);
        }
    }

    analyzeContentStructure() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headings.map(heading => ({
            level: parseInt(heading.tagName.charAt(1)),
            text: heading.textContent.trim(),
            id: heading.id || this.generateId(heading.textContent)
        }));
    }

    generateId(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    trackPagePerformance(entry) {
        const metrics = {
            page: this.currentPath,
            loadTime: entry.loadEventEnd - entry.loadEventStart,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            firstByte: entry.responseStart - entry.requestStart,
            totalTime: entry.loadEventEnd - entry.navigationStart
        };

    }

    storeSitemap(sitemap) {
        // Store in localStorage for development
        localStorage.setItem('sitemap', sitemap);
    }

    implementServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    }

    minifyAndCompressAssets() {
        // This would typically be done at build time
        // For runtime optimization, we can implement resource hints
        const resourceHints = [
            { rel: 'preload', href: '/css/styles.css', as: 'style' },
            { rel: 'preload', href: '/js/app.js', as: 'script' },
            { rel: 'prefetch', href: '/payloads.html' },
            { rel: 'prefetch', href: '/docs.html' }
        ];

        resourceHints.forEach(hint => {
            const link = document.createElement('link');
            Object.entries(hint).forEach(([key, value]) => {
                link.setAttribute(key, value);
            });
            document.head.appendChild(link);
        });
    }
}

// Initialize SEO Framework
document.addEventListener('DOMContentLoaded', () => {
    window.seoFramework = new SEOFramework();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOFramework;
}