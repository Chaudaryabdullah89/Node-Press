import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json(
        { message: "ID or Slug is required" },
        { status: 400 },
      );
    }

    const userId = searchParams.get("userId");

    const post = await prisma.post.findUnique({
      where: id ? { id } : { slug },
      include: {
        category: true,
        author: {
          include: {
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check interaction status if userId is provided
    let isLiked = false;
    let isBookmarked = false;

    if (userId) {
      const [like, bookmark] = await Promise.all([
        prisma.like.findUnique({
          where: {
            userId_postId: {
              userId,
              postId: post.id,
            },
          },
        }),
        prisma.bookmark.findUnique({
          where: {
            userId_postId: {
              userId,
              postId: post.id,
            },
          },
        }),
      ]);
      isLiked = !!like;
      isBookmarked = !!bookmark;
    }

    // Increment view count asynchronously
    prisma.post
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => console.error("Error updating view count:", err));

    return NextResponse.json({ post, isLiked, isBookmarked }, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
