const ExcelJS = require('exceljs');
const path = require('path');

const wb = new ExcelJS.Workbook();
wb.creator = 'Nico';
wb.created = new Date();

// ─── COLORES ────────────────────────────────────────────────────────────────
const C = {
  azulOscuro:  '1F3864',
  azulMedio:   '2E75B6',
  azulClaro:   'BDD7EE',
  verdeDark:   '375623',
  verdeMedio:  '70AD47',
  verdeClaro:  'E2EFDA',
  rojoDark:    'C00000',
  rojoClaro:   'FFCCCC',
  amarillo:    'FFF2CC',
  naranja:     'F4B942',
  naranjaClaro:'FFF0D4',
  grisOscuro:  '595959',
  grisMedio:   'D9D9D9',
  grisClaro:   'F2F2F2',
  blanco:      'FFFFFF',
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
function addBorder(cell, color = 'AAAAAA') {
  cell.border = {
    top:    { style: 'thin', color: { argb: color } },
    bottom: { style: 'thin', color: { argb: color } },
    left:   { style: 'thin', color: { argb: color } },
    right:  { style: 'thin', color: { argb: color } },
  };
}

function hdr(ws, row, col, value, bgColor, fontColor = 'FFFFFF') {
  const cell = ws.getCell(row, col);
  cell.value = value;
  cell.font = { bold: true, color: { argb: fontColor }, size: 10, name: 'Calibri' };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  addBorder(cell, '888888');
  return cell;
}

function val(ws, row, col, value, opts = {}) {
  const cell = ws.getCell(row, col);
  cell.value = value;
  cell.font = { name: 'Calibri', size: 10, ...opts.font };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.bg || C.blanco } };
  cell.alignment = { vertical: 'middle', wrapText: true, ...opts.align };
  if (opts.numFmt) cell.numFmt = opts.numFmt;
  if (opts.border !== false) addBorder(cell);
  return cell;
}

// ════════════════════════════════════════════════════════════════════════════
// DATOS: Productos comprados en China
// ════════════════════════════════════════════════════════════════════════════

// Órdenes base
const ordenes = [
  {
    id: 1,
    numero: '#248832179501029396',
    proveedor: 'Guangzhou Yuhuo Leather Co., Ltd.',
    fecha: '04/04/2025',
    destino: 'General',
    subtotalProductos: 510.00,
    envio: 335.00,
    feeProcessing: 25.27,
    reembolso: 0,
    totalPagado: 870.27,
  },
  {
    id: 2,
    numero: '#249035386501029396',
    proveedor: 'Guangzhou Haohang Industrial Co., Ltd.',
    fecha: '04/04/2025',
    destino: 'Caterina',
    subtotalProductos: 598.00,
    envio: 268.00,
    feeProcessing: 25.90,
    reembolso: 0,
    totalPagado: 891.90,
  },
  {
    id: 3,
    numero: '#248506982501029396',
    proveedor: 'Guangzhou Yuanfuyuan Leather Co., Ltd.',
    fecha: '01/04/2025',
    destino: 'Veegee',
    subtotalProductos: 1541.00,
    envio: 650.00,
    feeProcessing: 65.52,
    reembolso: 175.00,
    totalPagado: 2081.52,   // neto después de reembolso
  },
];

