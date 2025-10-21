import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu e-mail"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const RegisterSchema = z
  .object({
    email: z.string().email("Nieprawidłowy format adresu e-mail"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/(?=.*[a-z])/, "Hasło musi zawierać co najmniej jedną małą literę")
      .regex(/(?=.*[A-Z])/, "Hasło musi zawierać co najmniej jedną dużą literę"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"],
  });

export const UserSettingsSchema = z.object({
  apiKey: z.string().min(1, "Klucz API jest wymagany"),
});
