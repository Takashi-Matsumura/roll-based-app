import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Register API key for user
export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 },
      );
    }

    // Find the API key
    const foundApiKey = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!foundApiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 404 });
    }

    // Check if API key is active
    if (!foundApiKey.isActive) {
      return NextResponse.json(
        { error: "This API key has been deactivated" },
        { status: 403 },
      );
    }

    // Check if API key has expired
    if (new Date(foundApiKey.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This API key has expired" },
        { status: 403 },
      );
    }

    // Check if user already registered this API key
    const existing = await prisma.userApiKey.findUnique({
      where: {
        userId_apiKeyId: {
          userId: session.user.id,
          apiKeyId: foundApiKey.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already registered this API key" },
        { status: 400 },
      );
    }

    // Register the API key for the user
    const userApiKey = await prisma.userApiKey.create({
      data: {
        userId: session.user.id,
        apiKeyId: foundApiKey.id,
      },
      include: {
        apiKey: {
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

    return NextResponse.json({ userApiKey });
  } catch (error) {
    console.error("Error registering API key:", error);
    return NextResponse.json(
      { error: "Failed to register API key" },
      { status: 500 },
    );
  }
}

// Remove user's registered API key
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
        { error: "Missing user API key ID" },
        { status: 400 },
      );
    }

    // Ensure the user owns this API key registration
    const userApiKey = await prisma.userApiKey.findUnique({
      where: { id },
    });

    if (!userApiKey || userApiKey.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 },
      );
    }

    await prisma.userApiKey.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing API key:", error);
    return NextResponse.json(
      { error: "Failed to remove API key" },
      { status: 500 },
    );
  }
}
