"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHeart, FiUsers, FiUser, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

interface NavbarProps {
  user?: {
    name?: string;
    avatar_url?: string;
    username: string;
  };
  onSignOut?: () => void;
}

export default function Navbar({ user, onSignOut }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: FiUsers, label: "Discover" },
    { href: "/matches", icon: FiHeart, label: "Matches" },
    { href: "/profile", icon: FiUser, label: "Profile" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 backdrop-blur-lg border-b border-base-300 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <FiHeart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Promise.Bond
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-neutral hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-neutral">
                  {user.name || user.username}
                </p>
                <p className="text-xs text-neutral/60">@{user.username}</p>
              </div>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-8 rounded-full">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name || user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {(user.name || user.username).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300"
                >
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2"
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={onSignOut}
                      className="flex items-center space-x-2 text-error"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-base-300 bg-white">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-neutral/60"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
