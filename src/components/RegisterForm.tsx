import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterSchema } from "@/lib/schemas/auth.schemas";
import type { ZodIssue } from "zod";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { toast } from "sonner";

interface FormError {
  type: "validation" | "api";
  message?: string;
  issues?: ZodIssue[];
}

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<FormError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);
    setIsLoading(true);

    // Client-side validation with Zod
    const result = RegisterSchema.safeParse({ email, password, confirmPassword });

    if (!result.success) {
      setError({
        type: "validation",
        issues: result.error.issues,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Call register API endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: result.data.email,
          password: result.data.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        setError({
          type: "api",
          message: data.error || "Wystąpił błąd podczas rejestracji",
        });
        // toast.error(data.error || "Wystąpił błąd podczas rejestracji");
        toast.error("1!" + data.error || "Wystąpił błąd podczas rejestracji");
        setIsLoading(false);
        return;
      }

      // Success
      setIsSuccess(true);
      setSuccessMessage(data.message || "Rejestracja zakończona pomyślnie");
      toast.success(data.message || "Rejestracja zakończona pomyślnie");
      setIsLoading(false);
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

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md" data-testid="register-success-card">
        <CardHeader>
          <CardTitle data-testid="register-success-title">Rejestracja pomyślna!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert data-testid="register-success-alert">
            <AlertTitle data-testid="register-success-alert-title">✓ Konto utworzone</AlertTitle>
            <AlertDescription data-testid="register-success-alert-description">{successMessage}</AlertDescription>
          </Alert>
          <p className="text-center text-sm text-gray-600">
            <a href="/auth/login" className="font-semibold text-blue-600 hover:underline">
              Przejdź do logowania →
            </a>
          </p>
        </CardContent>
      </Card>
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
          {/* Display API error alert */}
          {error?.type === "api" && error.message && (
            <Alert variant="destructive" data-testid="register-error-alert">
              <AlertDescription data-testid="register-error-message">{error.message}</AlertDescription>
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
            {getFieldError("email") && (
              <p className="text-sm text-red-500" data-testid="register-field-error-email">
                {getFieldError("email")}
              </p>
            )}
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
            {getFieldError("password") && (
              <p className="text-sm text-red-500" data-testid="register-field-error-password">
                {getFieldError("password")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            {getFieldError("confirmPassword") && (
              <p className="text-sm text-red-500" data-testid="register-field-error-confirmPassword">
                {getFieldError("confirmPassword")}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Rejestrowanie..." : "Zarejestruj się"}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Masz już konto?{" "}
            <a href="/auth/login" className="font-semibold text-blue-600 hover:underline">
              Zaloguj się
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
