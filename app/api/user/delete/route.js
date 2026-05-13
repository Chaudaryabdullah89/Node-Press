import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Delete the user
    // Thanks to the 'onDelete: Cascade' in our schema, 
    // related Author, Posts (if any), Comments, etc., will be deleted automatically.
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { message: "Error deleting account" },
      { status: 500 },
    );
  }
}
