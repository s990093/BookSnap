"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PhotoIcon } from "@heroicons/react/24/solid";

const navItems = [
  { href: "/", label: "Dashboard" },
  {
    href: "/instagram-posts",
    label: "Instagram Posts",
    icon: PhotoIcon,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 從 localStorage 讀取使用者資訊
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const { username } = JSON.parse(userInfo);
      setUserName(username);
    }
  }, []);

  const handleSignOut = () => {
    // 登出時清除 localStorage
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-xl font-bold text-white">Blog Admin</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 flex items-center"
                >
                  {item.icon && (
                    <item.icon
                      className={`h-5 w-5 mr-2 ${
                        isActive ? "text-white" : "text-gray-300"
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      isActive ? "text-white" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-blue-600 rounded-md"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center relative">
            <div
              className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 rounded-full px-4 py-2 cursor-pointer transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-gray-300">{userName || "Guest"}</span>
              <svg
                className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                  {/* 可以在這裡添加更多選項 */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
