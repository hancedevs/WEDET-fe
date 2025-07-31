"use client";
import React, { useState } from "react";
import { House, MapPin, Heart, User } from "lucide-react";

function NavBar() {
  const [active, setActive] = useState("explore");

  const baseColor = "text-[#5e5d5d]";
  const activeColor = "text-[#28B872]";

  return (
    <div className="flex justify-around items-center bg-white shadow-md fixed bottom-0 left-0 right-0 h-20 rounded-t-2xl pt-2">
      <div
        onClick={() => setActive("explore")}
        className={`flex flex-col items-center cursor-pointer ${
          active === "explore" ? activeColor : baseColor
        }`}
      >
        <House size={26} strokeWidth={1.5} />
        <p className="text-sm">Explore</p>
      </div>

      <div
        onClick={() => setActive("trips")}
        className={`flex flex-col items-center cursor-pointer ${
          active === "trips" ? activeColor : baseColor
        }`}
      >
        <MapPin size={26} strokeWidth={1.5} />
        <p className="text-sm">My Trips</p>
      </div>

      <div
        onClick={() => setActive("saved")}
        className={`flex flex-col items-center cursor-pointer ${
          active === "saved" ? activeColor : baseColor
        }`}
      >
        <Heart size={26} strokeWidth={1.5} />
        <p className="text-sm">Saved</p>
      </div>

      <div
        onClick={() => setActive("profile")}
        className={`flex flex-col items-center cursor-pointer ${
          active === "profile" ? activeColor : baseColor
        }`}
      >
        <User size={26} strokeWidth={1.5} />
        <p className="text-sm">Profile</p>
      </div>
    </div>
  );
}

export default NavBar;
