<architecture_analysis>

1.  **Komponenty:**
    - **Strony Astro (Nowe):** `/login`, `/register`, `/settings`, `/auth/callback`.
    - **Komponenty React (Nowe):** `LoginForm.tsx`, `RegisterForm.tsx`, `UserSettingsForm.tsx`.
    - **Layout (Modyfikowany):** `AppLayout.tsx` (logika warunkowa auth/non-auth).
    - **Komponent (Modyfikowany):** `ProfileToolbar.tsx` (dodany przycisk wylogowania).
    - **Endpointy API (Nowe):** `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/user/settings`.

2.  **Strony i ich komponenty:**
    - Strona `/login` renderuje `LoginForm.tsx`.
    - Strona `/register` renderuje `RegisterForm.tsx`.
    - Strona `/settings` renderuje `UserSettingsForm.tsx`.
    - Wszystkie strony aplikacji są owinięte w `Layout.astro`, który z kolei używa `AppLayout.tsx`.

3.  **Przepływ danych:**
    - Formularze (`LoginForm`, `RegisterForm`) wysyłają dane (e-mail, hasło) do odpowiednich endpointów API.
    - Endpointy API komunikują się z Supabase Auth.
    - Middleware odczytuje stan sesji i przekazuje informacje o użytkowniku do `Astro.locals`.
    - `AppLayout.tsx` odczytuje dane użytkownika z `Astro.locals` (przekazane z `Layout.astro`) w celu warunkowego renderowania elementów UI (np. przycisk Wyloguj).
    - `UserSettingsForm.tsx` wysyła klucz API do endpointu `/api/user/settings`.

4.  **Funkcjonalność komponentów:**
    _ **`LoginForm.tsx`:** Formularz logowania z walidacją `zod`, obsługą błędów i komunikacją z API.
    _ **`RegisterForm.tsx`:** Formularz rejestracji z walidacją `zod`, obsługą błędów i komunikacją z API.
    _ **`UserSettingsForm.tsx`:** Formularz do zarządzania kluczem API.
    _ **`AppLayout.tsx`:** Główny layout aplikacji, dostosowujący widok w zależności od stanu zalogowania.
    </architecture_analysis>

<mermaid_diagram>

```mermaid
flowchart TD
    subgraph "Strony (Astro)"
        direction LR
        P_Login["/login"]
        P_Register["/register"]
        P_Settings["/settings"]
        P_Notes["/notes"]
    end

    subgraph "Komponenty (React)"
        C_LoginForm["LoginForm.tsx"]
        C_RegisterForm["RegisterForm.tsx"]
        C_UserSettingsForm["UserSettingsForm.tsx"]
        C_AppLayout["AppLayout.tsx (Modyfikowany)"]
    end

    subgraph "Logika Biznesowa"
        L_Middleware["Middleware"]
        subgraph "API Endpoints"
            A_Login["POST /api/auth/login"]
            A_Register["POST /api/auth/register"]
            A_Logout["POST /api/auth/logout"]
            A_Settings["POST /api/user/settings"]
        end
    end

    subgraph "Usługi Zewnętrzne"
        S_SupabaseAuth["Supabase Auth"]
        S_Database["Baza Danych (Profiles)"]
    end

    P_Login --> C_LoginForm
    P_Register --> C_RegisterForm
    P_Settings --> C_UserSettingsForm

    C_LoginForm -- "Dane logowania" --> A_Login
    C_RegisterForm -- "Dane rejestracyjne" --> A_Register
    C_UserSettingsForm -- "Klucz API" --> A_Settings

    L_Middleware -- "Weryfikacja sesji" --> S_SupabaseAuth
    A_Login --> S_SupabaseAuth
    A_Register --> S_SupabaseAuth
    A_Logout --> S_SupabaseAuth
    A_Settings -- "Zapis klucza" --> S_Database

    P_Login & P_Register & P_Settings & P_Notes -- "Renderowanie" --> C_AppLayout
    C_AppLayout -- "Odczyt `Astro.locals.user`" --> L_Middleware

    classDef modified fill:#FFDDC1,stroke:#333,stroke-width:2px,color:#000;
    class C_AppLayout modified;

```

</mermaid_diagram>
