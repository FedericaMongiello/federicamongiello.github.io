document.addEventListener('DOMContentLoaded', () => {
  /* Progress bar verticale */
  const vbar = document.getElementById('vProgressBar');
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
    if (vbar) vbar.style.height = `${Math.min(Math.max(ratio,0),1)*100}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive:true });
  window.addEventListener('resize', updateProgress, { passive:true });

  /* CTA Torna su */
  const toTop = document.getElementById('backToTop');
  const toggleToTop = () => {
    const show = (window.scrollY || document.documentElement.scrollTop) > 150;
    toTop?.classList.toggle('show', show);
  };
  toggleToTop();
  window.addEventListener('scroll', toggleToTop, { passive:true });
  toTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* Marca Work attivo */
  const nav = document.getElementById('siteNav');
  const workLink = nav?.querySelector('a[href*="#work"]');
  if (workLink) {
    nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    workLink.classList.add('active');
  }
});
