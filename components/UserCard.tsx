"use client";

import { motion } from "framer-motion";
import { FiHeart, FiUser, FiMail } from "react-icons/fi";
import { useState } from "react";

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar_url?: string;
}

interface UserCardProps {
  user: User;
  onCrush: (userId: string) => Promise<void>;
  isCrushed?: boolean;
  isLoading?: boolean;
}

export default function UserCard({
  user,
  onCrush,
  isCrushed = false,
  isLoading = false,
}: UserCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCrush = async () => {
    if (isLoading || isAnimating) return;

    setIsAnimating(true);
    try {
      await onCrush(user.id);
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg border border-base-300 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* User Avatar */}
      <div className="relative p-6 pb-3">
        <div className="flex flex-col items-center">
          <div className="relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name || user.username}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-4 border-white shadow-lg">
                <FiUser className="w-8 h-8 text-white" />
              </div>
            )}

            {/* Online status indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 pb-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-neutral">
            {user.name || user.username}
          </h3>
          <p className="text-sm text-neutral/60 mb-1">@{user.username}</p>
          <div className="flex items-center justify-center space-x-1 text-xs text-neutral/50">
            <FiMail className="w-3 h-3" />
            <span>{user.email.split("@")[1]}</span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleCrush}
          disabled={isLoading || isAnimating}
          className={`btn w-full transition-all duration-300 ${
            isCrushed
              ? "btn-success text-white"
              : "btn-outline btn-primary hover:btn-primary"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          <motion.div
            animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <FiHeart className={`w-4 h-4 ${isCrushed ? "fill-current" : ""}`} />
          </motion.div>
          {isCrushed ? "Crushing" : "Add Crush"}
        </motion.button>
      </div>

      {/* Animated background on crush */}
      {isAnimating && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: [0, 0.3, 0] }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl"
          style={{ zIndex: -1 }}
        />
      )}
    </motion.div>
  );
}
