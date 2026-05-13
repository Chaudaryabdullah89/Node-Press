import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function POST(req) {
  try {
    console.log("--- Signup API Proxied to Inkwell ---");
    const { email, password, username, name } = await req.json();

    if (!email || !password || !username || !name) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const bcrypt = await import("bcrypt");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name,
        role: "READER",
      },
    });

    console.log("User successfully created in NodePress (PostgreSQL)!");

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: user.id, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "User already exists or database error" },
      { status: 500 },
    );
  }
}
