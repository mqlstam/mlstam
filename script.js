// Portfolio JavaScript - Modern Dark Theme with Sidebar Navigation

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupIntersectionObservers();
        this.initializeAnimations();
        this.preserveScrollPosition();
    }

    setupElements() {
        // Core elements
        this.sidebar = document.getElementById('sidebar');
        this.mobileToggle = document.getElementById('mobileMenuToggle');
        this.mainContent = document.querySelector('.main-content');
        this.backToTop = document.getElementById('backToTop');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.themeToggle = document.getElementById('themeToggle');

        // Navigation elements
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');

        // Animation elements
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.fadeElements = document.querySelectorAll('.timeline-item, .education-card, .project-card, .contact-card, .quality-item, .tech-icon');
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Back to top button
        if (this.backToTop) {
            this.backToTop.addEventListener('click', () => this.scrollToTop());
        }

        // Theme toggle (placeholder for future implementation)
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Resize events
        window.addEventListener('resize', () => this.handleResize(), { passive: true });

        // Email links
        this.setupEmailLinks();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.sidebar.classList.toggle('open');

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.sidebar.classList.contains('open') ? 'hidden' : '';
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Close mobile menu if open
            this.sidebar.classList.remove('open');
            this.mobileToggle.classList.remove('active');
            document.body.style.overflow = '';

            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update active nav link
            this.updateActiveNavLink(e.currentTarget);
        }
    }

    updateActiveNavLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    handleScroll() {
        // Throttle scroll events
        if (!this.scrollTicking) {
            requestAnimationFrame(() => {
                this.updateScrollProgress();
                this.updateBackToTopButton();
                this.updateActiveSection();
                this.scrollTicking = false;
            });
            this.scrollTicking = true;
        }
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (this.scrollProgress) {
            // Only show progress bar when user has scrolled
            const progressContainer = document.querySelector('.scroll-progress');
            if (progressContainer) {
                progressContainer.classList.toggle('visible', scrollTop > 50);
            }
            this.scrollProgress.style.width = `${Math.max(0, scrollPercent)}%`;
        }
    }

    updateBackToTopButton() {
        if (this.backToTop) {
            const isVisible = window.pageYOffset > 300;
            this.backToTop.classList.toggle('visible', isVisible);
        }
    }

    updateActiveSection() {
        const scrollPos = window.pageYOffset + 100;

        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Update active nav link
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupIntersectionObservers() {
        // Skill bars animation
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.getAttribute('data-width');

                    setTimeout(() => {
                        skillBar.style.width = `${width}%`;
                    }, 300);

                    skillObserver.unobserve(skillBar);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        this.skillBars.forEach(bar => skillObserver.observe(bar));

        // Fade in animations
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in', 'visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.fadeElements.forEach(element => {
            element.classList.add('fade-in');
            fadeObserver.observe(element);
        });
    }

    initializeAnimations() {
        // Floating elements parallax
        this.setupFloatingElements();

        // Typing effect for hero title
        this.setupTypingEffect();

        // Profile image animation
        this.setupProfileAnimation();
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');

        window.addEventListener('scroll', () => {
            if (!this.floatingTicking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    floatingElements.forEach(element => {
                        const speed = element.getAttribute('data-speed') || 0.5;
                        const yPos = -(scrolled * speed);
                        element.style.transform = `translateY(${yPos}px)`;
                    });

                    this.floatingTicking = false;
                });
                this.floatingTicking = true;
            }
        }, { passive: true });
    }

    setupTypingEffect() {
        const heroTitle = document.querySelector('.hero-title .gradient-text');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #00d4ff';

        let charIndex = 0;
        const typeSpeed = 100;

        const typeWriter = () => {
            if (charIndex < text.length) {
                heroTitle.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    setupProfileAnimation() {
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            profileImg.addEventListener('mouseenter', () => {
                profileImg.style.transform = 'scale(1.05) rotate(5deg)';
            });

            profileImg.addEventListener('mouseleave', () => {
                profileImg.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    }

    setupEmailLinks() {
        // Make email addresses clickable
        const emailElements = document.querySelectorAll('p, span, a');

        emailElements.forEach(element => {
            if (element.textContent.includes('mql.stam@gmail.com')) {
                element.style.cursor = 'pointer';

                element.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'A') {
                        e.preventDefault();
                        window.open('mailto:mql.stam@gmail.com', '_blank');
                    }
                });

                element.addEventListener('mouseenter', () => {
                    if (element.tagName !== 'A') {
                        element.style.color = '#00d4ff';
                        element.style.transition = 'color 0.2s ease';
                    }
                });

                element.addEventListener('mouseleave', () => {
                    if (element.tagName !== 'A') {
                        element.style.color = '';
                    }
                });
            }
        });
    }


    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 968) {
            this.sidebar.classList.remove('open');
            this.mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleKeyboard(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && this.sidebar.classList.contains('open')) {
            this.toggleMobileMenu();
        }
    }

    toggleTheme() {
        // Placeholder for theme switching functionality
        console.log('Theme toggle clicked - future implementation');

        // Add a subtle feedback animation
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    preserveScrollPosition() {
        // Prevent scroll restoration on page refresh
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Always scroll to top on page load/refresh
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
        });

        // Ensure page starts at top
        window.scrollTo(0, 0);
    }
}

// Additional utility functions
class AnimationUtils {
    static createParticles() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #00d4ff;
                border-radius: 50%;
                opacity: 0.3;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;

            heroSection.appendChild(particle);
        }
    }

    static addHoverEffects() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.timeline-content, .education-card, .project-card, .contact-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    static smoothScrollPolyfill() {
        // Smooth scroll polyfill for older browsers
        if (!('scrollBehavior' in document.documentElement.style)) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
            document.head.appendChild(script);
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    static init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

            // Log largest contentful paint
            if ('LargestContentfulPaint' in window) {
                new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
                }).observe({ entryTypes: ['largest-contentful-paint'] });
            }
        });
    }

    static trackInteractions() {
        // Track user interactions
        const interactionElements = document.querySelectorAll('button, a, .nav-link');

        interactionElements.forEach(element => {
            element.addEventListener('click', (e) => {
                console.log(`Interaction: ${e.target.textContent || e.target.className}`);
            });
        });
    }
}

// Error handling
class ErrorHandler {
    static init() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    static init() {
        // Enhance keyboard navigation
        this.enhanceKeyboardNav();

        // Add ARIA labels
        this.addAriaLabels();
    }


    static enhanceKeyboardNav() {
        // Make all interactive elements keyboard accessible
        const interactiveElements = document.querySelectorAll('.tech-icon, .quality-item, .project-card');

        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }

            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    static addAriaLabels() {
        // Add ARIA labels to improve screen reader experience
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-width');
            bar.setAttribute('aria-label', `Skill level: ${percentage}%`);
        });

        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const title = link.getAttribute('title');
            if (title) {
                link.setAttribute('aria-label', title);
            }
        });
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    const app = new PortfolioApp();

    // Initialize utilities
    AnimationUtils.smoothScrollPolyfill();
    AnimationUtils.addHoverEffects();
    AnimationUtils.createParticles();

    // Initialize monitoring and error handling
    PerformanceMonitor.init();
    PerformanceMonitor.trackInteractions();
    ErrorHandler.init();

    // Initialize accessibility enhancements
    AccessibilityEnhancer.init();

    // Set initial theme based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        console.log('User prefers light theme - dark theme override active');
    }

    console.log('🚀 Portfolio initialized successfully!');
});

// Service worker registration for offline capability
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