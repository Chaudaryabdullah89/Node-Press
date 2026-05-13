import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const revalidate = 60; // Cache this API for 60 seconds

export async function GET(req) {
  try {
    const commonInclude = {
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
    };

    const sevendays = new Date();
    sevendays.setDate(sevendays.getDate() - 7);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const featuredposts = await prisma.post.findMany({
      where: {
        isFeatured: true,
        published: true,
      },
      include: commonInclude,
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    const latestPosts = await prisma.post.findMany({
      where: { published: true },
      include: commonInclude,
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    const trendingPosts = await prisma.post.findMany({
      where: {
        published: true,
        createdAt: { gte: sevendays },
      },
      include: commonInclude,
      take: 8,
      orderBy: { viewCount: "desc" },
    });

    // --- RANDOM POST LOGIC (Global, not category based) ---

    const randomCondition = {
      published: true,
      createdAt: { gte: oneDayAgo },
    };

    const postCount = await prisma.post.count({
      where: randomCondition,
    });

    let insightPosts = []; // We keep the variable name 'insightPosts' to avoid breaking your frontend
    if (postCount > 0) {
      const skip = Math.floor(Math.random() * postCount);
      const randomPost = await prisma.post.findMany({
        where: randomCondition,
        include: commonInclude,
        skip: skip,
        take: 1,
      });
      insightPosts = randomPost;
    } else {
      // Fallback: If no posts in last 24h, get latest 4 from last 7 days
      insightPosts = await prisma.post.findMany({
        where: {
          published: true,
          createdAt: { gte: sevendays },
        },
        include: commonInclude,
        take: 4,
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(
      {
        message: "fetched successfully",
        featuredPosts: featuredposts,
        latestPosts,
        trendingPosts,
        insightPosts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
