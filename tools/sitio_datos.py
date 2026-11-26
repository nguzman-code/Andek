"""Datos del sitio andek.cl: única fuente de verdad para textos de soluciones y cifras.

Cada cifra se define una sola vez (en `evidencia` de su solución) y la portada, las
páginas de industria y las fichas la toman de aquí. Para cambiar una cifra, cámbiala
aquí y vuelve a correr `python3 tools/build_site.py`.

Regla: solo cifras con fuente verificable (estudio, documento del fabricante o
fuente pública). Indicar siempre la fuente y el tipo.
"""

AREAS = {
    'Energía': ('energia', 'Menos consumo en refrigeración, climatización, iluminación y ventilación, sin cambiar los equipos.'),
    'Mantenimiento y fallas': ('herr', 'Menos fallas, descongelamientos, drenajes tapados y recambios de equipos.'),
    'Producto y merma': ('temp', 'Temperatura más estable, menos hielo sobre el producto y mejor exhibición en góndolas, vitrinas y cámaras.'),
    'Personal y seguridad': ('seguridad', 'Menos horas en tareas manuales, como sacar hielo o vigilar puertas, y menos riesgos en cámaras de frío.'),
}

# Orden en que se listan las soluciones en el pie y en las áreas de mejora
ORDEN = ['aerofoil', 'biopipe', 'clarifoil', 'cnt', 'gelclear', 'guardian', 'htf', 'kenfield', 'nualight']

