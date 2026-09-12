import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

export async function sendCouponEmail(input: {
  to: string;
  attendeeName: string;
  eventName: string;
  couponCode: string;
}) {
  const greeting = input.attendeeName
    ? `Hi ${input.attendeeName},`
    : "Hi there,";
  const from =
    process.env["RESEND_FROM_EMAIL"] ??
    "Event Check-in <onboarding@resend.dev>";

  const response = await connectors.proxy("resend", "/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `Your resources for ${input.eventName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17211b">
          <p>${greeting}</p>
          <p>Welcome to <strong>${input.eventName}</strong>.</p>
          <p>Here is your coupon code:</p>
          <p style="font-size:22px;font-weight:700;letter-spacing:1px">${input.couponCode}</p>
        </div>
      `,
      text: `${greeting}\n\nWelcome to ${input.eventName}.\n\nHere is your coupon code: ${input.couponCode}`,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend rejected the email (${response.status}): ${details}`);
  }
}

export async function sendFinalReportEmail(input: {
  to: string;
  eventName: string;
  total: number;
  checkedIn: number;
  didNotShow: number;
  csv: string;
}) {
  const from =
    process.env["RESEND_FROM_EMAIL"] ??
    "Event Check-in <onboarding@resend.dev>";
  const response = await connectors.proxy("resend", "/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `Final attendance report — ${input.eventName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#17211b">
          <h2>${input.eventName} attendance report</h2>
          <p><strong>${input.checkedIn}</strong> of <strong>${input.total}</strong> registered attendees checked in.</p>
          <p>${input.didNotShow} did not show. The attached CSV contains the complete event record.</p>
        </div>
      `,
      text: `${input.eventName} attendance report\n\n${input.checkedIn} of ${input.total} registered attendees checked in.\n${input.didNotShow} did not show.\n\nThe complete event record is attached.`,
      attachments: [
        {
          filename: `${input.eventName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "event"}-attendance.csv`,
          content: Buffer.from(input.csv, "utf8").toString("base64"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend rejected the final report (${response.status}): ${details}`);
  }
}
