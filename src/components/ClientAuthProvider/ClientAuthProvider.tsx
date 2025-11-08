"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ClientAuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    useEffect(() => {
        const checkSession = async () => {
            const onboard = localStorage.getItem("onboard");
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (onboard) {
                if (!session) {
                    const authRoutes = [
                        "/auth/login",
                        "/auth/signup",
                        "/auth/forgot-password",
                        "/home",
                        (url: string) => url.startsWith("/trip/"),
                    ];

                    const isAuthRoute = authRoutes.some((route) =>
                        typeof route === "string"
                            ? route === pathname
                            : route(pathname)
                    );

                    if (!isAuthRoute) {
                        router.replace("/auth/login");
                    }
                }
            }
            if (onboard === undefined) {
                router.replace("/");
            }

            setLoading(false);
        };

        void checkSession();
    }, [router]);

    if (loading) {
        return <></>;
    }

    return <>{children}</>;
}
