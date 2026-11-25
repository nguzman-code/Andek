#!/usr/bin/env python3
"""Genera las páginas de andek.cl a partir de tools/sitio_datos.py.

- Fichas de solución (solucion-*.html) y la página de industria: se generan completas.
- Portada (index.html): solo se reemplazan los bloques marcados con
  <!--#NOMBRE--> ... <!--/NOMBRE-->; el resto del archivo se edita a mano.

Uso:  python3 tools/build_site.py   (requiere Pillow: pip install pillow)
"""
import html
import re
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from sitio_datos import (AREAS, ORDEN, SOL, TARJETAS, INDUSTRIAS, ZONAS_SUPERMERCADOS,  # noqa: E402
                         CIFRAS, EVIDENCIA_PORTADA, EVIDENCIA_SUPERMERCADOS,
                         MAPA_DESTINO, MAPA_ORIGENES, CLIENTES)

RAIZ = Path(__file__).resolve().parent.parent
e = html.escape
IND = {i['id']: i for i in INDUSTRIAS}


def ev(sol, eid):
    return SOL[sol]['evidencia'][eid]


ISO = 'M328 60H678C640 78 604 102 575 131L135 572C95 520 60 450 60 360V328Z'

ICONOS = f'''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-iso" viewBox="60 60 1080 1080"><path d="{ISO}"/><path d="{ISO}" transform="rotate(90 600 600)"/><path d="{ISO}" transform="rotate(180 600 600)"/><path d="{ISO}" transform="rotate(270 600 600)"/></symbol>
  <symbol id="i-energia" viewBox="0 0 24 24"><path d="M13 2.5L5 13.5h6l-1 8 8-11h-6l1-8z"/></symbol>
  <symbol id="i-herr" viewBox="0 0 24 24"><path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L3.5 17.5l3 3 5.7-5.7a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/></symbol>
  <symbol id="i-temp" viewBox="0 0 24 24"><path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v7"/></symbol>
  <symbol id="i-seguridad" viewBox="0 0 24 24"><path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z"/><path d="M9 12l2 2 4-4"/></symbol>
  <symbol id="i-frio" viewBox="0 0 24 24"><path d="M12 2v20M3.5 7l17 10M3.5 17l17-10"/><path d="M9.5 4L12 6.5 14.5 4M9.5 20L12 17.5 14.5 20"/></symbol>
  <symbol id="i-vidrio" viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="1.5"/><path d="M9 6v3"/></symbol>
  <symbol id="i-camara" viewBox="0 0 24 24"><path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/><path d="M2 21h20M12 3v18"/></symbol>
  <symbol id="i-luz" viewBox="0 0 24 24"><path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-4 11.6V16h8v-1.9a6.5 6.5 0 0 0-4-11.6z"/></symbol>
  <symbol id="i-vent" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><path d="M12 10.5c0-4 1-7.5 3.5-7.5 2.2 0 2.2 3.3-2 7.3"/><path d="M13.5 12c4 0 7.5 1 7.5 3.5 0 2.2-3.3 2.2-7.3-2"/><path d="M12 13.5c0 4-1 7.5-3.5 7.5-2.2 0-2.2-3.3 2-7.3"/><path d="M10.5 12c-4 0-7.5-1-7.5-3.5 0-2.2 3.3-2.2 7.3 2"/></symbol>
  <symbol id="i-agua" viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></symbol>
  <symbol id="i-medicion" viewBox="0 0 24 24"><path d="M3.5 17a8.5 8.5 0 1 1 17 0"/><path d="M12 17l4.5-4.5"/></symbol>
  <symbol id="i-propuesta" viewBox="0 0 24 24"><path d="M4 4v16h16"/><path d="M7.5 9l4 4 3-3 4.5 4.5"/><path d="M19 11v3.5h-3.5"/></symbol>
  <symbol id="i-piloto" viewBox="0 0 24 24"><path d="M9.5 3h5M10 3v6l-5 9.5A1.7 1.7 0 0 0 6.5 21h11a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/></symbol>
</svg>'''

TRAMA = '<svg class="hero-trama" aria-hidden="true"><defs><pattern id="trama" width="240" height="240" patternUnits="userSpaceOnUse"><use href="#i-iso" x="40" y="40" width="160" height="160" fill="#FFFFFF" fill-opacity="0.05"></use></pattern></defs><rect width="100%" height="100%" fill="url(#trama)"></rect></svg>'