SOL = {
    'aerofoil': {
        'nombre': 'Aerofoil', 'corto': 'Aerofoil', 'origen': 'Reino Unido', 'archivo': 'solucion-aerofoil.html', 'icono': 'frio',
        'titulo_pagina': 'Aerofoil: perfiles aerodinámicos para góndolas abiertas',
        'h1': 'Perfiles aerodinámicos para góndolas abiertas',
        'lead': 'Se instalan en el borde de cada repisa, ordenan la cortina de aire frío y mantienen el frío dentro del mueble. Sin puertas, sin obras y sin cambiar la experiencia de compra.',
        'img': ('/assets/img/fichas/aerofoil.webp', 'Perfil Aerofoil instalado en el borde de una repisa refrigerada'),
        'problema': [
            'En una góndola abierta, el frío se mantiene con una cortina de aire en la parte frontal. Cada vez que un cliente saca un producto, esa cortina se rompe y el aire frío cae al pasillo.',
            'El compresor trabaja más para recuperar la temperatura y el producto queda expuesto a variaciones en las horas de mayor tráfico.',
        ],
        'solucion': [
            'Aerofoil instala perfiles aerodinámicos en el borde frontal de cada repisa. Dirigen el flujo de aire para que la cortina se mantenga estable aunque el cliente meta la mano.',
            'Se montan como un portaprecios, sin modificar el mueble ni cortar la energía.',
        ],
        'mejoras': [
            ('Energía', 'Se pierde menos frío y el compresor hace menos ciclos.'),
            ('Producto y merma', 'Temperatura del producto más estable en las horas de mayor tráfico.'),
            ('Mantenimiento y fallas', 'No requieren mantenimiento. Vida útil de más de 10 años.'),
        ],
        'specs_titulo': 'Especificaciones',
        'specs': [
            ('Aplicación', 'Góndolas abiertas verticales: verdulería, carnes, lácteos y deli'),
            ('Instalación', 'Como portaprecios, sin modificar el mueble. Cerca de 100 m lineales en una noche, sin cortes de energía'),
            ('Mantenimiento', 'No requiere'),
            ('Vida útil', 'Más de 10 años'),
            ('Fabricante', 'Aerofoil Energy (Reino Unido)'),
        ],
        'evidencia': {
            'calnext': {'num': '9–14 %', 'titulo': 'menos consumo del compresor en góndolas abiertas', 'detalle': 'Estudio de campo en supermercados de California. Payback estimado de 7 a 17 meses.', 'fuente': 'CalNEXT, 2024', 'tipo': 'Estudio independiente'},
            'sainsburys': {'num': '15 %', 'titulo': 'menos energía en refrigeración en la red de tiendas de Sainsbury’s', 'detalle': 'Resultado declarado por el cliente tras instalar Aerofoil. Reino Unido.', 'fuente': 'aerofoil-energy.com', 'tipo': 'Testimonio de cliente'},
            'tiendas': {'num': '12.000', 'titulo': 'supermercados y tiendas de conveniencia con Aerofoil en el mundo', 'detalle': '', 'fuente': 'aerofoil-energy.com', 'tipo': 'Dato del fabricante'},
        },
        'hero_ev': ['calnext', 'tiendas'],
        'aplicaciones': ['supermercados'],
    },

    'biopipe': {
        'nombre': 'BioPipe', 'corto': 'BioPipe', 'origen': 'Reino Unido', 'archivo': 'solucion-biopipe.html', 'icono': 'agua',
        'titulo_pagina': 'BioPipe: tubería de drenaje que evita el biofilm',
        'h1': 'Tubería de drenaje que evita el biofilm',
        'lead': 'Sistema de drenaje para refrigeración y climatización que impide que el biofilm se adhiera a la tubería. Menos drenajes tapados, fugas de agua y llamados de mantención, sin químicos ni reaplicaciones.',
        'img': ('/assets/img/fichas/biopipe.webp', 'Tuberías de drenaje BioPipe'),
        'antes_despues': ('/assets/img/fichas/biopipe-antes.webp', '/assets/img/fichas/biopipe-despues.webp', 'Drenaje convencional con biofilm acumulado', 'Tubería BioPipe en la inspección de los 12 meses'),
        'problema': [
            'Las bacterias del agua de condensado se adhieren a la tubería de drenaje y forman una capa de biofilm. Con el tiempo el drenaje se tapa, el agua rebalsa y aparecen fugas bajo los muebles refrigerados.',
            'En los muebles actuales queda poco espacio para el drenaje y la pendiente es baja, lo que acelera el problema. Las soluciones químicas dependen de reaplicarse y de que se cumplan los programas de limpieza.',
        ],
        'solucion': [
            'BioPipe es una tubería de drenaje cuyo material fue modificado con zinc, un mineral natural. Su superficie impide que bacterias, hongos y biofilm se adhieran.',
            'No lleva químicos, recubrimientos ni biocidas, y no se desgasta: el efecto dura toda la vida de la tubería. Se instala igual que un drenaje convencional, sin equipos ni capacitación especial.',
        ],
        'mejoras': [
            ('Mantenimiento y fallas', 'Menos drenajes tapados, fugas de agua y llamados de mantención correctiva.'),
            ('Personal y seguridad', 'Menos agua en el piso de la sala de ventas y menos horas del equipo técnico destinadas a drenajes.'),
        ],
        'specs_titulo': 'Especificaciones',
        'specs': [('Sistemas', 'ABS con unión por solvente (BS EN 1455-1) y PVC Schedule 40 (ASTM D1785 / D2665)'),
                  ('Tecnología', 'Superficie modificada con zinc, sin biocidas, plata, triclosán ni nanomateriales'),
                  ('Ensayos', 'ISO 22196 e ISO 21702'),
                  ('Certificación', 'Producto aprobado WRAS'),
                  ('Instalación', 'Pendiente recomendada de 10 mm por metro (1 en 100)'),
                  ('Fin de vida útil', 'Reutilizable y 100 % reciclable'),
                  ('Fabricante', 'Bio Products Group (Warrington, Reino Unido)')],
        'evidencia': {
            'fugas': {'num': '93 %', 'titulo': 'menos fugas de agua en un período de 16 meses', 'detalle': 'Caso en tiendas del Reino Unido entre septiembre de 2018 y enero de 2020.', 'fuente': 'Bio Products Group (fabricante)', 'tipo': 'Caso del fabricante'},
            'payback': {'num': '< 1 año', 'titulo': 'de retorno de la inversión', 'detalle': 'Con un costo total de propiedad menor que el de un drenaje convencional.', 'fuente': 'Bio Products Group (fabricante)', 'tipo': 'Dato del fabricante'},
            'iso': {'num': 'Hasta 99,999 %', 'titulo': 'de efectividad contra el crecimiento de bacterias en la superficie', 'detalle': 'Ensayo según ISO 22196, que mide la actividad antibacteriana en plásticos.', 'fuente': 'Bio Products Group, ensayo ISO 22196', 'tipo': 'Ensayo de laboratorio'},
        },
        'hero_ev': ['fugas', 'payback'],
        'aplicaciones': ['supermercados', 'frigorificos'],
    },
    'clarifoil': {
        'nombre': 'Clarifoil', 'corto': 'Clarifoil', 'origen': 'Reino Unido', 'archivo': 'solucion-clarifoil.html', 'icono': 'vidrio',
        'titulo_pagina': 'Clarifoil: láminas anti-empañamiento para puertas de vidrio',
        'h1': 'Láminas anti-empañamiento para puertas de vidrio',
        'lead': 'Se instalan en el interior del vidrio de puertas de congelados y refrigerados. El producto queda siempre visible y el heater de la puerta puede bajar a 15–20 % de operación.',
        'img': ('/assets/img/fichas/clarifoil.webp', 'Clienta frente a puertas de congelados con vidrio despejado'),
        'antes_despues': ('/assets/img/fichas/clarifoil-antes.webp', '/assets/img/fichas/clarifoil-despues.webp', 'Puertas de congelados empañadas', 'Las mismas puertas con láminas anti-empañamiento'),
        'problema': [
            'Cuando se abre una puerta de congelados, el aire húmedo de la tienda choca con el vidrio frío y lo empaña. El cliente no ve el producto.',
            'Para evitarlo, las puertas tienen heaters eléctricos que calientan el vidrio de forma permanente. Consumen energía y además agregan calor que el equipo de frío tiene que sacar.',
        ],
        'solucion': [
            'La lámina, de acetato de celulosa, desplaza el punto de rocío en la superficie del vidrio y el vapor no se condensa. Si se acumula humedad, su superficie hidrofílica la dispersa en una capa transparente.',
            'Como el empañamiento se previene de forma pasiva, el heater puede quedar al 15–20 % de su capacidad, solo como respaldo.',
        ],
        'mejoras': [
            ('Energía', 'El heater baja a 15–20 % de operación y el equipo de frío recibe menos calor.'),
            ('Producto y merma', 'El producto queda visible todo el día, también en horas de alto tráfico.'),
            ('Mantenimiento y fallas', 'No hace falta secar ni limpiar vidrios empañados.'),
        ],
        'specs_titulo': 'Especificaciones',
        'specs': [
            ('Aplicación', 'Puertas de vidrio de congelados y refrigerados'),
            ('Material', 'Acetato de celulosa (biobasado)'),
            ('Transmitancia luminosa', 'Más de 92 %, sin distorsión óptica'),
            ('Rango de temperatura', '−25 °C a +35 °C'),
            ('Vida útil', '7 a 10 años'),
            ('Instalación', '15–20 minutos por puerta'),
            ('Fabricante', 'Clarifoil, grupo Celanese (Reino Unido)'),
        ],
        'evidencia': {
            'ahorro': {'num': '31–41 %', 'titulo': 'menos consumo energético por puerta', 'detalle': 'El heater pasa de operar al 100 % a un 15–20 %.', 'fuente': 'Clarifoil (fabricante)', 'tipo': 'Dato del fabricante'},
        },
        'hero_ev': ['ahorro'],
        'aplicaciones': ['supermercados'],
    },

    'cnt': {
        'nombre': 'CNT Technology', 'corto': 'CNT', 'origen': 'Alemania', 'archivo': 'solucion-cnt.html', 'icono': 'agua',
        'titulo_pagina': 'CNT Technology: filtros de humedad para cámaras de frío y congeladores',
        'h1': 'Filtros de humedad para cámaras de frío y congeladores',
        'lead': 'Filtros moleculares que regulan la humedad del aire sin electricidad. Reducen el hielo en evaporadores y productos, los descongelamientos y las fallas.',
        'img': ('/assets/img/fichas/cnt.webp', 'Filtros moleculares CNT Technology'),
        'problema': [
            'La humedad que entra a una cámara o congelador se congela en el evaporador y sobre los productos. El evaporador transfiere peor el calor, el compresor trabaja más y los descongelamientos se alargan.',
            'El hielo también provoca fallas inesperadas, pérdida de mercadería y horas del personal dedicadas a sacarlo.',
        ],
        'solucion': [
            'El filtro molecular adsorbe moléculas de agua cuando la humedad sube y las libera cuando baja. Así evita los peaks de humedad y la condensación antes de que lleguen al evaporador.',
            'No tiene componentes eléctricos. En cámaras se instala en la entrada de aire del evaporador; en congeladores y muebles cerrados queda casi invisible. Solo se reemplaza si se daña físicamente.',
        ],
        'mejoras': [
            ('Mantenimiento y fallas', 'Menos fallas inesperadas y descongelamientos más cortos.'),
            ('Energía', 'Mejor transferencia de calor en el evaporador y menos tiempo de compresor.'),
            ('Producto y merma', 'Menos hielo sobre los productos y temperaturas más estables.'),
            ('Personal y seguridad', 'Menos horas sacando hielo y nieve, y condiciones de trabajo más seguras.'),
        ],
        'modelos_titulo': 'Formatos',
        'modelos': [
            {'id': 'camaras', 'nombre': 'Cámaras de frío y congelado', 'texto': 'Se instala directamente en la entrada de aire del evaporador, de forma tan simple como colgar un cuadro.', 'img': None, 'specs': []},
            {'id': 'muebles', 'nombre': 'Congeladores y muebles cerrados', 'texto': 'Para equipos cerrados. Queda casi invisible y actúa sobre el aire que circula en el mueble.', 'img': None, 'specs': []},
        ],
        'specs_titulo': 'Datos técnicos',
        'specs': [
            ('Energía eléctrica', 'No requiere'),
            ('Funcionamiento', 'Continuo, por adsorción y desorción de vapor de agua'),
            ('Reemplazo', 'Solo si se daña físicamente'),
            ('Retorno de la inversión', 'Habitualmente entre 1 y 3 años, según el fabricante'),
            ('Fabricante', 'CNT Technology GmbH (Chemnitz, Alemania)'),
        ],
        'evidencia': {
            'rewe': {'num': '83 %', 'titulo': 'menos fallas en congeladores vs. los 365 días previos a la instalación', 'detalle': 'Descongelamientos hasta 87 % más cortos (38 % en promedio). Menos hielo en productos y equipos.', 'fuente': 'CNT Technology, caso REWE (Alemania)', 'tipo': 'Caso del fabricante'},
            'edeka': {'num': '72 %', 'titulo': 'menos fallas en congeladores vs. el año previo a la instalación', 'detalle': 'Descongelamientos hasta 61 % más cortos (43 % en promedio). Menos tiempo del personal sacando hielo.', 'fuente': 'CNT Technology, caso Edeka (Alemania)', 'tipo': 'Caso del fabricante'},
            'mcdonalds': {'num': '11–49 %', 'titulo': 'menos consumo de energía en congelador (11 %) y cámara de frío (49 %)', 'detalle': 'Tiempo de compresor entre 8 % y 43 % menor, con temperaturas más estables.', 'fuente': 'CNT Technology, caso McDonald’s (Alemania)', 'tipo': 'Caso del fabricante'},
        },
        'hero_ev': ['rewe', 'mcdonalds'],
        'aplicaciones': ['supermercados', 'food', 'frigorificos', 'agro'],
    },

    'gelclear': {
        'nombre': 'Gel-clear', 'corto': 'Gel-clear', 'origen': 'Reino Unido', 'archivo': 'solucion-gelclear.html', 'icono': 'herr',
        'titulo_pagina': 'Gel-clear: tabletas para drenajes de condensado',
        'h1': 'Tabletas para drenajes de condensado',
        'lead': 'Previenen el biofilm en bandejas, drenajes y bombas de condensado de equipos de frío y climatización. Menos drenajes tapados, fallas y malos olores.',
        'img': ('/assets/img/fichas/gelclear.webp', 'Tableta Gel-clear QP34 en una bandeja de condensado'),
        'problema': [
            'En las bandejas y drenajes de condensado de muebles refrigerados y equipos de climatización se forma biofilm. Los drenajes se tapan, el agua rebalsa y aparecen malos olores y fallas.',
            'Resolverlo exige visitas de mantenimiento correctivo y, a veces, detener el equipo.',
        ],
        'solucion': [
            'Se pone una tableta en la bandeja de condensado, en contacto con el agua. Al disolverse, recubre todo el drenaje con una capa antimicrobiana que impide que el biofilm se adhiera.',
            'Sirve para drenajes por gravedad, con bomba o por vacío, y no daña bombas ni metales.',
        ],
        'mejoras': [
            ('Mantenimiento y fallas', 'Menos drenajes tapados y fallas por agua. Se integra al mantenimiento anual, con una tableta por equipo.'),
        ],
        'modelos_titulo': 'Productos',
        'modelos': [
            {'id': 'qp34', 'nombre': 'QP34', 'texto': 'Tableta para drenajes de equipos de frío y climatización. Una tableta, un equipo, un año.', 'img': None,
             'specs': [('Protección', '1 año'), ('Certificación', 'Aprobada NSF'), ('Compatibilidad', 'Todo tipo de drenaje y bombas de condensado'), ('Material', 'No corrosiva para metales, 100 % biodegradable'), ('Uso', 'Profesional')]},
            {'id': 'evap-tab', 'nombre': 'EVAP-TAB (CE30)', 'texto': 'Tableta con aceite de árbol de té, sin biocidas agresivos, para bandejas evaporadoras calefaccionadas y enfriadores evaporativos.', 'img': None,
             'specs': [('Protección', '6 meses'), ('Efecto', 'Previene biofilm y malos olores'), ('Compatibilidad', 'Bombas de condensado, cobre y aluminio'), ('Uso', 'Profesional')]},
            {'id': 'tgs18', 'nombre': 'TGS18', 'texto': 'Tratamiento con aceite de árbol de té para equipos murales y bombas de estanque.', 'img': None,
             'specs': [('Protección', '6 meses'), ('Efecto', 'Previene la obstrucción de bombas y elimina malos olores'), ('Material', '100 % biodegradable')]},
        ],
        'specs_titulo': None,
        'specs': [('Fabricante', 'Gel-clear Ltd (Lancashire, Reino Unido)')],
        'evidencia': {
            'qp34': {'num': '1 año', 'titulo': 'de protección con una tableta por equipo (QP34)', 'detalle': 'Sus fórmulas EVAP-TAB y TGS18 protegen 6 meses.', 'fuente': 'Gel-clear (fabricante)', 'tipo': 'Dato del fabricante'},
        },
        'hero_ev': ['qp34'],
        'aplicaciones': ['supermercados'],
    },

    'guardian': {
        'nombre': 'Guardian Controls', 'corto': 'Guardian', 'origen': 'Reino Unido', 'archivo': 'solucion-guardian.html', 'icono': 'vent',
        'titulo_pagina': 'Guardian Controls: control de ventiladores y alarmas para cámaras de frío',
        'h1': 'Control de ventiladores y alarmas para cámaras de frío',
        'lead': 'Dos equipos que se instalan sobre la cámara existente: el FSO ajusta la velocidad de los ventiladores del evaporador según la demanda y Door Sentry avisa cuando una puerta queda abierta.',
        'img': ('/assets/img/fichas/guardian.webp', 'Cámara de frío con evaporadores en el techo'),
        'problema': [
            'Los ventiladores de los evaporadores suelen funcionar a velocidad fija, aunque la cámara no lo necesite. Consumen energía y agregan calor que el sistema tiene que sacar.',
            'Las puertas de cámara quedan abiertas más tiempo del necesario: entra aire cálido y húmedo, se forma hielo y el producto pierde temperatura.',
        ],
        'solucion': [
            'El Fan Speed Optimiser (FSO) evalúa las condiciones de la cámara en tiempo real y ajusta la velocidad de los ventiladores sin afectar la temperatura del producto.',
            'Door Sentry detecta puertas abiertas más tiempo del necesario y emite una alarma. Combinado con el FSO, baja la velocidad de los ventiladores mientras la puerta está abierta.',
        ],
        'mejoras': [
            ('Energía', 'Menos consumo directo de los motores y menos calor que sacar de la cámara.'),
            ('Producto y merma', 'Protege la temperatura del producto cuando las puertas quedan abiertas.'),
            ('Mantenimiento y fallas', 'Door Sentry ayuda a reducir el mantenimiento al evitar puertas abiertas.'),
            ('Personal y seguridad', 'Door Sentry incluye entradas para alarma de hombre atrapado y sensor de gas.'),
        ],
        'modelos_titulo': 'Equipos',
        'modelos': [
            {'id': 'fso', 'nombre': 'Fan Speed Optimiser (FSO)', 'texto': 'Optimiza la velocidad de los ventiladores de evaporadores en cámaras de frío y congelado.', 'img': None,
             'specs': [('Compatibilidad', 'Motores PSC, polo sombreado y EC'), ('Instalación', 'Retrofit en menos de 1 hora, sin entrar a la cámara'), ('Comunicación', 'RS485 o Ethernet opcional'), ('Ahorro indirecto', 'Por cada 1 kWh ahorrado en el motor, 0,8 kWh adicionales en motores PSC y 0,35 kWh en motores EC')]},
            {'id': 'door-sentry', 'nombre': 'Door Sentry', 'texto': 'Alarma sonora y control de puerta. Su señal de apertura permite al FSO bajar la velocidad de los ventiladores.', 'img': '/assets/img/fichas/guardian-door-sentry.webp',
             'specs': [('Montaje', 'Pared o panel, 230 V o 24 V'), ('Instalación', 'Rápida, sin entrar a la cámara'), ('Entradas adicionales', 'Hombre atrapado y sensor de gas'), ('Comunicación', 'RS485 o Ethernet opcional')]},
        ],
        'specs_titulo': None,
        'specs': [('Fabricante', 'Guardian Controls (Reino Unido)')],
        'evidencia': {
            'fso': {'num': '36 %', 'titulo': 'de ahorro promedio en motores de evaporador con FSO', 'detalle': '', 'fuente': 'Guardian Controls (fabricante)', 'tipo': 'Dato del fabricante'},
            'sentry': {'num': '17 %', 'titulo': 'de ahorro adicional en energía de cámara con Door Sentry', 'detalle': '', 'fuente': 'Guardian Controls (fabricante)', 'tipo': 'Dato del fabricante'},
            'unidades': {'num': '+5.000', 'titulo': 'unidades FSO instaladas en supermercados del Reino Unido', 'detalle': '', 'fuente': 'Guardian Controls (fabricante)', 'tipo': 'Dato del fabricante'},
        },
        'hero_ev': ['fso', 'sentry'],
        'aplicaciones': ['supermercados', 'food', 'frigorificos', 'agro'],
    },

    'htf': {
        'nombre': 'HTF Compact ECO', 'corto': 'HTF Compact', 'origen': 'Italia', 'archivo': 'solucion-htf.html', 'icono': 'temp',
        'titulo_pagina': 'HTF Compact ECO: nanofluido para chillers y climatización',
        'h1': 'Nanofluido para chillers y sistemas de climatización',
        'lead': 'Se agrega al circuito de agua de chillers y sistemas HVAC en operación. Mejora la transferencia de calor y reduce el consumo eléctrico, sin modificar los equipos.',
        'img': ('/assets/img/fichas/htf.webp', 'Torres de enfriamiento de un sistema de climatización'),
        'problema': [
            'En chillers y sistemas HVAC, la eficiencia depende de qué tan rápido el agua, o el agua con glicol, transfiere el calor en los intercambiadores. Si esa transferencia es limitada, el compresor trabaja más tiempo para lograr la misma temperatura.',
            'Cuando el sistema no da abasto, la alternativa habitual es ampliar o reemplazar equipos.',
        ],
        'solucion': [
            'HTF Compact ECO es un nanofluido con nanopartículas de óxidos metálicos en suspensión. Aumenta la conductividad térmica del fluido y mejora el intercambio de calor.',
            'Se dosifica con el sistema funcionando, mediante una bomba, sin detener ni modificar los equipos. El equipo de TCT apoya la evaluación, la instalación y el monitoreo de resultados.',
        ],
        'mejoras': [
            ('Energía', 'Menos consumo eléctrico y menos tiempo de compresor. Más capacidad de enfriamiento con el mismo equipo.'),
            ('Mantenimiento y fallas', 'No corrosivo según ensayos ASTM, sin efecto en la garantía del chiller según su fabricante.'),
        ],
        'specs_titulo': 'Datos técnicos',
        'specs': [
            ('Aplicación', 'Chillers, sistemas HVAC, enfriamiento de procesos y data centers'),
            ('Fluido base', 'Agua o agua con glicol'),
            ('Instalación', 'Dosificación con el sistema en operación'),
            ('Corrosión', 'No corrosivo (ensayos ASTM D1384 y D2570)'),
            ('Seguridad', 'No favorece pseudomonas ni legionella. No se clasifica como residuo peligroso'),
            ('Fabricante', 'TCT Nanotech (Brindisi, Italia). Planta certificada ISO 9001 e ISO 14001'),
        ],
        'evidencia': {
            'hoffman': {'num': '25 %', 'titulo': 'menos consumo eléctrico en el sistema HVAC de un edificio municipal', 'detalle': 'El salto térmico del agua helada pasó de 4 °F a 9 °F y las válvulas de balance volvieron a operar en rango.', 'fuente': 'TCT Nanotech, piloto Hoffman Estates (EE.UU.), 2021', 'tipo': 'Piloto del fabricante'},
            'quercy': {'num': '11–13 %', 'titulo': 'menos consumo eléctrico en un chiller industrial de 450 kW', 'detalle': 'Sin corrosión ni efecto en la garantía del equipo, según el propio fabricante del chiller.', 'fuente': 'Quercy Réfrigération (Francia), 2025', 'tipo': 'Carta del fabricante del chiller'},
            'fyb': {'num': '22 %', 'titulo': 'menos consumo del chiller en una planta de alimentos', 'detalle': 'Seis meses de monitoreo. En una cámara de frío enfriada por chiller: 13 % menos en dos meses.', 'fuente': 'TCT Nanotech, caso industria de alimentos (Francia)', 'tipo': 'Caso del fabricante'},
        },
        'hero_ev': ['hoffman', 'quercy'],
        'aplicaciones': ['agro', 'edificios'],
    },

    'kenfield': {
        'nombre': 'Kenfield', 'corto': 'Kenfield', 'origen': 'Reino Unido', 'archivo': 'solucion-kenfield.html', 'icono': 'camara',
        'titulo_pagina': 'Kenfield: puertas aisladas y de alto tráfico para cámaras y trastiendas',
        'h1': 'Puertas aisladas y de alto tráfico para cámaras y trastiendas',
        'lead': 'Puertas y cortinas aisladas que reemplazan las cortinas de PVC en cámaras de frío, y puertas de impacto para accesos con tráfico de carros y pallets.',
        'img': ('/assets/img/fichas/kenfield.webp', 'Puerta aislada Kenfield en el acceso a una cámara de frío'),
        'problema': [
            'Las cortinas de PVC se dañan, se endurecen y sellan mal. En cada paso entra calor a la cámara y el compresor tiene que compensarlo.',
            'En trastiendas y zonas de carga, las puertas convencionales reciben golpes de carros y pallets todos los días y terminan fallando.',
        ],
        'solucion': [
            'Kenfield fabrica puertas aisladas de cierre automático para cámaras walk-in (K750), cortinas aisladas para aperturas grandes (K2) y puertas de impacto para accesos de alto tráfico (K150 y K550).',
            'Están diseñadas para el uso diario del retail: cierran solas, resisten golpes y requieren poco mantenimiento.',
        ],
        'mejoras': [
            ('Energía', 'Mejor sellado de la cámara y menos carga para el compresor.'),
            ('Mantenimiento y fallas', 'Bajo mantenimiento y vida útil de 5 a más de 10 años, según el modelo.'),
            ('Personal y seguridad', 'Cierre automático y diseño que protege los dedos en las puertas de impacto.'),
        ],
        'modelos_titulo': 'Modelos',
        'modelos': [
            {'id': 'k750', 'nombre': 'K750', 'texto': 'Puerta aislada de cierre automático para cámaras walk-in de refrigerados y congelados. Reemplaza las cortinas de PVC.', 'img': '/assets/img/fichas/kenfield-k750.webp',
             'specs': [('Uso', 'Cámaras de refrigerados y congelados'), ('Rango de temperatura', '−35 °C a 60 °C'), ('Ancho máximo', '2.350 mm (par)'), ('Vida útil', 'Más de 10 años')]},
            {'id': 'k2', 'nombre': 'K2', 'texto': 'Cortina aislada para aperturas mayores a 2,2 m o tráfico intenso, cuando una puerta no es viable.', 'img': '/assets/img/fichas/kenfield-k2.webp',
             'specs': [('Uso', 'Cámaras con tráfico intenso o aperturas grandes'), ('Ancho máximo', 'Hasta 2.100 mm por cortina'), ('Material', 'PVC / PU aislado'), ('Vida útil', 'Más de 5 años')]},
            {'id': 'k150', 'nombre': 'K150', 'texto': 'Puerta de impacto de polietileno de 15 mm, con bisagras de doble acción en acero inoxidable y paneles de visión.', 'img': '/assets/img/fichas/kenfield-k150.webp',
             'specs': [('Uso', 'Trastienda, cámaras secas, salas de preparación, zonas de carga'), ('Ancho máximo', '2.400 mm (par)'), ('Vida útil', 'Más de 10 años'), ('Material', 'Polietileno 100 % reciclable')]},
            {'id': 'k550', 'nombre': 'K550', 'texto': 'Puerta de impacto con terminación GRP, para accesos visibles al cliente y zonas de food service.', 'img': '/assets/img/fichas/kenfield-k550.webp',
             'specs': [('Uso', 'Accesos visibles al cliente, food service, pastelería'), ('Ancho máximo', '2.400 mm (par)'), ('Vida útil', 'Más de 10 años'), ('Material', 'GRP / polietileno')]},
        ],
        'specs_titulo': None,
        'specs': [('Fabricante', 'Kenfield (Birmingham, Reino Unido)'), ('Certificaciones', 'ISO 9001 e ISO 14001')],
        'evidencia': {
            'warwick': {'num': '21–42 %', 'titulo': 'menos consumo del compresor con K750 frente a cortinas de PVC en cámaras refrigeradas', 'detalle': 'En cámaras de congelado: 13–17 %.', 'fuente': 'Universidad de Warwick', 'tipo': 'Estudio independiente'},
            'puertas': {'num': '+40.000', 'titulo': 'puertas Kenfield suministradas a supermercados', 'detalle': 'Tesco, Sainsbury’s, Aldi y Farmfoods las especifican desde hace años.', 'fuente': 'Kenfield, en The Grocer (Reino Unido)', 'tipo': 'Fabricante'},
        },
        'hero_ev': ['warwick'],
        'aplicaciones': ['supermercados', 'food', 'frigorificos', 'agro'],
    },

    'nualight': {
        'nombre': 'Nualight', 'corto': 'Nualight', 'origen': 'Irlanda', 'archivo': 'solucion-nualight.html', 'icono': 'luz',
        'titulo_pagina': 'Nualight: iluminación LED para muebles refrigerados',
        'h1': 'Iluminación LED para muebles refrigerados',
        'lead': 'Luminarias con espectros calibrados por categoría de producto, alta eficiencia y bajo aporte de calor al mueble.',
        'img': ('/assets/img/fichas/nualight.webp', 'Muebles refrigerados iluminados con LED Nualight'),
        'problema': [
            'La mayoría de las luminarias de retail tienen un índice de reproducción cromática (CRI) de 75–80: los rojos pierden saturación y los blancos se ven grises. El producto se ve menos fresco.',
            'Además, una luminaria ineficiente consume más y agrega calor dentro del mueble refrigerado.',
        ],
        'solucion': [
            'Nualight diseña luminarias LED con CRI 95+ y espectros específicos por categoría, para que cada producto se vea con su color natural.',
            'Su gama ION alcanza 165 lúmenes por watt, con disipación térmica diseñada para no sumar carga al sistema de refrigeración.',
        ],
        'mejoras': [
            ('Energía', 'Alta eficiencia (165 lm/W en gama ION) y menos calor dentro del mueble.'),
            ('Mantenimiento y fallas', '100.000 horas de vida útil (L90): cerca de 15 años a 18 horas diarias.'),
            ('Producto y merma', 'Espectros por categoría que muestran el color natural del producto.'),
        ],
        'modelos_titulo': 'Gamas',
        'modelos': [
            {'id': 'ion', 'nombre': 'ION', 'texto': 'Gama principal para muebles de frío y congelado, vertical y horizontal. 165 lm/W.', 'img': None, 'specs': []},
            {'id': 'orion', 'nombre': 'ORION', 'texto': 'Diseñada para recambio en muebles existentes, con integración simple.', 'img': None, 'specs': []},
            {'id': 'hypercolour', 'nombre': 'HYPERCOLOUR', 'texto': 'Retroiluminación para destacar productos y promociones en el punto de venta.', 'img': None, 'specs': []},
            {'id': 'quickrail', 'nombre': 'QUICKRAIL PRO', 'texto': 'Sistema magnético de distribución de energía para estanterías, compatible con ION y ORION.', 'img': None, 'specs': []},
        ],
        'tabla_extra': ('Espectros por categoría', [
            ('Carnes', 'Red-tone'), ('Frutas y verduras', 'Vivace® · 4000 K'), ('Lácteos', 'Natural White · 4000 K'),
            ('Panadería', 'Warm White · 3000 K'), ('Pescadería', 'Cool White · 5000 K'), ('Congelados', 'Freezer range · 5000 K'),
        ]),
        'specs_titulo': None,
        'specs': [('Fabricante', 'Nualight (Cork, Irlanda), desde 2004. Parte del grupo Fulham')],
        'evidencia': {
            'cri': {'num': 'CRI 95+', 'titulo': 'reproducción del color natural del producto', 'detalle': 'Frente a CRI 75–80 de las luminarias habituales de retail.', 'fuente': 'Nualight (fabricante)', 'tipo': 'Dato del fabricante'},
            'eficiencia': {'num': '165 lm/W', 'titulo': 'de eficiencia en la gama ION', 'detalle': '', 'fuente': 'Nualight (fabricante)', 'tipo': 'Dato del fabricante'},
            'vida': {'num': '100.000 h', 'titulo': 'de vida útil (L90)', 'detalle': 'Cerca de 15 años de operación a 18 horas diarias.', 'fuente': 'Nualight (fabricante)', 'tipo': 'Dato del fabricante'},
        },
        'hero_ev': ['cri', 'vida'],
        'aplicaciones': ['supermercados'],
    },
}

