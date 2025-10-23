"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { House, MapPin, User } from "lucide-react";

export default function NavBar() {
    const router = useRouter();
    const pathname = usePathname();

    const baseColor = "text-[#959494]";
    const activeColor = "text-[#28B872]";

    const navItems = [
        {
            label: "Explore",
            key: "explore",
            icon: <House size={26} strokeWidth={1.5} />,
            path: "/home",
        },
        {
            label: "My Trips",
            key: "trips",
            icon: <MapPin size={26} strokeWidth={1.5} />,
            path: "/wishlist",
        },
        {
            label: "Profile",
            key: "profile",
            icon: <User size={26} strokeWidth={1.5} />,
            path: "/user_profile",
        },
    ];

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 pb-[env(safe-area-inset-bottom)] flex justify-center">
            <nav
                className="w-full max-w-sm h-16 bg-white rounded-full shadow-2xl flex justify-around items-center px-2"
                style={{
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    minWidth: "280px",
                }}
                aria-label="Bottom Navigation"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <button
                            key={item.key}
                            onClick={() => router.push(item.path)}
                            className={`
                                flex flex-col items-center cursor-pointer justify-center h-full p-0 m-0 transition-all duration-300 ease-in-out
                                relative z-10 ${isActive ? "w-1/4" : "w-1/3"}
                                focus:outline-none 
                            `}
                            aria-label={item.label}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {isActive ? (
                                <div
                                    className={`
                                        w-14 h-14 rounded-full bg-white shadow-lg border-2 
                                        flex items-center justify-center transition-all duration-300
                                        ${baseColor} 
                                    `}
                                    style={{
                                        borderColor: "rgba(40, 184, 114, 0.3)",
                                        boxShadow:
                                            "0 4px 10px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(40, 184, 114, 0.2)",
                                        transform: "translateY(-20px)",
                                    }}
                                >
                                    <div className={activeColor}>
                                        {item.icon}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`flex flex-col items-center ${baseColor}`}
                                >
                                    {item.icon}

                                    <span
                                        className="text-xs mt-1"
                                        style={{
                                            fontFamily:
                                                "'Century Gothic', sans-serif",
                                            fontWeight: 300,
                                        }}
                                    ></span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
