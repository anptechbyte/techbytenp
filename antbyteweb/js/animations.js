/* ============================================================
   ANT BYTE — animations.js
   Scroll reveal, animated counters, and the swarm background.
   Vanilla ES6. No dependencies. Respects reduced motion.
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* --- Animated counters --- */
  const countUp = (scope) => {
    scope.querySelectorAll('[data-count]').forEach(el => {
      const end = +el.dataset.count;
      const suf = el.dataset.suffix || '';
      if (reduced) { el.textContent = end + suf; return; }
      let t0 = null;
      const dur = 1300;
      const step = (t) => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(p * end) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  /* --- Scroll reveal via IntersectionObserver --- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.hasAttribute('data-count') || e.target.querySelector('[data-count]')) {
        countUp(e.target);
      }
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* --- Swarm background: ant-trail node network --- */
  const canvas = document.getElementById('swarm');
  if (!canvas || reduced) return;
  const ctx = canvas.getContext('2d');
  let w, h, ants;
  const amber = () => getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();

  const size = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const n = Math.min(60, Math.floor(w / 22));
    ants = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
    }));
  };

  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    const col = amber();
    for (const a of ants) {
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
    }
    for (let i = 0; i < ants.length; i++) {
      for (let j = i + 1; j < ants.length; j++) {
        const dx = ants[i].x - ants[j].x, dy = ants[i].y - ants[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.strokeStyle = col;
          ctx.globalAlpha = (1 - d / 130) * 0.35;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ants[i].x, ants[i].y);
          ctx.lineTo(ants[j].x, ants[j].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(ants[i].x, ants[i].y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  };

  size();
  loop();
  window.addEventListener('resize', size);
});
