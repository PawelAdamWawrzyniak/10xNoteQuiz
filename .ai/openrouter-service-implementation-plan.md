# Przewodnik Implementacji Usługi OpenRouter

## 1. Opis Usługi

`OpenRouterService` będzie hermetyzować logikę interakcji z API OpenRouter. Jej głównym zadaniem jest wysyłanie zapytań do modeli językowych (LLM) i przetwarzanie ich odpowiedzi, ze szczególnym uwzględnieniem odpowiedzi w ustrukturyzowanym formacie JSON. Usługa będzie działać po stronie serwera (w ramach Astro API routes) w celu bezpiecznego zarządzania kluczem API.

Będzie ona kluczowym elementem dla funkcji opartych na AI, takich jak generowanie quizów na podstawie notatek.

## 2. Opis Konstruktora

Konstruktor `OpenRouterService` będzie odpowiedzialny za inicjalizację usługi i weryfikację konfiguracji.

```typescript
// Proponowana lokalizacja: src/lib/services/openrouter.service.ts

interface OpenRouterServiceConfig {
  apiKey?: string;
  baseUrl?: string;
}

export class OpenRouterService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: OpenRouterServiceConfig = {}) {
    this.apiKey = config.apiKey ?? import.meta.env.OPENROUTER_API_KEY;
    this.baseUrl = config.baseUrl ?? "https://openrouter.ai/api/v1";

    if (!this.apiKey) {
      // Błąd krytyczny, aplikacja nie może kontynuować bez klucza
      console.error("OpenRouter API key is not configured.");
      throw new Error("OpenRouter API key is not configured. Please set OPENROUTER_API_KEY environment variable.");
    }
  }

  // ... metody
}
```

- **Parametry**:
  - `config` (opcjonalny): Obiekt konfiguracyjny pozwalający na nadpisanie domyślnych wartości, przydatny w testach.
    - `apiKey` (string): Klucz API OpenRouter. Domyślnie pobierany ze zmiennej środowiskowej `OPENROUTER_API_KEY`.
    - `baseUrl` (string): Adres URL API. Domyślnie `https://openrouter.ai/api/v1`.
- **Logika**:
  1. Przypisuje klucz API i bazowy URL, korzystając z wartości domyślnych ze zmiennych środowiskowych.
  2. Sprawdza, czy klucz API jest dostępny. Jeśli nie, zgłasza błąd krytyczny, aby zapobiec dalszemu działaniu usługi bez autoryzacji.

## 3. Publiczne Metody i Pola

### `public async getChatCompletion<T>(options: ChatCompletionOptions): Promise<T>`

Główna metoda usługi, która wysyła zapytanie do modelu i zwraca odpowiedź sparsowaną do oczekiwanego typu `T`.

- **Parametry**:
  - `options`: Obiekt `ChatCompletionOptions` zawierający wszystkie niezbędne informacje do zbudowania zapytania.

    ```typescript
    // Proponowana lokalizacja: src/types.ts
    import { JSONSchema } from "json-schema-to-ts";

    export interface ChatCompletionOptions {
      model: string;
      systemPrompt: string;
      userPrompt: string;
      responseSchema?: {
        name: string;
        schema: JSONSchema;
      };
      temperature?: number;
      maxTokens?: number;
    }
    ```

- **Zwraca**: `Promise<T>`, gdzie `T` to typ danych zgodny z dostarczonym `responseSchema`. Jeśli `responseSchema` nie jest podane, `T` będzie domyślnie `string`.
- **Przykład użycia**:

  ```typescript
  // w pliku src/pages/api/notes/[noteId]/quizzes.ts
  import { quizSchema } from "./_schema"; // Załóżmy, że schemat jest zdefiniowany
  import { type Quiz } from "@/types";

  const openRouter = new OpenRouterService();

  const quiz: Quiz = await openRouter.getChatCompletion<Quiz>({
    model: "anthropic/claude-3-haiku",
    systemPrompt: "Jesteś asystentem, który tworzy quizy. Odpowiadaj zawsze w formacie JSON.",
    userPrompt: `Wygeneruj quiz z 3 pytaniami na podstawie tej notatki: ${noteContent}`,
    responseSchema: {
      name: "create_quiz",
      schema: quizSchema,
    },
    temperature: 0.5,
  });
  ```

