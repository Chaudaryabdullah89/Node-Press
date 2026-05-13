import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // Fetch authors and include their user data and post count
    const authors = await prisma.author.findMany({
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: { published: true }
            }
          }
        }
      },
      take: 10,
    });

    // Sort by post count descending
    const sortedAuthors = authors.sort((a, b) => b._count.posts - a._count.posts);

    return NextResponse.json({ authors: sortedAuthors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching top authors:", error);
    return NextResponse.json(
      { message: "Error fetching top authors" },
      { status: 500 },
    );
  }
}
