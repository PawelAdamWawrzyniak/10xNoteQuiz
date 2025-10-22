/// <reference types="astro/client" />

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db/database.types.ts";

declare global {
  namespace App {
    interface Locals {
      // Regular Supabase client for database operations (RLS-protected)
      supabase: SupabaseClient<Database>;
      // Authenticated user information (available after middleware)
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly OPENROUTER_API_KEY: string;
  readonly SITE?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
