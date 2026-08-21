/* ========================================
   PORTFOLIO - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Menú Hamburguesa ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- Tabs de Galería ---
  const galeriaTabs = document.querySelectorAll('.galeria__tab');
  const galeriaPanels = document.querySelectorAll('.galeria__panel');

  galeriaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galeriaTabs.forEach(t => t.classList.remove('active'));
      galeriaPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // --- Subtabs (Años) ---
  const subtabs = document.querySelectorAll('.subtab');

  subtabs.forEach(subtab => {
    subtab.addEventListener('click', () => {
      const panel = subtab.closest('.galeria__panel');
      panel.querySelectorAll('.subtab').forEach(s => s.classList.remove('active'));
      panel.querySelectorAll('.galeria__subpanel').forEach(sp => sp.classList.remove('active'));
      subtab.classList.add('active');
      document.getElementById(`subpanel-${subtab.dataset.subtab}`).classList.add('active');
    });
  });

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return Array.from(document.querySelectorAll('.galeria__item')).filter(item => !item.classList.contains('hidden'));
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const img = visibleItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }

  document.querySelectorAll('.galeria__item').forEach((item) => {
    item.addEventListener('click', () => {
      const visibleIndex = getVisibleItems().indexOf(item);
      openLightbox(visibleIndex);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextImage);
  lightboxPrev.addEventListener('click', prevImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // --- Masonry.js + imagesLoaded Gallery ---
  let msnry;

  function getColumns() {
    const w = window.innerWidth;
    if (w <= 360) return 1;
    if (w <= 480) return 2;
    if (w <= 768) return 3;
    return 4;
  }

  function initMasonry() {
    const grid = document.querySelector('.galeria__panel.active .galeria__subpanel.active .galeria__grid');
    if (!grid) return;
    if (msnry) msnry.destroy();
    const cols = getColumns();
    const gridWidth = grid.getBoundingClientRect().width;
    const gutter = 12;
    const colW = (gridWidth - gutter * (cols - 1)) / cols;
    msnry = new Masonry(grid, {
      itemSelector: '.galeria__item',
      columnWidth: colW,
      gutter: gutter,
      percentPosition: false,
      transitionDuration: '0.2s'
    });
    imagesLoaded(grid, () => {
      msnry.reloadItems();
      msnry.layout();
    });
  }

  window.addEventListener('load', () => {
    initMasonry();
    setTimeout(initMasonry, 500);
  });

  // Re-init on tab/subtab change
  document.querySelectorAll('.galeria__tab, .subtab').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(initMasonry, 100);
      setTimeout(initMasonry, 500);
    });
  });

  // Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMasonry, 200);
  });

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // --- Carrusel de Comisiones ---
  const comTrack = document.getElementById('com-track');
  const comPrev = document.getElementById('com-prev');
  const comNext = document.getElementById('com-next');
  const comDots = document.getElementById('com-dots');

  if (comTrack) {
    const comSlides = comTrack.querySelectorAll('.carousel__slide');
    let comIndex = 0;

    // Crear dots
    comSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { comIndex = i; updateComCarousel(); });
      comDots.appendChild(dot);
    });

    function updateComCarousel() {
      comTrack.style.transform = `translateX(-${comIndex * 100}%)`;
      comDots.querySelectorAll('.carousel__dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === comIndex);
      });
    }

    comNext.addEventListener('click', () => {
      comIndex = (comIndex + 1) % comSlides.length;
      updateComCarousel();
    });

    comPrev.addEventListener('click', () => {
      comIndex = (comIndex - 1 + comSlides.length) % comSlides.length;
      updateComCarousel();
    });

    // Auto-play cada 5 segundos
    let comAutoPlay = setInterval(() => {
      comIndex = (comIndex + 1) % comSlides.length;
      updateComCarousel();
    }, 5000);

    // Pausar al hover
    comTrack.closest('.carousel').addEventListener('mouseenter', () => clearInterval(comAutoPlay));
    comTrack.closest('.carousel').addEventListener('mouseleave', () => {
      comAutoPlay = setInterval(() => {
        comIndex = (comIndex + 1) % comSlides.length;
        updateComCarousel();
      }, 5000);
    });
  }

  // --- Music Player ---
  const playlist = [
    'audio/Alien Stage full instrumentals [Updated Version].mp3',
    'audio/Persona 3 Reload - All Vocal songs (Lyrics).mp3',
    'audio/playlist to read nana  nana 707 all ost.mp3'
  ];

  let currentTrack = 0;
  let isPlaying = false;
  const audio = new Audio(playlist[0]);
  audio.loop = true;

  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const musicPrev = document.getElementById('music-prev');
  const musicNext = document.getElementById('music-next');
  const musicTrack = document.getElementById('music-track');

  function updateTrackDisplay() {
    musicTrack.textContent = `${currentTrack + 1} / ${playlist.length}`;
  }

  function playMusic() {
    audio.play().then(() => {
      isPlaying = true;
      musicIcon.classList.remove('fa-volume-high', 'fa-volume-xmark');
      musicIcon.classList.add('fa-volume-high');
    }).catch(() => {
      isPlaying = false;
      musicIcon.classList.remove('fa-volume-high');
      musicIcon.classList.add('fa-volume-xmark');
    });
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    musicIcon.classList.remove('fa-volume-high');
    musicIcon.classList.add('fa-volume-xmark');
  }

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  musicPrev.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    audio.src = playlist[currentTrack];
    updateTrackDisplay();
    if (isPlaying) playMusic();
  });

  musicNext.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    audio.src = playlist[currentTrack];
    updateTrackDisplay();
    if (isPlaying) playMusic();
  });

  audio.addEventListener('ended', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    audio.src = playlist[currentTrack];
    updateTrackDisplay();
    playMusic();
  });

  updateTrackDisplay();

  // Auto-play on page load
  audio.volume = 0.5;
  audio.play().then(() => {
    isPlaying = true;
    musicIcon.classList.remove('fa-volume-xmark');
    musicIcon.classList.add('fa-volume-high');
  }).catch(() => {
    isPlaying = false;
    musicIcon.classList.remove('fa-volume-high');
    musicIcon.classList.add('fa-volume-xmark');
  });

  // --- Animación fade-in para galería ---
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

});