# Tarjetas de la portada (pestañas por industria). La marca es lo principal.
# clave: (solución, producto o '', qué resuelve, texto, etiquetas, id de la cifra)
TARJETAS = {
    'aerofoil': ('aerofoil', '', 'Góndolas abiertas que pierden frío', 'Perfiles en el borde de cada repisa ordenan la cortina de aire. Temperatura más estable y menos trabajo del compresor, sin mantenimiento.', ['Energía', 'Producto', 'Sin mantenimiento'], 'calnext'),
    'clarifoil': ('clarifoil', '', 'Puertas de vidrio que se empañan', 'Láminas anti-empañamiento en el interior del vidrio. El producto queda visible y el heater baja a 15–20 % de operación.', ['Energía', 'Exhibición'], 'ahorro'),
    'kenfield': ('kenfield', '', 'Cortinas de PVC que dejan pasar calor', 'Puertas aisladas de cierre automático, de bajo mantenimiento y diseñadas para accesos de alto tráfico.', ['Energía', 'Mantenimiento', 'Personal'], 'warwick'),
    'nualight': ('nualight', '', 'Luminarias que consumen y calientan el mueble', 'LED con espectro por categoría, menos calor dentro del mueble y larga vida útil.', ['Mantenimiento', 'Energía', 'Exhibición'], 'vida'),
    'guardian': ('guardian', '', 'Ventiladores a tope y puertas de cámara abiertas', 'Control que ajusta los ventiladores del evaporador según la demanda y alarma de puerta abierta. Menos consumo y producto protegido.', [], 'fso'),
    'fso': ('guardian', 'FSO', 'Ventiladores de evaporador siempre a tope', 'Control que ajusta la velocidad de los ventiladores del evaporador según la demanda real.', ['Energía', 'Mantenimiento'], 'fso'),
    'sentry': ('guardian', 'Door Sentry', 'Puertas de cámara que quedan abiertas', 'Alarma de puerta abierta, con entradas para hombre atrapado y sensor de gas. Protege el producto y al personal.', ['Seguridad', 'Producto', 'Energía'], 'sentry'),
    'cnt': ('cnt', '', 'Hielo y fallas en congeladores y cámaras', 'Filtros moleculares que regulan la humedad sin electricidad. Menos hielo, descongelamientos más cortos y menos horas sacando hielo.', ['Fallas', 'Mantenimiento', 'Personal', 'Producto'], 'rewe'),
    'cntFood': ('cnt', '', 'Hielo y fallas en cámaras y congeladores', 'Filtros moleculares que regulan la humedad sin electricidad. Menos hielo en evaporadores y temperaturas más estables.', ['Fallas', 'Energía', 'Producto'], 'mcdonalds'),
    'htf': ('htf', '', 'Chillers y climatización que consumen de más', 'Nanofluido que mejora la transferencia de calor en circuitos de agua. Se agrega con el sistema en operación.', ['Energía', 'Capacidad'], 'hoffman'),
    'htfInd': ('htf', '', 'Chillers de proceso que consumen de más', 'Nanofluido que mejora la transferencia de calor en el circuito del chiller, sin modificar equipos ni afectar su garantía.', ['Energía', 'Sin detener equipos'], 'quercy'),
    'biopipe': ('biopipe', '', 'Fugas de agua por drenajes tapados', 'Tubería de drenaje con una superficie que impide que el biofilm se adhiera. Menos fugas y mantenciones, sin químicos.', [], 'fugas'),
    'gelclear': ('gelclear', '', 'Drenajes de condensado que se tapan', 'Tabletas que previenen el biofilm en bandejas y drenajes. Menos fallas y malos olores, dentro del mantenimiento anual.', ['Fallas', 'Mantenimiento'], 'qp34'),
}

