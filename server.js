/**
 * Andek Group — Contact Form Backend
 * Express + Nodemailer
 *
 * Start:  node server.js
 * Config: copy .env.example → .env and fill in your credentials
 */

require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ── */
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static('.'));          // Serve index.html + assets


/* ── Mail transporter ── */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


/* ── POST /api/contact ── */
app.post('/api/contact', async (req, res) => {
  const { nombre, email, empresa, servicio, mensaje } = req.body;

  // Basic server-side validation
  if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
    return res.status(400).json({ error: 'Campos requeridos faltantes.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  const serviceLabels = {
    iot:       'Control Industrial IoT',
    energia:   'Eficiencia Energética',
    bi:        'Business Intelligence',
    seguridad: 'Ciberseguridad OT',
    otro:      'Otro',
  };

  const mailToTeam = {
    from:    `"Andek Group Web" <${process.env.SMTP_USER}>`,
    to:      process.env.MAIL_TO || process.env.SMTP_USER,
    subject: `[Web] Nuevo contacto de ${nombre}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <div style="background:#0D1117;padding:24px;border-radius:12px;margin-bottom:24px;text-align:center">
          <p style="color:#fff;font-size:18px;font-weight:700;margin:0">Andek Group</p>
          <p style="color:rgba(255,255,255,.5);font-size:13px;margin:4px 0 0">Nuevo mensaje desde el sitio web</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:14px;width:140px">Nombre</td>
              <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;font-weight:600">${nombre}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:14px">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #E5E7EB"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:14px">Empresa</td>
              <td style="padding:12px 0;border-bottom:1px solid #E5E7EB">${empresa || '—'}</td></tr>
          <tr><td style="padding:12px 0;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:14px">Servicio</td>
              <td style="padding:12px 0;border-bottom:1px solid #E5E7EB">${serviceLabels[servicio] || '—'}</td></tr>
        </table>
        <div style="margin-top:24px;background:#F8F9FB;border-radius:10px;padding:20px">
          <p style="color:#6B7280;font-size:13px;margin-bottom:8px">Mensaje</p>
          <p style="margin:0;white-space:pre-wrap">${mensaje}</p>
        </div>
      </div>
    `,
  };

  const mailToUser = {
    from:    `"Andek Group" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: `Recibimos tu mensaje, ${nombre.split(' ')[0]}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <div style="background:#0D1117;padding:24px;border-radius:12px;margin-bottom:24px;text-align:center">
          <p style="color:#fff;font-size:18px;font-weight:700;margin:0">Andek Group</p>
          <p style="color:rgba(255,255,255,.5);font-size:13px;margin:4px 0 0">Technology for Industrial Efficiency</p>
        </div>
        <h2 style="font-size:22px;margin-bottom:12px">¡Gracias por contactarnos, ${nombre.split(' ')[0]}!</h2>
        <p style="color:#6B7280;line-height:1.7">
          Hemos recibido tu mensaje y uno de nuestros expertos se pondrá en contacto contigo
          en las próximas <strong style="color:#0D1117">24 horas hábiles</strong>.
        </p>
        <div style="margin:28px 0;background:#EBF0FD;border-radius:10px;padding:20px;border-left:4px solid #1E52D0">
          <p style="margin:0;color:#1440B0;font-size:14px"><strong>Tu mensaje:</strong><br/><br/>${mensaje}</p>
        </div>
        <hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0"/>
        <p style="font-size:13px;color:#9CA3AF;text-align:center">
          © 2024 Andek Group · Technology for Industrial Efficiency
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailToTeam);
    await transporter.sendMail(mailToUser);
    res.json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: 'Error al enviar el correo. Intenta nuevamente.' });
  }
});


/* ── Start ── */
app.listen(PORT, () => {
  console.log(`\n✓ Andek Group server running → http://localhost:${PORT}\n`);
});
