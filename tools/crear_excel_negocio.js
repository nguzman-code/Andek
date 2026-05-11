const ExcelJS = require('exceljs');
const path = require('path');

const wb = new ExcelJS.Workbook();
wb.creator = 'Nico';
wb.created = new Date();

// ─── COLORES Y ESTILOS ──────────────────────────────────────────────────────
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
  grisOscuro:  '595959',
  grisMedio:   'D9D9D9',
  grisClaro:   'F2F2F2',
  blanco:      'FFFFFF',
};

function hdr(ws, row, col, value, bgColor, fontColor = 'FFFFFF', bold = true, size = 11) {
  const cell = ws.getCell(row, col);
  cell.value = value;
  cell.font = { bold, color: { argb: fontColor }, size, name: 'Calibri' };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = {
    top: { style: 'thin', color: { argb: '999999' } },
    bottom: { style: 'thin', color: { argb: '999999' } },
    left: { style: 'thin', color: { argb: '999999' } },
    right: { style: 'thin', color: { argb: '999999' } },
  };
  return cell;
}

function label(ws, row, col, value, bold = false) {
  const cell = ws.getCell(row, col);
  cell.value = value;
  cell.font = { bold, name: 'Calibri', size: 11 };
  cell.alignment = { vertical: 'middle' };
  return cell;
}

function money(ws, row, col, formula_or_value, isFormula = false) {
  const cell = ws.getCell(row, col);
  if (isFormula) cell.value = { formula: formula_or_value };
  else cell.value = formula_or_value;
  cell.numFmt = '"$"#,##0.00';
  cell.font = { name: 'Calibri', size: 11 };
  cell.alignment = { horizontal: 'right', vertical: 'middle' };
  return cell;
}

function pct(ws, row, col, formula) {
  const cell = ws.getCell(row, col);
  cell.value = { formula };
  cell.numFmt = '0.00"%"';
  cell.font = { name: 'Calibri', size: 11 };
  cell.alignment = { horizontal: 'right', vertical: 'middle' };
  return cell;
}

function shade(ws, row, col, bgColor) {
  const cell = ws.getCell(row, col);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  return cell;
}

function titleRow(ws, row, colStart, colEnd, text, bgColor = C.azulOscuro) {
  ws.mergeCells(row, colStart, row, colEnd);
  const cell = ws.getCell(row, colStart);
  cell.value = text;
  cell.font = { bold: true, color: { argb: C.blanco }, size: 13, name: 'Calibri' };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(row).height = 28;
}

function subTitleRow(ws, row, colStart, colEnd, text, bgColor = C.azulMedio) {
  ws.mergeCells(row, colStart, row, colEnd);
  const cell = ws.getCell(row, colStart);
  cell.value = text;
  cell.font = { bold: true, color: { argb: C.blanco }, size: 11, name: 'Calibri' };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(row).height = 22;
}

function addBorder(cell) {
  cell.border = {
    top: { style: 'thin', color: { argb: 'AAAAAA' } },
    bottom: { style: 'thin', color: { argb: 'AAAAAA' } },
    left: { style: 'thin', color: { argb: 'AAAAAA' } },
    right: { style: 'thin', color: { argb: 'AAAAAA' } },
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SHEET 1 — RESUMEN
// ════════════════════════════════════════════════════════════════════════════
const wsRes = wb.addWorksheet('📊 Resumen', { tabColor: { argb: C.azulMedio } });
wsRes.views = [{ showGridLines: false }];
wsRes.getColumn(1).width = 3;
wsRes.getColumn(2).width = 32;
wsRes.getColumn(3).width = 22;
wsRes.getColumn(4).width = 3;
wsRes.getColumn(5).width = 32;
wsRes.getColumn(6).width = 22;
wsRes.getColumn(7).width = 3;

// Título principal
wsRes.mergeCells('B1:F1');
const titleCell = wsRes.getCell('B1');
titleCell.value = '📊 RESUMEN EJECUTIVO DEL NEGOCIO';
titleCell.font = { bold: true, size: 16, color: { argb: C.blanco }, name: 'Calibri' };
titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulOscuro } };
titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
wsRes.getRow(1).height = 40;

// Subtítulo fecha
wsRes.mergeCells('B2:F2');
const subCell = wsRes.getCell('B2');
subCell.value = 'Los datos se actualizan automáticamente desde las otras pestañas';
subCell.font = { italic: true, size: 10, color: { argb: C.grisOscuro }, name: 'Calibri' };
subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.grisClaro } };
subCell.alignment = { horizontal: 'center', vertical: 'middle' };
wsRes.getRow(2).height = 18;

// ─── Bloque Izquierdo: Ingresos & Rentabilidad ────────────────────────────
subTitleRow(wsRes, 4, 2, 3, '💰 INGRESOS Y RENTABILIDAD', C.verdeMedio);

const kpiIzq = [
  ['Ingresos Totales (Mes Actual)',    `SUMPRODUCT((MONTH(Ingresos!B:B)=MONTH(TODAY()))*(YEAR(Ingresos!B:B)=YEAR(TODAY()))*Ingresos!D:D)`],
  ['Ingresos Totales (Año Actual)',    `SUMPRODUCT((YEAR(Ingresos!B:B)=YEAR(TODAY()))*Ingresos!D:D)`],
  ['Ticket Promedio',                  `IFERROR(SUMPRODUCT((YEAR(Ingresos!B:B)=YEAR(TODAY()))*Ingresos!D:D)/SUMPRODUCT((YEAR(Ingresos!B:B)=YEAR(TODAY()))*(Ingresos!D:D<>"")*1),0)`],
  ['Cantidad de Ventas (Mes)',         `SUMPRODUCT((MONTH(Ingresos!B:B)=MONTH(TODAY()))*(YEAR(Ingresos!B:B)=YEAR(TODAY()))*(Ingresos!D:D>0)*1)`],
  ['Ingreso Mes Anterior',             `SUMPRODUCT((MONTH(Ingresos!B:B)=MONTH(TODAY())-1)*(YEAR(Ingresos!B:B)=YEAR(TODAY()))*Ingresos!D:D)`],
  ['Crecimiento vs Mes Anterior (%)',  `IFERROR((SUMPRODUCT((MONTH(Ingresos!B:B)=MONTH(TODAY()))*(YEAR(Ingresos!B:B)=YEAR(TODAY()))*Ingresos!D:D)-SUMPRODUCT((MONTH(Ingresos!B:B)=MONTH(TODAY())-1)*(YEAR(Ingresos!B:B)=YEAR(TODAY()))*Ingresos!D:D))/SUMPRODUCT((MONTH(Ingresos!B:B)=MONTH(TODAY())-1)*(YEAR(Ingresos!B:B)=YEAR(TODAY()))*Ingresos!D:D)*100,0)`],
];

