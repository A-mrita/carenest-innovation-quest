(() => {
  const vine = document.querySelector('.scroll-vine');
  const root = document.documentElement;
  let frame = 0;

  function draw() {
    frame = 0;
    const page = document.scrollingElement;
    const range = page.scrollHeight - page.clientHeight;
    const progress = range > 0 ? Math.max(0, Math.min(1, page.scrollTop / range)) : 0;
    vine.style.setProperty('--vine-progress', `${progress * 100}%`);
  }

  function scheduleDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  root.classList.add('vine-scroll-ready');
  draw();
  window.addEventListener('scroll', scheduleDraw, { passive: true });
  window.addEventListener('resize', scheduleDraw);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleDraw).observe(document.body);
})();
