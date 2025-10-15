# Plan implementacji widoku: Generowanie Quizu

## 1. Przegląd
Celem tego wdrożenia jest implementacja interfejsu użytkownika do generowania quizu na podstawie treści istniejącej notatki. Proces ten jest inicjowany przez użytkownika, odbywa się asynchronicznie z blokadą UI i wyświetleniem statusu w modalu. Po pomyślnym wygenerowaniu, użytkownik ma możliwość przejrzenia quizu, a następnie jego akceptacji lub odrzucenia w celu ponownej generacji. Widok musi również obsługiwać mechanizm timeoutu oraz różne scenariusze błędów.

## 2. Routing widoku
Komponenty odpowiedzialne za generowanie quizu nie będą stanowiły osobnej strony, lecz będą częścią istniejącego widoku szczegółów notatki, dostępnego pod ścieżką `/notes/{noteId}`.

## 3. Struktura komponentów
Hierarchia komponentów zostanie zaimplementowana w React i zintegrowana z istniejącą stroną Astro.

```
- NoteDetailsPage (Astro)
  - QuizGenerationController (React)
    - Button ("Generuj Quiz")
    - QuizGenerationModal (React) [Renderowany warunkowo]
      - (gdy stan: 'loading') -> LoadingSpinner
      - (gdy stan: 'timeout') -> TimeoutPrompt
      - (gdy stan: 'success') -> QuizReview
          - QuestionList
            - QuestionItem
      - (gdy stan: 'error') -> ErrorMessage
```

## 4. Szczegóły komponentów

### `QuizGenerationController`
- **Opis komponentu**: Główny, stanowy komponent zarządzający całym procesem generowania quizu. Renderuje przycisk inicjujący proces oraz modal wyświetlający jego przebieg. Odpowiada za komunikację z customowym hookiem `useQuizGeneration`.
- **Główne elementy**:
    - `Button` z Shadcn/ui do rozpoczęcia generowania.
    - Komponent `QuizGenerationModal` renderowany warunkowo.
    - `Tooltip` (opcjonalnie) informujący o limicie darmowych prób.
- **Obsługiwane interakcje**:
    - `onClick` na przycisku "Generuj Quiz", który uruchamia proces.
- **Obsługiwana walidacja**: Komponent może wyświetlać informację o pozostałych darmowych próbach, jeśli użytkownik nie ma własnego klucza API.
- **Typy**: `QuizGenerationState`.
- **Propsy**:
    ```typescript
    interface QuizGenerationControllerProps {
      noteId: string;
      // Poniższe propy są potrzebne do obsługi US-022
      hasUserApiKey: boolean;
      freeQuizzesRemaining: number;
    }
    ```

### `QuizGenerationModal`
- **Opis komponentu**: Modal (okno dialogowe) z Shadcn/ui, który jest centralnym punktem informowania użytkownika o statusie generacji. Dynamicznie renderuje odpowiednią treść w zależności od aktualnego stanu procesu.
- **Główne elementy**:
    - `Dialog` z Shadcn/ui jako kontener.
    - Warunkowe renderowanie komponentów: `LoadingSpinner`, `TimeoutPrompt`, `QuizReview`, `ErrorMessage`.
- **Obsługiwane interakcje**:
    - Przekazuje zdarzenia `onAccept`, `onReject`, `onWaitLonger`, `onCancel` od komponentów-dzieci do `QuizGenerationController`.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `QuizGenerationState`, `QuizGenerationResponseDto`.
- **Propsy**:
    ```typescript
    interface QuizGenerationModalProps {
      isOpen: boolean;
      onClose: () => void;
      generationState: QuizGenerationState;
      onAccept: (quizId: string) => void;
      onReject: (quizId:string) => void;
      onWaitLonger: () => void;
      onCancel: () => void;
    }
    ```

### `QuizReview`
- **Opis komponentu**: Wyświetla zawartość wygenerowanego quizu (pytania i odpowiedzi), dając użytkownikowi możliwość jego przejrzenia. Zawiera przyciski do akceptacji lub odrzucenia quizu.
- **Główne elementy**:
    - Lista pytań (`QuizQuestionDto[]`).
    - Dla każdego pytania wyświetlana jest jego treść i typ.
    - Dla pytań wielokrotnego wyboru (`multiple_choice`) wyświetlana jest lista odpowiedzi.
    - Dwa przyciski `Button` z Shadcn/ui: "Akceptuj" i "Odrzuć".