INDUSTRIAS = [
    {'id': 'supermercados', 'descripcion': 'Supermercados, hipermercados y tiendas de conveniencia.', 'nombre': 'Supermercados', 'archivo': 'industria-supermercados.html',
     'tarjetas': ['cnt', 'aerofoil', 'clarifoil', 'kenfield', 'gelclear', 'biopipe', 'guardian', 'nualight']},
    {'id': 'food', 'descripcion': 'Restaurantes, cadenas de comida rápida, casinos y cocinas centrales.', 'nombre': 'Food service', 'archivo': None, 'tarjetas': ['cntFood', 'kenfield', 'guardian']},
    {'id': 'frigorificos', 'descripcion': 'Bodegas refrigeradas y centros de frío de cadenas y operadores logísticos.', 'nombre': 'Frigoríficos', 'archivo': None, 'tarjetas': ['cnt', 'kenfield', 'guardian', 'biopipe']},
    {'id': 'agro', 'descripcion': 'Packings, centrales frutícolas y plantas de proceso.', 'nombre': 'Agroindustria', 'archivo': None, 'tarjetas': ['htfInd', 'cnt', 'guardian', 'kenfield']},
    {'id': 'edificios', 'descripcion': 'Oficinas, centros comerciales, hoteles, clínicas y data centers con climatización central.', 'nombre': 'Edificios e infraestructura', 'archivo': None, 'tarjetas': ['htf']},
]

