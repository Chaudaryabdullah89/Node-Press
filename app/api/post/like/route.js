import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { userId, postId } = await req.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { message: "userId and postId are required" },
        { status: 400 },
      );
    }

    // Verify the user exists to avoid foreign key violations
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "User not found. Please log in again." },
        { status: 404 },
      );
    }

    // Check if the like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // If it exists, remove it (Unlike)
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json(
        { message: "Post unliked", isLiked: false },
        { status: 200 },
      );
    } else {
      // If it doesn't exist, create it (Like)
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return NextResponse.json(
        { message: "Post liked", isLiked: true },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Like Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { message: "postId is required" },
        { status: 400 },
      );
    }

    const count = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching likes" },
      { status: 500 },
    );
  }
}
