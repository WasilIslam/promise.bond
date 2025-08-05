"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiEdit3,
  FiSave,
  FiX,
  FiHeart,
  FiUsers,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar_url?: string;
  organization_id: string;
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "" });
  const [stats, setStats] = useState({
    crushes: 0,
    matches: 0,
    joinedDays: 0,
  });

  // Mock current user
  useEffect(() => {
    setCurrentUser({
      id: "1",
      username: "john_doe",
      name: "John Doe",
      email: "john.doe@lhr.nu.edu.pk",
      organization_id: "1",
    });

    setStats({
      crushes: 3,
      matches: 2,
      joinedDays: 15,
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      setEditForm({ name: currentUser.name || "" });
    }
  }, [currentUser]);

  const handleSave = async () => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentUser((prev) =>
        prev ? { ...prev, name: editForm.name } : null
      );
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleSignOut = () => {
    toast.success("See you later!");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <Navbar user={currentUser} onSignOut={handleSignOut} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Your Profile
          </h1>
          <p className="text-neutral/60 text-lg">
            Manage your Promise.Bond account and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-base-300 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                <div className="flex items-center space-x-4">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.name || currentUser.username}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                      <FiUser className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {currentUser.name || currentUser.username}
                    </h2>
                    <p className="text-white/80 mb-1">
                      @{currentUser.username}
                    </p>
                    <div className="flex items-center space-x-1 text-white/70">
                      <FiMail className="w-4 h-4" />
                      <span className="text-sm">{currentUser.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-ghost btn-sm text-white hover:bg-white/20"
                  >
                    {isEditing ? (
                      <FiX className="w-4 h-4" />
                    ) : (
                      <FiEdit3 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Display Name
                        </span>
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ name: e.target.value })}
                        className="input input-bordered w-full"
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSave}
                        className="btn btn-primary flex-1"
                      >
                        <FiSave className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn-outline btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral mb-4">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-base-200 rounded-lg p-4">
                          <label className="text-sm text-neutral/60">
                            Username
                          </label>
                          <p className="font-medium text-neutral">
                            {currentUser.username}
                          </p>
                        </div>
                        <div className="bg-base-200 rounded-lg p-4">
                          <label className="text-sm text-neutral/60">
                            Email
                          </label>
                          <p className="font-medium text-neutral">
                            {currentUser.email}
                          </p>
                        </div>
                        <div className="bg-base-200 rounded-lg p-4">
                          <label className="text-sm text-neutral/60">
                            Organization
                          </label>
                          <p className="font-medium text-neutral">
                            {currentUser.email.split("@")[1]}
                          </p>
                        </div>
                        <div className="bg-base-200 rounded-lg p-4">
                          <label className="text-sm text-neutral/60">
                            Member Since
                          </label>
                          <p className="font-medium text-neutral">
                            {stats.joinedDays} days ago
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neutral mb-4">
                        Privacy & Security
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral">
                              Email Verified
                            </p>
                            <p className="text-sm text-neutral/60">
                              Your email is verified and secure
                            </p>
                          </div>
                          <div className="badge badge-success">Verified</div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral">
                              Profile Visibility
                            </p>
                            <p className="text-sm text-neutral/60">
                              Only visible to your organization
                            </p>
                          </div>
                          <div className="badge badge-info">Organization</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-neutral mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FiHeart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral">Crushes</p>
                      <p className="text-sm text-neutral/60">
                        {stats.crushes}/4 selected
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {stats.crushes}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <FiUsers className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral">Matches</p>
                      <p className="text-sm text-neutral/60">
                        Mutual connections
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-secondary">
                    {stats.matches}
                  </span>
                </div>

                <div className="pt-4 border-t border-base-300">
                  <p className="text-sm text-neutral/60 text-center">
                    You've been active for{" "}
                    <strong>{stats.joinedDays} days</strong> 🎉
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-neutral mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="btn btn-outline btn-primary w-full justify-start">
                  <FiUsers className="w-4 h-4" />
                  Discover People
                </button>
                <button className="btn btn-outline btn-secondary w-full justify-start">
                  <FiHeart className="w-4 h-4" />
                  View Matches
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
