
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const MIN_VISIBLE_MS = 450; // evita el "parpadeo" en conexiones muy rápidas
  const startedAt = performance.now();

  function hidePreloader() {
    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('is-loading');
      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }
})();
