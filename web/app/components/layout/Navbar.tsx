"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState, useRef,useEffect } from "react";
import { UserMenu } from "./NavbarModal/Menu";
const navItems = [
  { href: "/", 
    label: "Dashboard" 
  },
  {
    href: "/instagram-posts",
    label: "Instagram Posts",
    icon: PhotoIcon,
  },
  //   { href: "/posts", label: "Posts" },
  //   { href: "/events", label: "Events" },
  //   { href: "/design-templates", label: "Design Templates" },
];

export function Navbar() {
  const pathname = usePathname();
  const [NotiOpen,setNotiopen]  = useState<boolean>(false);
  // statue of having noti
  const [HaveNoti,setHaveNoti]  = useState<boolean>(false); 

  const [OnUserMenu,setCloseUserMenu] = useState<boolean>(false)
  const MenuRef = useRef<HTMLDivElement>(null);
  function NotiClicked(){
    setNotiopen((prev)=>!prev)
  }
  function useOutsideAlerter(ref:React.RefObject<HTMLElement | HTMLButtonElement | null>,ref2:React.RefObject<HTMLElement | HTMLButtonElement | null>) {
    useEffect(() => {
      function handleClickOutside(event:MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node) && !ref2.current.contains(event.target as Node)) {
          setNotiopen(false)
        }
      }
    document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  useEffect(() => {
      function handleClickOutsides(event:MouseEvent) {
        if (MenuRef.current && !MenuRef.current.contains(event.target as Node)) {
          console.log(ref)
          setCloseUserMenu(false)
        }
      }
    document.addEventListener("mousedown", handleClickOutsides);
      return () => {
        document.removeEventListener("mousedown", handleClickOutsides);
        
      };
    }, [OnUserMenu]);
  const NotiRef = useRef<HTMLInputElement | null>(null);
  const NotiButtonRef = useRef<HTMLInputElement | null>(null);
  useOutsideAlerter(NotiRef,NotiButtonRef);
  return (
    <>
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
          <div className="flex items-center space-x-4">
            <button ref={NotiButtonRef}  className="text-gray-300 hover:text-white" onClick={()=> NotiClicked()}>
              <span className="sr-only">Notifications</span>
              <svg
                className="h-6 w-6"
                fill= {`${HaveNoti ? "red" : "none"}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div ref={NotiRef}  className = {`bg-white h-4/6 w-1/6 top-12 rounded-lg right-52 absolute shadow-box  ${NotiOpen ? "":"hidden"}`}>
              <p className="text-center text-black">Noti</p>
            </div>
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white" onClick={()=>setCloseUserMenu((prev)=>!prev)}>
              <span className="sr-only">User menu</span>
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
    {
        <UserMenu ref = {MenuRef} change = {setCloseUserMenu} res = {OnUserMenu}/>
    }
    </>
  );
}