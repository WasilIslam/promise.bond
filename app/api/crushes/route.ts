import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase";
import { EmailService } from "@/lib/email";
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

// GET - Get user's crushes
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const crushes = await DatabaseService.getUserCrushes(user.userId);

    return NextResponse.json({ crushes });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch crushes" },
      { status: 401 }
    );
  }
}

// POST - Add a crush
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const { crushUserId } = await request.json();

    if (!crushUserId) {
      return NextResponse.json(
        { message: "Crush user ID is required" },
        { status: 400 }
      );
    }

    if (crushUserId === user.userId) {
      return NextResponse.json(
        { message: "You cannot add yourself as a crush" },
        { status: 400 }
      );
    }

    // Check if user already has this crush
    const existingCrushes = await DatabaseService.getUserCrushes(user.userId);
    if (existingCrushes.some((crush) => crush.id === crushUserId)) {
      return NextResponse.json(
        { message: "You already have this person as a crush" },
        { status: 400 }
      );
    }

    // Check crush limit (4 max)
    if (existingCrushes.length >= 4) {
      return NextResponse.json(
        { message: "You can only have up to 4 crushes at a time" },
        { status: 400 }
      );
    }

    // Add the crush
    await DatabaseService.addCrush(user.userId, crushUserId);

    // Check if it's a mutual crush
    const isMutual = await DatabaseService.areUsersMatched(
      user.userId,
      crushUserId
    );

    if (isMutual) {
      // Get both users' details
      const [currentUser, crushUser] = await Promise.all([
        DatabaseService.getUserByEmail(user.email),
        DatabaseService.getUserByEmail(""), // This would need the crush user's email
      ]);

      if (currentUser && crushUser) {
        // Send match notification emails to both users
        await Promise.all([
          EmailService.sendMatchNotification(
            currentUser.email,
            crushUser.name || crushUser.username
          ),
          EmailService.sendMatchNotification(
            crushUser.email,
            currentUser.name || currentUser.username
          ),
        ]);
      }
    }

    // Log the activity
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      user.userId,
      "crush_added",
      {
        crush_user_id: crushUserId,
        is_mutual: isMutual,
      },
      ip,
      userAgent
    );

    return NextResponse.json({
      message: isMutual ? "It's a match! 🎉" : "Crush added successfully",
      isMatch: isMutual,
    });
  } catch (error: any) {
    console.error("Add crush error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to add crush" },
      { status: 400 }
    );
  }
}

// DELETE - Remove a crush
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const { searchParams } = new URL(request.url);
    const crushUserId = searchParams.get("crushUserId");

    if (!crushUserId) {
      return NextResponse.json(
        { message: "Crush user ID is required" },
        { status: 400 }
      );
    }

    // Remove the crush
    await DatabaseService.removeCrush(user.userId, crushUserId);

    // Log the activity
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      user.userId,
      "crush_removed",
      { crush_user_id: crushUserId },
      ip,
      userAgent
    );

    return NextResponse.json({
      message: "Crush removed successfully",
    });
  } catch (error: any) {
    console.error("Remove crush error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to remove crush" },
      { status: 400 }
    );
  }
}
