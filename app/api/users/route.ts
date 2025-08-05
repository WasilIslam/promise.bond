import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

async function getUserFromToken(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      throw new Error("No authentication token");
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return payload as { userId: string; email: string; username: string };
  } catch (error) {
    throw new Error("Invalid authentication token");
  }
}

// GET - Get users in the same organization
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    // Get current user's full details
    const currentUser = await DatabaseService.getUserByEmail(user.email);
    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get users in the same organization
    const users = await DatabaseService.getOrganizationMembers(
      currentUser.organization_id,
      user.userId
    );

    // Check cross-origin crush setting
    const allowCrossOrigin = process.env.ALLOW_CROSS_ORIGIN_CRUSH === "true";

    let filteredUsers = users;
    if (!allowCrossOrigin) {
      // Only show users from same organization (already filtered by getOrganizationMembers)
      filteredUsers = users;
    }

    // Log the activity
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      user.userId,
      "users_viewed",
      {
        organization_id: currentUser.organization_id,
        users_count: filteredUsers.length,
      },
      ip,
      userAgent
    );

    return NextResponse.json({
      users: filteredUsers.map((u) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        email: u.email,
        avatar_url: u.avatar_url,
      })),
    });
  } catch (error: any) {
    console.error("Fetch users error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to fetch users" },
      { status: 401 }
    );
  }
}