# Página de industria: Supermercados. Cada zona toma su cifra de la ficha correspondiente.
ZONAS_SUPERMERCADOS = [
    {'sol': 'aerofoil', 'ev': 'calnext', 'titulo': 'Las góndolas abiertas botan aire frío', 'donde': 'Verdulería, lácteos, carnes, deli',
     'pasa': 'Cuando un cliente saca un producto, rompe la cortina de aire frío. El aire cae al pasillo y el compresor trabaja más para recuperar la temperatura.',
     'hacemos': 'Instalamos perfiles en el borde de cada repisa. Ordenan la cortina de aire y se montan como un portaprecios, sin modificar el mueble.',
     'extra': ('Instalación', 'Cerca de 100 m lineales en una noche, sin cortes de energía')},
    {'sol': 'clarifoil', 'ev': 'ahorro', 'titulo': 'Las puertas de vidrio se empañan', 'donde': 'Congelados y refrigerados',
     'pasa': 'Para evitar el empañamiento, los heaters de las puertas funcionan de forma permanente. Consumen energía y además calientan el mueble.',
     'hacemos': 'Instalamos láminas anti-empañamiento en el interior del vidrio. Evitan la condensación y permiten bajar el heater a 15–20 % de operación.',
     'extra': ('Instalación', '15–20 minutos por puerta')},
    {'sol': 'kenfield', 'ev': 'warwick', 'titulo': 'Las cortinas de PVC dejan pasar calor', 'donde': 'Cámaras, trastienda, zonas de carga',
     'pasa': 'Las cortinas de PVC y las puertas convencionales sellan mal. En cada paso entra calor a la cámara.',
     'hacemos': 'Reemplazamos por puertas aisladas de cierre automático: K750 para cámaras refrigeradas o de congelado; K150 y K550 para trastiendas y zonas de alto tráfico.',
     'extra': ('Vida útil', 'Más de 10 años (K750)')},
    {'sol': 'guardian', 'ev': 'fso', 'titulo': 'Ventiladores a tope y puertas que quedan abiertas', 'donde': 'Evaporadores y puertas de cámaras',
     'pasa': 'Los ventiladores del evaporador funcionan a velocidad fija aunque la cámara no lo necesite, y las puertas suelen quedar abiertas más de lo necesario.',
     'hacemos': 'Instalamos un control que ajusta la velocidad de los ventiladores según la demanda (FSO) y una alarma de puerta abierta (Door Sentry).',
     'extra': ('Instalación', 'Menos de 1 hora, sin entrar a la cámara')},
    {'sol': 'nualight', 'ev': 'vida', 'titulo': 'La iluminación calienta el mueble', 'donde': 'Vitrinas y muebles refrigerados',
     'pasa': 'Una luminaria ineficiente consume más, agrega calor al mueble refrigerado y altera el color del producto.',
     'hacemos': 'Instalamos LED con espectro calibrado por categoría: carnes, lácteos, panadería, pescadería y congelados.',
     'extra': ('Instalación', 'Gama ORION para recambio en muebles existentes')},
    {'sol': 'cnt', 'ev': 'rewe', 'titulo': 'El hielo en cámaras y congeladores genera fallas', 'donde': 'Cámaras de frío y congeladores',
     'pasa': 'La humedad del aire se congela en el evaporador y sobre los productos. Hay más descongelamientos, más fallas y horas del equipo dedicadas a sacar hielo.',
     'hacemos': 'Instalamos filtros moleculares en la entrada de aire del evaporador. Regulan la humedad sin electricidad y no requieren intervenir el equipo.',
     'extra': ('Instalación', 'Sin intervenir el equipo, sin conexión eléctrica')},
    {'sol': 'gelclear', 'ev': 'qp34', 'titulo': 'Los drenajes de condensado se tapan', 'donde': 'Muebles refrigerados y climatización',
     'pasa': 'En las bandejas y drenajes de condensado se forma biofilm. Los drenajes se tapan, aparecen malos olores y fallas en los equipos.',
     'hacemos': 'Ponemos una tableta en la bandeja de cada equipo. Se disuelve con el agua de condensado y protege todo el drenaje contra el biofilm. En equipos nuevos o recambios de drenaje, la tubería BioPipe evita que el biofilm se adhiera desde el origen.',
     'extra': ('Instalación', 'Una tableta por equipo, una vez al año')},
]

