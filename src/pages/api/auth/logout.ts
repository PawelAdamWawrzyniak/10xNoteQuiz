import type { APIRoute } from "astro";

import { createSupabaseServerInstance } from "@/db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Create SSR Supabase client
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Sign out user
    const { error } = await supabase.auth.signOut();

    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message || "Błąd podczas wylogowania",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Success - session cookie is automatically cleared by Supabase
    return new Response(null, {
      status: 200,
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas wylogowania. Spróbuj ponownie.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