## 4. Prywatne Metody i Pola

### `private buildRequestBody(options: ChatCompletionOptions): Record<string, any>`

Metoda pomocnicza do budowania ciała zapytania HTTP na podstawie opcji.

- **Logika**:
  1. Tworzy tablicę `messages` z `systemPrompt` i `userPrompt`.
  2. Buduje obiekt `response_format`, jeśli `responseSchema` zostało dostarczone.
  3. Składa finalny obiekt zapytania, uwzględniając model, wiadomości i opcjonalne parametry.

### `private async executeRequest<T>(requestBody: Record<string, any>): Promise<ApiResponse>`

Metoda odpowiedzialna za wykonanie zapytania `fetch` do API OpenRouter.

- **Logika**:
  1. Ustawia nagłówki `Authorization`, `Content-Type` oraz `HTTP-Referer`.
  2. Wykonuje zapytanie `POST` na endpoint `/chat/completions`.
  3. Sprawdza status odpowiedzi HTTP. W przypadku błędu (np. 401, 429, 500), rzuca odpowiedni customowy błąd.
  4. Zwraca odpowiedź w formacie JSON.

### `private parseResponse<T>(apiResponse: ApiResponse, schema?: JSONSchema): T`

Metoda do parsowania i walidacji odpowiedzi z API.

- **Logika**:
  1. Wyodrębnia treść odpowiedzi z `apiResponse.choices[0].message.content`.
  2. Jeśli `schema` jest dostarczona:
     a. Parsuje treść (string) do obiektu JSON.
     b. Waliduje obiekt względem schematu (można użyć biblioteki jak `zod` lub `ajv`). W przypadku błędu walidacji, rzuca `ModelResponseError`.
  3. Zwraca sparsowane i zwalidowane dane.

## 5. Obsługa Błędów

Usługa będzie implementować mechanizm niestandardowych błędów, aby ułatwić ich obsługę w wyższych warstwach aplikacji.

```typescript
// Proponowana lokalizacja: src/lib/services/openrouter.errors.ts
export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AuthenticationError extends OpenRouterError {}
export class RateLimitError extends OpenRouterError {}
export class InvalidRequestError extends OpenRouterError {}
export class ServiceUnavailableError extends OpenRouterError {}
export class ModelResponseError extends OpenRouterError {} // Błąd parsowania/walidacji JSON
```

- **Scenariusze błędów**:
  1. **Błąd Konfiguracji**: Konstruktor rzuca `Error`, jeśli brakuje klucza API.
  2. **Błąd Autoryzacji (401)**: `executeRequest` rzuca `AuthenticationError`.
  3. **Błąd Limitu Zapytań (429)**: `executeRequest` rzuca `RateLimitError`. Można zaimplementować mechanizm ponawiania z "exponential backoff".
  4. **Błąd po stronie serwera (5xx)**: `executeRequest` rzuca `ServiceUnavailableError`.
  5. **Błąd parsowania/walidacji odpowiedzi modelu**: `parseResponse` rzuca `ModelResponseError`, jeśli model nie zwrócił poprawnego JSON-a zgodnego ze schematem.

## 6. Kwestie Bezpieczeństwa

1.  **Klucz API**: Klucz API OpenRouter **nigdy** nie może być eksponowany po stronie klienta. Usługa musi być używana wyłącznie w kodzie serwerowym (Astro API routes). Klucz powinien być przechowywany w zmiennych środowiskowych (`.env`) i dodany do `.gitignore`.
2.  **Walidacja Danych Wejściowych**: Dane wejściowe od użytkownika (`userPrompt`) powinny być sanityzowane, aby uniknąć ataków typu "prompt injection". Należy usunąć lub zneutralizować potencjalnie szkodliwe instrukcje.
3.  **Referer**: Zgodnie z zaleceniami OpenRouter, należy ustawić nagłówek `HTTP-Referer` z adresem URL witryny.

## 7. Plan Wdrożenia Krok po Kroku

### Krok 1: Konfiguracja Zmiennych Środowiskowych

