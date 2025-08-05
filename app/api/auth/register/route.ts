import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";
import { EmailService } from "@/lib/email";
import { DatabaseService } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Register user
    const { user, verificationToken } = await AuthService.registerUser(
      email.toLowerCase().trim(),
      password,
      name?.trim()
    );

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, verificationToken);

    // Log the registration
    const ip =
      request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await DatabaseService.logActivity(
      user.id,
      "user_register",
      {
        method: "email_password",
        organization_domain: AuthService.extractDomain(email),
      },
      ip,
      userAgent
    );

    return NextResponse.json(
      {
        message:
          "Account created successfully! Please check your email to verify your account.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          email_verified: user.email_verified,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to create account" },
      { status: 400 }
    );
  }
}
