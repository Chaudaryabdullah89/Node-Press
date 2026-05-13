import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Upgrade the user in the NodePress database
    const user = await prisma.user.update({
      where: { email },
      data: { role: "AUTHOR" }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to upgrade NodePress user:", error);
    return NextResponse.json({ error: "Failed to upgrade user role" }, { status: 500 });
  }
}
