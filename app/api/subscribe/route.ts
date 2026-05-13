import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Send welcome email to the subscriber
    const result = await sendEmail({
      to: email,
      subject: "Welcome to NodePress",
      html: `
        <div style="background-color: #f5f5f7; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.04);">
            <div style="padding: 40px; text-align: center;">
              <div style="margin-bottom: 32px;">
                <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">NODE<span style="color: #86868b;">PRESS</span></span>
              </div>
              <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.04em;">You're in.</h1>
              <p style="margin: 0 0 32px 0; font-size: 17px; line-height: 1.5; color: #1d1d1f;">Thank you for joining NodePress. You're now part of a community of 50,000+ curious readers who value thoughtful stories.</p>
              
              <div style="margin-bottom: 40px;">
                <a href="${process.env.NEXTAUTH_URL}/stories" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 600;">Start Reading</a>
              </div>

              <div style="text-align: left; background-color: #f5f5f7; border-radius: 16px; padding: 24px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1d1d1f; font-weight: 600;">What to expect:</h4>
                <ul style="margin: 0; padding: 0 0 0 20px; font-size: 14px; color: #424245; line-height: 1.6;">
                  <li>Weekly hand-picked long-form articles.</li>
                  <li>Deep dives into culture, tech, and lifestyle.</li>
                  <li>Exclusive early access to new editorial series.</li>
                </ul>
              </div>
            </div>
            <div style="padding: 20px 40px; background-color: #fafafa; border-top: 1px solid #f2f2f2; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #86868b;">No spam, ever. Unsubscribe at any time.</p>
            </div>
          </div>
          <div style="max-width: 600px; margin: 24px auto 0; text-align: center; padding: 0 20px;">
            <p style="margin: 0; font-size: 12px; color: #86868b; line-height: 1.4;">
              © 2026 NodePress Journal. All rights reserved. <br />
              Sent with care from our editorial office.
            </p>
          </div>
        </div>
      `,
      text: `Welcome to NodePress! Thank you for subscribing. We'll send you our best stories every week.`,
    });

    if (result.success) {
      return NextResponse.json({ message: "Subscribed successfully" });
    } else {
      return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
    }
  } catch (error) {
    console.error("Subscribe API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
