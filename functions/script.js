document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.getElementById('header');
    
    const desktopThemeBtn = document.getElementById('theme-toggle-btn');
    const mobileThemeSwitch = document.getElementById('mobile-theme-toggle');

    const applyTheme = (theme) => {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(theme);
        localStorage.setItem('theme', theme);
    };

    const updateControls = (theme) => {
        if (mobileThemeSwitch) {
            mobileThemeSwitch.checked = theme === 'dark-mode';
        }
    };

    if (desktopThemeBtn) {
        desktopThemeBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            applyTheme(newTheme);
            updateControls(newTheme);
        });
    }

    if (mobileThemeSwitch) {
        mobileThemeSwitch.addEventListener('change', () => {
            const newTheme = mobileThemeSwitch.checked ? 'dark-mode' : 'light-mode';
            applyTheme(newTheme);
        });
    }
    
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);
    updateControls(savedTheme);

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const navOverlay = document.getElementById('nav-overlay');

    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
        hamburger.setAttribute('aria-expanded', !isExpanded);
    };

    if(hamburger && mobileMenu && navOverlay) {
        hamburger.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', toggleMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    const setActiveLink = () => {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const currentPath = window.location.pathname + window.location.hash;

        navLinks.forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname + new URL(link.href, window.location.origin).hash;
            link.classList.remove('active');

            if (link.getAttribute('href').startsWith('#')) {
                if (link.getAttribute('href') === window.location.hash) {
                    link.classList.add('active');
                }
            } else if ((currentPath === '/' && linkPath === '/') || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
                 link.classList.add('active');
            }
        });
    };
    setActiveLink();
    window.addEventListener('hashchange', setActiveLink);
    
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
    }
    

    window.addEventListener('resize', () => {
        if (window.innerWidth > 820 && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 820) {
                const scrollPosition = window.pageYOffset;
                heroSection.style.backgroundPositionY = scrollPosition * 0.4 + 'px';
            }
        });
    }

    const brandPromiseSection = document.getElementById('brand-promise');
    if (brandPromiseSection) {
        const brandPromiseVisual = brandPromiseSection.querySelector('.promise-visual img');
        if (brandPromiseVisual) {
            const parallaxSpeed = -0.15;
            const handlePromiseParallax = () => {
                const sectionTop = brandPromiseSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (sectionTop < windowHeight && sectionTop > -brandPromiseSection.offsetHeight) {
                    const parallaxOffset = sectionTop * parallaxSpeed;
                    window.requestAnimationFrame(() => {
                        brandPromiseVisual.style.transform = `translateY(${parallaxOffset}px)`;
                    });
                }
            };
            window.addEventListener('scroll', handlePromiseParallax, { passive: true });
        }
    }

    const animatedElements = document.querySelectorAll('.brand-promise, .promise-block, .three-promises-title, .showcase-title, .product-card, .testimonials-section, .invitation-card, .site-footer');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });
        animatedElements.forEach(el => observer.observe(el));
    }

    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (testimonialCards.length > 0) {
        let currentIndex = 1;
        
        function updateCarousel() {
            testimonialCards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next');

                const prevIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
                const nextIndex = (currentIndex + 1) % testimonialCards.length;
                
                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === prevIndex) {
                    card.classList.add('prev');
                } else if (index === nextIndex) {
                    card.classList.add('next');
                }
            });
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
            updateCarousel();
        });
        
        testimonialCards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('next')) {
                    nextBtn.click();
                } else if (card.classList.contains('prev')) {
                    prevBtn.click();
                }
            });
        });

        updateCarousel();
    }
});

// --- Loading Screen Effect ---
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    const body = document.body;

    // Use a timeout to ensure the fade-out transition is visible
    setTimeout(() => {
        if(loader) {
            loader.classList.add('hidden');
        }
        // Only remove the no-scroll class if the mobile menu isn't open
        if (!document.querySelector('.mobile-nav.active')) {
             body.classList.remove('no-scroll');
        }
    }, 500); // A 500ms delay for a smoother experience
});