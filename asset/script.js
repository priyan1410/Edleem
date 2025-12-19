// Function to reset cookies whenever the user opens the site
function resetAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    });
}

// Reset cookies when the DOM is ready, which is effectively when the user opens the site
document.addEventListener('DOMContentLoaded', resetAllCookies);

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
    enquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });

        // Hide form message
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
        }

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const course = document.getElementById('course').value;
        const department = document.getElementById('department').value.trim();
        const year = document.getElementById('year').value;
        const college = document.getElementById('college').value.trim();
        const state = document.getElementById('state').value.trim();
        const submitBtn = document.querySelector('.submit-btn') || enquiryForm.querySelector('button[type="submit"]');

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

        // Department validation
        if (!department) {
            document.getElementById('departmentError').textContent = 'Department is required';
            isValid = false;
        } else if (department.length < 2) {
            document.getElementById('departmentError').textContent = 'Department must be at least 2 characters';
            isValid = false;
        }

        // Year validation
        if (!year) {
            document.getElementById('yearError').textContent = 'Please select your year';
            isValid = false;
        }

        // College validation (optional, but if provided, minimum length)
        if (college && college.length < 2) {
            document.getElementById('collegeError').textContent = 'College name must be at least 2 characters';
            isValid = false;
        }

        // State validation
        if (!state) {
            document.getElementById('stateError').textContent = 'State is required';
            isValid = false;
        } else if (state.length < 2) {
            document.getElementById('stateError').textContent = 'State must be at least 2 characters';
            isValid = false;
        }

        if (isValid) {
            // Save original button text
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            submitBtn.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';

            try {
                // URLs for both PHP and Google Sheets
                const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxeIQxKaopSZEBiIX4V78lon9ZxAgp2FsUKpxtu6e9IIHtzxJDaHw52PH7U0rnlxybe/exec';

                // Get course name from selected option
                const courseSelect = document.getElementById('course');
                const courseName = courseSelect.options[courseSelect.selectedIndex].text;

                // Prepare form data for Google Sheets
                const sheetFormData = new URLSearchParams();
                sheetFormData.append('name', name);
                sheetFormData.append('email', email);
                sheetFormData.append('phone', phone);
                sheetFormData.append('course', courseName);
                sheetFormData.append('department', department);
                sheetFormData.append('year', year);
                sheetFormData.append('college', college);
                sheetFormData.append('state', state);
                sheetFormData.append('timestamp', new Date().toISOString());

                // Prepare form data for PHP script
                const phpFormData = new FormData();
                phpFormData.append('name', name);
                phpFormData.append('email', email);
                phpFormData.append('phone', phone);
                phpFormData.append('course', courseName);
                phpFormData.append('department', department);
                phpFormData.append('year', year);
                phpFormData.append('college', college);
                phpFormData.append('state', state);

                // Send data to Google Sheets
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: sheetFormData
                });

                // Send data to Python email server
                const pythonResponse = await fetch('http://localhost:5000/send_email', {
                    method: 'POST',
                    body: phpFormData // No Content-Type header needed for FormData
                });

                if (!pythonResponse.ok) {
                    const errorData = await pythonResponse.json();
                    throw new Error(errorData.message || 'Python email server failed');
                }

                const pythonResult = await pythonResponse.json();
                console.log(pythonResult.message);
                // Reset form
                enquiryForm.reset();

                // Change button to green with "Submitted" text
                submitBtn.innerHTML = 'Submitted';
                submitBtn.style.background = 'green';
                submitBtn.disabled = true;

                // Reset button after 2 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = 'var(--gradient-primary)';
                    submitBtn.disabled = false;
                }, 2000);

            } catch (error) {
                console.error('Form submission error:', error);

                // Even on error, we can say it was submitted to avoid user confusion,
                // as the Google Sheet part might have succeeded.
                enquiryForm.reset();

                // Change button to green with "Submitted" text
                submitBtn.innerHTML = 'Submitted';
                submitBtn.style.background = 'green';
                submitBtn.disabled = true;

                // Reset button after 2 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = 'var(--gradient-primary)';
                    submitBtn.disabled = false;
                }, 2000);
            }
        }
    });
}

