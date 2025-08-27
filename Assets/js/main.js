document.addEventListener('DOMContentLoaded', () => {
  const header          = document.querySelector('.header');
  const headerContainer = document.querySelector('.header-container');
  const nav             = document.getElementById('siteNav');
  const navToggle       = document.querySelector('.nav-toggle');
  const underline       = document.querySelector('.nav-underline');
  const navLinks        = nav ? nav.querySelectorAll('a[data-section]') : [];

  /* 1) Hamburger menu */
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('show'));
    nav.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => nav.classList.remove('show'))
    );
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) nav.classList.remove('show');
    });
  }

  /* 2) Header: ombra allo scroll */
  const onScrollHeader = () => {
    if (window.scrollY > 50) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* 3) Underline utilities */
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
  const isDesktop = () => window.matchMedia('(min-width: 769px)').matches;

  /* 4) Active state management via IntersectionObserver */
  const sections = document.querySelectorAll('[data-observe]');
  const linkBySection = {};
  navLinks.forEach((a) => { linkBySection[a.dataset.section] = a; });

  const setActive = (hash) => {
    nav?.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    const link = linkBySection[hash];
    if (link) {
      link.classList.add('active');
      if (isDesktop()) moveUnderlineTo(link);
    } else if (isDesktop()) hideUnderline();
  };

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      // il section più visibile diventa attivo
      const vis = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis) setActive(`#${vis.target.id}`);
    }, { threshold: [0.4, 0.6] });
    sections.forEach(s => io.observe(s));
  }

  // Hover/focus gestiscono underline ma non toccano .active
  if (nav && underline) {
    nav.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a');
      if (t && isDesktop()) moveUnderlineTo(t);
    });
    nav.addEventListener('focusin', (e) => {
      const t = e.target.closest('a');
      if (t && isDesktop()) moveUnderlineTo(t);
    });
    headerContainer.addEventListener('mouseleave', () => {
      const current = nav.querySelector('a.active');
      if (isDesktop()) current ? moveUnderlineTo(current) : hideUnderline();
    });
    window.addEventListener('resize', () => {
      if (!isDesktop()) hideUnderline();
      else {
        const current = nav.querySelector('a.active');
        current ? moveUnderlineTo(current) : hideUnderline();
      }
    });
  }

  /* 5) Copy email (a11y-friendly) */
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    const defaultLabel = 'Copia la mia email';
    const doneLabel = 'Copiata ✓';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('federica.mongiello16@gmail.com');
        const span = copyBtn.querySelector('span');
        if (span) span.textContent = doneLabel;
        setTimeout(() => { if (span) span.textContent = defaultLabel; }, 1800);
      } catch (e) { console.warn('Clipboard blocked', e); }
    });
  }

  /* 6) Logo badge: tap mobile per aprire */
  const logoBadge = document.querySelector('.logo-badge');
  if (logoBadge) {
    logoBadge.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        if (!logoBadge.classList.contains('open')) {
          e.preventDefault();
          logoBadge.classList.add('open');
        }
      }
    });
  }
});
