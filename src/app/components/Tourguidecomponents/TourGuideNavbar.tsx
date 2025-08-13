"use client";

import Link from "next/link";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { House, MapPin, User } from "lucide-react";
type Item = { href: string; label: string; value: string; Icon: LucideIcon };

const items: Item[] = [
  { href: "/explore", label: "Explore", value: "explore", Icon: House },
  { href: "/my-trips", label: "My Trips", value: "my-trips", Icon: MapPin },
  { href: "", label: "Profile", value: "profile", Icon: User },
];

export default function Navbar({
  active = "explore",
}: {
  active?: Item["value"];
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ECECEC]">
      <div
        className="
          mx-auto max-w-[430px]
          px-8 pt-3 pb-4
          grid grid-cols-3 place-items-center
        "
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
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
                size={25}
                strokeWidth={1}
                className="transition-colors"
                style={{ color }}
                aria-hidden="true"
              />
              <span
                className={clsx(
                  "text-[10px] font-semibold tracking-tight",
                  isActive ? "text-[#28B872]" : "text-gray-400"
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
