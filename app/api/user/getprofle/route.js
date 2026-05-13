import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
        author: {
          include: {
            posts: {
              take: 5,
              orderBy: { createdAt: "desc" },
            },
          },
        },
        bookmarks: {
          include: {
            post: true,
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error while Getting Profile:", error);
    return NextResponse.json(
      { message: "Error while Getting Profile" },
      { status: 500 },
    );
  }
}
