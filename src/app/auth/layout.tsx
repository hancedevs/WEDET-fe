"use client";

import { usePathname } from "next/navigation";

import type React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className=" ">
            <div>{children}</div>
        </div>
    );
}
