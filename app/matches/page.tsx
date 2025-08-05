"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiMail, FiCalendar, FiStar } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar_url?: string;
}

interface Match {
  id: string;
  user: User;
  matchedAt: string;
}

export default function MatchesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock current user
  useEffect(() => {
    setCurrentUser({
      id: "1",
      username: "john_doe",
      name: "John Doe",
      email: "john.doe@lhr.nu.edu.pk",
    });
  }, []);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMatches([
        {
          id: "1",
          user: {
            id: "2",
            username: "jane_smith",
            name: "Jane Smith",
            email: "jane.smith@lhr.nu.edu.pk",
          },
          matchedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          user: {
            id: "3",
            username: "alex_wilson",
            name: "Alex Wilson",
            email: "alex.wilson@lhr.nu.edu.pk",
          },
          matchedAt: "2024-01-14T15:45:00Z",
        },
      ]);
    } catch (error) {
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    toast.success("See you later!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <Navbar user={currentUser || undefined} onSignOut={handleSignOut} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Your Matches 💕
          </h1>
          <p className="text-neutral/60 text-lg">
            These amazing people chose you too! Time to make the first move.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && matches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral mb-4">
              No matches yet
            </h3>
            <p className="text-neutral/60 max-w-md mx-auto mb-6">
              Keep exploring and adding crushes! When someone likes you back,
              they'll appear here.
            </p>
            <button className="btn btn-primary">Discover People</button>
          </motion.div>
        )}

        {/* Matches List */}
        {!isLoading && matches.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence>
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-base-300 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    {/* Match Banner */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                      <div className="flex items-center justify-center space-x-2">
                        <FiStar className="w-5 h-5" />
                        <span className="font-semibold">Perfect Match!</span>
                        <FiStar className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Match Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        {/* Avatar */}
                        <div className="relative">
                          {match.user.avatar_url ? (
                            <img
                              src={match.user.avatar_url}
                              alt={match.user.name || match.user.username}
                              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-4 border-white shadow-lg">
                              <span className="text-white text-xl font-bold">
                                {(match.user.name || match.user.username)
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
                            <FiHeart className="w-3 h-3 text-white fill-current" />
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-neutral">
                            {match.user.name || match.user.username}
                          </h3>
                          <p className="text-neutral/60 mb-1">
                            @{match.user.username}
                          </p>
                          <div className="flex items-center space-x-1 text-sm text-neutral/50">
                            <FiMail className="w-3 h-3" />
                            <span>{match.user.email.split("@")[1]}</span>
                          </div>
                        </div>

                        {/* Match Date */}
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-sm text-neutral/60">
                            <FiCalendar className="w-4 h-4" />
                            <span>{formatDate(match.matchedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Match Description */}
                      <div className="bg-primary/5 rounded-lg p-4 mb-4">
                        <p className="text-neutral/70 text-center">
                          🎉 You both selected each other as crushes! This is
                          your chance to connect and see where it goes.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button className="btn btn-primary flex-1">
                          <FiMail className="w-4 h-4" />
                          Send Message
                        </button>
                        <button className="btn btn-outline btn-primary">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Stats Footer */}
        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-neutral mb-4">
                Your Match Stats
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {matches.length}
                  </div>
                  <div className="text-sm text-neutral/60">Total Matches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary mb-1">
                    {
                      matches.filter(
                        (m) =>
                          new Date(m.matchedAt) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </div>
                  <div className="text-sm text-neutral/60">This Week</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-1">
                    {Math.round((matches.length / 10) * 100)}%
                  </div>
                  <div className="text-sm text-neutral/60">Match Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
