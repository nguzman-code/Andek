require('dotenv').config();
const nodemailer = require('nodemailer');

// Escapa el texto ingresado en el formulario antes de insertarlo en el correo HTML.
const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const fila = (etiqueta, valor) => `
  <tr><td style="padding:12px 0;border-bottom:1px solid #E7EBEC;color:#5D7279;font-size:14px;width:160px">${etiqueta}</td>
      <td style="padding:12px 0;border-bottom:1px solid #E7EBEC;color:#1B2B30">${valor || '—'}</td></tr>`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const body = req.body || {};
  const { nombre, empresa, email, telefono, industria, area, mensaje, sitio } = body;

  // Campo trampa: si viene completo, es un bot. Respondemos OK sin enviar nada.
  if (sitio) return res.json({ success: true });

  if (!nombre?.trim() || !empresa?.trim() || !email?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const primerNombre = esc(nombre.trim().split(' ')[0]);

  const mailEquipo = {
    from: `"Andek Solutions Web" <${process.env.SMTP_USER}>`,
    to: process.env.MAIL_TO || process.env.SMTP_USER,
    replyTo: email,
    subject: `[Web] Nuevo contacto: ${nombre.trim()} (${(empresa || '').trim()})`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;color:#1B2B30">
        <div style="background:#1B2B30;padding:24px;border-radius:6px;margin-bottom:24px">
          <p style="color:#fff;font-size:18px;font-weight:600;margin:0">Andek Solutions</p>
          <p style="color:#C9D1D3;font-size:13px;margin:4px 0 0">Nuevo mensaje desde el sitio web</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${fila('Nombre', esc(nombre))}
          ${fila('Empresa', esc(empresa))}
          ${fila('Email', `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}
          ${fila('Teléfono', esc(telefono))}
          ${fila('Industria', esc(industria))}
          ${fila('Qué quiere mejorar', esc(area))}
        </table>
        <div style="margin-top:24px;background:#F6F8F8;border-radius:6px;padding:20px">
          <p style="color:#5D7279;font-size:13px;margin:0 0 8px">Mensaje</p>
          <p style="margin:0;white-space:pre-wrap">${esc(mensaje)}</p>
        </div>
      </div>`,
  };

  const mailCliente = {
    from: `"Andek Solutions" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Recibimos tu mensaje, ${nombre.trim().split(' ')[0]}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1B2B30">
        <div style="background:#1B2B30;padding:24px;border-radius:6px;margin-bottom:24px">
          <p style="color:#fff;font-size:18px;font-weight:600;margin:0">Andek Solutions</p>
          <p style="color:#C9D1D3;font-size:13px;margin:4px 0 0">Eficiencia operacional para instalaciones comerciales</p>
        </div>
        <p style="font-size:18px;margin:0 0 12px">Hola ${primerNombre}, gracias por escribirnos.</p>
        <p style="color:#5D7279;line-height:1.6;margin:0">Recibimos tu mensaje y te responderemos en menos de 24 horas hábiles.</p>
        <div style="margin:24px 0;background:#F6F8F8;border-radius:6px;padding:20px">
          <p style="color:#5D7279;font-size:13px;margin:0 0 8px">Tu mensaje</p>
          <p style="margin:0;white-space:pre-wrap">${esc(mensaje)}</p>
        </div>
        <p style="font-size:13px;color:#5D7279;margin:0">Andek Solutions SpA · Santiago, Chile · +56 9 6919 3071</p>
      </div>`,
  };

  try {
    await transporter.sendMail(mailEquipo);
    await transporter.sendMail(mailCliente);
    return res.json({ success: true });
  } catch (err) {
    console.error('Error de correo:', err.message);
    return res.status(500).json({ error: 'No se pudo enviar el correo. Intenta nuevamente.' });
  }
};
