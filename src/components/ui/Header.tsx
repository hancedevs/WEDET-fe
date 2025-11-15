"use client";

import React, { JSX, useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import IconButtons from "../home/IconsButton";
import { getUserInfo } from "@/lib/utils";
import FilterDropdown from "@/components/modals/FilterModal";
import { useRouter } from "next/navigation";
import { useHomeDataStore } from "@/stores/useHomeDataStore";

export default function Header(): JSX.Element {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // FIX: Using simple, non-object-returning selectors to ensure stable references.
    const setQuery = useHomeDataStore((s) => s.setQuery);
    const currentQuery = useHomeDataStore((s) => s.query);

    const [text, setText] = useState(currentQuery);

    useEffect(() => {
        const t = setTimeout(() => setQuery(text), 300);
        return () => clearTimeout(t);
    }, [text, setQuery]);

    useEffect(() => {
        let mounted = true;
        const loadUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (mounted) {
                if (!error && data.user) {
                    const { firstName, avatarUrl } = getUserInfo(data.user);
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

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between mt-4 px-3">
                <div className="flex gap-1 items-center">
                    <Avatar
                        className="h-12 w-12 border-2 border-green-500"
                        onClick={() => router.push("/user_profile")}
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
                        className="w-full rounded-3xl pl-10 placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                        placeholder="Search Destination"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
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
