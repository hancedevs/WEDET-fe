import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL =
    "https://mbvamieeoaysvmmgiolk.supabase.co"),
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idmFtaWVlb2F5c3ZtbWdpb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzQzNTMsImV4cCI6MjA3MTk1MDM1M30._4MWjjtlEo1G9p1B2ytHO4H4pIanf_B-LJSy3buQZTA"),
  { auth: { persistSession: true, autoRefreshToken: true } }
);