# Portada
# Sección de cifras (segunda sección de la portada): solución, id de la cifra, texto corto
CIFRAS = [('kenfield', 'puertas', 'Puertas Kenfield instaladas en supermercados'), ('cnt', 'rewe', 'Menos fallas en congeladores'), ('htf', 'hoffman', 'Menos consumo en climatización'), ('nualight', 'vida', 'Vida útil de las luminarias LED')]
EVIDENCIA_PORTADA = [('cnt', 'rewe'), ('htf', 'quercy'), ('aerofoil', 'calnext'), ('kenfield', 'warwick')]
EVIDENCIA_SUPERMERCADOS = ('aerofoil', 'calnext')

# Mapa de la sección Nosotros: líneas conceptuales desde distintas zonas del mundo
# hacia Santiago. No representan el origen exacto de cada marca. (lon, lat)
MAPA_DESTINO = (-70.67, -33.45)
MAPA_ORIGENES = [(-122.3, 47.6), (-87.6, 41.9), (-1.9, 52.5), (10.0, 51.2), (12.5, 41.9),
                 (18.1, 59.3), (34.8, 32.1), (121.5, 31.2), (139.7, 35.7), (151.2, -33.9)]

# Franja de clientes bajo las cifras (los mismos logos de la portada del sitio anterior)
CLIENTES = [('Walmart', 'walmart'), ('Kroger', 'kroger'), ("Sam's Club", 'sams-club'), ('Harris Teeter', 'harris-teeter'),
            ('The Fresh Market', 'the-fresh-market'), ("Sainsbury's", 'sainsburys'), ('Target', 'target')]