kpiIzq.forEach(([lbl, fml], i) => {
  const row = 5 + i;
  wsRes.getRow(row).height = 22;
  const lc = wsRes.getCell(row, 2);
  lc.value = lbl;
  lc.font = { name: 'Calibri', size: 11 };
  lc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? C.verdeClaro : C.blanco } };
  lc.alignment = { vertical: 'middle' };
  addBorder(lc);

  const vc = wsRes.getCell(row, 3);
  if (lbl.includes('%')) {
    vc.value = { formula: fml };
    vc.numFmt = '0.00"%"';
  } else if (lbl.includes('Cantidad')) {
    vc.value = { formula: fml };
    vc.numFmt = '#,##0';
  } else {
    vc.value = { formula: fml };
    vc.numFmt = '"$"#,##0.00';
  }
  vc.font = { bold: true, name: 'Calibri', size: 11, color: { argb: C.verdeDark } };
  vc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? C.verdeClaro : C.blanco } };
  vc.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(vc);
});

// ─── Bloque Derecho: Gastos & Utilidad ────────────────────────────────────
subTitleRow(wsRes, 4, 5, 6, '💸 GASTOS Y UTILIDAD', C.rojoDark);

const kpiDer = [
  ['Gastos Totales (Mes Actual)',    `SUMPRODUCT((MONTH(Gastos!B:B)=MONTH(TODAY()))*(YEAR(Gastos!B:B)=YEAR(TODAY()))*Gastos!D:D)`],
  ['Gastos Totales (Año Actual)',    `SUMPRODUCT((YEAR(Gastos!B:B)=YEAR(TODAY()))*Gastos!D:D)`],
  ['Gasto Promedio Diario',         `IFERROR(SUMPRODUCT((MONTH(Gastos!B:B)=MONTH(TODAY()))*(YEAR(Gastos!B:B)=YEAR(TODAY()))*Gastos!D:D)/DAY(TODAY()),0)`],
  ['Utilidad Neta (Mes)',           `B5-E5`],
  ['Margen Neto (%)',               `IFERROR((B5-E5)/B5*100,0)`],
  ['Ratio Gastos/Ingresos (%)',     `IFERROR(E5/B5*100,0)`],
];

kpiDer.forEach(([lbl, fml], i) => {
  const row = 5 + i;
  const lc = wsRes.getCell(row, 5);
  lc.value = lbl;
  lc.font = { name: 'Calibri', size: 11 };
  lc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? C.rojoClaro : C.blanco } };
  lc.alignment = { vertical: 'middle' };
  addBorder(lc);

  const vc = wsRes.getCell(row, 6);
  if (lbl.includes('%') || lbl.includes('Ratio') || lbl.includes('Margen')) {
    vc.value = { formula: fml };
    vc.numFmt = '0.00"%"';
    vc.font = { bold: true, name: 'Calibri', size: 11, color: { argb: C.rojoDark } };
  } else {
    vc.value = { formula: fml };
    vc.numFmt = '"$"#,##0.00';
    vc.font = { bold: true, name: 'Calibri', size: 11, color: { argb: C.rojoDark } };
  }
  vc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? C.rojoClaro : C.blanco } };
  vc.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(vc);
});

// ─── Saldo de Caja ─────────────────────────────────────────────────────────
wsRes.getRow(12).height = 8;
subTitleRow(wsRes, 13, 2, 6, '🏦 POSICIÓN DE CAJA', C.azulMedio);

const kpiCaja = [
  ['Saldo Actual de Caja',       `'💳 Flujo de Caja'!G${3+1}`, false],  // placeholder
  ['Total Cuentas por Cobrar',   `SUMPRODUCT((Ingresos!F:F="Pendiente")*Ingresos!D:D)`],
  ['Total Cuentas por Pagar',    `SUMPRODUCT((Gastos!F:F="Pendiente")*Gastos!D:D)`],
];

kpiCaja.forEach(([lbl, fml], i) => {
  const row = 14 + i;
  wsRes.getRow(row).height = 22;

  const lc = wsRes.getCell(row, 2);
  lc.value = lbl;
  lc.font = { name: 'Calibri', size: 11 };
  lc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulClaro } };
  lc.alignment = { vertical: 'middle' };
  addBorder(lc);

  const vc = wsRes.getCell(row, 3);
  vc.value = { formula: fml };
  vc.numFmt = '"$"#,##0.00';
  vc.font = { bold: true, name: 'Calibri', size: 11, color: { argb: C.azulMedio } };
  vc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulClaro } };
  vc.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(vc);

  // col 5-6 empty but colored
  for (let c = 5; c <= 6; c++) {
    const cc = wsRes.getCell(row, c);
    cc.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulClaro } };
    addBorder(cc);
  }
});

// Nota aclarativa
wsRes.getRow(17).height = 8;
wsRes.mergeCells('B18:F18');
const nota = wsRes.getCell('B18');
nota.value = '⚠️  El Saldo de Caja se toma de la última fila del Flujo de Caja. Verifica que esté al día.';
nota.font = { italic: true, size: 9, color: { argb: C.grisOscuro }, name: 'Calibri' };
nota.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.amarillo } };
nota.alignment = { horizontal: 'center', vertical: 'middle' };
wsRes.getRow(18).height = 18;

// ════════════════════════════════════════════════════════════════════════════
// SHEET 2 — INGRESOS
// ════════════════════════════════════════════════════════════════════════════
const wsIng = wb.addWorksheet('💵 Ingresos', { tabColor: { argb: C.verdeMedio } });
wsIng.views = [{ showGridLines: false }];

