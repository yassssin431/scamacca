const { User } = require("../models");
const ROLES = require("../constants/roles");
const { sendEmail } = require("./email.service");

const parseConfiguredRecipients = () => {
  return String(process.env.ALERT_RECIPIENTS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
};

const getDefaultAlertRecipients = async () => {
  const configured = parseConfiguredRecipients();

  if (configured.length) {
    return configured;
  }

  const users = await User.findAll({
    attributes: ["email"],
    where: {
      isActive: true,
      RoleId: [ROLES.ADMIN, ROLES.FINANCE],
    },
  });

  return users.map((user) => user.email).filter(Boolean);
};

const buildAlertEmail = ({ alert, anomalies = [] }) => {
  const anomalyRows = anomalies
    .slice(0, 8)
    .map((item, index) => {
      const amount = Number(item.amount || item.value || item.total || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
      const project = item.project || item.Project?.name || "-";
      const category = item.category || item.Category?.name || "-";

      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${index + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${amount}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${project}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${category}</td>
      </tr>`;
    })
    .join("");

  const subject = `[Tradrly] ${alert.severity || "HIGH"} AI anomaly alert`;
  const text = `${alert.type}: ${alert.message}`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:14px;padding:24px;border:1px solid #e5e7eb;">
        <p style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#007a55;margin:0 0 8px;">AI Alert System</p>
        <h2 style="margin:0 0 12px;color:#041627;">${alert.type}</h2>
        <p style="font-size:15px;line-height:1.6;margin:0 0 18px;">${alert.message}</p>
        <div style="display:inline-block;background:#fee2e2;color:#991b1b;font-weight:800;border-radius:999px;padding:8px 12px;margin-bottom:18px;">
          Severity: ${alert.severity || "HIGH"}
        </div>
        ${
          anomalyRows
            ? `<table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;">#</th>
                    <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;">Amount</th>
                    <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;">Project</th>
                    <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb;">Category</th>
                  </tr>
                </thead>
                <tbody>${anomalyRows}</tbody>
              </table>`
            : ""
        }
        <p style="font-size:12px;color:#64748b;margin-top:22px;">Generated automatically by Tradrly AI monitoring.</p>
      </div>
    </div>
  `;

  return { subject, text, html };
};

const notifyAlert = async ({ alert, anomalies = [] }) => {
  const recipients = await getDefaultAlertRecipients();
  const email = buildAlertEmail({ alert, anomalies });

  return sendEmail({
    to: recipients,
    ...email,
  });
};

const sendTestAlertEmail = async ({ requestedBy }) => {
  return notifyAlert({
    alert: {
      type: "Test AI Alert",
      severity: "INFO",
      message: `Test email requested by user ${requestedBy || "unknown"}.`,
    },
    anomalies: [],
  });
};

module.exports = {
  notifyAlert,
  sendTestAlertEmail,
  getDefaultAlertRecipients,
};
