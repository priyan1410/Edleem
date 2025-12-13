// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const body = document.body;

// Toggle mobile menu
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mobileNav.classList.contains('active');

        if (isActive) {
            // Close menu
            closeMobileMenu();
        } else {
            // Open menu
            mobileNav.classList.add('active');
            mobileNavOverlay.classList.add('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            body.style.overflow = 'hidden';
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
    });
}

// Close menu functions
function closeMobileMenu() {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    body.style.overflow = 'auto';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

// Close menu when clicking overlay
if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking on a link
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav && mobileMenuBtn && !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileNav.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only prevent default if it's an anchor on the CURRENT page
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
             e.preventDefault();
             if (targetId === '#') return;

             const targetElement = document.querySelector(targetId);
             if (targetElement) {
                 // Close mobile menu if open
                 if (mobileNav && mobileNav.classList.contains('active')) {
                     closeMobileMenu();
                 }

                 // Calculate header height for offset
                 const header = document.querySelector('header');
                 const headerHeight = header ? header.offsetHeight : 0;
                 const targetPosition = targetElement.offsetTop - headerHeight;

                 window.scrollTo({
                     top: targetPosition,
                     behavior: 'smooth'
                 });
             }
        }
    });
});

// Course Enquiry Form validation and submission
const enquiryForm = document.getElementById('courseEnquiryForm');
if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const course = document.getElementById('course').value;

        let isValid = true;

        // Name validation
        if (!name) {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        } else if (name.length < 2) {
            document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
            isValid = false;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            document.getElementById('emailError').textContent = 'Email is required';
            isValid = false;
        } else if (!emailPattern.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        // Phone validation
        const phonePattern = /^[0-9]{10}$/;
        if (!phone) {
            document.getElementById('phoneError').textContent = 'Phone number is required';
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            document.getElementById('phoneError').textContent = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        // Course validation
        if (!course) {
            document.getElementById('courseError').textContent = 'Please select a course';
            isValid = false;
        }

        if (isValid) {
            const submitBtn = enquiryForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Thank You! We will contact you shortly.';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
            submitBtn.disabled = true;

            // Reset form
            enquiryForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'var(--gradient-primary)';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}


// Set current year in footer
const yearEl = document.getElementById('copyright-year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// Background transition on scroll
function handleBackgroundTransition() {
    const aboutSection = document.getElementById('about');
    const currentScroll = window.pageYOffset;

    if (aboutSection) {
        const aboutTop = aboutSection.offsetTop - 200;
        const fadeStart = aboutTop;
        const fadeEnd = aboutTop + 400;

        if (currentScroll >= fadeStart && currentScroll <= fadeEnd) {
            const progress = (currentScroll - fadeStart) / (fadeEnd - fadeStart);
            const bgOpacity = Math.max(0, 1 - progress);
            const whiteOpacity = Math.min(0.4, progress);

            document.body.style.setProperty('--bg-opacity', bgOpacity);
            document.body.style.setProperty('--white-overlay-opacity', whiteOpacity);

            if (progress > 0.5) {
                document.body.classList.add('white-bg');
            } else {
                document.body.classList.remove('white-bg');
            }
        } else if (currentScroll > fadeEnd) {
            document.body.style.setProperty('--bg-opacity', '0.1');
            document.body.style.setProperty('--white-overlay-opacity', '0.9');
            document.body.classList.add('white-bg');
        } else {
            document.body.style.setProperty('--bg-opacity', '1');
            document.body.style.setProperty('--white-overlay-opacity', '0');
            document.body.classList.remove('white-bg');
        }
    }
}

// Only run background transition if on home page (where #about exists)
if (document.getElementById('about')) {
    window.addEventListener('scroll', handleBackgroundTransition);
    window.addEventListener('load', handleBackgroundTransition);
    window.addEventListener('resize', handleBackgroundTransition);
    handleBackgroundTransition();
}


// Prevent scrolling when mobile menu is open
document.addEventListener('touchmove', (e) => {
    if (mobileNav && mobileNav.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });


// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.classList.remove('animate-out');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations
initScrollAnimations();

// Active navigation indication on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
    
    if (sections.length === 0) return; // Exit if no sections (like on feedback page)

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset for header height
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.pageYOffset;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        // Only update links that are anchor links to ID
        const href = link.getAttribute('href');
        if (href.startsWith('#') || href.includes('index.html#')) {
            link.classList.remove('active');
            if (href === `#${currentSection}` || href === `index.html#${currentSection}`) {
                link.classList.add('active');
            }
        }
    });
}

// Update active nav link on scroll and load
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}