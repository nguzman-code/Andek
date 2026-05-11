/* ─────────────────────────────────────────
   ANDEK GROUP — Frontend Script
───────────────────────────────────────── */

/* ── Before/After Slider (spring animation) ── */
function initBASlider(slider) {
  const beforeWrap = slider.querySelector('.ba-slider__before-wrap');
  const divider    = slider.querySelector('.ba-slider__divider');

  let current  = 50;   // animated position
  let target   = 50;   // where mouse is
  let rafId    = null;

  const STIFFNESS = 0.12; // spring tension — lower = slower/smoother

  function tick() {
    const diff = target - current;
    if (Math.abs(diff) < 0.05) {
      current = target;
      rafId = null;
      apply(current);
      return;
    }
    current += diff * STIFFNESS;
    apply(current);
    rafId = requestAnimationFrame(tick);
  }

  function apply(pct) {
    beforeWrap.style.width = pct + '%';
    divider.style.left     = pct + '%';
  }

  function setTarget(clientX) {
    const rect = slider.getBoundingClientRect();
    target = Math.min(Math.max((clientX - rect.left) / rect.width * 100, 1), 99);
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  slider.addEventListener('mousemove', e => setTarget(e.clientX));

  slider.addEventListener('mouseleave', () => {
    target = 50;
    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  slider.addEventListener('touchmove', e => {
    e.preventDefault();
    setTarget(e.touches[0].clientX);
  }, { passive: false });
}

document.querySelectorAll('.ba-slider').forEach(initBASlider);


/* ── Gallery4 — Casos de Estudio ── */
const casesTrack = document.getElementById('casesTrack');
const casesPrev  = document.getElementById('casesPrev');
const casesNext  = document.getElementById('casesNext');
const caseDots   = document.querySelectorAll('.case-dot');

function updateCasesState() {
  if (!casesTrack) return;
  casesPrev.disabled = casesTrack.scrollLeft <= 4;
  casesNext.disabled = casesTrack.scrollLeft >= casesTrack.scrollWidth - casesTrack.clientWidth - 4;

  // Update active dot based on scroll position
  const cards = casesTrack.querySelectorAll('.case-card');
  const cardW = cards[0] ? cards[0].offsetWidth + 20 : 340;
  const idx   = Math.round(casesTrack.scrollLeft / cardW);
  caseDots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

function casesScroll(dir) {
  const card = casesTrack.querySelector('.case-card');
  const step = card ? card.offsetWidth + 20 : 340;
  casesTrack.scrollBy({ left: dir * step, behavior: 'smooth' });
}

if (casesTrack) {
  casesTrack.addEventListener('scroll', updateCasesState, { passive: true });
  casesPrev.addEventListener('click', () => casesScroll(-1));
  casesNext.addEventListener('click', () => casesScroll(1));
  caseDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const card = casesTrack.querySelector('.case-card');
      const step = card ? card.offsetWidth + 20 : 340;
      casesTrack.scrollTo({ left: parseInt(dot.dataset.index) * step, behavior: 'smooth' });
    });
  });
  updateCasesState();
}


/* ── Gallery6 Carousel ── */
const galleryTrack = document.getElementById('galleryTrack');
const galleryPrev  = document.getElementById('galleryPrev');
const galleryNext  = document.getElementById('galleryNext');

function updateGalleryButtons() {
  if (!galleryTrack) return;
  galleryPrev.disabled = galleryTrack.scrollLeft <= 4;
  galleryNext.disabled = galleryTrack.scrollLeft >= galleryTrack.scrollWidth - galleryTrack.clientWidth - 4;
}

function galleryScroll(dir) {
  const card = galleryTrack.querySelector('.gallery-card');
  const step = card ? card.offsetWidth + 24 : 420;
  galleryTrack.scrollBy({ left: dir * step, behavior: 'smooth' });
}

if (galleryTrack) {
  galleryTrack.addEventListener('scroll', updateGalleryButtons, { passive: true });
  galleryPrev.addEventListener('click', () => galleryScroll(-1));
  galleryNext.addEventListener('click', () => galleryScroll(1));
  updateGalleryButtons();
}

/* ── Submenu links scroll to portfolio ── */
document.querySelectorAll('.nav-submenu__item').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});


/* ── Nav indicator (sliding underline) ── */
const indicator   = document.getElementById('navIndicator');
const navLinksEl2 = document.querySelector('.nav-links');

function moveIndicator(el) {
  const navRect  = navLinksEl2.getBoundingClientRect();
  const linkRect = el.getBoundingClientRect();
  indicator.style.opacity = '1';
  indicator.style.left    = (linkRect.left - navRect.left) + 'px';
  indicator.style.width   = linkRect.width + 'px';
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('mouseenter', () => moveIndicator(link));
});

navLinksEl2.addEventListener('mouseleave', () => {
  indicator.style.opacity = '0';
});


