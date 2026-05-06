/**
 * Tom the Vacuum Man — site behaviour
 * Minimal: year stamp, stat counter on scroll, ribbon duplication for seamless loop.
 */
(() => {
  'use strict';

  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Current year in footer ------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Ribbon: duplicate content so marquee loops seamlessly ----------
  // Why: the CSS assumes track is twice as wide as viewport (translateX -50%).
  const ribbon = document.querySelector('.ribbon__track');
  if (ribbon) {
    const clone = ribbon.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.style.animation = 'none';
    // Merge clone contents into original to keep one animated track
    while (clone.firstChild) ribbon.appendChild(clone.firstChild);
  }

  // --- Stat counter -----------------------------------------------------
  // Counts up to the data-count value once the stat enters the viewport.
  const counters = document.querySelectorAll('.stat__num[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => { c.textContent = '0'; io.observe(c); });
  }

  // --- Smooth scroll for in-page anchors -------------------------------
  // Why: focus the section's heading (not the section itself) so screen readers
  // announce the destination context, not the bare landmark. Tabindex is set
  // once on first activation to avoid mutating the DOM on every click.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      const focusTarget = target.querySelector('h1, h2, h3') || target;
      if (!focusTarget.hasAttribute('tabindex')) {
        focusTarget.setAttribute('tabindex', '-1');
      }
      focusTarget.focus({ preventScroll: true });
    });
  });

  // --- Subtle parallax: tilt the service-docket on mouse (respect RM) --
  const docket = document.querySelector('.hero__docket');
  if (docket && !prefersReducedMotion && matchMedia('(pointer: fine)').matches) {
    const base = 1.2; // matches CSS rotate
    docket.addEventListener('mousemove', (e) => {
      const r = docket.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      docket.style.transform = `rotate(${base + x * 2}deg) translate(${x * 4}px, ${y * 4}px)`;
    });
    docket.addEventListener('mouseleave', () => {
      docket.style.transform = '';
    });
  }
})();
