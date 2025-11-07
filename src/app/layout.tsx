import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientAuthProvider from "@/components/ClientAuthProvider/ClientAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Your App",
    description: "Formidable App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <ClientAuthProvider>{children}</ClientAuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
