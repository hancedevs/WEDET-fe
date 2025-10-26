"use client";

import Link from "next/link";
import clsx from "clsx";
import { House, MapPin, User } from "lucide-react";
import type { NavItem, NavbarProps } from "@/types/type";

const items = [
    {
        href: "/TourDash",
        label: "Explore",
        value: "dashbord",
        Icon: House,
    },
    {
        href: "/Tourlist",
        label: "My Trips",
        value: "my-trips",
        Icon: MapPin,
    },
    {
        href: "/profile",
        label: "Profile",
        value: "Tour_profile",
        Icon: User,
    },
] as const satisfies readonly NavItem[];

export default function Navbar({ active = "explore" }: NavbarProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ECECEC]">
            <div
                className="
          mx-auto max-w-[430px]
          px-8 pt-3 pb-4
          grid grid-cols-3 place-items-center
          gap-x-12 md:gap-x-20
        "
                style={{
                    paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                }}
            >
                {items.map(({ href, label, value, Icon }) => {
                    const isActive = active === value;
                    const color = isActive ? "#28B872" : "#9CA3AF";

                    return (
                        <Link
                            key={value}
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={clsx(
                                "flex flex-col items-center gap-1 select-none",
                                isActive ? "text-[#28B872]" : "text-gray-400"
                            )}
                        >
                            <Icon
                                size={29}
                                strokeWidth={1}
                                className="transition-colors"
                                style={{ color }}
                                aria-hidden="true"
                            />
                            <span
                                className={clsx(
                                    "text-[13px] font-semibold tracking-tight",
                                    isActive
                                        ? "text-[#28B872]"
                                        : "text-gray-400"
                                )}
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
