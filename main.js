/**
 * Excellence Academy - Main JavaScript
 * Ready for Salesforce Marketing Cloud Personalization Integration
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initNavigation();
  initSmoothScroll();
  initHeaderScroll();
  initProgramFilters();
  initTestimonialSlider();
  initCounterAnimation();
  initBackToTop();
  initContactForm();
  initSalesforceMCP();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(navLink => {
          navLink.classList.remove('active');
        });
        this.classList.add('active');

        // Track navigation for Salesforce MCP
        trackEvent('navigation', { section: href.replace('#', '') });
      }
    });
  });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav based on scroll position
    updateActiveNavOnScroll();
    lastScrollY = window.scrollY;
  });
}

/**
 * Update Active Nav Link Based on Scroll Position
 */
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const headerHeight = document.querySelector('.header').offsetHeight;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    const scrollY = window.scrollY;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      const currentId = section.getAttribute('id');
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/**
 * Program Filter Functionality
 */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter cards
      programCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });

      // Track filter interaction for Salesforce MCP
      trackEvent('filter', { category: filter });
    });
  });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;
  let autoPlayInterval;

  function showSlide(index) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    showSlide((currentIndex + 1) % cards.length);
  }

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetAutoPlay();
    });
  });

  // Auto-play
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  if (cards.length > 0) {
    startAutoPlay();
  }
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  const options = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        animateCounter(counter, target);
        observer.unobserve(counter);
      }
    });
  }, options);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  const duration = 2000;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Here you would typically send the data to your server
      console.log('Form submitted:', data);

      // Track form submission for Salesforce MCP
      trackEvent('form_submit', {
        form_type: 'contact',
        program_interest: data.program
      });

      // Show success message (replace with your implementation)
      alert('Thank you for your message! We will get back to you soon.');
      form.reset();
    });
  }
}

/**
 * Salesforce Marketing Cloud Personalization (Interaction Studio) Integration
 * This section provides hooks for MCP integration
 */
function initSalesforceMCP() {
  // Check if Evergage/MCP SDK is loaded
  if (typeof Evergage !== 'undefined') {
    console.log('Salesforce MCP SDK detected');
    
    // Initialize with your configuration
    Evergage.init({
      cookieDomain: window.location.hostname
    }).then(() => {
      console.log('Salesforce MCP initialized');
      
      // Track page view
      trackPageView();
      
      // Set up catalog tracking
      initCatalogTracking();
    });
  } else {
    console.log('Salesforce MCP SDK not loaded - tracking disabled');
  }
}

/**
 * Track Page Views for MCP
 */
function trackPageView() {
  const pageData = {
    page_type: getPageType(),
    page_title: document.title,
    url: window.location.href
  };

  if (typeof Evergage !== 'undefined') {
    Evergage.sendEvent({
      action: 'Page View',
      ...pageData
    });
  }

  console.log('Page View Tracked:', pageData);
}

/**
 * Get Current Page Type
 */
function getPageType() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return 'homepage';
  if (path.includes('program')) return 'program_detail';
  if (path.includes('about')) return 'about';
  if (path.includes('contact')) return 'contact';
  return 'other';
}

/**
 * Initialize Catalog Tracking for Programs
 */
function initCatalogTracking() {
  const programCards = document.querySelectorAll('[data-evg-item-type="program"]');

  programCards.forEach(card => {
    // Track program views
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const programId = card.dataset.evgItemId;
          trackEvent('view_item', {
            item_type: 'program',
            item_id: programId
          });
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(card);

    // Track program clicks
    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('program-link')) {
        trackEvent('click_item', {
          item_type: 'program',
          item_id: card.dataset.evgItemId
        });
      }
    });
  });
}

/**
 * Generic Event Tracking Function
 * Use this to track any custom events for Salesforce MCP
 */
function trackEvent(eventName, eventData = {}) {
  const event = {
    action: eventName,
    timestamp: new Date().toISOString(),
    ...eventData
  };

  // Send to Salesforce MCP if available
  if (typeof Evergage !== 'undefined') {
    Evergage.sendEvent(event);
  }

  // Log for debugging (remove in production)
  console.log('Event Tracked:', event);
}

/**
 * User Identification for MCP
 * Call this when you have user information (e.g., after form submission)
 */
function identifyUser(userData) {
  if (typeof Evergage !== 'undefined') {
    Evergage.sendEvent({
      action: 'Identify',
      user: {
        id: userData.email,
        attributes: {
          email: userData.email,
          name: userData.name,
          programInterest: userData.program
        }
      }
    });
  }

  console.log('User Identified:', userData);
}

// Export functions for global access
window.trackEvent = trackEvent;
window.identifyUser = identifyUser;
