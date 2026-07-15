
// ─── FAQ accordion ───
function toggleFaq(q) {
  const item = q.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ─── Scroll reveal ───
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ─── Nav background on scroll ───
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  nav.style.background = window.scrollY > 60
    ? 'rgba(250,249,247,.97)'
    : 'rgba(250,249,247,.88)';
});

// ─── Hero parallax on the mark ───
if (!reduceMotion) {
  const heroSection = document.getElementById('hero');
  const heroMarkWrap = document.querySelector('.hero-mark-wrap');
  if (heroSection && heroMarkWrap) {
    heroSection.addEventListener('mousemove', (e) => {
      const r = heroSection.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroMarkWrap.style.transform = `translate(${x * 18}px, ${y * 18}px)`;
    });
    heroSection.addEventListener('mouseleave', () => { heroMarkWrap.style.transform = ''; });
  }
}

// ─── Magnetic buttons ───
if (!reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.16}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ─── Portfolio card 3D tilt ───
if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.port-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px)';
    });
  });
}

// ─── Animated counters ───
const counters = document.querySelectorAll('.cnt');
if (counters.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      if (reduceMotion) { el.textContent = target; cio.unobserve(el); return; }
      const dur = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));
}