// Helper function to show form messages
function showFormMessage(message, type) {
    // Create message element if it doesn't exist
    let formMessage = document.getElementById('formMessage');

    if (!formMessage) {
        formMessage = document.createElement('div');
        formMessage.id = 'formMessage';
        formMessage.className = 'form-message';
        enquiryForm.insertBefore(formMessage, enquiryForm.firstChild);
    }

    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

// Resume ticker animation on scroll and collapse expanded cards
window.addEventListener('scroll', () => {
    const track = document.getElementById('ticker-track');
    if (track) {
        track.style.animationPlayState = 'running';
    }

    // Collapse any expanded cards when scrolling
    const expandedCards = document.querySelectorAll('.testimonial-card .feedback-text.expanded');
    expandedCards.forEach(feedbackText => {
        const card = feedbackText.closest('.testimonial-card');
        const readMoreBtn = card.querySelector('.read-more-btn');

        // Get the truncated text from the data attribute or calculate it
        const fullText = feedbackText.getAttribute('data-full-text');
        const truncatedText = fullText ? fullText.substring(0, 150) + '...' : feedbackText.textContent.substring(1, 151) + '...';

        feedbackText.textContent = `"${truncatedText}"`;
        feedbackText.classList.remove('expanded');
        if (readMoreBtn) readMoreBtn.textContent = 'Read More';
    });
});

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
document.addEventListener('DOMContentLoaded', () => {
    const testimonials = [
        {
            feedback: "I got an opportunity to do internship in humeen. This opportunity made me to improve my knowledge and skills in the field of web development. I am very much gratitude to you and your organization. I hope I completed my project at my best of my knowledge. So thank you to Edlim and thank you to humeen. Thank you.",
            name: "S.Atshaya",
            department: "B.Tech IT",
            institution: "SRM Valliammai Engineering College"
        },
        {
            feedback: "I got an offer later for internship at your company Humeen and I was completed my project that you was given and thanks for the opportunity for doing internship at your company and thanks to the Edleem and Humeen.",
            name: "M.Anitha",
            department: "B.Tech IT",
            institution: "SRM Valliammai Engineering College"
        },
        {
            feedback: "I sincerely thank Edleem and Humeen for giving me this internship opportunity in the field of cyber security. During this internship I have completed my project which helped me to gain practical experience and better understanding of cyber security concept and I'm grateful for this opportunity. Thank you.",
            name: "A.Durga",
            department: "B.Tech IT",
            institution: "SRM Valliammai Engineering College"
        },
        {
            feedback: "When I was looking for an internship in data analytics domain Untitled subtitle where I can leverage my skills and gain more skills in the field of data. Analytics from your organisation and I have successfully completed my internship by completing an analytical project to the best of my ability. Thank you for providing this intenship opportunity to Edleem and Humeen. And feel grateful for this opportunity.",
            name: "D.Kanishk",
            department: "B.Tech IT",
            institution: "SRM Valliammai Engineering College"
        },
        {
            feedback: "I'm doing my internship at Humeen as a data analyst. During this internship, I got the chance to explore various data analysis tasks, which helped me to understand how works are done in real-world environment. I have completed my project, hope I have done it in a good way. The experience was really valuable and helped me to learn things in a simple and clear way. I'm very grateful for Humeen for providing me this wonderful opportunity, Thank you.",
            name: "J.Hemasri",
            department: "B.Tech IT",
            institution: "SRM Valliammai Engineering College"
        }
    ];

    const track = document.getElementById('ticker-track');

    function createCard(data) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';

        // Truncate feedback text to 150 characters
        const maxLength = 150;
        const isTruncated = data.feedback.length > maxLength;
        const truncatedText = isTruncated ? data.feedback.substring(0, maxLength) + '...' : data.feedback;

        card.innerHTML = `
                    <div class="card-header">
                        <i data-lucide="quote" class="quote-icon" width="24" height="24"></i>
                        <p class="feedback-text" data-full-text="${data.feedback.replace(/"/g, '"')}">"${truncatedText}"</p>
                        ${isTruncated ? '<span class="read-more-text">Read More</span>' : ''}
                    </div>
                    <div class="card-footer">
                        <span class="student-name">${data.name}</span>
                        <span class="student-info">${data.department}, ${data.institution}</span>
                    </div>
                `;

        // Add event listener for Read More text
        if (isTruncated) {
            const readMoreText = card.querySelector('.read-more-text');
            const feedbackText = card.querySelector('.feedback-text');
            const track = document.getElementById('ticker-track');

            readMoreText.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = feedbackText.classList.contains('expanded');
                if (isExpanded) {
                    feedbackText.textContent = `"${truncatedText}"`;
                    feedbackText.classList.remove('expanded');
                    readMoreText.textContent = 'Read More';
                    if (track) track.style.animationPlayState = 'running';
                } else {
                    feedbackText.textContent = `"${data.feedback}"`;
                    feedbackText.classList.add('expanded');
                    readMoreText.textContent = 'Read Less';
                    if (track) track.style.animationPlayState = 'paused';
                }
            });
        }

        return card;
    }

    if (track) {
        // Original set - Focusable for keyboard users
        testimonials.forEach(item => {
            const card = createCard(item);
            card.setAttribute('tabindex', '0');
            track.appendChild(card);
        });

        // Duplicate set for infinite scroll - Hidden from screen readers
        testimonials.forEach(item => {
            const card = createCard(item);
            card.setAttribute('aria-hidden', 'true');
            track.appendChild(card);
        });

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Add global click listener to collapse expanded cards when clicking outside
    document.addEventListener('click', (e) => {
        const expandedCards = document.querySelectorAll('.testimonial-card .feedback-text.expanded');
        expandedCards.forEach(feedbackText => {
            const card = feedbackText.closest('.testimonial-card');
            const readMoreBtn = card.querySelector('.read-more-btn');
            const track = document.getElementById('ticker-track');

            // Check if click is outside the card
            if (!card.contains(e.target)) {
                const truncatedText = feedbackText.textContent.substring(1, feedbackText.textContent.length - 1).substring(0, 150) + '...';
                feedbackText.textContent = `"${truncatedText}"`;
                feedbackText.classList.remove('expanded');
                if (readMoreBtn) readMoreBtn.textContent = 'Read More';
                if (track) track.style.animationPlayState = 'running';
            }
        });
    });
});
