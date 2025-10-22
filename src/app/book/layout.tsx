"use client";
import Header from "@/components/ui/Header";
import NavBar from "@/components/ui/navBar";
import { usePathname } from "next/navigation";

import type React from "react";

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-center xl:items-center ">
            <div>{children}</div>
        </div>
    );
}
