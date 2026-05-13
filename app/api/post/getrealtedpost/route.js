import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    console.log("categoryId", categoryId);
    const postId = searchParams.get("postId");

    const tagIds = searchParams.getAll("tagId");

    if (!postId) {
      return NextResponse.json(
        { message: "postId is required" },
        { status: 400 },
      );
    }

    const relatedPosts = await prisma.post.findMany({
      where: {
        id: {
          not: postId,
        },
        published: true,
        OR: [
          {
            categoryId: categoryId,
          },
          {
            postTags: {
              some: {
                tagId: {
                  in: tagIds,
                },
              },
            },
          },
        ],

        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      },

      include: {
        category: true,
        author: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    console.log("relatedPosts", relatedPosts);
    return NextResponse.json(relatedPosts);
  } catch (error) {
    console.error("Related posts error:", error);
    return NextResponse.json(
      { message: "Failed to fetch related posts" },
      { status: 500 },
    );
  }
}