# ── Páginas propias de las demás industrias ──
# Reutilizan los textos de las zonas de supermercados; solo cambia "dónde" según la industria.
def _zona(sol, ev=None, **cambios):
    base = next(z for z in ZONAS_SUPERMERCADOS if z['sol'] == sol)
    z = dict(base, **cambios)
    if ev:
        z['ev'] = ev
    return z


_ZONA_BIOPIPE = {'sol': 'biopipe', 'ev': 'fugas', 'titulo': 'Los drenajes se tapan y generan fugas de agua',
                 'donde': 'Tuberías de drenaje de los evaporadores',
                 'pasa': 'Las bacterias del agua de condensado forman biofilm dentro de la tubería. El drenaje se tapa, el agua rebalsa y hay que llamar a mantención.',
                 'hacemos': 'Instalamos tubería de drenaje BioPipe, cuya superficie impide que el biofilm se adhiera. Sin químicos ni reaplicaciones.',
                 'extra': ('Duración', 'Toda la vida útil de la tubería')}

_ZONA_HTF = {'sol': 'htf', 'ev': 'quercy', 'titulo': 'Los chillers de proceso consumen de más',
             'donde': 'Chillers y circuitos de agua de proceso',
             'pasa': 'La eficiencia del chiller depende de qué tan rápido el agua, o el agua con glicol, transfiere el calor. Si esa transferencia es limitada, el compresor trabaja más tiempo para lograr la misma temperatura.',
             'hacemos': 'Agregamos HTF Compact ECO al circuito: un nanofluido que mejora el intercambio de calor. Se dosifica con el sistema funcionando, sin detener ni modificar los equipos.',
             'extra': ('Instalación', 'Con el sistema en operación')}

