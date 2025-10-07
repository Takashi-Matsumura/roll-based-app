import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { language } = await request.json();

    if (!language || !["en", "ja"].includes(language)) {
      return NextResponse.json(
        { error: "Invalid language. Must be 'en' or 'ja'" },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { language },
    });

    return NextResponse.json({ success: true, language });
  } catch (error) {
    console.error("Error updating language preference:", error);
    return NextResponse.json(
      { error: "Failed to update language preference" },
      { status: 500 },
    );
  }
}
