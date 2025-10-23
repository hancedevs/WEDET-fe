"use client";

import { useState } from "react";
import { BellDot, MessageCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function IconButtons() {
    const [active, setActive] = useState<string | null>(null);

    const handleClick = (name: string) => {
        setActive((prev) => (prev === name ? null : name));
    };

    return (
        <div className="flex items-center gap-5">
            <DropdownMenu
                onOpenChange={(open: boolean) =>
                    setActive(open ? "bell" : null)
                }
            >
                <DropdownMenuTrigger asChild>
                    <div
                        onClick={() => handleClick("bell")}
                        className={`relative inline-flex items-center justify-center cursor-pointer rounded-full transition-all duration-200 
              ${
                  active === "bell"
                      ? "ring-2 ring-green-500 ring-offset-2 shadow-[0_0_10px_2px_rgba(34,197,94,0.6)]"
                      : ""
              }`}
                    >
                        <BellDot
                            className={`h-6 w-6 sm:h-6 sm:w-6 transition-colors duration-200 ${
                                active === "bell"
                                    ? "text-green-500"
                                    : "text-black dark:text-white"
                            }`}
                            strokeWidth={1.5}
                        />
                        <span className="absolute top-1 right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border border-white transform translate-x-1/4 -translate-y-1/4"></span>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-64 border-0 outline-none shadow-md"
                >
                    <DropdownMenuLabel className="text-green-500">
                        Notifications
                    </DropdownMenuLabel>

                    <DropdownMenuItem>No new notifications</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div
                onClick={() => handleClick("message")}
                className={`relative inline-flex items-center justify-center cursor-pointer rounded-full transition-all duration-200 
          ${
              active === "message"
                  ? "ring-2 ring-green-500 ring-offset-2 shadow-[0_0_10px_2px_rgba(34,197,94,0.6)]"
                  : ""
          }`}
            >
                <MessageCircle
                    className={`h-6 w-6 sm:h-6 sm:w-6 transition-colors duration-200 ${
                        active === "message"
                            ? "text-green-500"
                            : "text-black dark:text-white"
                    }`}
                    strokeWidth={1.5}
                />
                <span className="absolute top-1 right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border border-white transform translate-x-1/4 -translate-y-1/4"></span>
            </div>
        </div>
    );
}
