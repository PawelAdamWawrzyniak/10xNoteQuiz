# API Endpoint Implementation Plan: /notes

## 1. Przegląd punktu końcowego

Ten dokument opisuje plan wdrożenia interfejsu API REST dla zasobu `notes`. Endpointy te umożliwią pełen zakres operacji CRUD (Create, Read, Update, Delete) na notatkach użytkownika, zapewniając jednocześnie bezpieczeństwo i walidację danych.

## 2. Szczegóły żądania

### `GET /api/notes`

- **Metoda HTTP**: `GET`
- **Struktura URL**: `/api/notes`
- **Parametry Query (opcjonalne)**:
  - `page: number` (domyślnie: 1)
  - `page_size: number` (domyślnie: 20)
  - `sort_by: string` (np. "updated_at")
  - `order: 'asc' | 'desc'` (domyślnie: "desc")
  - `category_id: string` (UUID)
  - `tag_id: string` (UUID)
- **Request Body**: Brak

### `POST /api/notes`

- **Metoda HTTP**: `POST`
- **Struktura URL**: `/api/notes`
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "category_id": "string | null", // UUID
    "tag_ids": ["string"] // Array of UUIDs
  }
  ```

### `GET /api/notes/{noteId}`

- **Metoda HTTP**: `GET`
- **Struktura URL**: `/api/notes/{noteId}`
- **Parametry Path (wymagane)**:
  - `noteId: string` (UUID)
- **Request Body**: Brak

### `PATCH /api/notes/{noteId}`

- **Metoda HTTP**: `PATCH`
- **Struktura URL**: `/api/notes/{noteId}`
- **Parametry Path (wymagane)**:
  - `noteId: string` (UUID)
- **Request Body** (wszystkie pola opcjonalne):
  ```json
  {
    "title": "string",
    "content": "string",
    "category_id": "string | null", // UUID
    "tag_ids": ["string"] // Array of UUIDs
  }
  ```

### `DELETE /api/notes/{noteId}`

- **Metoda HTTP**: `DELETE`
- **Struktura URL**: `/api/notes/{noteId}`
- **Parametry Path (wymagane)**:
  - `noteId: string` (UUID)
- **Request Body**: Brak

## 3. Wykorzystywane typy

W pliku `src/types.ts` zostaną zdefiniowane lub zaktualizowane następujące typy:

- **`NoteListItemDto`**: Reprezentacja notatki na liście (dla `GET /api/notes`).
  ```typescript
  export interface NoteListItemDto {
    id: string;
    title: string;
    category_id: string | null;
    created_at: string;
    updated_at: string;
  }
  ```
- **`PaginatedResponseDto<T>`**: Generyczna struktura odpowiedzi dla list z paginacją.

  ```typescript
  export interface PaginationDto {
    current_page: number;
    total_pages: number;
    total_items: number;
  }

  export interface PaginatedResponseDto<T> {
    data: T[];
    pagination: PaginationDto;
  }
  ```

- **`NoteDetailsDto`** (istniejący): Używany dla odpowiedzi `GET /api/notes/{noteId}`, `POST` i `PATCH`.

## 4. Przepływ danych

1.  **Żądanie**: Żądanie HTTP trafia do odpowiedniego endpointu Astro w `src/pages/api/notes/`.
2.  **Middleware**: Middleware Astro (`src/middleware/index.ts`) weryfikuje token JWT. Jeśli jest nieprawidłowy, zwraca `401 Unauthorized`. W przeciwnym razie, dołącza dane użytkownika do `context.locals`.
3.  **Walidacja**: Endpoint używa biblioteki `zod` do walidacji parametrów ścieżki, query i ciała żądania. W przypadku błędu zwraca `400 Bad Request`.
4.  **Serwis**: Endpoint wywołuje odpowiednią metodę z `NotesService` (`src/lib/services/notes.service.ts`), przekazując zweryfikowane dane oraz `userId` z `context.locals`.
5.  **Baza danych**: `NotesService` wykonuje operacje na bazie danych Supabase, korzystając z klienta Supabase. Wszystkie zapytania zawierają warunek `user_id = ?`, aby zapewnić izolację danych użytkownika. Operacje zapisu (create, update) na notatkach i tagach są wykonywane transakcyjnie.
6.  **Odpowiedź**: Serwis zwraca dane (lub informację o sukcesie) do endpointu, który następnie formatuje odpowiedź HTTP (np. `200 OK`, `201 Created`, `204 No Content`) i wysyła ją do klienta.

## 5. Względy bezpieczeństwa

- **Uwierzytelnianie**: Wszystkie endpointy będą chronione. Dostęp będzie możliwy tylko po podaniu prawidłowego tokenu JWT w nagłówku `Authorization: Bearer <token>`.
- **Autoryzacja**: Każde zapytanie do bazy danych będzie ściśle powiązane z `user_id` zalogowanego użytkownika. Próba dostępu do zasobu nienależącego do użytkownika zwróci błąd `404 Not Found`, aby nie ujawniać istnienia zasobu.
- **Walidacja danych wejściowych**: Rygorystyczna walidacja za pomocą `zod` zapobiegnie atakom typu injection i zapewni spójność danych.
- **Cross-Site Scripting (XSS)**: Zespół frontendowy musi zostać poinformowany o konieczności sanitazyzacji pola `content` (Markdown) przed jego renderowaniem, aby zapobiec atakom XSS.

## 6. Obsługa błędów

- **`400 Bad Request`**: Zwracany w przypadku nieudanej walidacji `zod`. Odpowiedź będzie zawierać szczegóły dotyczące błędów walidacji.
- **`401 Unauthorized`**: Zwracany przez middleware, gdy użytkownik nie jest uwierzytelniony.
- **`404 Not Found`**: Zwracany, gdy żądany zasób (`note`, `category`, `tag`) nie zostanie znaleziony lub nie należy do użytkownika.
- **`500 Internal Server Error`**: Zwracany w przypadku nieoczekiwanych błędów po stronie serwera (np. problem z połączeniem z bazą danych). Błąd zostanie zalogowany na konsoli serwera.

## 7. Rozważania dotyczące wydajności

- **Paginacja**: `GET /api/notes` musi zawsze używać paginacji, aby uniknąć przesyłania dużych ilości danych.
- **Indeksy**: Należy upewnić się, że w bazie danych istnieją odpowiednie indeksy na kolumnach używanych do filtrowania i sortowania (`user_id`, `category_id`, `updated_at`).
- **N+1 Query Problem**: Podczas pobierania tagów dla notatek należy unikać problemu N+1. Serwis powinien pobierać wszystkie powiązane tagi w jednym lub dwóch zapytaniach, a nie w pętli.

## 8. Etapy wdrożenia

1.  **Aktualizacja typów**: Zdefiniować brakujące typy DTO (`NoteListItemDto`, `PaginatedResponseDto`) w pliku `src/types.ts`.
2.  **Schematy walidacji**: Stworzyć plik `src/lib/schemas/note.schemas.ts` zawierający wszystkie schematy `zod` do walidacji (`GetNotesQuerySchema`, `CreateNoteSchema`, `UpdateNoteSchema`, `NotePathParamsSchema`).
3.  **Rozbudowa `NotesService`**: Zaimplementować wszystkie wymagane metody w `src/lib/services/notes.service.ts`, hermetyzując logikę interakcji z Supabase.
4.  **Implementacja `GET /api/notes`**: Stworzyć plik `src/pages/api/notes/index.ts` obsługujący metodę `GET` z walidacją, paginacją, sortowaniem i filtrowaniem.
5.  **Implementacja `POST /api/notes`**: W tym samym pliku (`src/pages/api/notes/index.ts`) dodać obsługę metody `POST` do tworzenia notatek.
6.  **Implementacja `GET /api/notes/{noteId}`**: Stworzyć plik `src/pages/api/notes/[noteId].ts` i zaimplementować w nim obsługę metody `GET` do pobierania pojedynczej notatki.
7.  **Implementacja `PATCH /api/notes/{noteId}`**: W tym samym pliku dodać obsługę metody `PATCH` do aktualizacji notatek.
8.  **Implementacja `DELETE /api/notes/{noteId}`**: W tym samym pliku dodać obsługę metody `DELETE` do usuwania notatek.
9.  **Testy i dokumentacja**: Przeprowadzić testy manualne każdego endpointu. Zaktualizować dokumentację API (np. w Postmanie), jeśli jest to wymagane.
