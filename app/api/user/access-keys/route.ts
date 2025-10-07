import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Register Access key for user
export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { accessKey } = body;

    if (!accessKey) {
      return NextResponse.json(
        { error: "Access key is required" },
        { status: 400 },
      );
    }

    // Find the Access key
    const foundAccessKey = await prisma.accessKey.findUnique({
      where: { key: accessKey },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!foundAccessKey) {
      return NextResponse.json({ error: "Invalid Access key" }, { status: 404 });
    }

    // Check if Access key is active
    if (!foundAccessKey.isActive) {
      return NextResponse.json(
        { error: "This Access key has been deactivated" },
        { status: 403 },
      );
    }

    // Check if Access key has expired
    if (new Date(foundAccessKey.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This Access key has expired" },
        { status: 403 },
      );
    }

    // Check if user already registered this Access key
    const existing = await prisma.userAccessKey.findUnique({
      where: {
        userId_accessKeyId: {
          userId: session.user.id,
          accessKeyId: foundAccessKey.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already registered this Access key" },
        { status: 400 },
      );
    }

    // Register the Access key for the user
    const userAccessKey = await prisma.userAccessKey.create({
      data: {
        userId: session.user.id,
        accessKeyId: foundAccessKey.id,
      },
      include: {
        accessKey: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ userAccessKey });
  } catch (error) {
    console.error("Error registering Access key:", error);
    return NextResponse.json(
      { error: "Failed to register Access key" },
      { status: 500 },
    );
  }
}

// Remove user's registered Access key
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing user Access key ID" },
        { status: 400 },
      );
    }

    // Ensure the user owns this Access key registration
    const userAccessKey = await prisma.userAccessKey.findUnique({
      where: { id },
    });

    if (!userAccessKey || userAccessKey.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 },
      );
    }

    await prisma.userAccessKey.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing Access key:", error);
    return NextResponse.json(
      { error: "Failed to remove Access key" },
      { status: 500 },
    );
  }
}
