import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "../../../lib/prisma";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
  "inkwell-super-secret-key-2026-change-in-production",
);

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // Verify the JWT
    const { payload } = await jwtVerify(token, SECRET);

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
    console.error("NodePress Verify Session Error:", error.message);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
