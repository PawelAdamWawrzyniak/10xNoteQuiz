import { createClient } from "@supabase/supabase-js";

import type { Database } from "../db/database.types.ts";

// MOCK: For testing purposes - hardcoded user_id
// In production, remove this and use real authentication
export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

// Check if Supabase credentials are available
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

// Create a mock Supabase client for testing without credentials
const createMockSupabaseClient = () => {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          eq: (column2: string, value2: any) => ({
            single: async () => {
              // Mock note data
              if (table === "notes") {
                return {
                  data: {
                    content:
                      "This is a mock note content that is long enough to generate a quiz. It contains information about various topics and should be sufficient for testing purposes. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  },
                  error: null,
                };
              }
              return { data: null, error: { message: "Not found" } };
            },
          }),
        }),
      }),
    }),
    auth: {
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
    },
  } as any;
};

// Use mock client if credentials are not available, otherwise use real client
export const supabaseClient =
  supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey) : createMockSupabaseClient();

export type SupabaseClient = typeof supabaseClient;