_FAQ_MEDICION = ('¿Cómo se mide el resultado?', 'Antes de instalar medimos una línea base de consumo, fallas o mantenimiento, según el caso. Después del piloto comparamos contra esa misma medición.')
_FAQ_FRIO = ('¿Hay que detener la operación para instalar?', 'No. Los filtros CNT no requieren intervenir el equipo y el control de Guardian se instala en menos de 1 hora sin entrar a la cámara. Coordinamos cada instalación con tu equipo de operaciones.')

PAGINAS_INDUSTRIA = {
    'food': {
        'archivo': 'industria-food-service.html',
        'lead': 'Tres puntos donde una cocina, restaurante o casino pierde energía, producto u horas de mantenimiento en su cadena de frío, y la tecnología que aplicamos en cada uno. Todas se instalan sin reemplazar los equipos de frío.',
        'zonas': [_zona('cnt', 'mcdonalds', donde='Cámaras y congeladores de la cocina'),
                  _zona('kenfield', donde='Accesos a cámaras de frío y bodegas'),
                  _zona('guardian')],
        'destacado': ('cnt', 'mcdonalds', 'CNT Technology en McDonald’s (Alemania)'),
        'faq': [_FAQ_FRIO, _FAQ_MEDICION, ('¿Se puede partir con un solo local?', 'Sí. Recomendamos un piloto en un local o en una cámara, y escalar con los resultados medidos.')],
        'cta': ('Agenda un diagnóstico en tu cocina', 'Revisamos tu cadena de frío y te entregamos una estimación de ahorro y retorno.'),
    },
    'frigorificos': {
        'archivo': 'industria-frigorificos.html',
        'lead': 'Cuatro puntos donde una bodega refrigerada o centro de frío pierde energía, producto u horas de mantenimiento, y la tecnología que aplicamos en cada uno. Todas se instalan sin reemplazar los equipos de frío.',
        'zonas': [_zona('cnt', donde='Cámaras de frío y de congelado'),
                  _zona('kenfield', donde='Accesos a cámaras y zonas de carga'),
                  _zona('guardian'),
                  _ZONA_BIOPIPE],
        'destacado': ('cnt', 'rewe', 'CNT Technology en congeladores de REWE (Alemania)'),
        'faq': [_FAQ_FRIO, _FAQ_MEDICION, ('¿Se puede partir con una sola cámara?', 'Sí. Recomendamos un piloto en una cámara o en un grupo de equipos, y escalar con los resultados medidos.')],
        'cta': ('Agenda un diagnóstico en tu frigorífico', 'Revisamos tu operación y te entregamos una estimación de ahorro y retorno.'),
    },
    'agro': {
        'archivo': 'industria-agroindustria.html',
        'lead': 'Cuatro puntos donde un packing, central frutícola o planta de proceso pierde energía, producto u horas de mantenimiento, y la tecnología que aplicamos en cada uno. Todas se instalan sin reemplazar los equipos.',
        'zonas': [_ZONA_HTF,
                  _zona('cnt', donde='Cámaras de frío y de congelado'),
                  _zona('guardian'),
                  _zona('kenfield', donde='Accesos a cámaras y zonas de carga')],
        'destacado': ('htf', 'fyb', 'HTF Compact ECO en una planta de alimentos (Francia)'),
        'faq': [('¿Hay que detener la operación para instalar?', 'No. HTF Compact ECO se dosifica con el chiller funcionando, los filtros CNT no requieren intervenir el equipo y el control de Guardian se instala en menos de 1 hora sin entrar a la cámara.'),
                _FAQ_MEDICION,
                ('¿Se puede partir con una sola cámara o un solo chiller?', 'Sí. Recomendamos un piloto en un equipo y escalar con los resultados medidos.')],
        'cta': ('Agenda un diagnóstico en tu planta', 'Revisamos tu operación y te entregamos una estimación de ahorro y retorno.'),
    },
    'edificios': {
        'archivo': 'industria-edificios.html',
        'lead': 'Oficinas, centros comerciales, hoteles, clínicas y data centers gastan buena parte de su energía en climatización. Así la reducimos sin reemplazar los chillers.',
        'zonas': [dict(_ZONA_HTF, ev='hoffman', titulo='La climatización consume de más', donde='Chillers y circuitos de agua helada',
                       pasa='En chillers y sistemas HVAC, la eficiencia depende de qué tan rápido el agua transfiere el calor en los intercambiadores. Si esa transferencia es limitada, el compresor trabaja más tiempo y la alternativa habitual es ampliar o reemplazar equipos.')],
        'destacado': ('htf', 'hoffman', 'HTF Compact ECO en un edificio municipal (EE.UU.)'),
        'faq': [('¿Hay que detener la climatización para instalar?', 'No. HTF Compact ECO se dosifica con el sistema funcionando, mediante una bomba, sin detener ni modificar los equipos.'),
                _FAQ_MEDICION,
                ('¿Se puede partir con un solo edificio?', 'Sí. Recomendamos un piloto en un sistema y escalar con los resultados medidos.')],
        'cta': ('Agenda un diagnóstico en tu edificio', 'Revisamos tu sistema de climatización y te entregamos una estimación de ahorro y retorno.'),
    },
}
for _ind in INDUSTRIAS:
    if _ind['id'] in PAGINAS_INDUSTRIA:
        _ind['archivo'] = PAGINAS_INDUSTRIA[_ind['id']]['archivo']
