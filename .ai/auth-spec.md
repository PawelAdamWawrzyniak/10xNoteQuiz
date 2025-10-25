# Specyfikacja Techniczna Modułu Autentykacji

## 1. Architektura Interfejsu Użytkownika

### 1.1 Nowe strony (Astro)

- **`/auth/login`**: Strona logowania, publicznie dostępna. Będzie renderować komponent React `LoginForm` po stronie klienta.
- **`/auth/register`**: Strona rejestracji, publicznie dostępna. Będzie renderować komponent React `RegisterForm`.
- **`/auth/callback`**: Strona (endpoint) obsługująca callback od Supabase po pomyślnej autentykacji (np. po potwierdzeniu e-maila). Ta strona będzie odpowiedzialna za finalizację sesji i przekierowanie użytkownika do panelu głównego.

### 1.2 Nowe komponenty (React)

- **`LoginForm.tsx` (`src/components/LoginForm.tsx`)**:
  - Będzie zawierać formularz z polami na `email` i `password`.
  - Stan formularza będzie zarządzany lokalnie (np. za pomocą hooka `useState`).
  - Walidacja po stronie klienta będzie realizowana przy użyciu biblioteki `zod` w celu zapewnienia natychmiastowego feedbacku dla użytkownika.
  - Po wysłaniu formularza, komponent będzie komunikował się z naszym backendowym endpointem API (`/api/auth/login`).
  - Będzie obsługiwać i wyświetlać błędy zwrócone z API (np. "Nieprawidłowy e-mail lub hasło").
  - Po pomyślnym zalogowaniu, nastąpi przekierowanie do strony głównej (`/notes`).

- **`RegisterForm.tsx` (`src/components/RegisterForm.tsx`)**:
  - Będzie zawierać formularz z polami `email`, `password` i `confirmPassword`.
  - Podobnie jak `LoginForm`, będzie używać `useState` i `zod` do zarządzania stanem i walidacji (sprawdzanie formatu e-maila, zgodności haseł).
  - Będzie komunikować się z endpointem `/api/auth/register`.
  - Obsłuży błędy, takie jak "Użytkownik o tym adresie e-mail już istnieje".
  - Po pomyślnej rejestracji, wyświetli komunikat informujący o konieczności potwierdzenia adresu e-mail w celu aktywacji konta. Użytkownik zostanie przekierowany na stronę logowania lub stronę informacyjną.

- **`UserSettingsForm.tsx` (`src/components/UserSettingsForm.tsx`)**:
  - Komponent dostępny na nowej stronie `/settings`.
  - Umożliwi użytkownikowi wprowadzenie i zaktualizowanie swojego klucza API do modelu AI.
  - Będzie komunikował się z endpointem `/api/user/settings` w celu zapisania klucza.
  - Wyświetli informację o statusie zapisu klucza.

### 1.3 Modyfikacja istniejących komponentów i layoutów

- **`AppLayout.tsx` (`src/layouts/AppLayout.tsx`)**:
  - Ten layout zostanie rozszerzony o logikę warunkowego renderowania w zależności od stanu autentykacji użytkownika.
  - **Stan `non-auth`**: Na stronach publicznych (np. `/login`, `/register`) layout nie będzie wyświetlał elementów przeznaczonych dla zalogowanych użytkowników.
  - **Stan `auth`**: W głównym widoku aplikacji (np. `/notes`) layout będzie wyświetlał:
    - Nazwę zalogowanego użytkownika (adres e-mail).
    - Link do strony `/settings`.
    - Przycisk "Wyloguj".
- **`ProfileToolbar.tsx`**:
  - Należy dodać do niego przycisk "Wyloguj", który będzie widoczny tylko dla zalogowanych użytkowników. Kliknięcie przycisku wywoła endpoint `/api/auth/logout`.

### 1.4 Nowe strony (Astro)

- **`/settings`**: Strona ustawień konta, dostępna tylko dla zalogowanych użytkowników. Będzie renderować komponent React `UserSettingsForm`.

**Uwaga**: Strony główne (`/`) pozostają publiczne i dostępne bez logowania.

### 1.5 Scenariusze i obsługa błędów

- **Walidacja formularzy**: Komunikaty o błędach będą wyświetlane pod odpowiednimi polami formularza (np. "Nieprawidłowy format e-maila", "Hasła nie są zgodne", "Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną dużą i jedną małą literę").
- **Błędy API**: Błędy serwera (np. nieudane logowanie, istniejący użytkownik) będą wyświetlane jako:
  - Ogólny komunikat dla całego formularza przy użyciu komponentu `Alert` z `shadcn/ui`
  - Toast notifications przy użyciu komponentu `Sonner` dla natychmiastowego feedbacku
- **Nawigacja**:
  - Niezalogowany użytkownik próbujący uzyskać dostęp do chronionej strony (np. `/notes`) zostanie automatycznie przekierowany na stronę `/auth/login`.
  - Strona główna `/` pozostaje publiczna i nie wymaga logowania.

## 2. Logika Backendowa

### 2.1 Struktura endpointów API (Astro)

Nowe endpointy zostaną utworzone w katalogu `src/pages/api/`:

- **`POST /api/auth/login.ts`**:
  - Przyjmuje `email` i `password` w ciele żądania.
  - Waliduje dane wejściowe przy użyciu `zod`.
  - Wykorzystuje `supabase.auth.signInWithPassword()` do próby zalogowania użytkownika.
  - W przypadku sukcesu, zwraca odpowiedź `200 OK`. Sesja (ciasteczko) jest zarządzana automatycznie przez Supabase Auth Helpers.
  - W przypadku błędu, zwraca odpowiedni kod statusu (np. `401 Unauthorized`) wraz z komunikatem błędu.

