import { createClient } from "@supabase/supabase-js";

import type { Database } from "../db/database.types.ts";

// Hardcoded user ID for testing purposes
// In production, remove this and use real authentication from session
export const USER_ID = "85111ac2-ee6f-4fe3-a979-758ceb2e0321";

// Get Supabase credentials from environment
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

// Validate that Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in your .env file.");
}

// Create and export the Supabase client
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type SupabaseClient = typeof supabaseClient;
