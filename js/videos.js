/* ============================================================
   WEDDING MEMORIES — Video Player (videos.js)
   Video playback, modal, and controls
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFeaturedVideo();
  initVideoCards();
  initVideoModal();
});


/* ---- FEATURED VIDEO ---- */
function initFeaturedVideo() {
  const player = document.querySelector('.featured-video__player');
  if (!player) return;

  const video = player.querySelector('video');
  const playBtn = player.querySelector('.featured-video__play-btn');

  if (!video || !playBtn) return;

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playBtn.classList.add('is-hidden');
    }
  });

  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playBtn.classList.add('is-hidden');
    } else {
      video.pause();
      playBtn.classList.remove('is-hidden');
    }
  });

  video.addEventListener('ended', () => {
    playBtn.classList.remove('is-hidden');
    video.currentTime = 0;
  });
}


/* ---- VIDEO CARDS — HOVER PREVIEW ---- */
function initVideoCards() {
  const videoCards = document.querySelectorAll('.video-card');

  videoCards.forEach(card => {
    const thumbnail = card.querySelector('.video-card__thumbnail video');
    if (!thumbnail) return;

    let hoverTimeout;

    card.addEventListener('mouseenter', () => {
      hoverTimeout = setTimeout(() => {
        thumbnail.play().catch(() => {}); // Ignore autoplay errors
      }, 400);
    });

    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      thumbnail.pause();
      thumbnail.currentTime = 0;
    });
  });
}


/* ---- VIDEO MODAL ---- */
function initVideoModal() {
  const modal = document.querySelector('.video-modal');
  if (!modal) return;

  const modalVideo = modal.querySelector('video');
  const closeBtn = modal.querySelector('.video-modal__close');

  // A second host used as a fallback. If a card's primary URL is blocked or
  // unreachable, the browser automatically tries this one so the clip still plays.
  const FALLBACK_SRC = 'https://videos.pexels.com/video-files/19366393/19366393-hd_1920_1080_25fps.mp4';

  function openModal(videoSrc) {
    if (modalVideo) {
      // Rebuild the source list each time, with a fallback on a different host.
      modalVideo.innerHTML = '';
      const sources = videoSrc && videoSrc !== FALLBACK_SRC
        ? [videoSrc, FALLBACK_SRC]
        : [FALLBACK_SRC];
      sources.forEach(src => {
        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        modalVideo.appendChild(source);
      });
      modalVideo.load();
      modalVideo.play().catch(() => {});
    }
    modal.classList.add('video-modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('video-modal--open');
    document.body.style.overflow = '';
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.innerHTML = '';
      modalVideo.load();
    }
  }

  // Open modal on video card click
  document.querySelectorAll('[data-video-src]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-video-src');
      openModal(src);
    });
  });

  // Close
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('video-modal--open')) {
      closeModal();
    }
  });
}
