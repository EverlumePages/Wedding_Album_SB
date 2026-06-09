/* ============================================================
   WEDDING MEMORIES — Gallery (gallery.js)
   Masonry layout, filtering, lightbox
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});


/* ---- GALLERY FILTERING ---- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.masonry__item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = '';
          // Trigger re-animation
          item.classList.remove('is-visible');
          requestAnimationFrame(() => {
            item.classList.add('is-visible');
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}


/* ---- LIGHTBOX ---- */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxClose = lightbox.querySelector('.lightbox__close');
  const lightboxPrev = lightbox.querySelector('.lightbox__nav--prev');
  const lightboxNext = lightbox.querySelector('.lightbox__nav--next');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  const lightboxCounter = lightbox.querySelector('.lightbox__counter');

  // Collect all lightbox-triggerable images
  let currentImages = [];
  let currentIndex = 0;

  function getVisibleImages() {
    return Array.from(document.querySelectorAll('[data-lightbox]')).filter(
      el => el.style.display !== 'none' && el.offsetParent !== null
    );
  }

  function openLightbox(index) {
    currentImages = getVisibleImages();
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const el = currentImages[currentIndex];
    const imgSrc = el.getAttribute('data-lightbox');
    const caption = el.getAttribute('data-caption') || '';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = caption;

    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
  }

  // Attach click handlers to all lightbox triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
      const allVisible = getVisibleImages();
      const index = allVisible.indexOf(trigger);
      if (index !== -1) {
        openLightbox(index);
      }
    }
  });

  // Close
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigation
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--open')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  }, { passive: true });
}
