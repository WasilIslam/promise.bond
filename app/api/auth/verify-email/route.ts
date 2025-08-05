import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify the email token
    const user = await DatabaseService.verifyEmailToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Log email verification
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      user.id,
      "email_verified",
      { verification_method: "token" },
      ip,
      userAgent
    );

    return NextResponse.json({
      message: "Email verified successfully! You can now log in.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        email_verified: user.email_verified,
      },
    });
  } catch (error: any) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      { message: error.message || "Email verification failed" },
      { status: 400 }
    );
  }
}
