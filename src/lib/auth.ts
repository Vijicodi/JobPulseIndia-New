import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "jobpulse-india-dev-secret-change-in-production";

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";

// ---------------------------------------------------------------------------
// Password utilities
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---------------------------------------------------------------------------
// JWT utilities
// ---------------------------------------------------------------------------

export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId } satisfies Pick<TokenPayload, "userId">, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

// ---------------------------------------------------------------------------
// Request auth helper
// ---------------------------------------------------------------------------

/**
 * Extract the JWT from the request (Authorization header or cookie),
 * verify it, and return the corresponding User record (without passwordHash).
 * Returns null when authentication fails for any reason.
 */
export async function getAuthUser(request: NextRequest) {
  try {
    // 1. Try Authorization: Bearer <token>
    let token: string | null = null;

    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // 2. Fall back to cookie
    if (!token) {
      token = request.cookies.get("token")?.value ?? null;
    }

    if (!token) {
      return null;
    }

    // 3. Verify token
    const payload = verifyToken(token);

    if (!payload.userId) {
      return null;
    }

    // 4. Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
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

    return user;
  } catch {
    // Token expired, malformed, user deleted, etc.
    return null;
  }
}