def menu_soluciones(pref):
    """Menú desplegable de Soluciones: industrias y las marcas que aplican en cada una."""
    cols = []
    for ind in INDUSTRIAS:
        destino = f'/{ind["archivo"]}' if ind['archivo'] else f'{pref}#soluciones-{ind["id"]}'
        sols = []
        for k in ind['tarjetas']:
            s = TARJETAS[k][0]
            if s not in sols:
                sols.append(s)
        items = ''.join(f'<li><a href="/{SOL[s]["archivo"]}">{e(SOL[s]["nombre"])}</a></li>' for s in sols)
        cols.append(f'<div class="megamenu-col"><a class="megamenu-ind" href="{destino}">{e(ind["nombre"])}&nbsp;<span aria-hidden="true">→</span></a><ul>{items}</ul></div>')
    return f'''        <div class="nav-item" data-menu>
          <a class="nav-menu" href="{pref}#soluciones" aria-haspopup="true" aria-expanded="false">Industrias <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></a>
          <div class="megamenu">
            <div class="megamenu-panel">
              <p class="megamenu-titulo">Soluciones por industria</p>
              <div class="megamenu-grid">{''.join(cols)}</div>
              <a class="megamenu-todas" href="{pref}#soluciones">Ver todas las soluciones →</a>
            </div>
          </div>
        </div>'''


def cabecera(pref):
    return f'''    <header class="site-header">
      <a class="logo" href="/" aria-label="Andek Solutions, ir al inicio">
        <svg aria-hidden="true"><use href="#i-iso"></use></svg>
        <span class="logo-text"><b>ANDEK</b> <span>SOLUTIONS</span></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="navPrincipal" aria-label="Abrir menú">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <nav class="nav" id="navPrincipal" aria-label="Principal">
        <a href="{pref}#eficiencia">Qué mejoramos</a>
{menu_soluciones(pref)}
        <a href="{pref}#como-trabajamos">Cómo trabajamos</a>
        <a href="{pref}#nosotros">Nosotros</a>
        <a href="{pref}#fabricantes">Fabricantes</a>
        <a href="{pref}#evidencia">Casos de éxito</a>
      </nav>
      <a class="btn btn-blanco header-cta" href="{pref}#contacto">Agenda un diagnóstico</a>
    </header>'''


def enlace_industria(iid):
    a = IND[iid]['archivo']
    return f'/{a}' if a else '/#soluciones'


def pie():
    inds = '\n'.join(f'        <a href="{enlace_industria(i["id"])}">{e(i["nombre"])}</a>' for i in INDUSTRIAS)
    sols = '\n'.join(f'        <a href="/{SOL[k]["archivo"]}">{e(SOL[k]["nombre"])}</a>' for k in ORDEN)
    return f'''<footer class="footer on-dark">
  <div class="container">
    <div class="footer-cols">
      <div class="footer-marca">
        <a class="logo" href="/" aria-label="Andek Solutions, ir al inicio"><svg aria-hidden="true"><use href="#i-iso"></use></svg><span class="logo-text"><b>ANDEK</b> <span>SOLUTIONS</span></span></a>
        <p>Tecnologías probadas de eficiencia operacional para instalaciones comerciales.</p>
        <div class="footer-redes"><a href="https://www.linkedin.com/company/andek-solutions">LinkedIn</a><a href="https://www.instagram.com/andeksolutions">Instagram</a></div>
      </div>
      <nav class="footer-col" aria-label="Industrias">
        <span class="label">Industrias</span>
{inds}
      </nav>
      <nav class="footer-col" aria-label="Soluciones">
        <span class="label">Soluciones</span>
{sols}
      </nav>
      <div class="footer-col">
        <span class="label">Contacto</span>
        <a href="tel:+56969193071">+56 9 6919 3071</a>
        <a href="mailto:nguzman@andek.cl">nguzman@andek.cl</a>
        <span>Santiago, Chile</span>
      </div>
    </div>
    <div class="footer-legal">© <span id="anio">2026</span> Andek Solutions SpA</div>
  </div>
</footer>'''


