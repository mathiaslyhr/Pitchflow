// Supabase browser client. Phase 1 does not use it yet (no auth/db), but the
// project is wired so phase 2 (save/load named tactics) can drop straight in.
// Provide credentials in .env.local — see .env.example.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
