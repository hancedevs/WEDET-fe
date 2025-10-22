"use client";
import Header from "@/components/ui/Header";
import NavBar from "@/components/ui/navBar";
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
            {routerName === "/home" && <Header />}

            <div>{children}</div>

            <NavBar />
        </div>
    );
}