def documento(titulo, descripcion, cuerpo, og_img='/assets/img/instalacion-aerofoil.webp'):
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(titulo)}</title>
  <meta name="description" content="{e(descripcion)}">
  <meta property="og:title" content="{e(titulo)}">
  <meta property="og:description" content="{e(descripcion)}">
  <meta property="og:image" content="{og_img}">
  <meta property="og:locale" content="es_CL">
  <link rel="icon" href="/assets/img/isotipo.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/andek.css">
</head>
<body>
{ICONOS}
{cuerpo}
{pie()}
<script src="/assets/andek.js"></script>
</body>
</html>
'''


def cta_banda(titulo, texto, boton='Contactar'):
    return f'''<section class="section bg-pizarra on-dark">
  <div class="container cta-banda">
    <div>
      <h2 class="h2">{e(titulo)}</h2>
      <p class="lead">{e(texto)}</p>
    </div>
    <a class="btn btn-blanco" href="/#contacto">{e(boton)}</a>
  </div>
</section>'''


# ---------- Portada ----------

# Foto propia para tarjetas que no usan la foto principal de su solución
FOTO_TARJETA = {'sentry': ('/assets/img/fichas/guardian-door-sentry.webp', 'Alarma de puerta Door Sentry de Guardian Controls'),
                # Temporal, hasta tener fotos de Kenfield en alta resolución
                'kenfield': ('/assets/img/fichas/kenfield-tarjeta.webp', 'Operaria pasando por una puerta Kenfield K750 con una bandeja')}


def logo(sol):
    ruta = RAIZ / 'assets' / 'img' / 'logos' / f'{sol}.png'
    with Image.open(ruta) as im:
        w, h = im.size
    return f'/assets/img/logos/{sol}.png', w, h


def tarjeta(n, clave):
    sol, producto, resuelve, texto, tags, eid = TARJETAS[clave]
    s, c = SOL[sol], ev(sol, eid)
    foto, alt = FOTO_TARJETA.get(clave) or s['img']
    src, lw, lh = logo(sol)
    # Igualar el peso visual de logos con proporciones distintas: misma área aproximada
    alto = max(28, min(46, round((5200 / (lw / lh)) ** 0.5)))
    prod = f'<span class="card-producto">{e(producto)}</span>' if producto else f'<span class="card-origen">{e(s["origen"])}</span>'
    return f'''        <article class="card card--solucion">
          <div class="card-foto"><img src="{foto}" alt="{e(alt)}" loading="lazy" width="800" height="600"></div>
          <div class="card-marca">
            <h3><img class="card-logo" src="{src}" alt="{e(s['nombre'])}" width="{lw}" height="{lh}" style="height:{alto}px"></h3>
            {prod}
          </div>
          <p class="card-resuelve">{e(resuelve)}</p>
          <p class="card-texto">{e(texto)}</p>
          <div class="cifra">
            <span class="cifra-num">{e(c['num'])}</span>
            <span class="cifra-txt">{e(c['titulo'])}</span>
            <span class="fuente">Fuente: {e(c['fuente'])}</span>
          </div>
          <div class="card-pie"><a class="link-flecha" href="/{s['archivo']}">Ver {e(s['nombre'])} →</a></div>
        </article>'''


def paneles():
    tabs, panels = [], []
    for i, ind in enumerate(INDUSTRIAS):
        sel = i == 0
        iid = ind['id']
        tabs.append(f'      <button class="tab" type="button" role="tab" id="tab-{iid}" aria-controls="panel-{iid}" aria-selected="{"true" if sel else "false"}"{"" if sel else " tabindex=\"-1\""}>{e(ind["nombre"])}</button>')
        cards = '\n'.join(tarjeta(n + 1, k) for n, k in enumerate(ind['tarjetas']))
        pie_panel = f'\n      <div class="panel-pie"><a class="btn btn-outline" href="/{ind["archivo"]}">Ver la página de {e(ind["nombre"].lower())}</a></div>' if ind['archivo'] else ''
        panels.append(f'''    <div class="tab-panel" role="tabpanel" id="panel-{iid}" aria-labelledby="tab-{iid}" tabindex="0"{"" if sel else " hidden"}>
      <div class="grid">
{cards}
      </div>{pie_panel}
    </div>''')
    return '    <div class="tabs" role="tablist" aria-label="Industrias">\n' + '\n'.join(tabs) + '\n    </div>\n' + '\n'.join(panels)


def areas():
    bloques = []
    for area, (icono, texto) in AREAS.items():
        bloques.append(f'''      <article class="card">
        <svg class="icon icon-lg" aria-hidden="true"><use href="#i-{icono}"></use></svg>
        <h3 class="h3">{e(area)}</h3>
        <p>{e(texto)}</p>
      </article>''')
    return '    <div class="grid">\n' + '\n'.join(bloques) + '\n    </div>'


def cifras():
    items = []
    for s, i, texto in CIFRAS:
        c = ev(s, i)
        items.append(f'''      <div class="cifra-grande">
        <span class="cifra-grande-num" data-contar>{e(c['num'])}</span>
        <span class="cifra-grande-txt">{e(texto)}</span>
        <span class="fuente">Fuente: {e(c['fuente'])}</span>
      </div>''')
    return '    <div class="cifras">\n' + '\n'.join(items) + '\n    </div>'


def clientes():
    def logos(oculto):
        items = []
        for nombre, archivo in CLIENTES:
            with Image.open(RAIZ / 'assets' / 'img' / 'clientes' / f'{archivo}.png') as im:
                w, h = im.size
            alto = max(26, min(54, round((4200 / (w / h)) ** 0.5)))
            alt = '' if oculto else e(nombre)
            items.append(f'<li><img src="/assets/img/clientes/{archivo}.png" alt="{alt}" width="{w}" height="{h}" style="height:{alto}px" loading="lazy"></li>')
        extra = ' aria-hidden="true"' if oculto else ''
        return f'<ul class="clientes-lista"{extra}>' + ''.join(items) + '</ul>'
    return f'''    <div class="clientes-cabeza">
      <p class="label">Nuestros clientes</p>
      <p class="clientes-txt">Cadenas de retail que ya operan con las soluciones que representamos.</p>
    </div>
    <div class="clientes-franja">
      <div class="clientes-pista">{logos(False)}{logos(True)}</div>
    </div>'''


def proyectar(lon, lat):
    """Misma proyección que tools/generar_mapa.py (4 unidades por grado, latitudes 80 a -58)."""
    return (lon + 180) * 4, (80 - lat) * 4


def mapa():
    dx, dy = proyectar(*MAPA_DESTINO)
    lineas, origenes = [], []
    for i, (lon, lat) in enumerate(MAPA_ORIGENES):
        ox, oy = proyectar(lon, lat)
        dist = ((dx - ox) ** 2 + (dy - oy) ** 2) ** 0.5
        cx, cy = (ox + dx) / 2, max((oy + dy) / 2 - dist * 0.32, 12)
        lineas.append(f'        <path class="mapa-linea" style="--i:{i}" pathLength="1" d="M{ox:.0f} {oy:.0f}Q{cx:.0f} {cy:.0f} {dx:.0f} {dy:.0f}"/>')
        origenes.append(f'<circle style="--i:{i}" cx="{ox:.0f}" cy="{oy:.0f}" r="6"/>')
    return f'''    <svg class="mapa" viewBox="0 0 1440 552" role="img" aria-label="Mapa del mundo con líneas que salen de distintos países y llegan a Chile">
      <image href="/assets/img/mapa-puntos.svg" width="1440" height="552"/>
      <g class="mapa-lineas">
{chr(10).join(lineas)}
      </g>
      <g class="mapa-origenes">{''.join(origenes)}</g>
      <g class="mapa-chile"><circle class="mapa-pulso" cx="{dx:.0f}" cy="{dy:.0f}" r="10"/><circle class="mapa-destino" cx="{dx:.0f}" cy="{dy:.0f}" r="10"/></g>
    </svg>'''


def bloque_ev(c, senal=False, enlace=None):
    link = f'\n        <a class="ev-link" href="{enlace}">Ver el caso completo →</a>' if enlace else ''
    detalle = f'\n        <p>{e(c["detalle"])}</p>' if c['detalle'] else ''
    return f'''      <div class="ev">
        <span class="ev-tipo">{e(c['tipo'])}</span>
        <span class="ev-num{' ev-num--senal' if senal else ''}">{e(c['num'])}</span>
        <span class="ev-titulo">{e(c['titulo'])}</span>{detalle}
        <span class="fuente">Fuente: {e(c['fuente'])}</span>{link}
      </div>'''


def evidencia_portada():
    items = [bloque_ev(ev(s, i), n == 0, f'/{SOL[s]["archivo"]}#evidencia') for n, (s, i) in enumerate(EVIDENCIA_PORTADA)]
    return '    <div class="evidencia">\n' + '\n'.join(items) + '\n    </div>'


def reemplazar_bloques(ruta, bloques):
    txt = ruta.read_text(encoding='utf-8')
    for nombre, contenido in bloques.items():
        patron = re.compile(rf'(<!--#{nombre}-->)(.*?)(<!--/{nombre}-->)', re.S)
        if not patron.search(txt):
            raise SystemExit(f'Falta el marcador {nombre} en {ruta.name}')
        txt = patron.sub(lambda m: f'{m.group(1)}\n{contenido}\n{m.group(3)}', txt)
    ruta.write_text(txt, encoding='utf-8')


# ---------- Fichas ----------

def ficha(clave):
    s = SOL[clave]
    stats = '\n'.join(f'          <div class="stat"><span class="stat-num">{e(ev(clave, i)["num"])}</span><span class="stat-label">{e(ev(clave, i)["titulo"])}</span></div>' for i in s['hero_ev'])
    fuentes = ' · '.join(dict.fromkeys(ev(clave, i)['fuente'] for i in s['hero_ev']))
    foto = ''
    if s.get('img'):
        foto = f'\n        <figure class="ficha-foto"><img src="{s["img"][0]}" alt="{e(s["img"][1])}" width="1200" height="900"></figure>'

    problema = '\n'.join(f'          <p>{e(p)}</p>' for p in s['problema'])
    solucion = '\n'.join(f'          <p>{e(p)}</p>' for p in s['solucion'])
    antes = ''
    if s.get('antes_despues'):
        a, d, ta, td = s['antes_despues']
        antes = f'''
    <div class="antes-despues">
      <figure><img src="{a}" alt="{e(ta)}" width="900" height="504" loading="lazy"><figcaption><span class="punto" aria-hidden="true"></span>Antes</figcaption></figure>
      <figure><img src="{d}" alt="{e(td)}" width="900" height="504" loading="lazy"><figcaption><span class="punto punto--ok" aria-hidden="true"></span>Después</figcaption></figure>
    </div>'''

    mejoras = '\n'.join(f'''      <article class="card">
        <svg class="icon icon-lg" aria-hidden="true"><use href="#i-{AREAS[a][0]}"></use></svg>
        <h3 class="h3">{e(a)}</h3>
        <p>{e(t)}</p>
      </article>''' for a, t in s['mejoras'])

    modelos = ''
    if s.get('modelos'):
        tarjetas = []
        for m in s['modelos']:
            img = f'<img src="{m["img"]}" alt="{e(s["nombre"])} {e(m["nombre"])}" loading="lazy">' if m.get('img') else ''
            dl = ''
            if m['specs']:
                dl = '<dl>' + ''.join(f'<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in m['specs']) + '</dl>'
            tarjetas.append(f'''      <article class="card modelo" id="{m['id']}">
        {img}
        <h3 class="h3">{e(m['nombre'])}</h3>
        <p>{e(m['texto'])}</p>
        {dl}
      </article>''')
        modelos = f'''
    <div class="section-head" style="margin-top:0">
      <p class="label">{e(s['nombre'])}</p>
      <h2 class="h1">{e(s['modelos_titulo'])}</h2>
    </div>
    <div class="modelos">
{chr(10).join(tarjetas)}
    </div>'''

    extra = ''
    if s.get('tabla_extra'):
        t, filas = s['tabla_extra']
        extra = f'''
    <h3 class="h2 subtitulo-tabla">{e(t)}</h3>
    <table class="specs"><tbody>{''.join(f'<tr><th scope="row">{e(k)}</th><td>{e(v)}</td></tr>' for k, v in filas)}</tbody></table>'''

    specs = ''
    if s['specs']:
        titulo_specs = s['specs_titulo'] or 'Datos de la marca'
        head = '' if modelos else f'''
    <div class="section-head">
      <p class="label">{e(s['nombre'])}</p>
      <h2 class="h1">{e(titulo_specs)}</h2>
    </div>'''
        sub = f'\n    <h3 class="h2 subtitulo-tabla">{e(titulo_specs)}</h3>' if modelos else ''
        specs = f'''{head}{sub}
    <table class="specs"><tbody>{''.join(f'<tr><th scope="row">{e(k)}</th><td>{e(v)}</td></tr>' for k, v in s['specs'])}</tbody></table>'''

    evidencias = '\n'.join(bloque_ev(c, n == 0) for n, c in enumerate(s['evidencia'].values()))
    chips = '\n'.join(f'      <a class="chip" href="{enlace_industria(i)}">{e(IND[i]["nombre"])}</a>' for i in s['aplicaciones'])

    cuerpo = f'''<section class="hero on-dark">
  {TRAMA}
  <div class="container">
{cabecera('/')}
    <div class="hero-body hero-body--interior">
      <nav aria-label="Ruta"><ol class="breadcrumb"><li><a href="/">Inicio</a></li><li><a href="/#soluciones">Soluciones</a></li><li aria-current="page">{e(s['nombre'])}</li></ol></nav>
      <div class="hero-industria">
        <div>
          <p class="label">{e(s['nombre'])} · {e(s['origen'])}</p>
          <h1 class="h-display h-ficha">{e(s['h1'])}</h1>
          <p class="lead">{e(s['lead'])}</p>
          <div class="stats stats--ficha">
{stats}
          </div>
          <p class="fuentes">Fuentes: {e(fuentes)}</p>
        </div>{foto}
      </div>
    </div>
  </div>