- **Obsługiwane interakcje**:
    - `onClick` na przycisku "Akceptuj".
    - `onClick` na przycisku "Odrzuć".
- **Obsługiwana walidacja**: Brak.
- **Typy**: `QuizGenerationResponseDto`.
- **Propsy**:
    ```typescript
    interface QuizReviewProps {
      quiz: QuizGenerationResponseDto;
      onAccept: (quizId: string) => void;
      onReject: (quizId: string) => void;
    }
    ```

## 5. Typy
Do implementacji widoku wykorzystane zostaną istniejące typy DTO. Dodatkowo, wprowadzony zostanie nowy typ ViewModel do zarządzania stanem interfejsu.

- **`QuizGenerationResponseDto`**: Istniejący typ DTO zwracany przez API po pomyślnym wygenerowaniu quizu.
- **`QuizQuestionDto`**: Istniejący typ DTO dla pojedynczego pytania.
- **`QuizAnswerDto`**: Istniejący typ DTO dla pojedynczej odpowiedzi.

- **`QuizGenerationState` (ViewModel)**: Nowy typ do zarządzania stanem UI.
    ```typescript
    type QuizGenerationState =
      | { status: 'idle' }
      | { status: 'loading' }
      | { status: 'timeout' }
      | { status: 'success'; quiz: QuizGenerationResponseDto }
      | { status: 'error'; message: string; code: number };
    ```
    - `idle`: Stan początkowy, proces nie został rozpoczęty.
    - `loading`: Trwa komunikacja z API.
    - `timeout`: Komunikacja z API przekroczyła 10 sekund.
    - `success`: API zwróciło poprawnie wygenerowany quiz.
    - `error`: API zwróciło błąd.

## 6. Zarządzanie stanem
Cała logika biznesowa oraz zarządzanie stanem zostaną zamknięte w customowym hooku `useQuizGeneration`.

- **`useQuizGeneration(noteId: string)`**:
    - **Cel**: Abstrakcja logiki generowania quizu, zarządzania stanem, obsługi timeoutu oraz komunikacji z API.
    - **Zwracane wartości**:
        ```typescript
        {
          generationState: QuizGenerationState;
          generateQuiz: () => void;
          acceptQuiz: (quizId: string) => void;
          rejectQuiz: (quizId: string) => void;
          resetState: () => void; // Do anulowania i zamknięcia modala
        }
        ```
    - **Logika wewnętrzna**:
        - Używa `useState` lub `useReducer` do zarządzania `generationState`.
        - Implementuje logikę `setTimeout` i `clearTimeout` do obsługi mechanizmu timeoutu.
        - Wykorzystuje `AbortController` do przerywania żądania `fetch` w przypadku anulowania przez użytkownika.
        - Zawiera funkcje do obsługi wywołań API (`generate`, `accept`, `reject`).

## 7. Integracja API
Komponenty będą komunikować się z trzema punktami końcowymi REST API.

1.  **Generowanie quizu**:
    - **Endpoint**: `POST /api/notes/{noteId}/quizzes`
    - **Typ żądania**: `void` (puste body)
    - **Typ odpowiedzi ( sukces, `201` )**: `QuizGenerationResponseDto`
    - **Obsługa**: Wywoływane przez funkcję `generateQuiz` w hooku `useQuizGeneration`.

2.  **Akceptacja quizu**:
    - **Endpoint**: `POST /api/quizzes/{quizId}/accept`
    - **Typ żądania**: `void`
    - **Typ odpowiedzi ( sukces, `200` )**: Obiekt z danymi zaakceptowanego quizu (szczegóły do ustalenia wg API).
    - **Obsługa**: Wywoływane przez funkcję `acceptQuiz`.

3.  **Odrzucenie/usunięcie quizu**:
    - **Endpoint**: `DELETE /api/quizzes/{quizId}`
    - **Typ żądania**: `void`
    - **Typ odpowiedzi ( sukces, `204` )**: `void`
    - **Obsługa**: Wywoływane przez funkcję `rejectQuiz`, po czym natychmiastowo uruchamiana jest ponownie funkcja `generateQuiz`.

