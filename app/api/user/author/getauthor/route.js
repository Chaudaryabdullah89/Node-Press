import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 },
      );
    }

    // Find the author by username
    const author = await prisma.author.findUnique({
      where: { username },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            bio: true,
            _count: {
              select: { followers: true },
            },
          },
        },
        posts: {
          where: { published: true },
          include: {
            category: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!author) {
      return NextResponse.json(
        { message: "Author not found" },
        { status: 404 },
      );
    }

    // Calculate total views
    const totalViews = author.posts.reduce((acc, post) => acc + (post.viewCount || 0), 0);

    return NextResponse.json({ 
      author: {
        ...author,
        followerCount: author.user._count.followers,
        totalViews: totalViews
      } 
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching author:", error);
    return NextResponse.json(
      { message: "Error fetching author data" },
      { status: 500 },
    );
  }
}
