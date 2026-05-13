import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { userId, postId } = await req.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { message: "userId and postId are required" },
        { status: 400 }
      );
    }

    // Check if the bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      // If it exists, remove it (Unbookmark)
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });
      return NextResponse.json({ message: "Bookmark removed", isBookmarked: false }, { status: 200 });
    } else {
      // If it doesn't exist, create it (Bookmark)
      await prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });
      return NextResponse.json({ message: "Post bookmarked", isBookmarked: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Bookmark Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        post: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookmarks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching bookmarks" }, { status: 500 });
  }
}
