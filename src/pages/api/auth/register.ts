import type { APIRoute } from "astro";

import { RegisterApiSchema } from "@/lib/schemas/auth.schemas";
import { createSupabaseServerInstance } from "@/db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod
    const result = RegisterApiSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: result.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { email, password } = result.data;

    // Create SSR Supabase client
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Check for existing user
      if (error.message.includes("already registered")) {
        return new Response(
          JSON.stringify({
            error: "Użytkownik o tym adresie e-mail już istnieje",
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: error.message + "!2" || "Błąd podczas rejestracji",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Success - check if email confirmation is required
    const needsEmailConfirmation = !data.user?.email_confirmed_at;

    return new Response(
      JSON.stringify({
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
        needsEmailConfirmation,
        message: needsEmailConfirmation
          ? "Konto utworzone pomyślnie. Sprawdź swoją skrzynkę e-mail, aby potwierdzić adres."
          : "Konto utworzone pomyślnie. Możesz się teraz zalogować.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to register:", error);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
