import { defineMiddleware } from "astro:middleware";

import { supabaseClient, TEST_USER_ID } from "../db/supabase.client.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = supabaseClient;

  // For testing: use hardcoded user ID
  // TODO: In production, implement real authentication using Supabase session
  context.locals.user = {
    id: TEST_USER_ID,
    email: "test@example.com",
  };

  // Real authentication implementation (for future use):
  // try {
  //   const {
  //     data: { session },
  //   } = await supabaseClient.auth.getSession();
  //
  //   if (session?.user) {
  //     context.locals.user = session.user;
  //   } else {
  //     // No session - user is not authenticated
  //     context.locals.user = undefined;
  //   }
  // } catch (error) {
  //   console.error("Error getting session in middleware:", error);
  //   context.locals.user = undefined;
  // }

  return next();
});