// Productos detallados
// tasaOverhead = (envío + fee - reembolso) / subtotalProductos, aplicada por proporción
// costLandedUnit = foB_unit + (foB_unit / subtotalOrden) * overhead
const productosBrutos = [
  // Orden 1
  {
    ordenId: 1,
    nombreCorto: 'Handbag Crossbody Canvas',
    descripcion: 'L-130 Casual Oil Wax Canvas Handbag Women\'s Unisex Shoulder Crossbody Shopping Storage Bag Two Cotton Lining',
    unidades: 30,
    fobUnit: 17.00,
  },
  // Orden 2
  {
    ordenId: 2,
    nombreCorto: 'Backpack Laptop Vintage Cuero',
    descripcion: 'Large Capacity Business Laptop Backpack Vintage Men Cotton Canvas Haversack Waterproof Backpack With Leather Trim Bag',
    unidades: 26,  // 14 + 12 mismo producto
    fobUnit: 23.00,
  },
  // Orden 3
  {
    ordenId: 3,
    nombreCorto: 'Mochila Rucksack Wax Canvas',
    descripcion: 'Custom Vintage Waterproof Travel Outdoor Laptop Casual Sports Waxed Canvas Rucksack Backpack for Men',
    unidades: 10,
    fobUnit: 22.00,
  },
  {
    ordenId: 3,
    nombreCorto: 'Duffle Bag Weekender Canvas',
    descripcion: 'Custom Large Carry on Waterproof Sport Gym Vintage Camping Waxed Canvas Bag Overnight Weekender Canvas Duffle Bags for Men',
    unidades: 12,  // 8 + 4
    fobUnit: 27.00,
  },
  {
    ordenId: 3,
    nombreCorto: 'Messenger Satchel Wax Canvas',
    descripcion: 'Custom Waterproof Laptop Vintage Satchel Shoulder Crossbody Bag Briefcase Waxed Canvas Messenger Bag for Men',
    unidades: 10,  // 5 + 5
    fobUnit: 22.00,
  },
  {
    ordenId: 3,
    nombreCorto: 'Duffle Retro Logo Wax Canvas',
    descripcion: 'Manufacturer Custom Logo Vintage Retro Waterproof Overnight Weekender Waxed Canvas Travel Camping Duffel Bag Canvas Duffle Bag',
    unidades: 12,  // 6 + 6
    fobUnit: 24.50,
  },
  {
    ordenId: 3,
    nombreCorto: 'Duffle Luxury Multilayer',
    descripcion: 'Custom Luxury Canvas Duffel Bag for Travel Camping Large Capacity Multilayer Duffel Cloth Package Bags',
    unidades: 12,  // 8 + 4
    fobUnit: 26.50,
  },
  {
    ordenId: 3,
    nombreCorto: 'Toiletry Organizer Canvas',
    descripcion: 'Custom Vintage Cotton Canvas Waterproof Travel Toiletry Makeup Cosmetic Organizer Bags Waxed Canvas Bag for Men',
    unidades: 15,
    fobUnit: 11.00,
  },
];

// Calcular landed cost por producto
const productos = productosBrutos.map((p, i) => {
  const orden = ordenes.find(o => o.id === p.ordenId);
  const subtotalProducto = p.unidades * p.fobUnit;
  const overheadTotal = orden.envio + orden.feeProcessing - orden.reembolso;
  const proporcion = subtotalProducto / orden.subtotalProductos;
  const overheadAsignado = overheadTotal * proporcion;
  const overheadPorUnidad = overheadAsignado / p.unidades;
  const landedUnit = p.fobUnit + overheadPorUnidad;
  const landedTotal = landedUnit * p.unidades;

  return {
    ...p,
    orden,
    subtotalProducto,
    overheadAsignado: Math.round(overheadAsignado * 100) / 100,
    overheadPorUnidad: Math.round(overheadPorUnidad * 100) / 100,
    landedUnit: Math.round(landedUnit * 100) / 100,
    landedTotal: Math.round(landedTotal * 100) / 100,
    envioUnit: Math.round((orden.envio * proporcion / p.unidades) * 100) / 100,
    feeUnit:   Math.round((orden.feeProcessing * proporcion / p.unidades) * 100) / 100,
    reembolsoUnit: Math.round((orden.reembolso * proporcion / p.unidades) * 100) / 100,
  };
});

// ════════════════════════════════════════════════════════════════════════════
// SHEET 1 — PRODUCTOS COMPRADOS EN CHINA
// ════════════════════════════════════════════════════════════════════════════
const ws = wb.addWorksheet('🛒 Productos China', { tabColor: { argb: C.azulMedio } });
ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4, showGridLines: false }];

