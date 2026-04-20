/* Count-up animation + kin-trigger — runs when a slide becomes active.
   Listens to `slidechange` on <deck-stage> and:
     1. Toggles a .play class on the active slide (restarts .kin entrance CSS).
     2. Animates any [data-count] elements to their target value.
*/
(function() {
  function animateCount(el) {
    const end = parseFloat(el.dataset.count);
    const duration = parseInt(el.dataset.duration || '1400', 10);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const start = parseFloat(el.dataset.start || '0');
    const startAt = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = start + (end - start) * eased;
      el.textContent = prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function playSlide(slide, previousSlide) {
    if (!slide) return;
    if (previousSlide) previousSlide.classList.remove('play');
    // Force reflow so re-adding .play re-triggers animations.
    slide.classList.remove('play');
    void slide.offsetWidth;
    slide.classList.add('play');

    // Reset and fire count-ups.
    const els = slide.querySelectorAll('[data-count]');
    els.forEach((el) => {
      const start = el.dataset.start || '0';
      el.textContent = start;
    });
    // Kick count-ups a touch after the kin entrance begins.
    setTimeout(() => {
      slide.querySelectorAll('[data-count]').forEach(animateCount);
    }, 120);
  }

  function init() {
    const stage = document.querySelector('deck-stage');
    if (!stage) return;
    // Initial active slide.
    const active = stage.querySelector('[data-deck-active]') || stage.firstElementChild;
    playSlide(active, null);

    stage.addEventListener('slidechange', (e) => {
      playSlide(e.detail.slide, e.detail.previousSlide);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
