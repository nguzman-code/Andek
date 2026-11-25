#!/usr/bin/env python3
"""Genera assets/img/mapa-puntos.svg: mapa del mundo hecho de puntos (sección Nosotros).

Solo hace falta correrlo si se quiere cambiar el mapa base. Las líneas animadas que
llegan a Chile las genera tools/build_site.py con la misma proyección (ver MAPA en
sitio_datos.py).

Datos de tierra: paquete npm `world-atlas` (Natural Earth, dominio público).
  npm install world-atlas@2 topojson-client@3
  node -e "const t=require('world-atlas/land-110m.json');const {feature}=require('topojson-client');require('fs').writeFileSync('land.json',JSON.stringify(feature(t,t.objects.land)))"
  python3 tools/generar_mapa.py land.json

Requiere Pillow.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

# Proyección equirectangular. Debe coincidir con proyectar() en build_site.py.
ESCALA = 4          # unidades SVG por grado
LAT_MAX, LAT_MIN = 80, -58
ANCHO, ALTO = 360 * ESCALA, (LAT_MAX - LAT_MIN) * ESCALA
PASO = 2.5          # grados entre puntos


def proyectar(lon, lat):
    return (lon + 180) * ESCALA, (LAT_MAX - lat) * ESCALA


def main(ruta_land):
    geo = json.loads(Path(ruta_land).read_text())
    mascara = Image.new('L', (ANCHO, ALTO), 0)
    d = ImageDraw.Draw(mascara)
    for f in geo['features']:
        g = f['geometry']
        poligonos = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        for poli in poligonos:
            for i, anillo in enumerate(poli):
                # Desenvuelve anillos que cruzan el antimeridiano (Rusia, Fiyi) y los dibuja
                # también desplazados ±360° para que no aparezcan franjas horizontales.
                coords, ajuste, previo = [], 0, None
                for lon, lat in anillo:
                    if previo is not None and abs(lon + ajuste - previo) > 180:
                        ajuste += -360 if lon + ajuste > previo else 360
                    coords.append((lon + ajuste, lat)); previo = lon + ajuste
                if len(coords) > 2:
                    for desplazamiento in (-360, 0, 360):
                        d.polygon([proyectar(lon + desplazamiento, lat) for lon, lat in coords], fill=0 if i else 255)
    puntos = []
    lat = LAT_MAX - PASO / 2
    while lat > LAT_MIN:
        lon = -180 + PASO / 2
        while lon < 180:
            x, y = proyectar(lon, lat)
            if mascara.getpixel((min(int(x), ANCHO - 1), min(int(y), ALTO - 1))):
                puntos.append(f'M{x:g} {y:g}h0')
            lon += PASO
        lat -= PASO
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ANCHO} {ALTO}">'
           f'<path d="{"".join(puntos)}" stroke="#C3CCCF" stroke-width="5" stroke-linecap="round" fill="none"/></svg>\n')
    salida = Path(__file__).resolve().parent.parent / 'assets' / 'img' / 'mapa-puntos.svg'
    salida.write_text(svg)
    print(f'{len(puntos)} puntos → {salida} ({len(svg) // 1024} KB)')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'land.json')