const ingCols = [
  { header: '#',              width: 5  },
  { header: 'Fecha',         width: 14 },
  { header: 'Cliente',       width: 24 },
  { header: 'Monto',         width: 16 },
  { header: 'Categoría',     width: 22 },
  { header: 'Estado',        width: 14 },
  { header: 'Método de Pago',width: 18 },
  { header: 'Factura/Ref.',  width: 16 },
  { header: 'Notas',         width: 35 },
];
ingCols.forEach((col, i) => {
  wsIng.getColumn(i + 1).width = col.width;
});

// Título
wsIng.mergeCells('A1:I1');
const ingTitle = wsIng.getCell('A1');
ingTitle.value = '💵 REGISTRO DE INGRESOS';
ingTitle.font = { bold: true, size: 14, color: { argb: C.blanco }, name: 'Calibri' };
ingTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.verdeDark } };
ingTitle.alignment = { horizontal: 'center', vertical: 'middle' };
wsIng.getRow(1).height = 32;

// Instrucción
wsIng.mergeCells('A2:I2');
const ingInstr = wsIng.getCell('A2');
ingInstr.value = '✏️  Completa los campos en blanco. Los campos con fórmula se calculan solos. Usa Tab para moverte entre celdas.';
ingInstr.font = { italic: true, size: 9, color: { argb: C.grisOscuro }, name: 'Calibri' };
ingInstr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.grisClaro } };
ingInstr.alignment = { horizontal: 'center', vertical: 'middle' };
wsIng.getRow(2).height = 16;

// Headers
ingCols.forEach((col, i) => {
  hdr(wsIng, 3, i + 1, col.header, C.verdeMedio);
});
wsIng.getRow(3).height = 22;

// 100 filas de datos
for (let r = 4; r <= 103; r++) {
  const even = (r % 2 === 0);
  const bg = even ? C.verdeClaro : C.blanco;

  // # (formula)
  const numCell = wsIng.getCell(r, 1);
  numCell.value = { formula: `IF(B${r}<>"",ROW()-3,"")` };
  numCell.font = { name: 'Calibri', size: 10, color: { argb: C.grisOscuro } };
  numCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  numCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(numCell);

  // Fecha
  const fechaCell = wsIng.getCell(r, 2);
  fechaCell.numFmt = 'DD/MM/YYYY';
  fechaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  fechaCell.alignment = { vertical: 'middle' };
  addBorder(fechaCell);

  // Cliente
  const clienteCell = wsIng.getCell(r, 3);
  clienteCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  clienteCell.alignment = { vertical: 'middle' };
  addBorder(clienteCell);

  // Monto
  const montoCell = wsIng.getCell(r, 4);
  montoCell.numFmt = '"$"#,##0.00';
  montoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  montoCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(montoCell);

  // Categoría (dropdown)
  const catCell = wsIng.getCell(r, 5);
  catCell.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"Ventas de Productos,Servicios,Consultoría,Comisiones,Alquiler,Intereses,Otros"'],
    showErrorMessage: true,
  };
  catCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  catCell.alignment = { vertical: 'middle' };
  addBorder(catCell);

  // Estado (dropdown)
  const estadoCell = wsIng.getCell(r, 6);
  estadoCell.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"Cobrado,Pendiente,Anulado"'],
    showErrorMessage: true,
  };
  estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  estadoCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(estadoCell);

  // Método de pago (dropdown)
  const metodoCell = wsIng.getCell(r, 7);
  metodoCell.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: ['"Efectivo,Transferencia,Tarjeta,Cheque,Plataforma Digital,Otro"'],
    showErrorMessage: true,
  };
  metodoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  metodoCell.alignment = { vertical: 'middle' };
  addBorder(metodoCell);

  // Factura/Ref
  const facCell = wsIng.getCell(r, 8);
  facCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  facCell.alignment = { vertical: 'middle' };
  addBorder(facCell);

  // Notas
  const notasCell = wsIng.getCell(r, 9);
  notasCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  notasCell.alignment = { vertical: 'middle', wrapText: true };
  addBorder(notasCell);

  wsIng.getRow(r).height = 20;
}

// Fila de totales
wsIng.getRow(104).height = 24;
for (let c = 1; c <= 9; c++) {
  const cell = wsIng.getCell(104, c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.verdeDark } };
  cell.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
  addBorder(cell);
}
const totIngLabel = wsIng.getCell(104, 3);
totIngLabel.value = 'TOTAL INGRESOS';
totIngLabel.alignment = { horizontal: 'right', vertical: 'middle' };

const totIngVal = wsIng.getCell(104, 4);
totIngVal.value = { formula: 'SUM(D4:D103)' };
totIngVal.numFmt = '"$"#,##0.00';
totIngVal.alignment = { horizontal: 'right', vertical: 'middle' };

// Freeze header
wsIng.views = [{ state: 'frozen', xSplit: 0, ySplit: 3, showGridLines: false }];

// ════════════════════════════════════════════════════════════════════════════
// SHEET 3 — GASTOS
// ════════════════════════════════════════════════════════════════════════════
const wsGas = wb.addWorksheet('💸 Gastos', { tabColor: { argb: C.rojoDark } });

const gasCols = [
  { header: '#',              width: 5  },
  { header: 'Fecha',         width: 14 },
  { header: 'Proveedor',     width: 24 },
  { header: 'Monto',         width: 16 },
  { header: 'Categoría',     width: 24 },
  { header: 'Estado',        width: 14 },
  { header: 'Método de Pago',width: 18 },
  { header: 'Comprobante',   width: 16 },
  { header: 'Notas',         width: 35 },
];
gasCols.forEach((col, i) => { wsGas.getColumn(i + 1).width = col.width; });

wsGas.mergeCells('A1:I1');
const gasTitle = wsGas.getCell('A1');
gasTitle.value = '💸 REGISTRO DE GASTOS';
gasTitle.font = { bold: true, size: 14, color: { argb: C.blanco }, name: 'Calibri' };
gasTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.rojoDark } };
gasTitle.alignment = { horizontal: 'center', vertical: 'middle' };
wsGas.getRow(1).height = 32;

