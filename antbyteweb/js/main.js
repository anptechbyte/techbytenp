/* ============================================================
   ANT BYTE — main.js
   Core interactions: theme, nav, header, filters, FAQ, form.
   Vanilla ES6. No dependencies.
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  /* --- Theme switcher (persisted) --- */
  const tBtn = document.getElementById('theme');
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
  tBtn?.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    localStorage.setItem('theme', t);
  });

  /* --- Mobile navigation --- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  burger?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  menu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );

  /* --- Sticky header + scroll progress + back-to-top --- */
  const header = document.getElementById('header');
  const prog = document.getElementById('progress');
  const top = document.getElementById('top');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 10);
    top?.classList.toggle('show', y > 600);
    if (prog) {
      const max = document.body.scrollHeight - window.innerHeight;
      prog.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  top?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* --- Portfolio filtering --- */
  const filters = document.getElementById('filters');
  filters?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('#projects .proj').forEach(p => {
      p.style.display = (f === 'all' || p.dataset.cat === f) ? '' : 'none';
    });
  });

  /* --- FAQ accordion --- */
  document.querySelectorAll('.faq-q').forEach(q =>
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'))
  );

  /* --- Contact form validation (client-side) --- */
  const form = document.getElementById('form');
  const toast = document.getElementById('toast');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    const check = (id, test) => {
      const el = document.getElementById(id);
      const field = el.closest('.field');
      const bad = !test(el.value.trim());
      field.classList.toggle('invalid', bad);
      if (bad) ok = false;
    };
    check('name', v => v.length > 1);
    check('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    check('msg', v => v.length > 4);
    if (ok) {
      form.reset();
      // NOTE: front-end only. Wire this to your backend / form service.
      toast?.classList.add('show');
      setTimeout(() => toast?.classList.remove('show'), 3200);
    }
  });
});
