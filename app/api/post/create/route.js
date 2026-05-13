import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function POST(req) {
  try {
    const {
      title,
      slug,
      content,
      except,
      imageurl,
      status,
      published,
      publishedAt,
      authorId,
      viewCount,
      
    } = await req.json();


    const author = await prisma.author.findUnique({
      where: { id: authorId },
    });
    if (!author) {
      return NextResponse.json(
        { message: "author Not found" },
        { status: 400 },
      );
    }
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        except,
        imageurl,
        status,
        published,
        publishedAt,
        authorId,
        viewCount,
      },
    });

    return NextResponse.json(
      {
        message: "POST created successfully",
        newPost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(" error:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