// Anchos de columnas
const cols = [
  { width: 4  },  // A: #
  { width: 28 },  // B: Nombre Corto
  { width: 45 },  // C: Descripción
  { width: 26 },  // D: Proveedor
  { width: 12 },  // E: Destino
  { width: 22 },  // F: N° Orden
  { width: 12 },  // G: Fecha
  { width: 10 },  // H: Unidades
  { width: 14 },  // I: FOB Unit
  { width: 14 },  // J: Subtotal Producto
  { width: 14 },  // K: Envío Asignado/u
  { width: 14 },  // L: Fee/u
  { width: 14 },  // M: Reembolso/u
  { width: 16 },  // N: Costo Landed/u
  { width: 16 },  // O: Costo Landed Total
];
cols.forEach((c, i) => { ws.getColumn(i + 1).width = c.width; });

// ─── Fila 1: Título principal ───────────────────────────────────────────────
ws.mergeCells('A1:O1');
const titleCell = ws.getCell('A1');
titleCell.value = '🛒 PRODUCTOS COMPRADOS EN CHINA — COSTO LANDED (Incluye Envío + Fees)';
titleCell.font = { bold: true, size: 14, color: { argb: C.blanco }, name: 'Calibri' };
titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulOscuro } };
titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
ws.getRow(1).height = 36;

// ─── Fila 2: Nota metodológica ──────────────────────────────────────────────
ws.mergeCells('A2:O2');
const notaCell = ws.getCell('A2');
notaCell.value = 'ℹ️  El costo landed se calcula distribuyendo envío + fees de procesamiento proporcionalmente al costo de cada producto. El reembolso de Veegee se descuenta del overhead asignado.';
notaCell.font = { italic: true, size: 9, color: { argb: C.grisOscuro }, name: 'Calibri' };
notaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.amarillo } };
notaCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
ws.getRow(2).height = 28;

// ─── Fila 3: Resumen rápido de órdenes ────────────────────────────────────
// Orden 1 summary
ws.mergeCells('A3:C3');
const o1Cell = ws.getCell('A3');
o1Cell.value = `Orden 1 (Yuhuo / General): $${ordenes[0].totalPagado.toFixed(2)} pagado`;
o1Cell.font = { bold: true, size: 9, color: { argb: C.blanco }, name: 'Calibri' };
o1Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulMedio } };
o1Cell.alignment = { horizontal: 'center', vertical: 'middle' };
ws.getRow(3).height = 20;

ws.mergeCells('D3:G3');
const o2Cell = ws.getCell('D3');
o2Cell.value = `Orden 2 (Haohang / Caterina): $${ordenes[1].totalPagado.toFixed(2)} pagado`;
o2Cell.font = { bold: true, size: 9, color: { argb: C.blanco }, name: 'Calibri' };
o2Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.verdeMedio } };
o2Cell.alignment = { horizontal: 'center', vertical: 'middle' };

ws.mergeCells('H3:O3');
const o3Cell = ws.getCell('H3');
o3Cell.value = `Orden 3 (Yuanfuyuan / Veegee): $${ordenes[2].totalPagado.toFixed(2)} pagado neto (incl. reembolso -$175)`;
o3Cell.font = { bold: true, size: 9, color: { argb: C.blanco }, name: 'Calibri' };
o3Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E07B00' } };
o3Cell.alignment = { horizontal: 'center', vertical: 'middle' };

// ─── Fila 4: Headers ────────────────────────────────────────────────────────
const headers = [
  { col: 1,  text: '#',                    bg: C.azulOscuro },
  { col: 2,  text: 'Nombre Comercial',     bg: C.azulOscuro },
  { col: 3,  text: 'Descripción Completa', bg: C.azulOscuro },
  { col: 4,  text: 'Proveedor',            bg: C.azulOscuro },
  { col: 5,  text: 'Destino',              bg: C.azulOscuro },
  { col: 6,  text: 'N° Orden',             bg: C.azulOscuro },
  { col: 7,  text: 'Fecha',               bg: C.azulOscuro },
  { col: 8,  text: 'Unidades',             bg: C.azulOscuro },
  { col: 9,  text: 'FOB Unit (USD)',       bg: C.azulMedio  },
  { col: 10, text: 'Subtotal Producto',    bg: C.azulMedio  },
  { col: 11, text: 'Envío/u (USD)',        bg: '5B8DB8'     },
  { col: 12, text: 'Fee Procesam./u',      bg: '5B8DB8'     },
  { col: 13, text: 'Reembolso/u',          bg: '5B8DB8'     },
  { col: 14, text: '★ Costo Landed/u',    bg: C.verdeDark  },
  { col: 15, text: '★ Costo Landed Total', bg: C.verdeDark  },
];
headers.forEach(h => hdr(ws, 4, h.col, h.text, h.bg));
ws.getRow(4).height = 36;

