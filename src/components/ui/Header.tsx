"use client";

import React, { JSX, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BellDot, Search, Funnel, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import FilterOptionsModal from "@/components/modals/FilterModal";

/* ========= Helpers ========= */

type DerivedIdentity = {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
};

function deriveNameAndAvatar(user: User): DerivedIdentity {
    // Metadata from Auth (email/password or OAuth claims mapped by Supabase)
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    // Some providers also expose raw claims on the first identity
    const id0 = (user.identities?.[0]?.identity_data ?? {}) as Record<
        string,
        unknown
    >;

    const pickStr = (
        obj: Record<string, unknown>,
        key: string
    ): string | null =>
        typeof obj[key] === "string" && obj[key] ? (obj[key] as string) : null;

    const firstName =
        pickStr(meta, "firstName") ??
        pickStr(meta, "first_name") ??
        pickStr(meta, "given_name") ??
        pickStr(id0, "firstName") ??
        pickStr(id0, "first_name") ??
        pickStr(id0, "given_name") ??
        (typeof meta["name"] === "string"
            ? (meta["name"] as string).split(" ")[0]
            : null) ??
        (typeof id0["name"] === "string"
            ? (id0["name"] as string).split(" ")[0]
            : null) ??
        (typeof user.email === "string" ? user.email.split("@")[0] : null);

    const lastName =
        pickStr(meta, "lastName") ??
        pickStr(meta, "last_name") ??
        pickStr(meta, "family_name") ??
        pickStr(id0, "lastName") ??
        pickStr(id0, "last_name") ??
        pickStr(id0, "family_name");

    const avatarUrl =
        pickStr(meta, "avatar_url") ??
        pickStr(meta, "picture") ??
        pickStr(id0, "avatar_url") ??
        pickStr(id0, "picture");

    return { firstName, lastName, avatarUrl };
}

/* ========= Component ========= */

export default function Header(): JSX.Element {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState(false);

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
                    const { firstName, avatarUrl } = deriveNameAndAvatar(user);
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
                const { firstName, avatarUrl } = deriveNameAndAvatar(user);
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

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between mt-4 mb-3 px-3">
                <div className="flex gap-1 items-center">
                    <Avatar className="h-12 w-12 border-2 border-green-500">
                        <AvatarImage
                            src={avatarUrl ?? "https://github.com/shadcn.png"}
                            alt="User Avatar"
                        />
                        <AvatarFallback>{fallbackInitial}</AvatarFallback>
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

                <div className="flex items-center gap-5">
                    <div className="relative inline-block">
                        <BellDot
                            className="h-6 w-6 sm:h-6 sm:w-6"
                            strokeWidth={1}
                        />
                        <span className="absolute top-1 right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border border-white transform translate-x-1/4 -translate-y-1/4"></span>
                    </div>
                    <div className="relative inline-block">
                        <MessageCircle
                            className="h-6 w-6 sm:h-6 sm:w-6"
                            strokeWidth={1}
                        />
                        <span className="absolute top-1 right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 border border-white transform translate-x-1/4 -translate-y-1/4"></span>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-7 items-center px-3">
                <div className="relative flex-1">
                    <Input
                        className="w-full rounded-3xl pl-10 placeholder:text-gray-300 
             border border-[#C0C0C0] 
             focus:border-green-500 focus:ring-2 focus:ring-green-300 focus:outline-none"
                        placeholder="Search Destination"
                    />
                    <Search
                        strokeWidth={0.75}
                        className="absolute text-green-500 top-1/2 left-3 transform -translate-y-1/2"
                    />
                </div>

                <div
                    onClick={() => {
                        setOpen(true);
                    }}
                    className="cursor-pointer"
                >
                    <Funnel
                        size={25}
                        strokeWidth={0.75}
                        className="text-green-500"
                    />
                </div>

                <FilterOptionsModal open={open} setOpen={setOpen} />
            </div>
        </div>
    );
}
