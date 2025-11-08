"use client";

import React, { JSX, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BellDot, Search, Funnel, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import FilterOptionsModal from "@/components/modals/FilterModal";
import IconButtons from "../home/IconsButton";
import { getUserInfo } from "@/lib/utils";
import FilterDropdown from "@/components/modals/FilterModal";
import { useRouter } from "next/navigation";

export default function Header(): JSX.Element {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadUser = async (): Promise<void> => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error("supabase.auth.getUser error:", error.message);
                if (mounted) setLoading(false);
                return;
            }

            const user = data.user;
            if (mounted) {
                if (user) {
                    const { firstName, avatarUrl } = getUserInfo(user);
                    setFirstName(firstName);
                    setAvatarUrl(avatarUrl);
                } else {
                    setFirstName(null);
                    setAvatarUrl(null);
                }
                setLoading(false);
            }
        };

        void loadUser();

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                if (!mounted) return;
                const user = session?.user ?? null;
                if (!user) {
                    setFirstName(null);
                    setAvatarUrl(null);
                    return;
                }
                const { firstName, avatarUrl } = getUserInfo(user);
                setFirstName(firstName);
                setAvatarUrl(avatarUrl);
            }
        );

        return () => {
            mounted = false;
            subscription.subscription.unsubscribe();
        };
    }, []);

    const greetingName = loading ? "…" : firstName ?? "Guest";
    const fallbackInitial = (firstName?.[0] ?? "U").toUpperCase();

    const router = useRouter();
    console.log(firstName);
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between mt-4  px-3">
                <div className="flex gap-1 items-center">
                    <Avatar
                        className="h-12 w-12 border-2 border-green-500"
                        onClick={() => {
                            router.push("/user_profile");
                        }}
                    >
                        <AvatarFallback className="font-bold">
                            {fallbackInitial}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-[11px] text-gray-600">
                            Good morning, {greetingName}
                        </p>
                        <h2 className="text-md font-bold text-gray-900">
                            Discover and go
                        </h2>
                    </div>
                </div>

                {firstName && <IconButtons />}
            </div>

            <div className="flex flex-row gap-7 items-center px-3">
                <div className="relative flex-1">
                    <Input
                        className="w-full rounded-3xl pl-10 placeholder:text-gray-300 
             
             focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                        placeholder="Search Destination"
                    />
                    <Search
                        strokeWidth={0.75}
                        className="absolute text-green-500 top-1/2 left-3 transform -translate-y-1/2"
                    />
                </div>

                <FilterDropdown />
            </div>
        </div>
    );
}