// ─── Filas de datos ─────────────────────────────────────────────────────────
const ordenColors = {
  1: C.azulClaro,
  2: C.verdeClaro,
  3: C.naranjaClaro,
};

productos.forEach((p, i) => {
  const r = 5 + i;
  const bg = ordenColors[p.ordenId];
  ws.getRow(r).height = 50;

  val(ws, r, 1, i + 1, { bg, align: { horizontal: 'center', vertical: 'middle' }, font: { bold: true } });
  val(ws, r, 2, p.nombreCorto, { bg, font: { bold: true, size: 10 } });
  val(ws, r, 3, p.descripcion, { bg, font: { size: 9, color: { argb: C.grisOscuro } } });
  val(ws, r, 4, p.orden.proveedor, { bg, font: { size: 9 } });
  val(ws, r, 5, p.orden.destino, { bg, align: { horizontal: 'center', vertical: 'middle' }, font: { bold: true } });
  val(ws, r, 6, p.orden.numero, { bg, font: { size: 9, color: { argb: C.grisOscuro } } });
  val(ws, r, 7, p.orden.fecha, { bg, align: { horizontal: 'center', vertical: 'middle' } });

  // Unidades
  const uCell = val(ws, r, 8, p.unidades, { bg, align: { horizontal: 'center', vertical: 'middle' }, font: { bold: true } });

  // FOB unit
  val(ws, r, 9, p.fobUnit, { bg, align: { horizontal: 'right', vertical: 'middle' }, numFmt: '"USD "#,##0.00' });

  // Subtotal producto
  val(ws, r, 10, p.subtotalProducto, { bg, align: { horizontal: 'right', vertical: 'middle' }, numFmt: '"USD "#,##0.00' });

  // Envío/u
  val(ws, r, 11, p.envioUnit, { bg, align: { horizontal: 'right', vertical: 'middle' }, numFmt: '"USD "#,##0.00' });

  // Fee/u
  val(ws, r, 12, p.feeUnit, { bg, align: { horizontal: 'right', vertical: 'middle' }, numFmt: '"USD "#,##0.00' });

  // Reembolso/u (negativo si aplica)
  const reemCell = val(ws, r, 13,
    p.reembolsoUnit > 0 ? -p.reembolsoUnit : '-',
    { bg, align: { horizontal: 'right', vertical: 'middle' }, numFmt: p.reembolsoUnit > 0 ? '"USD "-#,##0.00' : undefined,
      font: { color: { argb: p.reembolsoUnit > 0 ? C.rojoDark : C.grisOscuro } } }
  );

  // ★ Costo Landed/u (destacado)
  const lCell = ws.getCell(r, 14);
  lCell.value = p.landedUnit;
  lCell.numFmt = '"USD "#,##0.00';
  lCell.font = { bold: true, size: 11, color: { argb: C.verdeDark }, name: 'Calibri' };
  lCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.verdeClaro } };
  lCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(lCell, '70AD47');

  // ★ Costo Landed Total
  const ltCell = ws.getCell(r, 15);
  ltCell.value = p.landedTotal;
  ltCell.numFmt = '"USD "#,##0.00';
  ltCell.font = { bold: true, size: 11, color: { argb: C.verdeDark }, name: 'Calibri' };
  ltCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.verdeClaro } };
  ltCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(ltCell, '70AD47');
});

// ─── Fila de totales ────────────────────────────────────────────────────────
const totalRow = 5 + productos.length;
ws.getRow(totalRow).height = 28;

for (let c = 1; c <= 15; c++) {
  const cell = ws.getCell(totalRow, c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulOscuro } };
  cell.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
  addBorder(cell, '000000');
}

const totLabel = ws.getCell(totalRow, 1);
ws.mergeCells(totalRow, 1, totalRow, 7);
totLabel.value = 'TOTALES';
totLabel.alignment = { horizontal: 'right', vertical: 'middle' };

