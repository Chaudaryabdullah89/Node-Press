import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { content, postId, userId, parentId, name, email } = await req.json();
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
        parentId,
        name,
        email,
        approved: false,
      },
    });

    return NextResponse.json(
      { message: "Comment submitted", newComment },
      { status: 201 },
    );
  } catch (error) {
    console.error("Comment Error:", error);
    return NextResponse.json(
      { message: "Failed to post comment" },
      { status: 500 },
    );
  }
}
