 // Preloader functionality
        document.addEventListener('DOMContentLoaded', function() {
            const preloader = document.getElementById('preloader');
            const mainContent = document.getElementById('main-content');
            const progressBar = document.getElementById('progress-bar');
            const preloaderText = document.getElementById('preloader-text');
            
            const loadingTexts = [
                'Loading your retail solution...',
                'Setting up inventory management...',
                'Preparing QR code scanner...',
                'Connecting to mobile POS...',
                'Almost ready!'
            ];
            
            let progress = 0;
            let textIndex = 0;
            
            // Simulate loading progress
            const loadingInterval = setInterval(() => {
                progress += Math.random() * 15 + 5; // Random increment between 5-20
                
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(loadingInterval);
                    
                    // Hide preloader and show main content
                    setTimeout(() => {
                        preloader.classList.add('hidden');
                        mainContent.classList.add('loaded');
                        
                        // Initialize other animations after preloader is hidden
                        setTimeout(() => {
                            initializeAnimations();
                        }, 500);
                    }, 500);
                }
                
                progressBar.style.width = progress + '%';
                
                // Change loading text
                if (Math.floor(progress / 20) !== textIndex && textIndex < loadingTexts.length - 1) {
                    textIndex = Math.floor(progress / 20);
                    preloaderText.textContent = loadingTexts[textIndex];
                }
            }, 200);
        });

        // Initialize animations after preloader
        function initializeAnimations() {
            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            // Observe all fade-in elements
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(el => observer.observe(el));
        }

        // Redirect function to main.html with different actions
        function redirectToMain(action) {
            // Show preloader again during redirect
            const preloader = document.getElementById('preloader');
            const mainContent = document.getElementById('main-content');
            
            preloader.classList.remove('hidden');
            mainContent.classList.remove('loaded');
            
            // Simulate loading before redirect
            setTimeout(() => {
                const params = new URLSearchParams();
                params.set('action', action);
                window.location.href = `main.html?${params.toString()}`;
            }, 1000);
        }

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });

        // Feature card click effects
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Mobile menu functionality (basic)
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });

        // Add some interactive hover effects
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });

        // Pricing card hover effects
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('featured')) {
                    card.style.borderColor = '#667eea';
                    card.style.borderWidth = '2px';
                    card.style.borderStyle = 'solid';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('featured')) {
                    card.style.border = 'none';
                }
            });
        });