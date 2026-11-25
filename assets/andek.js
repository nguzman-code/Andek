// Andek Solutions — interacciones del sitio
(function () {
  'use strict';

  // Menú en celular
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var abierto = header.classList.toggle('abierto');
      toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    header.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('abierto');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Pestañas de industria
  var tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var activar = function (tab, foco) {
      tabs.forEach(function (t) {
        var activa = t === tab;
        t.setAttribute('aria-selected', activa ? 'true' : 'false');
        t.tabIndex = activa ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !activa;
      });
      if (foco) tab.focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activar(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var destino = null;
        if (e.key === 'ArrowRight') destino = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') destino = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') destino = tabs[0];
        if (e.key === 'End') destino = tabs[tabs.length - 1];
        if (destino) { e.preventDefault(); activar(destino, true); }
      });
    });
  }

  // Formulario de contacto
  var form = document.getElementById('formContacto');
  if (form) {
    var estado = document.getElementById('formEstado');
    var boton = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var datos = {};
      new FormData(form).forEach(function (v, k) { datos[k] = String(v).trim(); });
      boton.disabled = true;
      boton.textContent = 'Enviando…';
      estado.className = 'form-estado';
      estado.textContent = '';
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j && res.j.error);
          form.reset();
          estado.className = 'form-estado ok';
          estado.textContent = 'Gracias. Recibimos tu mensaje y te responderemos en menos de 24 horas hábiles.';
        })
        .catch(function () {
          estado.className = 'form-estado error';
          estado.textContent = 'No pudimos enviar el mensaje. Escríbenos a nguzman@andek.cl o llámanos al +56 9 6919 3071.';
        })
        .then(function () {
          boton.disabled = false;
          boton.textContent = 'Enviar';
        });
    });
  }

  var sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Título con palabra rotativa: gaste → falle → desperdicie
  var rotador = document.querySelector('[data-rotador]');
  // Fotos y temas del hero que cambian junto con la palabra (si existen)
  var sincronizados = [document.querySelectorAll('.hero-foto, .grafico-serie'), document.querySelectorAll('.hero-tema-item')];
  var sincronizar = function (i) {
    sincronizados.forEach(function (lista) {
      Array.prototype.forEach.call(lista, function (el, j) { el.classList.toggle('is-visible', j === i); });
    });
  };
  if (rotador) {
    var palabras = Array.prototype.slice.call(rotador.querySelectorAll('.rotador-palabra'));
    if (sinMovimiento) {
      var titulo = rotador.closest('.titulo-animado');
      if (titulo) titulo.textContent = 'Hacemos que tu operación gaste menos, falle menos y desperdicie menos.';
      sincronizar(0);
    } else if (palabras.length > 1) {
      var actual = 0;
      var ajustarAncho = function (i) { rotador.style.width = palabras[i].getBoundingClientRect().width + 'px'; };
      palabras.forEach(function (p) { p.style.justifySelf = 'start'; p.style.whiteSpace = 'nowrap'; });
      ajustarAncho(0);
      rotador.style.transition = 'width .45s cubic-bezier(.22, 1, .36, 1)';
      // El gráfico se dibuja después de la entrada del hero
      setTimeout(function () { sincronizar(0); }, 500);
      window.addEventListener('resize', function () { ajustarAncho(actual); });
      setInterval(function () {
        var previa = palabras[actual];
        actual = (actual + 1) % palabras.length;
        previa.classList.remove('is-visible');
        previa.classList.add('is-saliendo');
        setTimeout(function () { previa.classList.remove('is-saliendo'); }, 500);
        palabras[actual].classList.add('is-visible');
        ajustarAncho(actual);
        sincronizar(actual);
      }, document.querySelector('.grafico-serie') ? 4200 : (sincronizados[0].length ? 3200 : 2200));
    }
  }

  // Cifras que cuentan hasta su valor al aparecer en pantalla
  var contadores = Array.prototype.slice.call(document.querySelectorAll('[data-contar]'));
  if (contadores.length && !sinMovimiento && 'IntersectionObserver' in window) {
    var preparar = function (el) {
      var texto = el.textContent;
      var m = texto.match(/[\d.]+/);
      if (!m || /[–-]/.test(texto)) return null;
      return { el: el, final: texto, antes: texto.slice(0, m.index), despues: texto.slice(m.index + m[0].length), valor: parseInt(m[0].replace(/\./g, ''), 10) };
    };
    var datos = contadores.map(preparar).filter(Boolean);
    datos.forEach(function (d) { d.el.textContent = d.antes + '0' + d.despues; });
    var animar = function (d) {
      var inicio = null, dur = 1600;
      var paso = function (ts) {
        if (!inicio) inicio = ts;
        var k = Math.min((ts - inicio) / dur, 1);
        var v = Math.round(d.valor * (1 - Math.pow(1 - k, 3)));
        d.el.textContent = k < 1 ? d.antes + v.toLocaleString('es-CL') + d.despues : d.final;
        if (k < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    };
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        datos.filter(function (d) { return d.el === en.target; }).forEach(animar);
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    datos.forEach(function (d) { io.observe(d.el); });
  }

  // Línea de tiempo: avanza sola en ciclo. Solo se detiene mientras está fuera de pantalla.
  var tl = document.querySelector('[data-timeline]');
  if (tl) {
    var pasos = Array.prototype.slice.call(tl.querySelectorAll('.tl-paso'));
    var activarPaso = function (i) {
      pasos.forEach(function (p, j) {
        p.classList.toggle('is-activo', j === i);
        p.classList.toggle('is-hecho', j < i);
        var nodo = p.querySelector('.tl-nodo');
        if (j === i) nodo.setAttribute('aria-current', 'step'); else nodo.removeAttribute('aria-current');
      });
    };
    pasos.forEach(function (p, i) {
      p.querySelector('.tl-nodo').addEventListener('click', function () { activarPaso(i); });
      p.querySelector('.tl-barra span').addEventListener('animationend', function () {
        if (p.classList.contains('is-activo')) activarPaso((i + 1) % pasos.length);
      });
    });
    if (sinMovimiento) {
      tl.classList.add('sin-animacion');
    } else if ('IntersectionObserver' in window) {
      tl.classList.add('en-pausa');
      new IntersectionObserver(function (en) { tl.classList.toggle('en-pausa', !en[0].isIntersecting); }, { threshold: 0.3 }).observe(tl);
    }
    activarPaso(0);
  }

  // Tipo de contacto: los fabricantes no necesitan industria ni área
  var tipo = document.getElementById('tipoContacto');
  if (tipo) {
    var soloCliente = Array.prototype.slice.call(document.querySelectorAll('[data-solo-cliente]'));
    var aplicarTipo = function () {
      soloCliente.forEach(function (c) { c.hidden = tipo.value === 'fabricante'; });
    };
    tipo.addEventListener('change', aplicarTipo);
    if (form) form.addEventListener('reset', function () { setTimeout(aplicarTipo, 0); });
    document.querySelectorAll('[data-tipo-contacto]').forEach(function (a) {
      a.addEventListener('click', function () { tipo.value = a.getAttribute('data-tipo-contacto'); aplicarTipo(); });
    });
    aplicarTipo();
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
