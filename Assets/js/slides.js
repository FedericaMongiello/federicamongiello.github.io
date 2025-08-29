document.addEventListener('DOMContentLoaded',()=>{
    const slides = document.querySelectorAll('.slide');
    const pagination = document.getElementById('pagination');
  
    /* Crea i pallini */
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Vai alla slide ${i+1}`);
      btn.addEventListener('click', () => s.scrollIntoView({ behavior:'smooth' }));
      pagination.appendChild(btn);
    });
  
    const buttons = pagination.querySelectorAll('button');
  
    /* Evidenzia il pallino della slide visibile */
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const idx = [...slides].indexOf(entry.target);
          buttons.forEach(b=>b.classList.remove('active'));
          if (buttons[idx]) buttons[idx].classList.add('active');
          history.replaceState(null, '', `#${entry.target.id}`);
        }
      });
    },{ threshold:0.6 });
  
    slides.forEach(s=>io.observe(s));
  
    /* Parallax + reveal del box nella cover */
    const scroller = document.querySelector('.slides-container');
    const parallax = document.querySelector('.parallax');
    const sticky = parallax?.querySelector('.sticky-cover');
    const introBox = parallax?.querySelector('.intro-box');
  
    const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
  
    const onScroll = () => {
      if (!parallax || !sticky) return;
      const viewport = scroller.clientHeight || window.innerHeight;
      const total = parallax.offsetHeight - viewport;       // es. 220vh - 100vh = 120vh
      const rect = parallax.getBoundingClientRect();
      const seen = clamp(-rect.top, 0, total);
      const ratio = total > 0 ? seen / total : 0;           // 0 → 1 durante lo scroll della sezione
  
      // Effetto scala molto lieve sulla cover
      const scale = 1 + 0.08 * ratio;
      sticky.style.transform = `scale(${scale})`;
  
      // Reveal/Parallasse del box: appare tra ~12% e ~60% della sezione
      if (introBox) {
        const start = 0.12, end = 0.60;
        const t = clamp((ratio - start) / (end - start), 0, 1);
        introBox.style.opacity = t.toFixed(3);
        const translate = 24 * (1 - t); // da 24px a 0
        introBox.style.transform = `translateY(${translate}px)`;
      }
    };
  
    // Ascolta lo scroll del container (non window)
    scroller?.addEventListener('scroll', onScroll, { passive:true });
    window.addEventListener('resize', onScroll, { passive:true });
    onScroll(); // init
  
    /* Navigazione da tastiera */
    document.addEventListener('keydown',(e)=>{
      const all = [...slides];
      const currentIdx = Math.max(all.findIndex(s => `#${s.id}` === location.hash), 0);
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = all[Math.min(currentIdx+1, all.length-1)];
        next?.scrollIntoView({behavior:'smooth'});
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = all[Math.max(currentIdx-1, 0)];
        prev?.scrollIntoView({behavior:'smooth'});
      }
    });
  
    /* Attiva il primo pallino all'avvio */
    if (buttons[0]) buttons[0].classList.add('active');
  });
  