wsGas.mergeCells('A2:I2');
const gasInstr = wsGas.getCell('A2');
gasInstr.value = '✏️  Completa los campos en blanco. Categoriza cada gasto para que el análisis sea preciso.';
gasInstr.font = { italic: true, size: 9, color: { argb: C.grisOscuro }, name: 'Calibri' };
gasInstr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.grisClaro } };
gasInstr.alignment = { horizontal: 'center', vertical: 'middle' };
wsGas.getRow(2).height = 16;

gasCols.forEach((col, i) => { hdr(wsGas, 3, i + 1, col.header, C.rojoDark); });
wsGas.getRow(3).height = 22;

for (let r = 4; r <= 103; r++) {
  const even = (r % 2 === 0);
  const bg = even ? C.rojoClaro : C.blanco;

  const numCell = wsGas.getCell(r, 1);
  numCell.value = { formula: `IF(B${r}<>"",ROW()-3,"")` };
  numCell.font = { name: 'Calibri', size: 10, color: { argb: C.grisOscuro } };
  numCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  numCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(numCell);

  const fechaCell = wsGas.getCell(r, 2);
  fechaCell.numFmt = 'DD/MM/YYYY';
  fechaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  fechaCell.alignment = { vertical: 'middle' };
  addBorder(fechaCell);

  const provCell = wsGas.getCell(r, 3);
  provCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  provCell.alignment = { vertical: 'middle' };
  addBorder(provCell);

  const montoCell = wsGas.getCell(r, 4);
  montoCell.numFmt = '"$"#,##0.00';
  montoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  montoCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(montoCell);

  const catCell = wsGas.getCell(r, 5);
  catCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"Nómina y Personal,Alquiler y Oficina,Marketing y Publicidad,Tecnología y Software,Servicios Públicos,Transporte y Logística,Materiales y Suministros,Impuestos y Tasas,Seguros,Mantenimiento,Gastos Bancarios,Formación y Capacitación,Otros"'],
    showErrorMessage: true,
  };
  catCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  catCell.alignment = { vertical: 'middle' };
  addBorder(catCell);

  const estadoCell = wsGas.getCell(r, 6);
  estadoCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"Pagado,Pendiente,Anulado"'],
    showErrorMessage: true,
  };
  estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  estadoCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(estadoCell);

  const metodoCell = wsGas.getCell(r, 7);
  metodoCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"Efectivo,Transferencia,Tarjeta,Cheque,Débito Automático,Otro"'],
    showErrorMessage: true,
  };
  metodoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  metodoCell.alignment = { vertical: 'middle' };
  addBorder(metodoCell);

  const compCell = wsGas.getCell(r, 8);
  compCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  compCell.alignment = { vertical: 'middle' };
  addBorder(compCell);

  const notasCell = wsGas.getCell(r, 9);
  notasCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  notasCell.alignment = { vertical: 'middle', wrapText: true };
  addBorder(notasCell);

  wsGas.getRow(r).height = 20;
}

wsGas.getRow(104).height = 24;
for (let c = 1; c <= 9; c++) {
  const cell = wsGas.getCell(104, c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.rojoDark } };
  cell.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
  addBorder(cell);
}
wsGas.getCell(104, 3).value = 'TOTAL GASTOS';
wsGas.getCell(104, 3).alignment = { horizontal: 'right', vertical: 'middle' };
wsGas.getCell(104, 3).font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
const totGasVal = wsGas.getCell(104, 4);
totGasVal.value = { formula: 'SUM(D4:D103)' };
totGasVal.numFmt = '"$"#,##0.00';
totGasVal.alignment = { horizontal: 'right', vertical: 'middle' };
totGasVal.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };

wsGas.views = [{ state: 'frozen', xSplit: 0, ySplit: 3, showGridLines: false }];

// ════════════════════════════════════════════════════════════════════════════
// SHEET 4 — FLUJO DE CAJA
// ════════════════════════════════════════════════════════════════════════════
const wsCaja = wb.addWorksheet('💳 Flujo de Caja', { tabColor: { argb: C.azulMedio } });

const cajaCols = [
  { header: '#',              width: 5  },
  { header: 'Fecha',         width: 14 },
  { header: 'Descripción',   width: 30 },
  { header: 'Categoría',     width: 22 },
  { header: 'Entradas (+)',  width: 18 },
  { header: 'Salidas (-)',   width: 18 },
  { header: 'Saldo',         width: 18 },
  { header: 'Tipo',          width: 14 },
  { header: 'Notas',         width: 30 },
];
cajaCols.forEach((col, i) => { wsCaja.getColumn(i + 1).width = col.width; });

wsCaja.mergeCells('A1:I1');
const cajaTitle = wsCaja.getCell('A1');
cajaTitle.value = '💳 FLUJO DE CAJA';
cajaTitle.font = { bold: true, size: 14, color: { argb: C.blanco }, name: 'Calibri' };
cajaTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulOscuro } };
cajaTitle.alignment = { horizontal: 'center', vertical: 'middle' };
wsCaja.getRow(1).height = 32;

// Saldo inicial
wsCaja.mergeCells('A2:D2');
const siLabel = wsCaja.getCell('A2');
siLabel.value = '💰 SALDO INICIAL (escribe aquí el saldo de apertura):';
siLabel.font = { bold: true, size: 11, color: { argb: C.azulOscuro }, name: 'Calibri' };
siLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.amarillo } };
siLabel.alignment = { vertical: 'middle' };
wsCaja.getRow(2).height = 22;

const siVal = wsCaja.getCell('E2');
siVal.value = 0;
siVal.numFmt = '"$"#,##0.00';
siVal.font = { bold: true, size: 12, color: { argb: C.verdeDark }, name: 'Calibri' };
siVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.amarillo } };
siVal.alignment = { horizontal: 'right', vertical: 'middle' };
addBorder(siVal);

cajaCols.forEach((col, i) => { hdr(wsCaja, 3, i + 1, col.header, C.azulMedio); });
wsCaja.getRow(3).height = 22;

