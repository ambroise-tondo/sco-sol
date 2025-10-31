// src//scripts/animate.js

// Observer: révèle les éléments + anime les compteurs quand ils entrent dans le viewport
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // 1) Si c'est un bloc .reveal : on ajoute la classe et on cherche des compteurs dedans
    if (el.classList.contains('reveal')) {
      el.classList.add('in');

      el.querySelectorAll('[data-count-to]:not([data-counted])').forEach((counter) => {
        const to = Number(counter.getAttribute('data-count-to'));
        if (Number.isFinite(to)) {
          counter.dataset.counted = '1';
          animateCount(counter, to);
        }
      });
    }

    // 2) Si c'est directement un élément compteur observé
    if (el.hasAttribute('data-count-to') && !el.dataset.counted) {
      const to = Number(el.getAttribute('data-count-to'));
      if (Number.isFinite(to)) {
        el.dataset.counted = '1';
        animateCount(el, to);
      }
    }

    io.unobserve(el);
  });
}, { threshold: 0.15 });

// On observe à la fois les .reveal et les éléments ayant data-count-to
document.querySelectorAll('.reveal, [data-count-to]').forEach((el) => io.observe(el));

// Animation numérique lissée
function animateCount(el, to) {
  const dur = 1200; // 1.2s
  const start = performance.now();
  const from = Number((el.textContent || '0').replace(/[^\d]/g, '')) || 0;
  const fmt = new Intl.NumberFormat('fr-FR');

  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const val = Math.round(from + (to - from) * p);
    el.textContent = fmt.format(val);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
