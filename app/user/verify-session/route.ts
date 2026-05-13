import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "../../lib/prisma";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
  "inkwell-super-secret-key-2026-change-in-production",
);

export async function POST(request: Request) {
  let bodyText = "";
  try {
    bodyText = await request.text();
    // Strip trailing commas which can break JSON.parse()
    const cleanBody = bodyText.replace(/,\s*([\]}])/g, "$1");
    const { token } = JSON.parse(cleanBody);
    console.log("NodePress Verify Session: Received token length:", token?.length);

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Verify the JWT
    const { payload } = await jwtVerify(token, SECRET);
    console.log("NodePress Verify Session: Decoded payload email:", payload?.email);

    // Check if user exists in NodePress (PostgreSQL)
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in NodePress" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: {
        id: String(user.id),
        email: user.email,
        name: user.username || user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("NodePress Verify Session Error:", (error as Error).message);
    if (bodyText) {
      console.error("NodePress Verify Session: Raw Body received:", bodyText);
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
