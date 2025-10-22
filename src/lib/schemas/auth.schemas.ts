import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu e-mail"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

// Base object for registration, without refinement
const RegisterObjectSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu e-mail"),
  password: z
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .regex(/(?=.*[a-z])/, "Hasło musi zawierać co najmniej jedną małą literę")
    .regex(/(?=.*[A-Z])/, "Hasło musi zawierać co najmniej jedną dużą literę"),
  confirmPassword: z.string(),
});

// Schema for frontend validation (includes password confirmation)
export const RegisterSchema = RegisterObjectSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są zgodne",
  path: ["confirmPassword"],
});

// Schema for API validation (omits password confirmation)
export const RegisterApiSchema = RegisterObjectSchema.omit({ confirmPassword: true });

export const UserSettingsSchema = z.object({
  apiKey: z.string().min(1, "Klucz API jest wymagany"),
});
