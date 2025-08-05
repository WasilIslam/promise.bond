"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (mode === "signup") {
        toast.success(
          "Account created! Please check your email to verify your account."
        );
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Google OAuth would be implemented here
      toast.error("Google Sign-In will be available soon!");
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <AuthForm
      mode={mode}
      onSubmit={handleSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      onToggleMode={toggleMode}
      isLoading={isLoading}
    />
  );
}
