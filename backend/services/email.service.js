let nodemailer = null;

try {
  nodemailer = require("nodemailer");
} catch {
  nodemailer = null;
}

const emailEnabled = () => {
  return String(process.env.EMAIL_ALERTS_ENABLED || "false").toLowerCase() === "true";
};

const smtpConfigured = () => {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
};

const getTransporter = () => {
  if (!nodemailer) {
    return null;
  }

  if (!emailEnabled() || !smtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);

  if (!recipients.length) {
    return { sent: false, reason: "No recipients configured" };
  }

  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      "[email] skipped: install nodemailer and configure EMAIL_ALERTS_ENABLED=true plus SMTP_* env vars"
    );
    return { sent: false, reason: "Email service not configured" };
  }

  const info = await transporter.sendMail({
    from: process.env.ALERT_EMAIL_FROM || process.env.SMTP_USER,
    to: recipients.join(","),
    subject,
    text,
    html,
  });

  return { sent: true, messageId: info.messageId };
};

module.exports = {
  sendEmail,
  emailEnabled,
  smtpConfigured,
};
