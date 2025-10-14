import { defineMiddleware } from "astro:middleware";

import { supabaseClient, MOCK_USER_ID } from "../db/supabase.client.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseClient;

  // MOCK: For testing purposes, set a mock user
  // In production, uncomment the real session logic below
  context.locals.user = {
    id: MOCK_USER_ID,
    email: "mock@example.com",
  } as any;

  // Real authentication (commented out for testing):
  // try {
  //   const {
  //     data: { session },
  //   } = await supabaseClient.auth.getSession();
  //
  //   if (session?.user) {
  //     context.locals.user = session.user;
  //   }
  // } catch (error) {
  //   console.error("Error getting session in middleware:", error);
  // }

  return next();
});