1.  Utwórz plik `.env` w głównym katalogu projektu (jeśli jeszcze nie istnieje).
2.  Dodaj do niego swój klucz API:
    ```
    OPENROUTER_API_KEY="sk-or-v1-..."
    ```
3.  Upewnij się, że plik `.env` jest dodany do `.gitignore`.

### Krok 2: Definicja Typów i Schematów

1.  W pliku `src/types.ts` zdefiniuj interfejs `ChatCompletionOptions` oraz typy dla odpowiedzi, np. `Quiz`.
2.  W odpowiednich endpointach API (np. `src/pages/api/notes/[noteId]/_schema.ts`) zdefiniuj schematy JSON (`JSONSchema`) dla oczekiwanych odpowiedzi. Przykład dla quizu:

    ```typescript
    // src/pages/api/notes/[noteId]/_schema.ts
    import { type JSONSchema } from "json-schema-to-ts";

    export const quizSchema = {
      type: "object",
      properties: {
        title: { type: "string", description: "Tytuł quizu." },
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question_text: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correct_answer: { type: "string" },
            },
            required: ["question_text", "options", "correct_answer"],
          },
        },
      },
      required: ["title", "questions"],
    } as const satisfies JSONSchema;
    ```

### Krok 3: Implementacja Klasy `OpenRouterService`

1.  Utwórz plik `src/lib/services/openrouter.service.ts`.
2.  Zaimplementuj szkielet klasy `OpenRouterService` wraz z konstruktorem, zgodnie z opisem w sekcji 2.
3.  Zaimplementuj metody prywatne: `buildRequestBody`, `executeRequest`, `parseResponse`.
4.  Zaimplementuj publiczną metodę `getChatCompletion`.

**Implementacja `buildRequestBody` z `response_format`**:

```typescript
private buildRequestBody(options: ChatCompletionOptions): Record<string, any> {
  const body: Record<string, any> = {
    model: options.model,
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt },
    ],
  };

  if (options.responseSchema) {
    body.response_format = {
      type: 'json_schema',
      json_schema: {
        name: options.responseSchema.name,
        strict: true, // Wymusza ścisłe przestrzeganie schematu
        schema: options.responseSchema.schema,
      },
    };
  }

  // Dodaj opcjonalne parametry
  if (options.temperature) body.temperature = options.temperature;
  if (options.maxTokens) body.max_tokens = options.maxTokens;

  return body;
}
```

### Krok 4: Integracja z Endpointem API

1.  W istniejącym lub nowym endpoincie API (np. `src/pages/api/notes/[noteId]/quizzes.ts`), utwórz instancję `OpenRouterService`.
2.  Wywołaj metodę `getChatCompletion`, przekazując odpowiednie parametry, w tym `responseSchema`.
3.  Obsłuż potencjalne błędy w bloku `try...catch`, zwracając odpowiednie kody statusu HTTP.

```typescript
// src/pages/api/notes/[noteId]/quizzes.ts
import type { APIRoute } from "astro";
import { OpenRouterService } from "@/lib/services/openrouter.service";
import { OpenRouterError } from "@/lib/services/openrouter.errors";
import { quizSchema } from "./_schema";

export const POST: APIRoute = async ({ params, request }) => {
  const { noteId } = params;
  const { content } = await request.json(); // Załóżmy, że treść notatki jest przesyłana w ciele

  if (!content) {
    return new Response("Note content is required.", { status: 400 });
  }

  const service = new OpenRouterService();

  try {
    const quiz = await service.getChatCompletion({
      model: "anthropic/claude-3-haiku",
      systemPrompt:
        "Twoim zadaniem jest stworzenie quizu z 3 pytaniami na podstawie dostarczonego tekstu. Zawsze odpowiadaj w formacie JSON zgodnym z dostarczonym schematem.",
      userPrompt: `Oto tekst notatki:\n\n${content}`,
      responseSchema: { name: "create_quiz", schema: quizSchema },
    });

    return new Response(JSON.stringify(quiz), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof OpenRouterError) {
      console.error(`OpenRouter Service Error: ${error.message}`);
      return new Response(error.message, { status: 502 }); // Bad Gateway
    }
    console.error(`Unexpected Error: ${error}`);
    return new Response("An unexpected error occurred.", { status: 500 });
  }
};
```
