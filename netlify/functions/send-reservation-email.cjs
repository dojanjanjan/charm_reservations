const nodemailer = require('nodemailer');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

function getEnv(name, fallback) {
  const v = process.env[name];
  return (v === undefined || v === null || v === '') ? fallback : v;
}

function getLocale(language) {
  if (language === 'de') return 'de-DE';
  if (language === 'th') return 'th-TH';
  return 'en-US';
}

function formatDateLocal(yyyyMmDd, language) {
  // yyyyMmDd: "YYYY-MM-DD"
  const [y, m, d] = (yyyyMmDd || '').split('-').map(Number);
  if (!y || !m || !d) return yyyyMmDd || '';
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(getLocale(language), { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' });
}

function buildEmail({ type, reservation, language }) {
  const dateLabel = formatDateLocal(reservation.date, language);
  const timeLabel = reservation.time || '';
  const paxLabel = reservation.pax ? String(reservation.pax) : '';
  const confirmedBy = reservation.confirmedBy || '';
  const confirmationMessage = reservation.confirmationMessage || '';

  const subjectMap = {
    en: {
      confirmed: `Your reservation is confirmed (${reservation.date} ${timeLabel})`,
      updated: `Your reservation was updated (${reservation.date} ${timeLabel})`
    },
    de: {
      confirmed: `Ihre Reservierung ist bestätigt (${reservation.date} ${timeLabel})`,
      updated: `Ihre Reservierung wurde aktualisiert (${reservation.date} ${timeLabel})`
    },
    th: {
      confirmed: `ยืนยันการจองเรียบร้อยแล้ว (${reservation.date} ${timeLabel})`,
      updated: `อัปเดตการจองเรียบร้อยแล้ว (${reservation.date} ${timeLabel})`
    }
  };

  const copy = {
    en: {
      titleConfirmed: 'Reservation confirmed',
      titleUpdated: 'Reservation updated',
      greeting: `Hi ${reservation.guestName || ''},`,
      line1Confirmed: 'Your reservation at Charm Thai has been confirmed.',
      line1Updated: 'Your reservation at Charm Thai has been updated.',
      details: 'Details',
      pax: 'Guests',
      message: 'Message',
      comments: 'Notes',
      footer: 'If you have questions, please reply to this email.'
    },
    de: {
      titleConfirmed: 'Reservierung bestätigt',
      titleUpdated: 'Reservierung aktualisiert',
      greeting: `Hallo ${reservation.guestName || ''},`,
      line1Confirmed: 'Ihre Reservierung im Charm Thai wurde bestätigt.',
      line1Updated: 'Ihre Reservierung im Charm Thai wurde aktualisiert.',
      details: 'Details',
      pax: 'Personen',
      message: 'Nachricht',
      comments: 'Anmerkungen',
      footer: 'Wenn Sie Fragen haben, antworten Sie bitte auf diese E-Mail.'
    },
    th: {
      titleConfirmed: 'ยืนยันการจอง',
      titleUpdated: 'อัปเดตการจอง',
      greeting: `สวัสดี ${reservation.guestName || ''},`,
      line1Confirmed: 'การจองของคุณที่ร้าน Charm Thai ได้รับการยืนยันแล้ว',
      line1Updated: 'การจองของคุณที่ร้าน Charm Thai ได้รับการอัปเดตแล้ว',
      details: 'รายละเอียด',
      pax: 'จำนวนคน',
      message: 'ข้อความ',
      comments: 'หมายเหตุ',
      footer: 'หากมีคำถาม กรุณาตอบกลับอีเมลนี้'
    }
  }[language] || copy.en;

  const isConfirmed = type === 'confirmed';

  const subject = (subjectMap[language] || subjectMap.en)[type] || subjectMap.en.confirmed;
  const title = isConfirmed ? copy.titleConfirmed : copy.titleUpdated;
  const line1 = isConfirmed ? copy.line1Confirmed : copy.line1Updated;

  const safe = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const html = `
  <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
    <h2 style="margin:0 0 12px 0;">${safe(title)}</h2>
    <p style="margin:0 0 12px 0;">${safe(copy.greeting)}</p>
    <p style="margin:0 0 16px 0;">${safe(line1)}</p>
    <div style="padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa;">
      <div style="font-weight:700;margin-bottom:8px;">${safe(copy.details)}</div>
      <div><b>${safe(dateLabel)}</b> – ${safe(timeLabel)}</div>
      <div>${safe(copy.pax)}: <b>${safe(paxLabel)}</b></div>
      ${type === 'confirmed' && confirmationMessage ? `<div style="margin-top:8px;"><span style="color:#374151;">${safe(copy.message)}:</span><br/>${safe(confirmationMessage)}</div>` : ''}
      ${reservation.comments ? `<div style="margin-top:8px;"><span style="color:#374151;">${safe(copy.comments)}:</span><br/>${safe(reservation.comments)}</div>` : ''}
    </div>
    <p style="margin:16px 0 0 0;color:#374151;">${safe(copy.footer)}</p>
  </div>
  `.trim();

  const text = [
    title,
    '',
    copy.greeting,
    line1,
    '',
    `${dateLabel} - ${timeLabel}`,
    `${copy.pax}: ${paxLabel}`,
    type === 'confirmed' && confirmationMessage ? `${copy.message}: ${confirmationMessage}` : '',
    reservation.comments ? `${copy.comments}: ${reservation.comments}` : '',
    '',
    copy.footer
  ].filter(Boolean).join('\n');

  return { subject, html, text };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const type = payload.type;
  const reservation = payload.reservation || {};
  const language = payload.language || 'en';

  if (type !== 'confirmed' && type !== 'updated') {
    return json(400, { error: 'Invalid type' });
  }

  if (!reservation.email) {
    return json(400, { error: 'Missing reservation.email' });
  }

  const smtpHost = getEnv('SMTP_HOST', null);
  const smtpPort = Number(getEnv('SMTP_PORT', '587'));
  const smtpUser = getEnv('SMTP_USER', null);
  const smtpPass = getEnv('SMTP_PASS', null);
  const fromName = getEnv('MAIL_FROM_NAME', 'Charm Thai Reservations');
  const fromEmail = getEnv('MAIL_FROM_EMAIL', smtpUser);
  const bcc = getEnv('MAIL_BCC', null);

  const missing = [];
  if (!smtpHost) missing.push('SMTP_HOST');
  if (!smtpPort || Number.isNaN(smtpPort)) missing.push('SMTP_PORT');
  if (!smtpUser) missing.push('SMTP_USER');
  if (!smtpPass) missing.push('SMTP_PASS');
  if (!fromEmail) missing.push('MAIL_FROM_EMAIL');
  if (missing.length > 0) {
    return json(500, { error: 'Missing SMTP configuration', missing });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // STARTTLS on 587
    auth: { user: smtpUser, pass: smtpPass },
    tls: { minVersion: 'TLSv1.2' }
  });

  const { subject, html, text } = buildEmail({ type, reservation, language });

  try {
    const info = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: reservation.email,
      bcc: bcc || undefined,
      subject,
      text,
      html
    });

    return json(200, { ok: true, messageId: info.messageId || null });
  } catch (err) {
    console.error('sendMail error', err);
    return json(500, {
      error: 'Failed to send email',
      details: err && err.message ? String(err.message) : 'Unknown error',
      code: err && err.code ? String(err.code) : undefined,
      responseCode: err && err.responseCode ? Number(err.responseCode) : undefined
    });
  }
};


