"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try query param first (?code=...), then hash (#code=...)
    const queryCode = searchParams.get("code");
    const hashCode =
      typeof window !== "undefined"
        ? new URL(window.location.href).hash.match(/(?:^|[#&])code=([^&]+)/)?.[1]
        : null;

    const code = queryCode ?? hashCode ?? null;

    if (!code) {
      router.replace("/auth/login?error=Missing%20auth%20code");
      return;
    }

    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        router.replace(`/auth/login?error=${encodeURIComponent(error.message)}`);
        return;
      }
      router.replace("/pages/home");
    })();
  }, [router, searchParams]);

  return <p className="p-6">Signing you in…</p>;
}
