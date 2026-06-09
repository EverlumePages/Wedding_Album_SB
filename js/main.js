/* ============================================================
   WEDDING MEMORIES — Main JavaScript (main.js)
   Navigation, scroll handling, shared functionality
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initParallax();
  initScrollIndicator();
  initSmoothScroll();
});

/* ---- NAVIGATION ---- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileOverlay = document.querySelector('.nav__mobile-overlay');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!nav) return;

  // Scroll-based nav style
  let lastScroll = 0;
  const navThreshold = 80;

  function updateNav() {
    const scrollY = window.scrollY;

    if (scrollY > navThreshold) {
      nav.classList.remove('nav--transparent');
      nav.classList.add('nav--solid');
    } else {
      nav.classList.add('nav--transparent');
      nav.classList.remove('nav--solid');
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateNav);
  });

  // Initial state
  updateNav();

  // Hamburger toggle
  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('nav__hamburger--open');
      mobileOverlay.classList.toggle('nav__mobile-overlay--open');
      document.body.style.overflow = mobileOverlay.classList.contains('nav__mobile-overlay--open') ? 'hidden' : '';
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('nav__hamburger--open');
        mobileOverlay.classList.remove('nav__mobile-overlay--open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('nav__mobile-overlay--open')) {
        hamburger.classList.remove('nav__hamburger--open');
        mobileOverlay.classList.remove('nav__mobile-overlay--open');
        document.body.style.overflow = '';
      }
    });
  }
}


/* ---- PARALLAX ---- */
function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  const parallaxDividers = document.querySelectorAll('.parallax-divider__img');

  if (!heroBg && parallaxDividers.length === 0) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    if (heroBg) {
      const speed = 0.4;
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * speed}px)`;
    }

    parallaxDividers.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 80;
        img.style.transform = `translateY(${offset}px)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}


/* ---- SCROLL INDICATOR ---- */
function initScrollIndicator() {
  const scrollBtn = document.querySelector('.hero__scroll');
  if (!scrollBtn) return;

  scrollBtn.addEventListener('click', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      const nextSection = hero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}


/* ---- SMOOTH SCROLL ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
