import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";

// Simple email regex — intentionally permissive; real validation happens at
// the SMTP level, but this catches obvious typos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    // ---- Validation ----------------------------------------------------------

    const errors: string[] = [];

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push("Name is required.");
    }

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      errors.push("A valid email address is required.");
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    // TypeScript narrowing — safe after validation above.
    const trimmedName = (name as string).trim();
    const normalizedEmail = (email as string).toLowerCase().trim();

    // ---- Check for existing user --------------------------------------------

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    // ---- Create user --------------------------------------------------------

    const passwordHash = await hashPassword(password as string);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        passwordHash,
      },
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

    const token = generateToken(user.id);

    return NextResponse.json({ token, user }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/signup]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
