import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const supabaseServer = () => {
    return createServerComponentClient({
        cookies: cookies(), // ✅ call cookies() here, don’t just pass the function
    });
};
