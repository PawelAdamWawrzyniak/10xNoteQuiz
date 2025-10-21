"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterSchema } from "@/lib/schemas/auth.schemas";
import type { ZodIssue } from "zod";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setIsSuccess(false);

    const result = RegisterSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      setErrors(result.error.issues);
      return;
    }

    // TODO: Handle successful registration
    console.log("Registration data:", result.data);
    setIsSuccess(true);
  };

  const getError = (path: string) => errors.find((e) => e.path[0] === path)?.message;

  if (isSuccess) {
    return (
      <Alert className="w-full max-w-md">
        <AlertTitle>Rejestracja pomyślna!</AlertTitle>
        <AlertDescription>
          Na Twój adres e-mail wysłaliśmy link aktywacyjny. Potwierdź go, aby dokończyć rejestrację.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Utwórz nowe konto</CardTitle>
        <CardDescription>Wypełnij poniższe pola, aby dołączyć do naszej społeczności.</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {getError("confirmPassword") && <p className="text-sm text-red-500">{getError("confirmPassword")}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button type="submit">Zarejestruj się</Button>
          <p className="text-center text-sm text-gray-500">
            Masz już konto?{" "}
            <a href="/login" className="font-semibold text-blue-600 hover:underline">
              Zaloguj się
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
