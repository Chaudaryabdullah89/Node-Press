import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Send email to the Admin
    const adminEmailResult = await sendEmail({
      to: process.env.EMAIL_SERVER_USER || "hello@nodepress.com",
      subject: `New Inquiry: ${subject}`,
      html: `
        <div style="background-color: #f5f5f7; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
            <div style="padding: 40px;">
              <h3 style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; tracking: 0.1em; color: #86868b;">New Message</h3>
              <h1 style="margin: 8px 0 32px 0; font-size: 24px; font-weight: 600; color: #1d1d1f;">${subject}</h1>
              
              <div style="margin-bottom: 32px;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #86868b;">From</p>
                <p style="margin: 0; font-size: 16px; color: #1d1d1f; font-weight: 500;">${name} &lt;${email}&gt;</p>
              </div>

              <div style="margin-bottom: 32px; padding: 24px; background-color: #f5f5f7; border-radius: 12px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #1d1d1f; white-space: pre-wrap;">${message}</p>
              </div>

              <a href="mailto:${email}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">Reply to ${name}</a>
            </div>
            <div style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #f2f2f2; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #86868b;">Sent via NodePress Editorial Portal</p>
            </div>
          </div>
        </div>
      `,
      text: `New Contact Form Submission\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    });

    // 2. Send confirmation email to the User
    const userEmailResult = await sendEmail({
      to: email,
      subject: `We've received your message`,
      html: `
        <div style="background-color: #f5f5f7; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
            <div style="padding: 40px;">
              <div style="margin-bottom: 32px;">
                <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">NODE<span style="color: #86868b;">PRESS</span></span>
              </div>
              <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.03em;">Hi ${name.split(' ')[0]},</h1>
              <p style="margin: 0 0 24px 0; font-size: 17px; line-height: 1.5; color: #1d1d1f;">Thank you for reaching out to us. We've received your inquiry regarding <strong>"${subject}"</strong> and our team is already reviewing it.</p>
              <p style="margin: 0 0 32px 0; font-size: 17px; line-height: 1.5; color: #424245;">You can expect to hear from us within 24-48 business hours.</p>
              
              <hr style="border: 0; border-top: 1px solid #f2f2f2; margin: 32px 0;" />
              
              <p style="margin: 0; font-size: 15px; color: #86868b;">Best regards,</p>
              <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 600; color: #1d1d1f;">The NodePress Team</p>
            </div>
          </div>
          <div style="max-width: 600px; margin: 24px auto 0; text-align: center; padding: 0 20px;">
            <p style="margin: 0; font-size: 12px; color: #86868b; line-height: 1.4;">
              © 2026 NodePress Journal. All rights reserved. <br />
              This is an automated confirmation of your contact form submission.
            </p>
          </div>
        </div>
      `,
      text: `Hi ${name}, thank you for reaching out to NodePress. We've received your message and will get back to you soon.`,
    });

    if (adminEmailResult.success) {
      return NextResponse.json({ message: "Message sent successfully" });
    } else {
      return NextResponse.json({ error: "Failed to send message to admin" }, { status: 500 });
    }
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
