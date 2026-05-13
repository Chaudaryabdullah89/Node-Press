export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { message: "postId is required" },
      { status: 400 },
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        approved: true, // Only show moderated comments
        parentId: null, // Get top-level comments first
      },
      include: {
        user: { select: { username: true, avatar: true } }, // Include user info
        replies: {
          include: {
            user: { select: { username: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching comments" },
      { status: 500 },
    );
  }
}