for (let r = 4; r <= 203; r++) {
  const even = (r % 2 === 0);
  const bg = even ? C.azulClaro : C.blanco;

  // #
  const numCell = wsCaja.getCell(r, 1);
  numCell.value = { formula: `IF(B${r}<>"",ROW()-3,"")` };
  numCell.font = { name: 'Calibri', size: 10, color: { argb: C.grisOscuro } };
  numCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  numCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(numCell);

  // Fecha
  const fechaCell = wsCaja.getCell(r, 2);
  fechaCell.numFmt = 'DD/MM/YYYY';
  fechaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  fechaCell.alignment = { vertical: 'middle' };
  addBorder(fechaCell);

  // Descripción
  const descCell = wsCaja.getCell(r, 3);
  descCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  descCell.alignment = { vertical: 'middle' };
  addBorder(descCell);

  // Categoría
  const catCell = wsCaja.getCell(r, 4);
  catCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"Ventas,Cobros,Pagos a Proveedores,Nómina,Alquiler,Impuestos,Inversión,Préstamo,Otro"'],
    showErrorMessage: true,
  };
  catCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  catCell.alignment = { vertical: 'middle' };
  addBorder(catCell);

  // Entradas
  const entCell = wsCaja.getCell(r, 5);
  entCell.numFmt = '"$"#,##0.00';
  entCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  entCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(entCell);

  // Salidas
  const salCell = wsCaja.getCell(r, 6);
  salCell.numFmt = '"$"#,##0.00';
  salCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  salCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(salCell);

  // Saldo (fórmula acumulada)
  const saldoCell = wsCaja.getCell(r, 7);
  if (r === 4) {
    saldoCell.value = { formula: `IF(OR(E${r}<>"",F${r}<>""),E2+E${r}-F${r},"")` };
  } else {
    saldoCell.value = { formula: `IF(OR(E${r}<>"",F${r}<>""),IF(G${r-1}="",E2,G${r-1})+E${r}-F${r},"")` };
  }
  saldoCell.numFmt = '"$"#,##0.00';
  saldoCell.font = { bold: true, name: 'Calibri', size: 11, color: { argb: C.azulMedio } };
  saldoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  saldoCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(saldoCell);

  // Tipo
  const tipoCell = wsCaja.getCell(r, 8);
  tipoCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"Operativo,Inversión,Financiamiento"'],
    showErrorMessage: true,
  };
  tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  tipoCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(tipoCell);

  // Notas
  const notasCell = wsCaja.getCell(r, 9);
  notasCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  notasCell.alignment = { vertical: 'middle', wrapText: true };
  addBorder(notasCell);

  wsCaja.getRow(r).height = 20;
}

// Fila de totales
wsCaja.getRow(204).height = 26;
for (let c = 1; c <= 9; c++) {
  const cell = wsCaja.getCell(204, c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulOscuro } };
  cell.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
  addBorder(cell);
}
wsCaja.getCell(204, 3).value = 'TOTALES';
wsCaja.getCell(204, 3).alignment = { horizontal: 'right', vertical: 'middle' };
wsCaja.getCell(204, 3).font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };

const totEnt = wsCaja.getCell(204, 5);
totEnt.value = { formula: 'SUM(E4:E203)' };
totEnt.numFmt = '"$"#,##0.00';
totEnt.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
totEnt.alignment = { horizontal: 'right', vertical: 'middle' };

const totSal = wsCaja.getCell(204, 6);
totSal.value = { formula: 'SUM(F4:F203)' };
totSal.numFmt = '"$"#,##0.00';
totSal.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
totSal.alignment = { horizontal: 'right', vertical: 'middle' };

const netoCaja = wsCaja.getCell(204, 7);
netoCaja.value = { formula: 'E204-F204' };
netoCaja.numFmt = '"$"#,##0.00';
netoCaja.font = { bold: true, color: { argb: C.amarillo }, name: 'Calibri', size: 12 };
netoCaja.alignment = { horizontal: 'right', vertical: 'middle' };

wsCaja.views = [{ state: 'frozen', xSplit: 0, ySplit: 3, showGridLines: false }];

// ════════════════════════════════════════════════════════════════════════════
// SHEET 5 — PRESUPUESTO VS REAL
// ════════════════════════════════════════════════════════════════════════════
const wsPres = wb.addWorksheet('📋 Presupuesto', { tabColor: { argb: 'FF9900' } });

const presCols = [
  { header: 'Categoría',              width: 30 },
  { header: 'Tipo',                   width: 14 },
  { header: 'Presupuesto Mensual',    width: 22 },
  { header: 'Real (Mes Actual)',      width: 22 },
  { header: 'Diferencia',            width: 18 },
  { header: '% Ejecución',           width: 16 },
  { header: 'Estado',                width: 14 },
  { header: 'Notas',                 width: 30 },
];
presCols.forEach((col, i) => { wsPres.getColumn(i + 1).width = col.width; });

wsPres.mergeCells('A1:H1');
const presTitle = wsPres.getCell('A1');
presTitle.value = '📋 PRESUPUESTO VS REAL';
presTitle.font = { bold: true, size: 14, color: { argb: C.blanco }, name: 'Calibri' };
presTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6600' } };
presTitle.alignment = { horizontal: 'center', vertical: 'middle' };
wsPres.getRow(1).height = 32;

wsPres.mergeCells('A2:H2');
const presInstr = wsPres.getCell('A2');
presInstr.value = '✏️  Ingresa el Presupuesto Mensual. El "Real" se calcula automáticamente desde las pestañas de Ingresos y Gastos.';
presInstr.font = { italic: true, size: 9, color: { argb: C.grisOscuro }, name: 'Calibri' };
presInstr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.grisClaro } };
presInstr.alignment = { horizontal: 'center', vertical: 'middle' };
wsPres.getRow(2).height = 16;

presCols.forEach((col, i) => { hdr(wsPres, 3, i + 1, col.header, 'FF6600'); });
wsPres.getRow(3).height = 22;

