# API Endpoint Implementation Plan: POST /notes/{noteId}/quizzes

## 1. Przegląd punktu końcowego

Ten punkt końcowy jest odpowiedzialny za generowanie nowego quizu na podstawie treści istniejącej notatki. Wykorzystuje zewnętrzną usługę AI (Openrouter.ai) do tworzenia pytań i odpowiedzi. Po pomyślnym wygenerowaniu, quiz jest zapisywany w bazie danych ze statusem `pending_acceptance`, co pozwala użytkownikowi na jego przejrzenie i akceptację przed udostępnieniem.

## 2. Szczegóły żądania

- **Metoda HTTP:** `POST`
- **Struktura URL:** `/api/notes/{noteId}/quizzes`
- **Parametry:**
  - **Wymagane:**
    - `noteId` (w ścieżce URL): Identyfikator UUID notatki, dla której ma zostać wygenerowany quiz.
  - **Opcjonalne:** Brak.
- **Request Body:** Puste.

## 3. Wykorzystywane typy

Do implementacji tego punktu końcowego zostaną wykorzystane następujące DTO (Data Transfer Objects) i modele.

- **QuizGenerationParams (Walidacja Zod):**

  ```typescript
  import { z } from "zod";

  export const QuizGenerationParams = z.object({
    noteId: z.string().uuid(),
  });
  ```

- **QuizGenerationResponseDto (Odpowiedź API):**

  ```typescript
  // Definicje typów dla odpowiedzi API
  // src/types.ts

  export interface QuizAnswerDto {
    id: string;
    content: string;
  }

  export interface QuizQuestionDto {
    id: string;
    type: "true_false" | "multiple_choice" | "short_answer";
    content: string;
    question_order: number;
    answers?: QuizAnswerDto[]; // Występuje tylko dla pytań typu 'multiple_choice'
  }

  export interface QuizGenerationResponseDto {
    id: string;
    note_id: string;
    status: "pending_acceptance";
    created_at: string;
    questions: QuizQuestionDto[];
  }
  ```

## 4. Szczegóły odpowiedzi

- **Pomyślna odpowiedź (`201 Created`):**
  - **Content-Type:** `application/json`
  - **Body:** Obiekt `QuizGenerationResponseDto` zawierający nowo utworzony quiz z zagnieżdżonymi pytaniami i odpowiedziami.
- **Odpowiedzi błędów:**
  - `400 Bad Request`: Nieprawidłowy format `noteId` lub treść notatki jest niewystarczająca.
  - `401 Unauthorized`: Użytkownik nie jest zalogowany.
  - `402 Payment Required`: Użytkownik wyczerpał darmowe próby generowania quizu i nie skonfigurował klucza API.
  - `404 Not Found`: Notatka o podanym `noteId` nie istnieje lub nie należy do zalogowanego użytkownika.
  - `503 Service Unavailable`: Wystąpił błąd podczas komunikacji z zewnętrzną usługą AI.

## 5. Przepływ danych

1.  Żądanie `POST` trafia do endpointu Astro `/src/pages/api/notes/[noteId]/quizzes.ts`.
2.  Middleware Astro weryfikuje token JWT użytkownika i dołącza sesję do `context.locals`.
3.  Handler endpointu waliduje parametr `noteId` przy użyciu schematu Zod.
4.  Handler wywołuje metodę `generateQuizForNote` z nowo utworzonego serwisu `QuizGenerationService` (`src/lib/services/quiz.service.ts`), przekazując `noteId`, `userId` (z `context.locals.user.id`) oraz instancję klienta Supabase (`context.locals.supabase`).
5.  `QuizGenerationService` wykonuje następujące operacje:
    a. Pobiera notatkę z bazy danych, weryfikując, czy należy do użytkownika.
    b. Pobiera profil użytkownika w celu sprawdzenia `free_quizzes_remaining` i `encrypted_api_key`.
    c. Decyduje, czy użyć klucza API użytkownika (wymaga odszyfrowania, np. przez funkcję brzegową Supabase), czy domyślnego klucza aplikacji. Jeśli używany jest klucz domyślny, sprawdza limit darmowych quizów.
    d. Tworzy prompt dla modelu AI na podstawie treści notatki.
    e. Wysyła żądanie do usługi Openrouter.ai.
    f. Przetwarza i waliduje odpowiedź JSON od AI.
    g. W ramach jednej transakcji bazodanowej:
    i. Zapisuje nowy rekord w tabeli `quizzes`.
    ii. Zapisuje pytania w tabeli `questions`.
    iii. Zapisuje odpowiedzi w tabeli `answers`.
    iv. Jeśli to konieczne, dekrementuje licznik `free_quizzes_remaining` w tabeli `profiles`.
    h. Zwraca nowo utworzone dane quizu do handlera.
