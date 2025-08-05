import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { DatabaseService } from "./supabase";

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password
  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Extract domain from email
  static extractDomain(email: string): string {
    return email.split("@")[1].toLowerCase();
  }

  // Generate username from email
  static generateUsername(email: string): string {
    return email.split("@")[0].toLowerCase();
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): {
    isValid: boolean;
    message?: string;
  } {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }

    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }

    return { isValid: true };
  }

  // Register new user
  static async registerUser(
    email: string,
    password: string,
    name?: string
  ): Promise<{ user: any; verificationToken: string }> {
    // Validate inputs
    if (!this.validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message!);
    }

    // Check if user already exists
    const existingUser = await DatabaseService.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Extract domain and get/create organization
    const domain = this.extractDomain(email);
    const organization = await DatabaseService.getOrCreateOrganization(domain);

    // Generate username and hash password
    const username = this.generateUsername(email);
    const hashedPassword = await this.hashPassword(password);
    const verificationToken = uuidv4();

    // Create user
    const user = await DatabaseService.createUser({
      email,
      username,
      name,
      organization_id: organization.id,
      password_hash: hashedPassword,
      email_verification_token: verificationToken,
    });

    return { user, verificationToken };
  }

  // Login user
  static async loginUser(email: string, password: string): Promise<any> {
    const user = await DatabaseService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.email_verified) {
      throw new Error("Please verify your email before logging in");
    }

    if (!user.password_hash) {
      throw new Error(
        "This account is linked to Google. Please use Google sign in."
      );
    }

    const isValidPassword = await this.comparePassword(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    await DatabaseService.logActivity(user.id, "user_login", {
      method: "email_password",
    });

    return user;
  }

  // Create or get Google user
  static async handleGoogleUser(googleProfile: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<any> {
    let user = await DatabaseService.getUserByEmail(googleProfile.email);

    if (!user) {
      // Create new user from Google profile
      const domain = this.extractDomain(googleProfile.email);
      const organization = await DatabaseService.getOrCreateOrganization(
        domain
      );
      const username = this.generateUsername(googleProfile.email);

      user = await DatabaseService.createUser({
        email: googleProfile.email,
        username,
        name: googleProfile.name,
        organization_id: organization.id,
        google_id: googleProfile.id,
        avatar_url: googleProfile.picture,
        email_verification_token: null, // Google emails are pre-verified
      });

      // Mark as verified since it's Google
      user.email_verified = true;
    } else if (!user.google_id) {
      // Link existing account to Google
      // This would require additional verification in a real app
    }

    await DatabaseService.logActivity(user.id, "user_login", {
      method: "google_oauth",
    });

    return user;
  }

  // Generate secure token
  static generateSecureToken(): string {
    return uuidv4();
  }
}
