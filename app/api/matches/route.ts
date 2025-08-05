import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

async function getUserFromToken(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      throw new Error("No authentication token");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return payload as { userId: string; email: string; username: string };
  } catch (error) {
    throw new Error("Invalid authentication token");
  }
}

// GET - Get user's matches
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const matches = await DatabaseService.getUserMatches(user.userId);

    // Log the activity
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      user.userId,
      "matches_viewed",
      { matches_count: matches.length },
      ip,
      userAgent
    );

    return NextResponse.json({
      matches: matches.map((match) => ({
        id: match.id,
        username: match.username,
        name: match.name,
        email: match.email,
        avatar_url: match.avatar_url,
      })),
    });
  } catch (error: any) {
    console.error("Fetch matches error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to fetch matches" },
      { status: 401 }
    );
  }
}
