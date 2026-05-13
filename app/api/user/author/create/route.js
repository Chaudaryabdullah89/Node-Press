import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
  const { userId, username, bio, avator, twitter, website } = await req.json();

  // finding the user

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      author: true,
    },
  });

  if (!user) {
    return NextResponse.json({ messege: "user donot exist " }, { status: 400 });
  }

  if (user.author) {
    return NextResponse.json(
      { messege: "user is already an author" },
      { status: 400 },
    );
  }

  //   creaeting new user

  const newauthor = await prisma.author.create({    
    data: {
      userId: userId,
      username: username,
      bio: bio || "",
      avator: avator || "",
      twitter: twitter || "",
    },
  });

  console.log(newauthor);

  return NextResponse.json(
    { messege: "author created sucessfully  " },
    { status: 201 },
  );
}
