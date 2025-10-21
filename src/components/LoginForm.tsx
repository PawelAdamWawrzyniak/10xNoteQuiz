"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSchema } from "@/lib/schemas/auth.schemas";
import type { ZodIssue } from "zod";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);

    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      setErrors(result.error.issues);
      return;
    }

    // TODO: Handle successful login
    console.log("Login data:", result.data);
    alert("Logowanie...");
  };

  const getError = (path: string) => errors.find((e) => e.path[0] === path)?.message;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Witaj ponownie!</CardTitle>
        <CardDescription>Zaloguj się, aby kontynuować.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="jan.kowalski@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {getError("email") && <p className="text-sm text-red-500">{getError("email")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {getError("password") && <p className="text-sm text-red-500">{getError("password")}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button type="submit">Zaloguj się</Button>
          <p className="text-center text-sm text-gray-500">
            Nie masz jeszcze konta?{" "}
            <a href="/register" className="font-semibold text-blue-600 hover:underline">
              Zarejestruj się
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
