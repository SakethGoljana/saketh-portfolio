import { Resend } from "resend";
import type { Lead } from "./leads";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

const ADMIN_EMAIL = process.env.NOTIFICATION_EMAIL?.trim() || "sakethgoljana098@gmail.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL?.trim() || "hello@sakethgoljana.tech";
const SENDER_NAME = "Saketh Goljana";

/**
 * Dispatch automated email notifications whenever a new lead is booked:
 * 1. Immediate rich alert to Saketh (admin)
 * 2. Professional confirmation receipt to the client (if they provided an email address)
 */
export async function sendLeadNotifications(lead: Lead): Promise<{
  adminNotified: boolean;
  clientNotified: boolean;
  error?: string;
}> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("Resend notification skipped: RESEND_API_KEY is not configured.");
    return { adminNotified: false, clientNotified: false };
  }

  let adminNotified = false;
  let clientNotified = false;

  const isCall = lead.type === "call_booking";
  const title = isCall ? "Discovery Call Booking" : "Project Brief Request";
  const scheduleOrTimeline = isCall
    ? `${lead.day || "Date not specified"} at ${lead.slot || "Slot not specified"}`
    : `${lead.timeline || "Timeline not specified"}`;

  // 1. Send Admin Notification to Saketh
  try {
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0E0E12; color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #22222E; padding: 32px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 1px solid #1E1E28; padding-bottom: 16px;">
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #7CF4D4; background: rgba(124, 244, 212, 0.1); padding: 4px 10px; border-radius: 9999px;">
            ${isCall ? "📅 Call Booked" : "💼 Brief Received"}
          </span>
          <span style="font-size: 12px; color: #71717A;">
            ${new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #F4F4F0; letter-spacing: -0.02em;">
          New ${title} from ${lead.name}
        </h2>

        <div style="background: #14141C; border-radius: 12px; border: 1px solid #242432; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #A1A1AA; width: 140px;">Client Name:</td>
              <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${lead.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #A1A1AA;">Contact:</td>
              <td style="padding: 8px 0; color: #7CF4D4; font-weight: 600;">${lead.contact}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #A1A1AA;">Service:</td>
              <td style="padding: 8px 0; color: #FFFFFF;">${lead.service || "General Inquiry"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #A1A1AA;">${isCall ? "Date & Time:" : "Timeline:"}</td>
              <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${scheduleOrTimeline}</td>
            </tr>
            ${
              lead.budget
                ? `<tr>
              <td style="padding: 8px 0; color: #A1A1AA;">Budget Range:</td>
              <td style="padding: 8px 0; color: #7CF4D4; font-weight: 700;">${lead.budget}</td>
            </tr>`
                : ""
            }
          </table>

          ${
            lead.notes
              ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #20202C;">
              <span style="font-size: 12px; color: #A1A1AA; display: block; margin-bottom: 6px;">Client Notes / Scope:</span>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #D4D4D8; white-space: pre-wrap;">${lead.notes}</p>
            </div>`
              : ""
          }
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <a href="https://sakethgoljana.tech/crm" style="display: inline-block; background: #7CF4D4; color: #0A0A0E; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 14px rgba(124, 244, 212, 0.3);">
            Open in Private CRM →
          </a>
        </div>
      </div>
    `;

    // Try sending from custom sender, fallback to onboarding sender if domain is pending verification
    let fromAddress = `${SENDER_NAME} <${SENDER_EMAIL}>`;
    let response = await resend.emails.send({
      from: fromAddress,
      to: [ADMIN_EMAIL],
      subject: `🚀 New Lead: ${lead.name} · ${lead.service || "Inquiry"} (${isCall ? lead.slot || "Call" : lead.budget || "Brief"})`,
      html: adminHtml,
    });

    if (response.error && response.error.message?.includes("domain")) {
      // Fallback for unverified test domains during onboarding
      response = await resend.emails.send({
        from: `Saketh Portfolio <onboarding@resend.dev>`,
        to: [ADMIN_EMAIL],
        subject: `🚀 New Lead: ${lead.name} · ${lead.service || "Inquiry"}`,
        html: adminHtml,
      });
    }

    if (!response.error) {
      adminNotified = true;
    } else {
      console.warn("Resend admin alert notice:", response.error.message);
    }
  } catch (err: unknown) {
    console.warn("Failed to send admin notification:", err);
  }

  // 2. Send Client Confirmation Email (if client provided an email address)
  const isEmail = lead.contact.includes("@") && lead.contact.includes(".");
  if (isEmail) {
    try {
      const clientEmail = lead.contact.trim();
      const clientHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0E0E12; color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #22222E; padding: 32px;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; color: #7CF4D4; letter-spacing: -0.02em;">Saketh Goljana</span>
            <span style="display: block; font-size: 12px; color: #71717A; margin-top: 2px;">Full-Stack &amp; Mobile Engineer</span>
          </div>

          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 12px; color: #FFFFFF; letter-spacing: -0.02em;">
            Thank you, ${lead.name.split(" ")[0]}!
          </h1>
          <p style="font-size: 15px; line-height: 1.6; color: #A1A1AA; margin: 0 0 24px;">
            ${
              isCall
                ? `I've received your discovery call request for <strong>${scheduleOrTimeline}</strong>. I look forward to discussing your project!`
                : `I've received your project brief for <strong>${lead.service || "your project"}</strong>. I'm currently reviewing the details.`
            }
          </p>

          <div style="background: #14141C; border-radius: 12px; border: 1px solid #242432; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #71717A; margin-bottom: 12px;">
              Request Summary
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #71717A; width: 120px;">Service:</td>
                <td style="padding: 6px 0; color: #FFFFFF; font-weight: 600;">${lead.service || "Custom Software"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717A;">${isCall ? "Reserved Slot:" : "Timeline:"}</td>
                <td style="padding: 6px 0; color: #7CF4D4; font-weight: 600;">${scheduleOrTimeline}</td>
              </tr>
              ${
                lead.budget
                  ? `<tr>
                <td style="padding: 6px 0; color: #71717A;">Selected Budget:</td>
                <td style="padding: 6px 0; color: #FFFFFF;">${lead.budget}</td>
              </tr>`
                  : ""
              }
            </table>
          </div>

          <div style="padding: 16px; background: rgba(124, 244, 212, 0.05); border: 1px solid rgba(124, 244, 212, 0.15); border-radius: 12px; margin-bottom: 24px;">
            <span style="font-size: 13px; font-weight: 600; color: #7CF4D4; display: block; margin-bottom: 4px;">What happens next?</span>
            <p style="font-size: 13px; line-height: 1.5; color: #D4D4D8; margin: 0;">
              I review all inquiries within 2–4 hours. I will send a calendar invite and a direct Google Meet link to this email address.
            </p>
          </div>

          <p style="font-size: 12px; color: #71717A; line-height: 1.5; margin: 0; border-top: 1px solid #1E1E28; padding-top: 16px;">
            Need to share urgent details or reschedule? Reply directly to this email or reach out on WhatsApp at 
            <a href="https://wa.me/919390246687" style="color: #7CF4D4; text-decoration: none;">+91 93902 46687</a>.
          </p>
        </div>
      `;

      let clientResponse = await resend.emails.send({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: [clientEmail],
        subject: isCall
          ? `Confirmed: Discovery Call with Saketh Goljana (${lead.day || "Upcoming"})`
          : `Received: Project Inquiry with Saketh Goljana`,
        html: clientHtml,
      });

      if (!clientResponse.error) {
        clientNotified = true;
      }
    } catch (err: unknown) {
      console.warn("Failed to send client confirmation:", err);
    }
  }

  return { adminNotified, clientNotified };
}
