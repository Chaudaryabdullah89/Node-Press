import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, body" },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      subject,
      html: `<p>${body}</p>`,
      text: body,
    });

    if (result.success) {
      return NextResponse.json({ message: "Email sent successfully", messageId: result.messageId });
    } else {
      return NextResponse.json({ error: "Failed to send email", details: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Test Email Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
