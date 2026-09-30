/* Focus outline only for keyboard users */
const handleFirstTab = (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');

    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');

  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
};

window.addEventListener('keydown', handleFirstTab);

/* Mobile nav */
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  siteNav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Back to top */
const backToTopButton = document.querySelector('.back-to-top');

const renderBackToTop = (visible) => {
  if (!backToTopButton) return;
  backToTopButton.style.visibility = visible ? 'visible' : 'hidden';
  backToTopButton.style.opacity = visible ? 1 : 0;
  backToTopButton.style.transform = visible ? 'scale(1)' : 'scale(0.6)';
};

window.addEventListener(
  'scroll',
  () => {
    renderBackToTop(window.scrollY > 700);
  },
  { passive: true }
);

/* Restrained scroll reveal */
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add('visible'));
}

/* Active section highlight */
const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
const sections = [...document.querySelectorAll('main section[id]')];

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

/* Footer year */
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Lightbox for content images */
(() => {
  const SELECTOR = '.card__media img, .interest img, .review img, img.about__photo';
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML = '<figure><img alt="" /><figcaption></figcaption></figure>';
  document.body.appendChild(overlay);
  const viewImg = overlay.querySelector('img');
  const viewCap = overlay.querySelector('figcaption');

  const open = (img) => {
    viewImg.src = img.currentSrc || img.src;
    viewImg.alt = img.alt || '';
    viewCap.textContent = img.alt || '';
    viewCap.hidden = !img.alt;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    viewImg.removeAttribute('src');
  };

  document.addEventListener('click', (e) => {
    const img = e.target.closest(SELECTOR);
    if (img) {
      open(img);
      return;
    }
    if (e.target.closest('.lightbox')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
})();
