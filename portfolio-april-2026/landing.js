/* Landing page: count-up on scroll + reveal animations + lucide icons */

// Lucide
if (window.lucide) window.lucide.createIcons();

// Count-up helper — runs when element enters viewport
const easeOut = t => 1 - Math.pow(1 - t, 3);
function runCountUp(el) {
  const target = parseInt(el.dataset.count || '0', 10);
  const duration = parseInt(el.dataset.duration || '1400', 10);
  if (target === 0) { el.textContent = '0'; return; }
  const start = performance.now();
  const step = now => {
    const t = Math.min(1, (now - start) / duration);
    const val = Math.floor(easeOut(t) * target);
    el.textContent = val.toLocaleString('en-US');
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('en-US');
  };
  requestAnimationFrame(step);
}

// Observer: count-up
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCountUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.cu').forEach(el => countObserver.observe(el));

// Observer: section reveals (add .reveal class to things we want to fade in)
// We'll auto-tag project cards and arc columns.
document.querySelectorAll('.proj, .arc-col, .sm-cell, .fn-header').forEach(el => {
  el.classList.add('reveal');
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Hero summary-row cells should reveal on page load
document.querySelectorAll('.sm-cell').forEach((el, i) => {
  el.style.transitionDelay = `${200 + i * 80}ms`;
  setTimeout(() => el.classList.add('in'), 50);
});