</section>

<main>
<section class="section">
  <div class="container">
    <div class="section-head">
      <p class="label">Qué resuelve</p>
      <h2 class="h1">El problema y cómo lo resuelve</h2>
    </div>
    <div class="dos-col">
      <div>
        <h3 class="h3">El problema</h3>
{problema}
      </div>
      <div>
        <h3 class="h3">Cómo lo resuelve</h3>
{solucion}
      </div>
    </div>{antes}
  </div>
</section>

<section class="section bg-blanco">
  <div class="container">
    <div class="section-head">
      <p class="label">Qué mejora</p>
      <h2 class="h1">Qué mejora en tu operación</h2>
    </div>
    <div class="grid">
{mejoras}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">{modelos}{extra}{specs}
  </div>
</section>

<section class="section bg-profundo on-dark" id="evidencia">
  <div class="container">
    <div class="section-head">
      <p class="label">{e(s['nombre'])}</p>
      <h2 class="h1">Casos de éxito</h2>
      <p class="lead">Resultados medidos por estudios independientes, clientes y fabricantes. En Chile validamos cada solución con un piloto en tu operación.</p>
    </div>
    <div class="evidencia">
{evidencias}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <p class="label">Dónde se aplica</p>
      <h2 class="h2">Industrias</h2>
    </div>
    <div class="chips">
{chips}
    </div>
  </div>