// Total unidades
const totalUnidades = productos.reduce((s, p) => s + p.unidades, 0);
val(ws, totalRow, 8, totalUnidades, {
  bg: C.azulOscuro,
  align: { horizontal: 'center', vertical: 'middle' },
  font: { bold: true, color: { argb: C.amarillo }, size: 12 },
});

// Total subtotal productos
const totalSubtotal = productos.reduce((s, p) => s + p.subtotalProducto, 0);
val(ws, totalRow, 10, Math.round(totalSubtotal * 100) / 100, {
  bg: C.azulOscuro,
  align: { horizontal: 'right', vertical: 'middle' },
  numFmt: '"USD "#,##0.00',
  font: { bold: true, color: { argb: C.amarillo }, size: 11 },
});

// Total landed total
const totalLanded = productos.reduce((s, p) => s + p.landedTotal, 0);
val(ws, totalRow, 15, Math.round(totalLanded * 100) / 100, {
  bg: C.azulOscuro,
  align: { horizontal: 'right', vertical: 'middle' },
  numFmt: '"USD "#,##0.00',
  font: { bold: true, color: { argb: C.amarillo }, size: 12 },
});

// ─── Resumen por orden (debajo de la tabla) ──────────────────────────────────
const resRow = totalRow + 2;
ws.getRow(resRow).height = 22;
ws.getRow(resRow + 1).height = 20;
ws.getRow(resRow + 2).height = 20;
ws.getRow(resRow + 3).height = 20;
ws.getRow(resRow + 4).height = 20;

ws.mergeCells(resRow, 1, resRow, 5);
const resLabel = ws.getCell(resRow, 1);
resLabel.value = 'RESUMEN POR ORDEN';
resLabel.font = { bold: true, size: 11, color: { argb: C.blanco }, name: 'Calibri' };
resLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulMedio } };
resLabel.alignment = { horizontal: 'center', vertical: 'middle' };
addBorder(resLabel);

const resHeaders = ['Orden', 'Proveedor', 'Destino', 'Total Pagado (USD)', 'Unidades Total'];
resHeaders.forEach((h, i) => hdr(ws, resRow + 1, i + 1, h, C.azulMedio));

ordenes.forEach((o, i) => {
  const r = resRow + 2 + i;
  const bg = i % 2 === 0 ? C.azulClaro : C.blanco;
  const uOrden = productos.filter(p => p.ordenId === o.id).reduce((s, p) => s + p.unidades, 0);
  val(ws, r, 1, o.numero, { bg, font: { size: 9 } });
  val(ws, r, 2, o.proveedor, { bg, font: { size: 9 } });
  val(ws, r, 3, o.destino, { bg, align: { horizontal: 'center', vertical: 'middle' }, font: { bold: true } });
  val(ws, r, 4, o.totalPagado, { bg, align: { horizontal: 'right', vertical: 'middle' }, numFmt: '"USD "#,##0.00', font: { bold: true } });
  val(ws, r, 5, uOrden, { bg, align: { horizontal: 'center', vertical: 'middle' }, font: { bold: true } });
  ws.getRow(r).height = 20;
});

// ════════════════════════════════════════════════════════════════════════════
// GUARDAR
// ════════════════════════════════════════════════════════════════════════════
wb.views = [{ activeTab: 0 }];

const outputPath = path.join(__dirname, '..', 'Importacion China.xlsx');
wb.xlsx.writeFile(outputPath).then(() => {
  console.log('✅ Excel creado: ' + outputPath);
  console.log('');
  console.log('📦 Resumen de productos:');
  productos.forEach(p => {
    console.log(`   ${p.nombreCorto}: ${p.unidades}u | FOB $${p.fobUnit} | Landed $${p.landedUnit}`);
  });
  console.log('');
  console.log(`💰 Total pagado a proveedores: USD ${ordenes.reduce((s, o) => s + o.totalPagado, 0).toFixed(2)}`);
  console.log(`📦 Total unidades: ${productos.reduce((s, p) => s + p.unidades, 0)}`);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
