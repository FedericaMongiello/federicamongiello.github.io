document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio pronto!');
  
    /* ======================
     * 0) Selettori di base
     * ====================== */
    const header          = document.querySelector('.header');
    const headerContainer = document.querySelector('.header-container');
    const nav             = document.getElementById('siteNav');          // <nav id="siteNav" class="nav">
    const navToggle       = document.querySelector('.nav-toggle');       // bottone hamburger
    const navLinks        = nav ? nav.querySelectorAll('a') : [];
    const underline       = document.querySelector('.nav-underline');    // <span class="nav-underline"></span>
  
    /* ======================
     * 1) Animazione card (fade-in su scroll)
     * ====================== */
    const cards = document.querySelectorAll('.card');
    if ('IntersectionObserver' in window && cards.length) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('fade-in'); });
      }, { threshold: 0.1 });
      cards.forEach((c) => cardObserver.observe(c));
    }
  
    /* ======================
     * 2) Hamburger menu mobile
     * ====================== */
    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
      });
  
      // Chiudi menu quando clicchi un link o fuori
      navLinks.forEach((link) => {
        link.addEventListener('click', () => nav.classList.remove('show'));
      });
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) nav.classList.remove('show');
      });
    }
  
    /* ======================
     * 3) Header "scrolled" dopo 50px
     * ====================== */
    const onScrollHeader = () => {
      if (!header) return;
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  
    /* ======================
     * 4) Barra underline allineata al fondo header (hover/active)
     *    - Nessun glow, testo link invariato in hover
     * ====================== */
    const moveUnderlineTo = (el) => {
      if (!underline || !headerContainer || !el) return;
      const cRect = headerContainer.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const left = r.left - cRect.left;
      underline.style.left   = `${left}px`;
      underline.style.width  = `${r.width}px`;
      underline.style.opacity = '1';
    };
    const hideUnderline = () => {
      if (!underline) return;
      underline.style.opacity = '0';
      underline.style.width   = '0';
    };
    const getActiveLink = () => {
      for (const l of navLinks) if (l.classList.contains('active')) return l;
      return null;
    };
    const updateUnderlineToActive = () => {
      const active = getActiveLink();
      if (active) moveUnderlineTo(active);
      else hideUnderline();
    };
  
    if (nav && underline && navLinks.length) {
      // Hover/focus tastiera: mostra barra
      navLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => moveUnderlineTo(link));
        link.addEventListener('focus',      () => moveUnderlineTo(link));
      });
  
      // Uscendo dall'area header: torna alla voce attiva (o nascondi)
      headerContainer?.addEventListener('mouseleave', updateUnderlineToActive);
      nav.addEventListener('focusout', (e) => {
        if (!nav.contains(e.relatedTarget)) updateUnderlineToActive();
      });
  
      // Re-posiziona su resize (cambia larghezza dei link)
      window.addEventListener('resize', () => {
        // Solo su desktop (dove la barra è visibile via CSS)
        const isDesktop = window.matchMedia('(min-width: 769px)').matches;
        if (isDesktop) updateUnderlineToActive();
        else hideUnderline();
      });
    }
  
    /* ======================
     * 5) Stato ACTIVE del menu
     *    - Funziona per:
     *      a) link ad altre pagine (in base a window.location.pathname)
     *      b) link interni con ancora (#section) su click/scroll
     * ====================== */
    const setActive = (el) => {
      navLinks.forEach((l) => l.classList.remove('active'));
      if (el) el.classList.add('active');
      updateUnderlineToActive();
    };
  
    // a) Pagina corrente (path)
    const currentPath = window.location.pathname;
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href && !href.startsWith('#') && currentPath.includes(href)) {
        link.classList.add('active');
      }
    });
  
    // b) Link con ancora: attiva su click
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        link.addEventListener('click', () => setActive(link));
      }
    });
  
    // c) Active automatico quando la sezione entra in viewport
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute('id');
            const targetLink = Array.from(navLinks).find((l) => l.getAttribute('href') === `#${id}`);
            if (targetLink) setActive(targetLink);
          }
        });
      }, { threshold: 0.5 });
      sections.forEach((s) => sectionObserver.observe(s));
    }
  
    // All'avvio: posiziona la barra sulla voce già attiva (se siamo su desktop)
    if (window.matchMedia('(min-width: 769px)').matches) {
      updateUnderlineToActive();
    } else {
      hideUnderline();
    }
  
    /* ======================
     * 6) Smooth scroll per link interni (#id) con offset header
     * ====================== */
    const smoothScroll = (target) => {
      if (!target) return;
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    };
  
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        link.addEventListener('click', (e) => {
          if (target) {
            e.preventDefault();
            smoothScroll(target);
          }
        });
      }
    });
  });