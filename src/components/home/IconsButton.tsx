"use client";

import { useState } from "react";
import { BellDot } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function NotificationButton() {
    const [active, setActive] = useState(false);

    return (
        <DropdownMenu onOpenChange={(open: boolean) => setActive(open)}>
            <DropdownMenuTrigger asChild>
                <button
                    className={`relative flex items-center justify-center h-10 w-10 rounded-full shadow transition border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                        active
                            ? "bg-green-50 ring-2 ring-green-500 ring-offset-2 shadow-[0_0_10px_2px_rgba(34,197,94,0.6)]"
                            : "bg-white"
                    }`}
                    aria-label="Notifications"
                >
                    <BellDot
                        className="h-6 w-6 text-green-500 transition-colors duration-200"
                        strokeWidth={1.5}
                    />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border border-white"></span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
            >
                <DropdownMenuLabel className="text-green-600 font-bold mb-2">
                    Notifications
                </DropdownMenuLabel>
                <DropdownMenuItem className="text-gray-500 text-sm">
                    No new notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
