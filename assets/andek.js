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
          estado.textContent = 'No pudimos enviar el mensaje. Escríbenos a contacto@andek.cl o llámanos al +56 9 6919 3071.';
        })
        .then(function () {
          boton.disabled = false;
          boton.textContent = 'Enviar';
        });
    });
  }

  var anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();
})();
