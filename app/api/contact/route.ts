import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectType?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  website?: string;
};

const REQUIRED_FIELDS: Array<keyof ContactPayload> = [
  "name",
  "email",
  "phone",
  "company",
  "projectType",
  "service",
  "budget",
  "timeline",
  "message",
];

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 4000) : "";
}

function getMissingFields(payload: ContactPayload) {
  return REQUIRED_FIELDS.filter((field) => !cleanValue(payload[field]));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSmtpPort() {
  const rawPort = Number(process.env.SMTP_PORT ?? 587);
  return Number.isFinite(rawPort) ? rawPort : 587;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = getSmtpPort();

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function buildEmailHtml(payload: Required<Omit<ContactPayload, "website">>) {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone],
    ["Company", payload.company],
    ["Project Type", payload.projectType],
    ["Service Needed", payload.service],
    ["Budget Range", payload.budget],
    ["Timeline", payload.timeline],
  ];

  return `
    <div style="margin:0;background:#050505;padding:32px;font-family:Arial,sans-serif;color:#f7f1e7;">
      <div style="max-width:720px;margin:0 auto;border:1px solid rgba(255,255,255,0.14);background:#0b0b0b;">
        <div style="padding:28px 28px 22px;border-bottom:1px solid rgba(255,255,255,0.12);">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(247,241,231,0.48);">New Sthyra contact brief</p>
          <h1 style="margin:0;font-size:32px;line-height:0.92;letter-spacing:-0.04em;color:#f7f1e7;">${escapeHtml(payload.company)} wants to discuss ${escapeHtml(payload.service)}</h1>
        </div>
        <div style="padding:22px 28px;">
          ${rows
            .map(
              ([label, value]) => `
                <div style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08);">
                  <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(247,241,231,0.42);">${escapeHtml(label)}</p>
                  <p style="margin:0;font-size:16px;line-height:1.42;color:#f7f1e7;">${escapeHtml(value)}</p>
                </div>
              `,
            )
            .join("")}
          <div style="padding-top:18px;">
            <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(247,241,231,0.42);">Project Brief</p>
            <p style="margin:0;white-space:pre-line;font-size:16px;line-height:1.62;color:rgba(247,241,231,0.78);">${escapeHtml(payload.message)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const rawPayload = (await request.json()) as ContactPayload;

    if (cleanValue(rawPayload.website)) {
      return NextResponse.json({
        success: true,
        message: "Your brief has been received.",
      });
    }

    const payload = {
      name: cleanValue(rawPayload.name),
      email: cleanValue(rawPayload.email),
      phone: cleanValue(rawPayload.phone),
      company: cleanValue(rawPayload.company),
      projectType: cleanValue(rawPayload.projectType),
      service: cleanValue(rawPayload.service),
      budget: cleanValue(rawPayload.budget),
      timeline: cleanValue(rawPayload.timeline),
      message: cleanValue(rawPayload.message),
    };

    const missingFields = getMissingFields(payload);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (payload.message.length < 20) {
      return NextResponse.json(
        { error: "Please add a little more detail to the project brief." },
        { status: 400 },
      );
    }

    const transporter = createTransporter();

    if (!transporter) {
      console.error("Contact form SMTP is not configured.");
      return NextResponse.json(
        { error: "Email is not configured yet. Please email info@sthyra.com directly." },
        { status: 500 },
      );
    }

    const to = process.env.CONTACT_TO_EMAIL || "info@sthyra.com";
    const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || to;

    await transporter.sendMail({
      from,
      to,
      replyTo: payload.email,
      subject: `New Sthyra brief from ${payload.name} at ${payload.company}`,
      text: [
        "New Sthyra contact brief",
        "",
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Company: ${payload.company}`,
        `Project Type: ${payload.projectType}`,
        `Service Needed: ${payload.service}`,
        `Budget Range: ${payload.budget}`,
        `Timeline: ${payload.timeline}`,
        "",
        "Project Brief:",
        payload.message,
      ].join("\n"),
      html: buildEmailHtml(payload),
    });

    return NextResponse.json({
      success: true,
      message: "Your brief has been sent. We will respond within 24 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unable to send your brief right now. Please email info@sthyra.com directly." },
      { status: 500 },
    );
  }
}
