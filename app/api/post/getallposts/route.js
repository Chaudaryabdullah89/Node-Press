import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const revalidate = 60; // Cache this API for 60 seconds
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "Latest";

    let orderBy = { createdAt: "desc" };
    if (sort === "Oldest") orderBy = { createdAt: "asc" };
    if (sort === "Trending") orderBy = { viewCount: "desc" };

    const posts = await prisma.post.findMany({
      orderBy,
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

    return NextResponse.json(
      {
        message: "fetched successfully",
        posts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch all posts error:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