</section>

{cta_banda(f'Evalúa {s["nombre"]} en tu operación', 'Revisamos tu caso y te entregamos una estimación de resultados y retorno.')}
</main>'''
    og = s['img'][0] if s.get('img') else '/assets/img/instalacion-aerofoil.webp'
    return documento(f'{s["titulo_pagina"]} | Andek Solutions', s['lead'], cuerpo, og)


# ---------- Industria: Supermercados ----------

PLANO = '''<figure class="plano">
          <svg role="img" aria-label="Plano de un supermercado con siete puntos numerados: góndolas abiertas, puertas de vidrio de congelados, acceso a la cámara de frío, evaporador de la cámara, iluminación de vitrinas, hielo en la cámara y drenajes de condensado" viewBox="0 0 520 380" font-family="Inter, system-ui, sans-serif">
            <rect x="20" y="20" width="480" height="340" rx="6" fill="#FFFFFF" stroke="#96A1A5" stroke-width="1.5"/>
            <rect x="36" y="36" width="160" height="100" rx="4" fill="#E7EBEC" stroke="#5D7279" stroke-width="1.5"/>
            <text x="50" y="122" font-size="11" fill="#2D444B" letter-spacing="1">CÁMARA DE FRÍO</text>
            <rect x="50" y="48" width="66" height="18" rx="3" fill="#FFFFFF" stroke="#5D7279"/>
            <circle cx="64" cy="57" r="5" fill="none" stroke="#2D444B" stroke-width="1.5"/>
            <circle cx="83" cy="57" r="5" fill="none" stroke="#2D444B" stroke-width="1.5"/>
            <circle cx="102" cy="57" r="5" fill="none" stroke="#2D444B" stroke-width="1.5"/>
            <line x1="120" y1="136" x2="168" y2="136" stroke="#2D444B" stroke-width="5" stroke-linecap="round"/>
            <rect x="36" y="160" width="30" height="184" rx="3" fill="#E7EBEC" stroke="#5D7279" stroke-width="1.5"/>
            <text x="0" y="0" font-size="11" fill="#2D444B" letter-spacing="1" transform="translate(56 334) rotate(-90)">GÓNDOLAS ABIERTAS</text>
            <rect x="150" y="196" width="210" height="28" rx="3" fill="#E7EBEC" stroke="#5D7279" stroke-width="1.5"/>
            <path d="M176 196v28M202 196v28M228 196v28M254 196v28M280 196v28M306 196v28M332 196v28" stroke="#5D7279" stroke-width="1.2"/>
            <text x="168" y="246" font-size="11" fill="#2D444B" letter-spacing="1">PUERTAS DE CONGELADOS</text>
            <rect x="150" y="268" width="210" height="14" rx="3" fill="#E7EBEC"/>
            <rect x="150" y="304" width="210" height="14" rx="3" fill="#E7EBEC"/>
            <rect x="396" y="70" width="88" height="140" rx="4" fill="#E7EBEC" stroke="#5D7279" stroke-width="1.5"/>
            <text x="408" y="228" font-size="11" fill="#2D444B" letter-spacing="1">VITRINAS</text>
            <path d="M410 60l-6-10M440 58v-12M470 60l6-10" stroke="#5D7279" stroke-width="1.5" stroke-linecap="round"/>
            <text x="418" y="344" font-size="11" fill="#5D7279" letter-spacing="1">ENTRADA</text>
            <g><circle cx="88" cy="252" r="14" fill="#F2A93B"/><text x="88" y="257" font-size="13" font-weight="500" fill="#1B2B30" text-anchor="middle">1</text></g>
            <g><circle cx="255" cy="180" r="14" fill="#F2A93B"/><text x="255" y="185" font-size="13" font-weight="500" fill="#1B2B30" text-anchor="middle">2</text></g>
            <g><circle cx="144" cy="156" r="14" fill="#F2A93B"/><text x="144" y="161" font-size="13" font-weight="500" fill="#1B2B30" text-anchor="middle">3</text></g>
            <g><circle cx="138" cy="57" r="14" fill="#F2A93B"/><text x="138" y="62" font-size="13" font-weight="500" fill="#1B2B30" text-anchor="middle">4</text></g>
            <g><circle cx="440" cy="140" r="14" fill="#F2A93B"/><text x="440" y="145" font-size="13" font-weight="500" fill="#1B2B30" text-anchor="middle">5</text></g>
            <g><circle cx="172" cy="92" r="14" fill="#F2A93B"/><text x="172" y="97" font-size="13" font-weight="500" fill="#1B2B30" text-anchor="middle">6</text></g>
            <g><circle cx="88" cy="318" r="14" fill="#F2A93B"/><text x="88" y="323" font-size="13" font-weight="500" fill="#1B2B30" text-anchor="middle">7</text></g>
          </svg>
          <figcaption><span>1 Góndolas</span><span>2 Puertas de vidrio</span><span>3 Acceso a cámara</span><span>4 Evaporador</span><span>5 Iluminación</span><span>6 Hielo y humedad</span><span>7 Drenajes</span></figcaption>
        </figure>'''


def industria_supermercados():
    zonas = []
    for n, z in enumerate(ZONAS_SUPERMERCADOS, 1):
        s, c = SOL[z['sol']], ev(z['sol'], z['ev'])
        k, v = z['extra']
        zonas.append(f'''    <article class="zona">
      <div class="zona-titulo"><span class="marcador">{n}</span><div><h3>{e(z['titulo'])}</h3><span class="zona-donde">{e(z['donde'])}</span></div></div>
      <div class="zona-cuerpo">
        <div class="zona-col"><span class="label">Qué pasa</span><p>{e(z['pasa'])}</p></div>
        <div class="zona-col"><span class="label">Qué hacemos</span><p>{e(z['hacemos'])}</p></div>
        <div class="zona-dato">
          <div><span class="cifra-num">{e(c['num'])}</span><span class="cifra-txt">{e(c['titulo'])}</span><span class="fuente">Fuente: {e(c['fuente'])}</span></div>
          <div class="extra"><span class="label">{e(k)}</span><span>{e(v)}</span></div>
          <div class="pie"><span class="marca">{e(s['nombre'])}</span><a class="link-flecha" href="/{s['archivo']}">Ver la ficha →</a></div>
        </div>
      </div>
    </article>''')
    sol_d, ev_d = EVIDENCIA_SUPERMERCADOS
    d = ev(sol_d, ev_d)
    cuerpo = f'''<section class="hero on-dark">
  {TRAMA}
  <div class="container">
{cabecera('/')}
    <div class="hero-body hero-body--interior">
      <nav aria-label="Ruta"><ol class="breadcrumb"><li><a href="/">Inicio</a></li><li><a href="/#soluciones">Soluciones</a></li><li aria-current="page">Supermercados</li></ol></nav>
      <div class="hero-industria">
        <div>
          <h1 class="h-display h-ficha">Supermercados</h1>
          <p class="lead">Siete puntos donde un supermercado o tienda de conveniencia pierde energía, producto u horas de mantenimiento, y la tecnología que aplicamos en cada uno. Todas se instalan sin reemplazar los equipos de frío.</p>
          <div><a class="btn btn-outline-claro" href="#puntos">Ver los siete puntos</a></div>
        </div>
        {PLANO}
      </div>
    </div>
  </div>
