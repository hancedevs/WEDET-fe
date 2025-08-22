"use client";
import React, { useState } from "react";
import { House, MapPin, User } from "lucide-react";

export default function NavBar() {
  const [active, setActive] = useState("explore");

  const baseColor = "text-[#5e5d5d]";
  const activeColor = "text-[#28B872]";

  const navItems = [
    {
      label: "Explore",
      key: "explore",
      icon: <House size={26} strokeWidth={1.5} />,
    },
    {
      label: "My Trips",
      key: "trips",
      icon: <MapPin size={26} strokeWidth={1.5} />,
    },
    {
      label: "Profile",
      key: "profile",
      icon: <User size={26} strokeWidth={1.5} />,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md rounded-t-2xl flex justify-around items-center h-20 pt-2 pb-[env(safe-area-inset-bottom)] "
      aria-label="Bottom Navigation"
    >
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`flex flex-col items-center min-w-12 px-2 py-1 cursor-pointer transition-colors duration-150
            ${active === item.key ? activeColor : baseColor}
            hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#28B872] rounded-xl`}
          aria-label={item.label}
          aria-current={active === item.key ? "page" : undefined}
        >
          {item.icon}
          <span className="text-sm mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