6.  Handler endpointu formatuje dane do postaci `QuizGenerationResponseDto` i wysyła odpowiedź `201 Created` z serializowanym obiektem JSON.

## 6. Względy bezpieczeństwa

- **Autoryzacja:** Wszystkie zapytania do bazy danych w `QuizGenerationService` muszą zawierać warunek `where('user_id', '=', userId)`, aby uniemożliwić dostęp do danych innych użytkowników. Polegamy również na politykach RLS (Row-Level Security) w Supabase jako drugiej linii obrony.
- **Zarządzanie kluczami API:** Klucz API użytkownika jest przechowywany w formie zaszyfrowanej. Proces jego użycia (odszyfrowanie) powinien być zrealizowany w bezpiecznym środowisku, np. w funkcji brzegowej Supabase (Edge Function), aby uniknąć jego ekspozycji.
- **Ochrona przed DoS:** Endpoint jest kosztowny obliczeniowo. Ograniczenie liczby darmowych prób i wymóg własnego klucza API działają jako mechanizm ograniczający nadużycia. W razie potrzeby można dodać globalne rate limiting na poziomie middleware.
- **Prompt Injection:** Prompt wysyłany do AI musi być starannie skonstruowany, aby oddzielić instrukcje systemowe od treści dostarczonej przez użytkownika, minimalizując ryzyko manipulacji modelem.

## 7. Obsługa błędów

- Błędy walidacji Zod w handlerze API zwracają `400 Bad Request` z komunikatem o błędzie.
- Błędy biznesowe (np. brak notatki, brak darmowych quizów) rzucane z serwisu są łapane w handlerze i mapowane na odpowiednie kody statusu HTTP (`404`, `402`).
- Błędy komunikacji z usługą AI są łapane i zwracają `503 Service Unavailable`.
- Wszystkie nieoczekiwane błędy (np. błędy bazy danych) są logowane na serwerze i zwracają generyczny błąd `500 Internal Server Error`.

## 8. Rozważania dotyczące wydajności

- Głównym wąskim gardłem wydajnościowym jest czas odpowiedzi zewnętrznej usługi AI. Proces jest asynchroniczny i jego czas wykonania jest poza naszą bezpośrednią kontrolą.
- Operacje na bazie danych powinny być zoptymalizowane i wykonywane w ramach jednej transakcji, aby zapewnić spójność danych i zminimalizować liczbę zapytań.

## 9. Etapy wdrożenia

1.  **Typy:** Zdefiniować typy `QuizAnswerDto`, `QuizQuestionDto` i `QuizGenerationResponseDto` w pliku `src/types.ts`.
2.  **Serwis:** Utworzyć plik `src/lib/services/quiz.service.ts`. Zaimplementować w nim klasę `QuizGenerationService` z metodą `generateQuizForNote`, zawierającą całą logikę biznesową (pobieranie danych, komunikacja z AI, transakcje bazodanowe).
3.  **Endpoint API:** Utworzyć plik `src/pages/api/notes/[noteId]/quizzes.ts`.
4.  **Implementacja Handlera:** W pliku endpointu zaimplementować handler `POST`, który:
    a. Używa `context.locals` do uzyskania dostępu do sesji użytkownika i klienta Supabase.
    b. Waliduje `noteId` przy użyciu Zod.
    c. Wywołuje serwis `QuizGenerationService`.
    d. Obsługuje błędy i zwraca odpowiednie odpowiedzi HTTP.
5.  **Zmienne środowiskowe:** Dodać domyślny klucz API do Openrouter.ai i jego adres URL do zmiennych środowiskowych.
6.  **Testy:** (Opcjonalnie) Dodać testy jednostkowe dla serwisu, mockując klienta Supabase i usługę AI.
7.  **Dokumentacja:** Zaktualizować dokumentację API, jeśli istniejące narzędzia (np. Swagger) tego nie robią automatycznie.