// Filas de ingresos
const ingRows = [
  ['Ventas de Productos', 'Ingreso', `SUMPRODUCT((MONTH('💵 Ingresos'!B:B)=MONTH(TODAY()))*(YEAR('💵 Ingresos'!B:B)=YEAR(TODAY()))*('💵 Ingresos'!E:E="Ventas de Productos")*'💵 Ingresos'!D:D)`],
  ['Servicios',           'Ingreso', `SUMPRODUCT((MONTH('💵 Ingresos'!B:B)=MONTH(TODAY()))*(YEAR('💵 Ingresos'!B:B)=YEAR(TODAY()))*('💵 Ingresos'!E:E="Servicios")*'💵 Ingresos'!D:D)`],
  ['Consultoría',         'Ingreso', `SUMPRODUCT((MONTH('💵 Ingresos'!B:B)=MONTH(TODAY()))*(YEAR('💵 Ingresos'!B:B)=YEAR(TODAY()))*('💵 Ingresos'!E:E="Consultoría")*'💵 Ingresos'!D:D)`],
  ['Comisiones',          'Ingreso', `SUMPRODUCT((MONTH('💵 Ingresos'!B:B)=MONTH(TODAY()))*(YEAR('💵 Ingresos'!B:B)=YEAR(TODAY()))*('💵 Ingresos'!E:E="Comisiones")*'💵 Ingresos'!D:D)`],
  ['Otros Ingresos',      'Ingreso', `SUMPRODUCT((MONTH('💵 Ingresos'!B:B)=MONTH(TODAY()))*(YEAR('💵 Ingresos'!B:B)=YEAR(TODAY()))*('💵 Ingresos'!E:E="Otros")*'💵 Ingresos'!D:D)`],
];

