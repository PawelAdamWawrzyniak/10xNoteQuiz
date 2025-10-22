import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginSchema } from "@/lib/schemas/auth.schemas";
import type { ZodIssue } from "zod";
import { toast } from "sonner";

interface FormError {
  type: "validation" | "api";
  message?: string;
  issues?: ZodIssue[];
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<FormError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Client-side validation with Zod
    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      setError({
        type: "validation",
        issues: result.error.issues,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call login API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        setError({
          type: "api",
          message: data.error || "Wystąpił błąd podczas logowania",
        });
        toast.error(data.error || "Wystąpił błąd podczas logowania");
        setIsLoading(false);
        return;
      }

      // Success - show toast and redirect
      toast.success("Zalogowano pomyślnie!");

      // Redirect to notes page
      window.location.href = "/notes";
    } catch {
      setError({
        type: "api",
        message: "Nie udało się połączyć z serwerem. Spróbuj ponownie.",
      });
      toast.error("Nie udało się połączyć z serwerem");
      setIsLoading(false);
    }
  };

  const getFieldError = (path: string) =>
    error?.type === "validation" ? error.issues?.find((e) => e.path[0] === path)?.message : undefined;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Witaj ponownie!</CardTitle>
        <CardDescription>Zaloguj się, aby kontynuować.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Display API error alert */}
          {error?.type === "api" && error.message && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="jan.kowalski@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            {getFieldError("email") && <p className="text-sm text-red-500">{getFieldError("email")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            {getFieldError("password") && <p className="text-sm text-red-500">{getFieldError("password")}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Nie masz jeszcze konta?{" "}
            <a href="/auth/register" className="font-semibold text-blue-600 hover:underline">
              Zarejestruj się
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
