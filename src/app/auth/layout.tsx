"use client";

import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";

import type React from "react";
import { useEffect } from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session) {
                if (session?.user?.user_metadata?.role === "business_user")
                    router.push("/TourDash");
                else if (session?.user?.user_metadata?.role === "normal_user")
                    router.push("/home");
                else return;
            }
        };
        void checkSession();
    }, [router]);

    return (
        <div className=" ">
            <div>{children}</div>
        </div>
    );
}
