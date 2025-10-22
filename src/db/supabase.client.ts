import type { AstroCookies } from "astro";
import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";

import type { Database } from "../db/database.types.ts";

// Get Supabase credentials from environment
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

// Validate that Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in your .env file.");
}

// ============================================================================
// Regular Supabase Client (for services, RLS-protected database operations)
// ============================================================================
// Use this in services, background jobs, and non-auth operations
// Protected by Row Level Security (RLS) policies
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type SupabaseClient = typeof supabaseClient;

// ============================================================================
// SSR Supabase Client (for auth endpoints, middleware, protected pages)
// ============================================================================
// Use this ONLY in API routes and middleware where you have access to cookies/headers
// This client properly handles session management via httpOnly cookies

export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  if (!cookieHeader) return [];
  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

export const createSupabaseServerInstance = (context: { headers: Headers; cookies: AstroCookies }) => {
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookieOptions,
    cookies: {
      getAll() {
        return parseCookieHeader(context.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => context.cookies.set(name, value, options));
      },
    },
  });

  return supabase;
};
