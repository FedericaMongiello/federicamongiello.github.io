document.addEventListener('DOMContentLoaded', () => {
  const header          = document.querySelector('.header');
  const headerContainer = document.querySelector('.header-container');
  const nav             = document.getElementById('siteNav');
  const navToggle       = document.querySelector('.nav-toggle');
  const navLinks        = nav ? nav.querySelectorAll('a') : [];
  const underline       = document.querySelector('.nav-underline');

  /* 1) Hamburger menu mobile */
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
    navLinks.forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('show'));
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('show');
      }
    });
  }

  /* 2) Header glass con opacità graduale allo scroll */
  const onScrollHeader = () => {
    if (!header) return;
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      const opacity = Math.min(0.15 + scrollY / 300, 0.45);
      header.style.background = `rgba(255,255,255,${opacity})`;
    }
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* 3) Barra underline (a pelo del container header) */
  const moveUnderlineTo = (el) => {
    if (!underline || !headerContainer || !el) return;
    const cRect = headerContainer.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    underline.style.left = `${r.left - cRect.left}px`;
    underline.style.width = `${r.width}px`;
    underline.style.opacity = '1';
  };
  const hideUnderline = () => {
    if (!underline) return;
    underline.style.opacity = '0';
    underline.style.width = '0';
  };
  const getActiveLink = () => [...navLinks].find(l => l.classList.contains('active')) || null;
  const updateUnderlineToActive = () => {
    const active = getActiveLink();
    active ? moveUnderlineTo(active) : hideUnderline();
  };

  if (nav && underline && navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => moveUnderlineTo(link));
      link.addEventListener('focus',      () => moveUnderlineTo(link));
    });
    headerContainer.addEventListener('mouseleave', updateUnderlineToActive);
    nav.addEventListener('focusout', (e) => {
      if (!nav.contains(e.relatedTarget)) updateUnderlineToActive();
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 769px)').matches) updateUnderlineToActive();
      else hideUnderline();
    });
  }

  /* 4) Riallineamenti su load/font */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (window.matchMedia('(min-width: 769px)').matches) updateUnderlineToActive();
    });
  }
  window.addEventListener('load', () => {
    if (window.matchMedia('(min-width: 769px)').matches) updateUnderlineToActive();
  });
});

