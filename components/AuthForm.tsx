"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (data: any) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  onToggleMode: () => void;
  isLoading?: boolean;
}

export default function AuthForm({
  mode,
  onSubmit,
  onGoogleSignIn,
  onToggleMode,
  isLoading = false,
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (mode === "signup" && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-2xl">💕</span>
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Promise.Bond
          </h1>
          <p className="text-neutral/60 mt-2">
            {mode === "login"
              ? "Welcome back! Ready to find your match?"
              : "Join your campus community and discover connections"}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-base-300 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral/40 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input input-bordered w-full pl-10 ${
                      errors.name ? "input-error" : ""
                    }`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.name}
                    </span>
                  </label>
                )}
              </div>
            )}

            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral/40 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="your-email@university.edu"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral/40 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 pr-10 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder={
                    mode === "signup"
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral/40 hover:text-neutral transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.password}
                  </span>
                </label>
              )}
              {mode === "signup" && (
                <label className="label">
                  <span className="label-text-alt text-neutral/60">
                    At least 8 characters with uppercase, lowercase, and number
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading && <span className="loading loading-spinner"></span>}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Google Sign In */}
          {onGoogleSignIn && (
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="btn btn-outline w-full mb-4"
              disabled={isLoading}
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
          )}

          {/* Toggle Mode */}
          <div className="text-center">
            <p className="text-neutral/60">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary font-medium hover:underline"
                disabled={isLoading}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-neutral/40 text-sm mt-6"
        >
          Made with ❤️ for campus connections
        </motion.p>
      </motion.div>
    </div>
  );
}
