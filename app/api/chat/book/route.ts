import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    const { name, email, phone, preferredDate, preferredTime, projectType, message } = bookingData;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Log the booking (in production, you would save to database or send email)
    console.log("=== NEW BOOKING REQUEST ===");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Preferred Date:", preferredDate || "Not specified");
    console.log("Preferred Time:", preferredTime || "Not specified");
    console.log("Project Type:", projectType || "Not specified");
    console.log("Message:", message || "No message provided");
    console.log("==========================");

    // Here you could:
    // 1. Send email notification via SendGrid, Resend, etc.
    // 2. Save to database (Supabase, PlanetScale, etc.)
    // 3. Create a Slack notification
    // 4. Integrate with a CRM like HubSpot or Pipedrive

    // Example: Send email via Resend (uncomment and configure)
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'bookings@sthyra.com',
      to: 'info@sthyra.com',
      subject: `New Consultation Request from ${name}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate || "Not specified"}</p>
        <p><strong>Preferred Time:</strong> ${preferredTime || "Not specified"}</p>
        <p><strong>Project Type:</strong> ${projectType || "Not specified"}</p>
        <p><strong>Message:</strong> ${message || "No message"}</p>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: "Booking request received successfully. We will contact you within 24 hours.",
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Failed to process booking request" },
      { status: 500 }
    );
  }
}
