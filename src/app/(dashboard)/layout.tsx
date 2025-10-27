"use client";
import NavBar from "@/components/Tourguidecomponents/TourGuideNavbar";
import Header from "@/components/ui/Header";

import { usePathname } from "next/navigation";

import type React from "react";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const routerName = usePathname();

    return (
        <div className="flex flex-col justify-center xl:items-center">
            <div>{children}</div>

            <NavBar />
        </div>
    );
}
