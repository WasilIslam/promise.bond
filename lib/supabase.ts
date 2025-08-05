import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  organization_id: string;
  email_verified: boolean;
  google_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Organization {
  id: string;
  domain: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Crush {
  id: string;
  user_id: string;
  crush_user_id: string;
  created_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

// Database utility functions
export class DatabaseService {
  // Get or create organization by domain
  static async getOrCreateOrganization(domain: string): Promise<Organization> {
    let { data: org, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("domain", domain)
      .single();

    if (error && error.code === "PGRST116") {
      // Organization doesn't exist, create it
      const { data: newOrg, error: createError } = await supabase
        .from("organizations")
        .insert({ domain, name: domain })
        .select()
        .single();

      if (createError) throw createError;
      return newOrg;
    }

    if (error) throw error;
    return org;
  }

  // Create user
  static async createUser(userData: {
    email: string;
    username: string;
    name?: string;
    organization_id: string;
    password_hash?: string;
    google_id?: string;
    avatar_url?: string;
    email_verification_token?: string;
  }): Promise<User> {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return user;
  }

  // Get users in same organization
  static async getOrganizationMembers(
    organizationId: string,
    excludeUserId?: string
  ): Promise<User[]> {
    let query = supabase
      .from("users")
      .select("id, username, name, email, avatar_url")
      .eq("organization_id", organizationId)
      .eq("email_verified", true);

    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }

    const { data: users, error } = await query;
    if (error) throw error;
    return users || [];
  }

  // Add crush
  static async addCrush(userId: string, crushUserId: string): Promise<Crush> {
    const { data: crush, error } = await supabase
      .from("crushes")
      .insert({ user_id: userId, crush_user_id: crushUserId })
      .select()
      .single();

    if (error) throw error;
    return crush;
  }

  // Remove crush
  static async removeCrush(userId: string, crushUserId: string): Promise<void> {
    const { error } = await supabase
      .from("crushes")
      .delete()
      .eq("user_id", userId)
      .eq("crush_user_id", crushUserId);

    if (error) throw error;
  }

  // Get user's crushes
  static async getUserCrushes(userId: string): Promise<User[]> {
    const { data: crushes, error } = await supabase
      .from("crushes")
      .select(
        `
        crush_user_id,
        users!crushes_crush_user_id_fkey (
          id, username, name, email, avatar_url
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return crushes?.map((c) => c.users) || [];
  }

  // Get user's matches
  static async getUserMatches(userId: string): Promise<User[]> {
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        user1_id,
        user2_id,
        created_at,
        user1:users!matches_user1_id_fkey (id, username, name, email, avatar_url),
        user2:users!matches_user2_id_fkey (id, username, name, email, avatar_url)
      `
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) throw error;

    return (
      matches?.map((match) =>
        match.user1_id === userId ? match.user2 : match.user1
      ) || []
    );
  }

  // Check if users are matched
  static async areUsersMatched(
    userId1: string,
    userId2: string
  ): Promise<boolean> {
    const [smaller, larger] = [userId1, userId2].sort();

    const { data: match, error } = await supabase
      .from("matches")
      .select("id")
      .eq("user1_id", smaller)
      .eq("user2_id", larger)
      .single();

    if (error && error.code === "PGRST116") return false;
    if (error) throw error;
    return !!match;
  }

  // Verify email token
  static async verifyEmailToken(token: string): Promise<User | null> {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email_verification_token", token)
      .single();

    if (error && error.code === "PGRST116") return null;
    if (error) throw error;

    // Mark email as verified
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        email_verified: true,
        email_verification_token: null,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;
    return { ...user, email_verified: true };
  }

  // Log user activity for security
  static async logActivity(
    userId: string | null,
    action: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const { error } = await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) console.error("Failed to log activity:", error);
  }
}
