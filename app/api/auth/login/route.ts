import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import { DatabaseService } from "@/lib/supabase";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await AuthService.loginUser(
      email.toLowerCase().trim(),
      password
    );

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // Log the login
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      user.id,
      "user_login",
      { method: "email_password" },
      ip,
      userAgent
    );

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar_url: user.avatar_url,
        organization_id: user.organization_id,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);

    // Log failed login attempt
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      null,
      "login_failed",
      {
        email: email?.toLowerCase().trim(),
        error: error.message,
      },
      ip,
      userAgent
    );

    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 401 }
    );
  }
}