- **`POST /api/auth/register.ts`**:
  - Przyjmuje `email` i `password` w ciele żądania.
  - Waliduje dane.
  - Wywołuje `supabase.auth.signUp()` w celu utworzenia nowego konta. Supabase automatycznie wyśle e-mail weryfikacyjny.
  - Zwraca `200 OK` w przypadku sukcesu.
  - Zwraca `409 Conflict` jeśli użytkownik już istnieje.

- **`POST /api/auth/logout.ts`**:
  - Nie przyjmuje żadnych danych.
  - Wywołuje `supabase.auth.signOut()`.
  - Zwraca `200 OK` i usuwa ciasteczko sesji.

- **`POST /api/user/settings.ts`**:
  - Dostępny tylko dla zalogowanych użytkowników (weryfikacja w middleware lub na początku endpointu).
  - Przyjmuje `apiKey` w ciele żądania.
  - Szyfruje klucz API przed zapisaniem do bazy danych.
  - Zapisuje zaszyfrowany klucz w tabeli `profiles` powiązanej z ID użytkownika.
  - Zwraca `200 OK`.

- **`GET /api/user/settings.ts`**:
  - Dostępny tylko dla zalogowanych użytkowników.
  - Pobiera ustawienia użytkownika z tabeli `profiles`.
  - Zwraca dane w formie `JSON`. Klucz API nie jest zwracany, jedynie informacja o jego istnieniu (`hasApiKey: true/false`).

### 2.2 Walidacja i modele danych

W `src/lib/schemas/auth.schemas.ts` zostaną zdefiniowane schematy `zod` do walidacji danych wejściowych dla logowania i rejestracji.

```typescript
// src/lib/schemas/auth.schemas.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/(?=.*[a-z])/, "Hasło musi zawierać co najmniej jedną małą literę")
      .regex(/(?=.*[A-Z])/, "Hasło musi zawierać co najmniej jedną dużą literę"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są zgodne",
    path: ["confirmPassword"], // ścieżka do pola, przy którym wyświetli się błąd
  });

export const UserSettingsSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
});
```

### 2.3 Aktualizacja renderowania

Nie ma potrzeby zmiany sposobu renderowania aplikacji w `astro.config.mjs`, ponieważ tryb `server` z adapterem `standalone` jest już odpowiednio skonfigurowany do obsługi logiki po stronie serwera i middleware.

## 3. System Autentykacji

### 3.1 Integracja z Supabase Auth

- **Konfiguracja**: Klucze Supabase (`SUPABASE_URL` i `SUPABASE_KEY`) będą przechowywane jako zmienne środowiskowe. W projekcie używamy **dual-client approach**:
  - **Regular Client** (`supabaseClient`) z `@supabase/supabase-js` - dla operacji bazodanowych z Row Level Security
  - **SSR Client** (`createSupabaseServerInstance`) z `@supabase/ssr` - dla operacji autentykacji

- **Middleware**: Głównym mechanizmem zabezpieczającym aplikację będzie middleware Astro zlokalizowany w `src/middleware/index.ts`.
  - Middleware będzie uruchamiany dla każdego żądania.
  - Sprawdzi, czy użytkownik próbuje uzyskać dostęp do chronionej ścieżki (np. wszystko poza `/`, `/auth/login`, `/auth/register`, `/api/auth/**`).
  - Użyje SSR client z metodą `auth.getUser()` do weryfikacji istnienia aktywnej sesji użytkownika na podstawie ciasteczka.
  - Jeśli sesja nie istnieje, a ścieżka jest chroniona, użytkownik zostanie przekierowany do `/auth/login`.
  - Informacje o zalogowanym użytkowniku (`user.id`, `user.email`) będą przekazywane do `Astro.locals` w celu umożliwienia dostępu do nich w komponentach Astro i endpointach API.
  - Regular client jest przekazywany do `locals.supabase` dla operacji bazodanowych.

- **Zarządzanie sesją**: Biblioteka `@supabase/ssr` automatycznie zarządza sesją za pomocą bezpiecznych, serwerowych ciasteczek (`httpOnly`, `secure`, `sameSite: 'lax'`). Nie ma potrzeby ręcznego zarządzania tokenami JWT po stronie klienta.

- **Logika wyboru klucza API**: Logika biznesowa odpowiedzialna za generowanie quizów musi zostać zaktualizowana. Przed wysłaniem zapytania do AI, system sprawdzi, czy użytkownik ma zapisany własny klucz API. Jeśli tak, użyje go. W przeciwnym razie, użyje domyślnego klucza systemowego, informując o tym użytkownika.

## 4. Schemat Bazy Danych

W celu obsługi nowych funkcjonalności, konieczne jest rozszerzenie schematu bazy danych o nową tabelę.

### 4.1 Tabela `profiles`

Tabela `profiles` będzie przechowywać dane specyficzne dla użytkownika, które nie mieszczą się w domyślnej tabeli `auth.users` od Supabase.

- **Kolumny**:
  - `id` (UUID, klucz główny, referencja do `auth.users.id`): Zapewnia połączenie 1-do-1 z użytkownikiem w systemie autentykacji.
  - `encrypted_api_key` (TEXT, nullable): Przechowuje zaszyfrowany klucz API użytkownika.
  - `created_at` (TIMESTAMP WITH TIME ZONE): Data utworzenia profilu.
  - `updated_at` (TIMESTAMP WITH TIME ZONE): Data ostatniej modyfikacji profilu.

- **Zabezpieczenia**: Należy zaimplementować Row Level Security (RLS) dla tabeli `profiles`, aby zapewnić, że każdy użytkownik ma dostęp (do odczytu i zapisu) wyłącznie do swojego własnego wiersza.