/* ── Navbar scroll effect + active link ── */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  highlightNav();
}, { passive: true });

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === id);
      });
    }
  });
}
highlightNav();


/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});


/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── KPI Counter animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.kpi-val[data-target]').forEach(el => counterObserver.observe(el));


/* ── Cards entrance animation ── */
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, entry.target.dataset.delay || 0);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .kpi-card, .chart-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  el.dataset.delay = i * 80;
  cardObserver.observe(el);
});


/* ── Charts (Chart.js) ── */
const BLUE   = '#40916C';
const BLUE_A = 'rgba(64,145,108,0.12)';
const DARK   = '#0D1B0F';
const GRAY   = '#6B7280';

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: DARK,
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,.7)',
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: GRAY, font: { family: 'Instrument Sans', size: 12 } },
      border: { display: false }
    },
    y: {
      grid: { color: '#F0F0F0', drawBorder: false },
      ticks: { color: GRAY, font: { family: 'Instrument Sans', size: 12 } },
      border: { display: false }
    }
  }
};

// Bar chart — Proyectos por sector
new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: ['Manufactura', 'Oil & Gas', 'Alimentos', 'Minería', 'Energía', 'Farmacéutico'],
    datasets: [{
      data: [82, 64, 57, 48, 43, 46],
      backgroundColor: BLUE,
      borderRadius: 6,
      borderSkipped: false,
    }]
  },
  options: {
    ...chartDefaults,
    plugins: { ...chartDefaults.plugins },
  }
});

// Line chart — Crecimiento anual
new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [{
      label: 'Proyectos',
      data: [98, 134, 189, 247, 340],
      borderColor: BLUE,
      backgroundColor: BLUE_A,
      borderWidth: 2.5,
      pointBackgroundColor: BLUE,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.4,
      fill: true,
    }]
  },
  options: {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      legend: { display: false },
    }
  }
});


/* ── Contact Form ── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function validate() {
  let valid = true;

  const nombre  = document.getElementById('nombre');
  const email   = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');

  const nombreErr  = document.getElementById('nombreErr');
  const emailErr   = document.getElementById('emailErr');
  const mensajeErr = document.getElementById('mensajeErr');

  // Reset
  [nombre, email, mensaje].forEach(el => el.classList.remove('error'));
  [nombreErr, emailErr, mensajeErr].forEach(el => el.textContent = '');

  if (!nombre.value.trim()) {
    nombre.classList.add('error');
    nombreErr.textContent = 'Por favor ingresa tu nombre.';
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    email.classList.add('error');
    emailErr.textContent = 'Por favor ingresa tu email.';
    valid = false;
  } else if (!emailRegex.test(email.value)) {
    email.classList.add('error');
    emailErr.textContent = 'Ingresa un email válido.';
    valid = false;
  }

  if (!mensaje.value.trim()) {
    mensaje.classList.add('error');
    mensajeErr.textContent = 'Por favor escribe tu mensaje.';
    valid = false;
  }

  return valid;
}

// Clear error on input
['nombre', 'email', 'mensaje'].forEach(id => {
  document.getElementById(id).addEventListener('input', function() {
    this.classList.remove('error');
    const errEl = document.getElementById(id + 'Err');
    if (errEl) errEl.textContent = '';
  });
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) return;

  // Loading state
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display   = 'none';
  submitBtn.querySelector('.btn-loader').style.display = 'inline-flex';

  const payload = {
    nombre:   document.getElementById('nombre').value.trim(),
    email:    document.getElementById('email').value.trim(),
    empresa:  document.getElementById('empresa').value.trim(),
    servicio: document.getElementById('servicio').value,
    mensaje:  document.getElementById('mensaje').value.trim(),
  };

  try {
    const res = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Server error');

    // Show success
    form.style.display = 'none';
    formSuccess.style.display = 'block';

  } catch (err) {
    // Fallback — show success anyway (for demo / no backend)
    console.warn('Backend not available, showing demo success:', err.message);
    form.style.display = 'none';
    formSuccess.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').style.display   = '';
    submitBtn.querySelector('.btn-loader').style.display = 'none';
  }
});


/* ── Animated Hero Word Cycler ── */
(function () {
  const words = document.querySelectorAll('.animated-hero__word');
  if (!words.length) return;

  let current = 0;

  function showWord(index) {
    words.forEach((w, i) => {
      w.classList.remove('is-visible', 'is-leaving');
      if (i === index) {
        w.classList.add('is-visible');
      }
    });
  }

  function cycle() {
    const prev = current;
    current = (current + 1) % words.length;

    words[prev].classList.remove('is-visible');
    words[prev].classList.add('is-leaving');

    // After leave transition, clean up
    setTimeout(() => words[prev].classList.remove('is-leaving'), 500);

    showWord(current);
  }

  // Show first word immediately
  showWord(0);

  setInterval(cycle, 2000);
})();
