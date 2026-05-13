import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, username, bio, avatar } = await req.json();

    // Check if username is taken (if it's being changed)
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 400 },
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username,
        bio,
        avatar,
      },
    });

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 },
    );
  }
}
