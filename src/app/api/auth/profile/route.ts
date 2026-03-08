import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

// Allowed values for experienceLevel so we don't store arbitrary strings.
const VALID_EXPERIENCE_LEVELS = new Set([
  "fresher",
  "junior",
  "mid",
  "senior",
  "lead",
  "executive",
]);

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { name, preferredLocations, preferredCategories, experienceLevel } =
      body as {
        name?: string;
        preferredLocations?: string[];
        preferredCategories?: string[];
        experienceLevel?: string;
      };

    // ---- Build update data selectively --------------------------------------

    const data: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string." },
          { status: 400 },
        );
      }
      data.name = name.trim();
    }

    if (preferredLocations !== undefined) {
      if (
        !Array.isArray(preferredLocations) ||
        !preferredLocations.every((l) => typeof l === "string")
      ) {
        return NextResponse.json(
          { error: "preferredLocations must be an array of strings." },
          { status: 400 },
        );
      }
      data.preferredLocations = JSON.stringify(preferredLocations);
    }

    if (preferredCategories !== undefined) {
      if (
        !Array.isArray(preferredCategories) ||
        !preferredCategories.every((c) => typeof c === "string")
      ) {
        return NextResponse.json(
          { error: "preferredCategories must be an array of strings." },
          { status: 400 },
        );
      }
      data.preferredCategories = JSON.stringify(preferredCategories);
    }

    if (experienceLevel !== undefined) {
      if (
        typeof experienceLevel !== "string" ||
        !VALID_EXPERIENCE_LEVELS.has(experienceLevel)
      ) {
        return NextResponse.json(
          {
            error: `experienceLevel must be one of: ${[...VALID_EXPERIENCE_LEVELS].join(", ")}.`,
          },
          { status: 400 },
        );
      }
      data.experienceLevel = experienceLevel;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 },
      );
    }

    // ---- Perform update ------------------------------------------------------

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        preferredLocations: true,
        preferredCategories: true,
        experienceLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/auth/profile]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
