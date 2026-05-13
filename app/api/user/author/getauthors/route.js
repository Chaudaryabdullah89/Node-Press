import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  // finding the user

  const authors = await prisma.author.findMany({
    include: {
      user: {
        select: {
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  return NextResponse.json({ message: "Success", authors }, { status: 200 });
}
