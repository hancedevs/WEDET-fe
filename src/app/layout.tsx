import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Wedet - Travel Discovery App",
    description:
        "Discover amazing travel destinations and plan your next adventure",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div>{children}</div>
                <Toaster /> {/* global sonner toaster */}
            </body>
        </html>
    );
}
