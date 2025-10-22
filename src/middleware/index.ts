import { defineMiddleware } from "astro:middleware";

import { createSupabaseServerInstance } from "../db/supabase.client.ts";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/api/auth/login", "/api/auth/register"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, cookies, url, request, redirect } = context;

  // Create SSR client for all operations in this request
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Make Supabase client available in context
  locals.supabase = supabase;

  // Skip auth check for public paths
  if (PUBLIC_PATHS.includes(url.pathname)) {
    return next();
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // User is authenticated - store minimal user info in locals
    locals.user = {
      id: user.id,
      email: user.email,
    };
  } else {
    // User is not authenticated - redirect to login for protected routes
    return redirect("/auth/login");
  }

  return next();
});
