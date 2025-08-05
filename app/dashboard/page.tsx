"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiHeart, FiUsers, FiRefreshCw } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import UserCard from "@/components/UserCard";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar_url?: string;
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [crushes, setCrushes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock current user - in a real app, this would come from auth context
  useEffect(() => {
    // Simulate fetching current user
    setCurrentUser({
      id: "1",
      username: "john_doe",
      name: "John Doe",
      email: "john.doe@lhr.nu.edu.pk",
      avatar_url: undefined,
    });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers([
        {
          id: "2",
          username: "jane_smith",
          name: "Jane Smith",
          email: "jane.smith@lhr.nu.edu.pk",
          avatar_url: undefined,
        },
        {
          id: "3",
          username: "alex_wilson",
          name: "Alex Wilson",
          email: "alex.wilson@lhr.nu.edu.pk",
          avatar_url: undefined,
        },
        {
          id: "4",
          username: "sarah_jones",
          name: "Sarah Jones",
          email: "sarah.jones@lhr.nu.edu.pk",
          avatar_url: undefined,
        },
        {
          id: "5",
          username: "mike_brown",
          name: "Mike Brown",
          email: "mike.brown@lhr.nu.edu.pk",
          avatar_url: undefined,
        },
      ]);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrush = async (userId: string) => {
    try {
      if (crushes.includes(userId)) {
        // Remove crush
        setCrushes((prev) => prev.filter((id) => id !== userId));
        toast.success("Removed from your crushes");
      } else {
        if (crushes.length >= 4) {
          toast.error("You can only have up to 4 crushes at a time");
          return;
        }
        // Add crush
        setCrushes((prev) => [...prev, userId]);
        toast.success("Added to your crushes! 💕");

        // Simulate match check (50% chance for demo)
        if (Math.random() > 0.5) {
          setTimeout(() => {
            const user = users.find((u) => u.id === userId);
            toast.success(
              `🎉 It's a match with ${user?.name || user?.username}!`
            );
          }, 1500);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleSignOut = () => {
    toast.success("See you later!");
    // In a real app, clear auth state and redirect
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <Navbar user={currentUser || undefined} onSignOut={handleSignOut} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Discover Your Campus
          </h1>
          <p className="text-neutral/60 text-lg mb-6">
            Find amazing people in your organization. You can select up to 4
            crushes.
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {users.length}
              </div>
              <div className="text-sm text-neutral/60">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {crushes.length}/4
              </div>
              <div className="text-sm text-neutral/60">Your Crushes</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="btn btn-outline btn-primary"
            disabled={isLoading}
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiUsers className="w-16 h-16 text-neutral/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral/60 mb-2">
              {searchQuery ? "No users found" : "No users available"}
            </h3>
            <p className="text-neutral/40">
              {searchQuery
                ? "Try adjusting your search"
                : "Check back later for new members"}
            </p>
          </motion.div>
        )}

        {/* Users Grid */}
        {!isLoading && filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <UserCard
                    user={user}
                    onCrush={handleCrush}
                    isCrushed={crushes.includes(user.id)}
                    isLoading={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Crush Counter */}
        {crushes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
          >
            <FiHeart className="w-4 h-4 fill-current" />
            <span className="font-medium">{crushes.length}/4 crushes</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