</section>

<main>
<section class="section" id="puntos">
  <div class="container">
    <div class="section-head" style="margin-bottom:32px">
      <p class="label">Puntos de pérdida</p>
      <h2 class="h1">Qué pasa y qué hacemos en cada punto</h2>
    </div>
{chr(10).join(zonas)}
  </div>
</section>

<section class="section" style="padding-top:0" aria-label="Evidencia">
  <div class="container">
    <div class="destacado on-dark">
      <div>
        <p class="label">{e(d['tipo'])}</p>
        <h2 class="h2">{e(SOL[sol_d]['nombre'])} en supermercados de California</h2>
        <p>{e(d['detalle'])}</p>
        <a class="link-flecha" href="/{SOL[sol_d]['archivo']}#evidencia">Ver el caso completo →</a>
      </div>
      <div class="destacado-cifras">
        <div><span class="ev-num ev-num--senal">{e(d['num'])}</span><span class="ev-titulo">{e(d['titulo'])}</span></div>
        <span class="fuente" style="flex-basis:100%;color:var(--niebla)">Fuente: {e(d['fuente'])}</span>
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0" aria-label="Preguntas frecuentes">
  <div class="container">
    <div class="faq">
      <h2 class="h2">Preguntas frecuentes</h2>
      <div>
        <details open><summary>¿Hay que cerrar la tienda para instalar?</summary><p>No. Aerofoil se instala de noche sin cortar la energía, Clarifoil toma 15–20 minutos por puerta y los filtros CNT no requieren intervenir el equipo. Coordinamos cada instalación con el equipo de operaciones.</p></details>
        <details><summary>¿Cómo se mide el resultado?</summary><p>Antes de instalar medimos una línea base de consumo, fallas o mantenimiento, según el caso. Después del piloto comparamos contra esa misma medición.</p></details>
        <details><summary>¿Se puede partir con una sola tienda?</summary><p>Sí. Recomendamos un piloto en un local o en un grupo de muebles, y escalar con los resultados medidos.</p></details>
      </div>
    </div>
  </div>
</section>

{cta_banda('Agenda un diagnóstico en tu tienda', 'Revisamos tu operación y te entregamos una estimación de ahorro y retorno.')}
</main>'''
    return documento('Supermercados | Andek Solutions',
                     'Siete puntos donde un supermercado pierde energía, producto u horas de mantenimiento, y la tecnología que aplicamos en cada uno.',
                     cuerpo)


def main():
    for k in ORDEN:
        (RAIZ / SOL[k]['archivo']).write_text(ficha(k), encoding='utf-8')
        print('ficha', SOL[k]['archivo'])
    (RAIZ / 'industria-supermercados.html').write_text(industria_supermercados(), encoding='utf-8')
    print('industria-supermercados.html')
    reemplazar_bloques(RAIZ / 'index.html', {
        'ICONOS': ICONOS, 'CABECERA': cabecera(''), 'CIFRAS': cifras(), 'AREAS': areas(),
        'PANELES': paneles(), 'EVIDENCIA': evidencia_portada(), 'MAPA': mapa(), 'CLIENTES': clientes(), 'PIE': pie(),
    })
    print('index.html')


if __name__ == '__main__':
    main()