const gasRows = [
  ['Nómina y Personal',       'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Nómina y Personal")*'💸 Gastos'!D:D)`],
  ['Alquiler y Oficina',      'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Alquiler y Oficina")*'💸 Gastos'!D:D)`],
  ['Marketing y Publicidad',  'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Marketing y Publicidad")*'💸 Gastos'!D:D)`],
  ['Tecnología y Software',   'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Tecnología y Software")*'💸 Gastos'!D:D)`],
  ['Servicios Públicos',      'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Servicios Públicos")*'💸 Gastos'!D:D)`],
  ['Transporte y Logística',  'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Transporte y Logística")*'💸 Gastos'!D:D)`],
  ['Materiales y Suministros','Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Materiales y Suministros")*'💸 Gastos'!D:D)`],
  ['Impuestos y Tasas',       'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Impuestos y Tasas")*'💸 Gastos'!D:D)`],
  ['Seguros',                 'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Seguros")*'💸 Gastos'!D:D)`],
  ['Otros Gastos',            'Gasto', `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=MONTH(TODAY()))*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*('💸 Gastos'!E:E="Otros")*'💸 Gastos'!D:D)`],
];

const allPresRows = [...ingRows, ...gasRows];
allPresRows.forEach(([cat, tipo, realFml], i) => {
  const r = 4 + i;
  wsPres.getRow(r).height = 22;
  const isIng = tipo === 'Ingreso';
  const bg = isIng
    ? (i % 2 === 0 ? C.verdeClaro : C.blanco)
    : (i % 2 === 0 ? C.rojoClaro : C.blanco);

  // Categoría
  const catCell = wsPres.getCell(r, 1);
  catCell.value = cat;
  catCell.font = { name: 'Calibri', size: 11 };
  catCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  catCell.alignment = { vertical: 'middle' };
  addBorder(catCell);

  // Tipo
  const tipoCell = wsPres.getCell(r, 2);
  tipoCell.value = tipo;
  tipoCell.font = { bold: true, name: 'Calibri', size: 10, color: { argb: isIng ? C.verdeDark : C.rojoDark } };
  tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  tipoCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(tipoCell);

  // Presupuesto (usuario llena)
  const presCell = wsPres.getCell(r, 3);
  presCell.value = 0;
  presCell.numFmt = '"$"#,##0.00';
  presCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.amarillo } };
  presCell.font = { name: 'Calibri', size: 11 };
  presCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(presCell);

  // Real (fórmula)
  const realCell = wsPres.getCell(r, 4);
  realCell.value = { formula: realFml };
  realCell.numFmt = '"$"#,##0.00';
  realCell.font = { bold: true, name: 'Calibri', size: 11 };
  realCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  realCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(realCell);

  // Diferencia
  const diffCell = wsPres.getCell(r, 5);
  diffCell.value = { formula: `C${r}-D${r}` };
  diffCell.numFmt = '"$"#,##0.00';
  diffCell.font = { bold: true, name: 'Calibri', size: 11 };
  diffCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  diffCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(diffCell);

  // % ejecución
  const pctCell = wsPres.getCell(r, 6);
  pctCell.value = { formula: `IFERROR(D${r}/C${r}*100,0)` };
  pctCell.numFmt = '0.0"%"';
  pctCell.font = { bold: true, name: 'Calibri', size: 11 };
  pctCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  pctCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(pctCell);

  // Estado (fórmula semáforo)
  const estCell = wsPres.getCell(r, 7);
  estCell.value = { formula: `IF(C${r}=0,"Sin presupuesto",IF(D${r}/C${r}<=0.8,"✅ Bajo",IF(D${r}/C${r}<=1,"⚠️ En rango","🔴 Excedido")))` };
  estCell.font = { name: 'Calibri', size: 10 };
  estCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  estCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(estCell);

  // Notas
  const notCell = wsPres.getCell(r, 8);
  notCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  notCell.alignment = { vertical: 'middle' };
  addBorder(notCell);
});

const lastPresRow = 4 + allPresRows.length;
wsPres.getRow(lastPresRow).height = 26;
for (let c = 1; c <= 8; c++) {
  const cell = wsPres.getCell(lastPresRow, c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6600' } };
  cell.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
  addBorder(cell);
}
wsPres.getCell(lastPresRow, 1).value = 'TOTALES';
wsPres.getCell(lastPresRow, 1).alignment = { vertical: 'middle' };
wsPres.getCell(lastPresRow, 1).font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };

const presTotal = wsPres.getCell(lastPresRow, 3);
presTotal.value = { formula: `SUM(C4:C${lastPresRow-1})` };
presTotal.numFmt = '"$"#,##0.00';
presTotal.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
presTotal.alignment = { horizontal: 'right', vertical: 'middle' };

const realTotal = wsPres.getCell(lastPresRow, 4);
realTotal.value = { formula: `SUM(D4:D${lastPresRow-1})` };
realTotal.numFmt = '"$"#,##0.00';
realTotal.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
realTotal.alignment = { horizontal: 'right', vertical: 'middle' };

wsPres.views = [{ state: 'frozen', xSplit: 0, ySplit: 3, showGridLines: false }];

// ════════════════════════════════════════════════════════════════════════════
// SHEET 6 — CUENTAS POR COBRAR
// ════════════════════════════════════════════════════════════════════════════
const wsCobrar = wb.addWorksheet('🧾 Cuentas x Cobrar', { tabColor: { argb: '9933CC' } });

const cobrarCols = [
  { header: '#',               width: 5  },
  { header: 'Cliente',         width: 26 },
  { header: 'Concepto',        width: 30 },
  { header: 'Monto',           width: 16 },
  { header: 'Fecha Emisión',   width: 16 },
  { header: 'Fecha Venc.',     width: 16 },
  { header: 'Días Vencido',    width: 14 },
  { header: 'Estado',          width: 14 },
  { header: 'Prioridad',       width: 14 },
  { header: 'Notas',           width: 30 },
];
cobrarCols.forEach((col, i) => { wsCobrar.getColumn(i + 1).width = col.width; });

wsCobrar.mergeCells('A1:J1');
const cobrarTitle = wsCobrar.getCell('A1');
cobrarTitle.value = '🧾 CUENTAS POR COBRAR';
cobrarTitle.font = { bold: true, size: 14, color: { argb: C.blanco }, name: 'Calibri' };
cobrarTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6600CC' } };
cobrarTitle.alignment = { horizontal: 'center', vertical: 'middle' };
wsCobrar.getRow(1).height = 32;

wsCobrar.mergeCells('A2:J2');
const cobrarInstr = wsCobrar.getCell('A2');
cobrarInstr.value = '✏️  Registra aquí lo que te deben. Los días vencidos se calculan automáticamente.';
cobrarInstr.font = { italic: true, size: 9, color: { argb: C.grisOscuro }, name: 'Calibri' };
cobrarInstr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.grisClaro } };
cobrarInstr.alignment = { horizontal: 'center', vertical: 'middle' };
wsCobrar.getRow(2).height = 16;

cobrarCols.forEach((col, i) => { hdr(wsCobrar, 3, i + 1, col.header, '6600CC'); });
wsCobrar.getRow(3).height = 22;

for (let r = 4; r <= 53; r++) {
  const even = (r % 2 === 0);
  const bg = even ? 'EDE7F6' : C.blanco;
  wsCobrar.getRow(r).height = 20;

  const numCell = wsCobrar.getCell(r, 1);
  numCell.value = { formula: `IF(B${r}<>"",ROW()-3,"")` };
  numCell.font = { name: 'Calibri', size: 10, color: { argb: C.grisOscuro } };
  numCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  numCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(numCell);

  for (let c = 2; c <= 10; c++) {
    const cell = wsCobrar.getCell(r, c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
    cell.alignment = { vertical: 'middle' };
    addBorder(cell);
  }

  wsCobrar.getCell(r, 4).numFmt = '"$"#,##0.00';
  wsCobrar.getCell(r, 4).alignment = { horizontal: 'right', vertical: 'middle' };
  wsCobrar.getCell(r, 5).numFmt = 'DD/MM/YYYY';
  wsCobrar.getCell(r, 6).numFmt = 'DD/MM/YYYY';

  // Días vencido
  const diasCell = wsCobrar.getCell(r, 7);
  diasCell.value = { formula: `IF(F${r}="","",IF(H${r}="Cobrado",0,MAX(0,TODAY()-F${r})))` };
  diasCell.numFmt = '0';
  diasCell.font = { bold: true, name: 'Calibri', size: 11 };
  diasCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Estado
  const estadoCell = wsCobrar.getCell(r, 8);
  estadoCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"Pendiente,Cobrado,Vencido,En Disputa"'],
    showErrorMessage: true,
  };
  estadoCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Prioridad
  const prioCell = wsCobrar.getCell(r, 9);
  prioCell.dataValidation = {
    type: 'list', allowBlank: true,
    formulae: ['"Alta,Media,Baja"'],
    showErrorMessage: true,
  };
  prioCell.alignment = { horizontal: 'center', vertical: 'middle' };
}

// Total
wsCobrar.getRow(54).height = 24;
for (let c = 1; c <= 10; c++) {
  const cell = wsCobrar.getCell(54, c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6600CC' } };
  cell.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
  addBorder(cell);
}
wsCobrar.getCell(54, 2).value = 'TOTAL POR COBRAR';
wsCobrar.getCell(54, 2).alignment = { horizontal: 'right', vertical: 'middle' };
wsCobrar.getCell(54, 2).font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
const totCobrar = wsCobrar.getCell(54, 4);
totCobrar.value = { formula: 'SUMIF(H4:H53,"<>Cobrado",D4:D53)' };
totCobrar.numFmt = '"$"#,##0.00';
totCobrar.font = { bold: true, color: { argb: C.amarillo }, name: 'Calibri', size: 12 };
totCobrar.alignment = { horizontal: 'right', vertical: 'middle' };

wsCobrar.views = [{ state: 'frozen', xSplit: 0, ySplit: 3, showGridLines: false }];

// ════════════════════════════════════════════════════════════════════════════
// SHEET 7 — ANÁLISIS MENSUAL
// ════════════════════════════════════════════════════════════════════════════
const wsAnual = wb.addWorksheet('📈 Análisis Mensual', { tabColor: { argb: 'CC6600' } });

const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const anualCols = [
  { header: 'Mes',          width: 16 },
  { header: 'Ingresos',     width: 18 },
  { header: 'Gastos',       width: 18 },
  { header: 'Utilidad',     width: 18 },
  { header: 'Margen (%)',   width: 14 },
  { header: 'Transacciones',width: 16 },
];
anualCols.forEach((col, i) => { wsAnual.getColumn(i + 1).width = col.width; });

wsAnual.mergeCells('A1:F1');
const anualTitle = wsAnual.getCell('A1');
anualTitle.value = '📈 ANÁLISIS MENSUAL — AÑO ACTUAL';
anualTitle.font = { bold: true, size: 14, color: { argb: C.blanco }, name: 'Calibri' };
anualTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CC6600' } };
anualTitle.alignment = { horizontal: 'center', vertical: 'middle' };
wsAnual.getRow(1).height = 32;

wsAnual.mergeCells('A2:F2');
const anualInstr = wsAnual.getCell('A2');
anualInstr.value = 'Los datos se calculan automáticamente desde las pestañas de Ingresos y Gastos.';
anualInstr.font = { italic: true, size: 9, color: { argb: C.grisOscuro }, name: 'Calibri' };
anualInstr.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.grisClaro } };
anualInstr.alignment = { horizontal: 'center', vertical: 'middle' };
wsAnual.getRow(2).height = 16;

anualCols.forEach((col, i) => { hdr(wsAnual, 3, i + 1, col.header, 'CC6600'); });
wsAnual.getRow(3).height = 22;

meses.forEach((mes, idx) => {
  const r = 4 + idx;
  const m = idx + 1;
  wsAnual.getRow(r).height = 22;
  const bg = idx % 2 === 0 ? 'FFF3E0' : C.blanco;

  const mesCell = wsAnual.getCell(r, 1);
  mesCell.value = mes;
  mesCell.font = { bold: true, name: 'Calibri', size: 11 };
  mesCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  mesCell.alignment = { vertical: 'middle' };
  addBorder(mesCell);

  const ingCell = wsAnual.getCell(r, 2);
  ingCell.value = { formula: `SUMPRODUCT((MONTH('💵 Ingresos'!B:B)=${m})*(YEAR('💵 Ingresos'!B:B)=YEAR(TODAY()))*'💵 Ingresos'!D:D)` };
  ingCell.numFmt = '"$"#,##0.00';
  ingCell.font = { name: 'Calibri', size: 11, color: { argb: C.verdeDark } };
  ingCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  ingCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(ingCell);

  const gasCell = wsAnual.getCell(r, 3);
  gasCell.value = { formula: `SUMPRODUCT((MONTH('💸 Gastos'!B:B)=${m})*(YEAR('💸 Gastos'!B:B)=YEAR(TODAY()))*'💸 Gastos'!D:D)` };
  gasCell.numFmt = '"$"#,##0.00';
  gasCell.font = { name: 'Calibri', size: 11, color: { argb: C.rojoDark } };
  gasCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  gasCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(gasCell);

  const utilCell = wsAnual.getCell(r, 4);
  utilCell.value = { formula: `B${r}-C${r}` };
  utilCell.numFmt = '"$"#,##0.00';
  utilCell.font = { bold: true, name: 'Calibri', size: 11 };
  utilCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  utilCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(utilCell);

  const margenCell = wsAnual.getCell(r, 5);
  margenCell.value = { formula: `IFERROR(D${r}/B${r}*100,0)` };
  margenCell.numFmt = '0.0"%"';
  margenCell.font = { name: 'Calibri', size: 11 };
  margenCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  margenCell.alignment = { horizontal: 'right', vertical: 'middle' };
  addBorder(margenCell);

  const txCell = wsAnual.getCell(r, 6);
  txCell.value = { formula: `SUMPRODUCT((MONTH('💵 Ingresos'!B:B)=${m})*(YEAR('💵 Ingresos'!B:B)=YEAR(TODAY()))*('💵 Ingresos'!D:D>0)*1)` };
  txCell.numFmt = '#,##0';
  txCell.font = { name: 'Calibri', size: 11 };
  txCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
  txCell.alignment = { horizontal: 'center', vertical: 'middle' };
  addBorder(txCell);
});

// Fila totales anuales
const totalRow = 16;
wsAnual.getRow(totalRow).height = 26;
for (let c = 1; c <= 6; c++) {
  const cell = wsAnual.getCell(totalRow, c);
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CC6600' } };
  cell.font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };
  addBorder(cell);
}
wsAnual.getCell(totalRow, 1).value = 'TOTAL AÑO';
wsAnual.getCell(totalRow, 1).alignment = { horizontal: 'center', vertical: 'middle' };
wsAnual.getCell(totalRow, 1).font = { bold: true, color: { argb: C.blanco }, name: 'Calibri', size: 11 };

['B','C','D','F'].forEach((col, i) => {
  const cell = wsAnual.getCell(`${col}${totalRow}`);
  cell.value = { formula: `SUM(${col}4:${col}15)` };
  cell.numFmt = i < 3 ? '"$"#,##0.00' : (i === 2 ? '"$"#,##0.00' : '#,##0');
  cell.font = { bold: true, color: { argb: C.amarillo }, name: 'Calibri', size: 12 };
  cell.alignment = { horizontal: 'right', vertical: 'middle' };
});
wsAnual.getCell(`D${totalRow}`).numFmt = '"$"#,##0.00';
wsAnual.getCell(`E${totalRow}`).value = { formula: `IFERROR(D${totalRow}/B${totalRow}*100,0)` };
wsAnual.getCell(`E${totalRow}`).numFmt = '0.0"%"';
wsAnual.getCell(`E${totalRow}`).font = { bold: true, color: { argb: C.amarillo }, name: 'Calibri', size: 12 };
wsAnual.getCell(`F${totalRow}`).value = { formula: `SUM(F4:F15)` };
wsAnual.getCell(`F${totalRow}`).numFmt = '#,##0';
wsAnual.getCell(`F${totalRow}`).font = { bold: true, color: { argb: C.amarillo }, name: 'Calibri', size: 12 };

wsAnual.views = [{ state: 'frozen', xSplit: 0, ySplit: 3, showGridLines: false }];

// ════════════════════════════════════════════════════════════════════════════
// GUARDAR
// ════════════════════════════════════════════════════════════════════════════
// Fijar el Resumen como primera hoja activa
wb.views = [{ activeTab: 0 }];

const outputPath = path.join(__dirname, '..', 'Gestión del Negocio.xlsx');
wb.xlsx.writeFile(outputPath).then(() => {
  console.log('✅ Excel creado: ' + outputPath);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