## 8. Interakcje użytkownika
- **Użytkownik klika "Generuj Quiz"**: Uruchamia `generateQuiz`, otwiera modal w stanie `loading`.
- **Proces trwa > 10s**: Stan zmienia się na `timeout`, UI w modalu pokazuje opcje "Poczekaj jeszcze" i "Anuluj".
- **Użytkownik klika "Poczekaj jeszcze"**: Stan wraca do `loading`.
- **Użytkownik klika "Anuluj"**: Żądanie API jest przerywane, modal jest zamykany, stan wraca do `idle`.
- **Quiz wygenerowany**: Stan zmienia się na `success`, UI w modalu pokazuje `QuizReview`.
- **Użytkownik klika "Akceptuj"**: Wywoływane jest `acceptQuiz`, modal jest zamykany, następuje odświeżenie danych na stronie notatki.
- **Użytkownik klika "Odrzuć"**: Wywoływane jest `rejectQuiz`, które wewnętrznie usuwa stary quiz i natychmiast uruchamia `generateQuiz`, przechodząc do stanu `loading`.

## 9. Warunki i walidacja
- **Warunek**: Użytkownik musi być zalogowany.
  - **Weryfikacja**: Po stronie serwera (middleware). Komponent nie będzie renderowany dla niezalogowanych użytkowników.
- **Warunek**: Limit darmowych prób (dla użytkowników bez klucza API).
  - **Weryfikacja**: Po stronie serwera (API zwróci `402`). Komponent `QuizGenerationController` otrzyma props `freeQuizzesRemaining` i może wyświetlić tę informację w UI, ale nie blokuje przycisku.

## 10. Obsługa błędów
Błędy z API będą przechwytywane w hooku `useQuizGeneration` i mapowane na stan `error`, co spowoduje wyświetlenie komponentu `ErrorMessage` w modalu.

- **`400 Bad Request`**: "Nie można wygenerować quizu. Treść notatki jest zbyt krótka."
- **`402 Payment Required`**: "Wyczerpano darmowe próby. Dodaj swój klucz API w ustawieniach, aby kontynuować." (Z linkiem do ustawień).
- **`404 Not Found`**: "Nie znaleziono podanej notatki."
- **`503 Service Unavailable`**: "Usługa generowania quizów jest tymczasowo niedostępna. Spróbuj ponownie później."
- **Błąd sieciowy**: "Błąd połączenia. Sprawdź swoje połączenie internetowe i spróbuj ponownie."

## 11. Kroki implementacji
1.  **Utworzenie typów**: Zdefiniować typ `QuizGenerationState` w odpowiednim pliku (np. `src/types.ts` lub lokalnie w komponencie).
2.  **Stworzenie hooka `useQuizGeneration`**: Zaimplementować całą logikę stanu, timeoutu i wywołań API (`fetch`) w pliku `src/lib/hooks/useQuizGeneration.ts`.
3.  **Implementacja komponentów UI**:
    - Stworzyć komponent `QuizReview` (`src/components/QuizReview.tsx`).
    - Stworzyć komponenty `LoadingSpinner`, `TimeoutPrompt`, `ErrorMessage` (mogą być to proste komponenty zdefiniowane wewnątrz `QuizGenerationModal`).
4.  **Implementacja komponentu `QuizGenerationModal`**: Zintegrować logikę warunkowego renderowania w zależności od `generationState`.
5.  **Implementacja `QuizGenerationController`**: Stworzyć główny komponent, który używa hooka `useQuizGeneration` i zarządza otwieraniem/zamykaniem modala.
6.  **Integracja z Astro**: Umieścić komponent `<QuizGenerationController client:load />` na stronie szczegółów notatki, przekazując wymagane propsy (`noteId`, `hasUserApiKey`, `freeQuizzesRemaining`).
7.  **Stylowanie**: Użyć klas Tailwind CSS i komponentów Shadcn/ui w celu zapewnienia spójnego wyglądu z resztą aplikacji.
8.  **Testowanie**: Ręcznie przetestować wszystkie ścieżki interakcji użytkownika i scenariusze błędów.
