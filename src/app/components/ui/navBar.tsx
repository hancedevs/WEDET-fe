"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { House, MapPin, User } from "lucide-react";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const baseColor = "text-[#5e5d5d]";
  const activeColor = "text-[#28B872]";

  const navItems = [
    {
      label: "Explore",
      key: "explore",
      icon: <House size={26} strokeWidth={1.5} />,
      path: "/pages/home", 
    },
    {
      label: "My Trips",
      key: "trips",
      icon: <MapPin size={26} strokeWidth={1.5} />,
      path: "/pages/wishlist", 
    },
    {
      label: "Profile",
      key: "profile",
      icon: <User size={26} strokeWidth={1.5} />,
      path: "/pages/user_profile", 
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md rounded-t-2xl flex justify-around items-center h-20 pt-2 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom Navigation"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.key}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center min-w-12 px-2 py-1 cursor-pointer transition-colors duration-150
              ${isActive ? activeColor : baseColor}
              hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#28B872] rounded-xl`}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            {item.icon}
            <span className="text-sm mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
