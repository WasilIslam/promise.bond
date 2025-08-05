"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiCheckCircle, FiXCircle, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "Invalid verification link. Please check your email for the correct link."
      );
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        toast.success("Email verified successfully!");
      } else {
        setStatus("error");
        setMessage(data.message || "Verification failed");
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      toast.error("Verification failed");
    }
  };

  const goToLogin = () => {
    router.push("/");
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
            <FiMail className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Email Verification
          </h1>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-base-300 p-6"
        >
          {status === "loading" && (
            <div className="text-center py-8">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <h3 className="text-lg font-semibold text-neutral mb-2">
                Verifying your email...
              </h3>
              <p className="text-neutral/60">
                Please wait while we confirm your email address.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FiCheckCircle className="w-8 h-8 text-success" />
              </motion.div>
              <h3 className="text-lg font-semibold text-neutral mb-2">
                Email Verified! 🎉
              </h3>
              <p className="text-neutral/60 mb-6">{message}</p>
              <button onClick={goToLogin} className="btn btn-primary w-full">
                Continue to Login
                <FiArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FiXCircle className="w-8 h-8 text-error" />
              </motion.div>
              <h3 className="text-lg font-semibold text-neutral mb-2">
                Verification Failed
              </h3>
              <p className="text-neutral/60 mb-6">{message}</p>
              <div className="space-y-3">
                <button onClick={goToLogin} className="btn btn-primary w-full">
                  Go to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-outline btn-secondary w-full"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-neutral/40 text-sm mt-6"
        >
          Need help? Contact support at support@promise.bond
        </motion.p>
      </motion.div>
    </div>
  );
}
