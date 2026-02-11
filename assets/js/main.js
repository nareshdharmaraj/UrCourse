class EducationWebsite {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentDir = localStorage.getItem('direction') || 'ltr';
        this.init();
    }

    init() {
        this.initTheme();
        this.initDirection();
        this.initNavigation();
        this.initMobileMenu();
        this.initActiveLink();
        this.initCounters();
        this.bindEvents();
    }

    // Theme Management
    initTheme() {
        if (this.currentTheme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        this.currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
    }

    // Direction Management
    initDirection() {
        document.documentElement.setAttribute('dir', this.currentDir);
    }

    toggleDirection() {
        this.currentDir = this.currentDir === 'ltr' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', this.currentDir);
        localStorage.setItem('direction', this.currentDir);

        // Update mobile menu position when direction changes
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            const isOpen = mobileMenu.style.transform === 'translateX(0px)';
            if (!isOpen) {
                // Update closed state based on new direction
                if (this.currentDir === 'rtl') {
                    mobileMenu.classList.remove('-translate-x-full');
                    mobileMenu.classList.add('translate-x-full');
                } else {
                    mobileMenu.classList.remove('translate-x-full');
                    mobileMenu.classList.add('-translate-x-full');
                }
            }
            // If menu is open, it stays open with inline style, no action needed
        }
    }

    // Navigation
    initNavigation() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-lg');
                navbar.classList.add('bg-white/90');
                navbar.classList.add('dark:bg-gray-900/90');
            } else {
                navbar.classList.remove('shadow-lg');
                navbar.classList.remove('bg-white/90');
                navbar.classList.remove('dark:bg-gray-900/90');
            }
        });

        // Dropdown functionality for Desktop
        const dropdowns = document.querySelectorAll('.group');
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.absolute');
            if (menu) {
                dropdown.addEventListener('mouseenter', () => {
                    menu.classList.remove('hidden');
                    menu.classList.remove('invisible');
                    setTimeout(() => {
                        menu.classList.remove('opacity-0', 'translate-y-2');
                    }, 10);
                });
                dropdown.addEventListener('mouseleave', () => {
                    menu.classList.add('opacity-0', 'translate-y-2');
                    setTimeout(() => {
                        menu.classList.add('hidden');
                        menu.classList.add('invisible');
                    }, 300);
                });
            }
        });
    }

    initActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#navbar a, #mobile-menu a');
        const dropdownBtns = document.querySelectorAll('.group button, .mobile-dropdown-btn');

        // First, reset all to inactive state
        [...navLinks, ...dropdownBtns].forEach(el => {
            el.classList.remove('text-primary-600', 'dark:text-primary-400');
            el.classList.add('text-gray-600', 'dark:text-gray-300');
        });

        // Highlight matching link and its parents
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === 'index.html' && href === 'index2.html') || (currentPath === 'index2.html' && href === 'index.html')) {
                // Special case for home styles - highlight "Home" dropdown if either index is active
                if (href === currentPath) {
                    link.classList.add('text-primary-600', 'dark:text-primary-400');
                    link.classList.remove('text-gray-600', 'dark:text-gray-300');
                }

                // Desktop dropdown parent
                const dropdown = link.closest('.group');
                if (dropdown) {
                    const btn = dropdown.querySelector('button');
                    if (btn) {
                        btn.classList.add('text-primary-600', 'dark:text-primary-400');
                        btn.classList.remove('text-gray-600', 'dark:text-gray-300');
                    }
                }

                // Mobile dropdown parent
                const mobileDropdownContent = link.closest('div[class*="hidden"]');
                if (mobileDropdownContent) {
                    const mobileBtn = mobileDropdownContent.previousElementSibling;
                    if (mobileBtn && mobileBtn.classList.contains('mobile-dropdown-btn')) {
                        mobileBtn.classList.add('text-primary-600', 'dark:text-primary-400');
                        mobileBtn.classList.remove('text-gray-600', 'dark:text-gray-300');
                    }
                }
            }
        });
    }

    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');

        const openMobileMenu = () => {
            if (mobileMenu) {
                const currentDir = document.documentElement.getAttribute('dir');
                // Remove closed state
                mobileMenu.classList.remove('-translate-x-full', 'translate-x-full');
                // In RTL, menu is on right, so no translation needed (already at right:0)
                // In LTR, menu is on left, so no translation needed (already at left:0)
                // Just remove the hiding transform to show it
                mobileMenu.style.transform = 'translateX(0)';
                document.body.style.overflow = 'hidden';
            }
        };

        const closeMobileMenu = () => {
            if (mobileMenu) {
                const currentDir = document.documentElement.getAttribute('dir');
                // Reset inline style
                mobileMenu.style.transform = '';
                // Add appropriate closed state based on direction
                if (currentDir === 'rtl') {
                    mobileMenu.classList.remove('-translate-x-full');
                    mobileMenu.classList.add('translate-x-full');
                } else {
                    mobileMenu.classList.remove('translate-x-full');
                    mobileMenu.classList.add('-translate-x-full');
                }
                document.body.style.overflow = 'auto';
            }
        };

        const isMobileMenuOpen = () => {
            return mobileMenu && mobileMenu.style.transform === 'translateX(0px)';
        };

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                openMobileMenu();
            });
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                closeMobileMenu();
            });
        }

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (isMobileMenuOpen() &&
                !mobileMenu.contains(e.target) &&
                mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Mobile Dropdowns
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown-btn');
        mobileDropdowns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('.dropdown-icon');

                content.classList.toggle('hidden');
                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
            });
        });
    }

    // Counter Animation
    initCounters() {
        const counters = document.querySelectorAll('.counter');

        const animateCounter = (counter) => {
            const target = parseInt(counter.innerText);
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        };

        // Use Intersection Observer to trigger animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target.querySelector('.counter');
                    if (counter) {
                        animateCounter(counter);
                        observer.unobserve(entry.target);
                    }
                }
            });
        });

        const counterParents = document.querySelectorAll('.counter').forEach(el => {
            observer.observe(el.parentElement);
        });
    }

    // Event Binding
    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        const directionToggle = document.getElementById('direction-toggle');
        if (directionToggle) {
            directionToggle.addEventListener('click', () => this.toggleDirection());
        }

        const mobileDirectionToggle = document.getElementById('mobile-direction-toggle');
        if (mobileDirectionToggle) {
            mobileDirectionToggle.addEventListener('click', () => this.toggleDirection());
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.educationWebsite = new EducationWebsite();
});