# Plan Testów dla Aplikacji do Notatek i Quizów

## 1. Wprowadzenie i cele testowania

### 1.1. Wprowadzenie

Niniejszy dokument opisuje plan testów dla aplikacji internetowej do tworzenia notatek i generowania na ich podstawie quizów. Aplikacja zbudowana jest w oparciu o nowoczesny stos technologiczny, w tym Astro, React, TypeScript i Supabase. Celem planu jest zapewnienie wysokiej jakości produktu poprzez systematyczne podejście do weryfikacji funkcjonalności, wydajności, bezpieczeństwa i użyteczności.

### 1.2. Cele testowania

- **Weryfikacja funkcjonalna**: Zapewnienie, że wszystkie funkcjonalności aplikacji działają zgodnie z wymaganiami, w tym uwierzytelnianie, zarządzanie notatkami (CRUD) i generowanie quizów.
- **Zapewnienie jakości**: Wykrycie i zaraportowanie jak największej liczby błędów przed wdrożeniem produkcyjnym.
- **Ocena użyteczności (UX/UI)**: Sprawdzenie, czy interfejs użytkownika jest intuicyjny, spójny i responsywny.
- **Weryfikacja bezpieczeństwa**: Upewnienie się, że dane użytkowników są chronione, a dostęp do zasobów jest prawidłowo autoryzowany.
- **Ocena wydajności**: Zidentyfikowanie potencjalnych wąskich gardeł i zapewnienie akceptowalnego czasu odpowiedzi aplikacji.

## 2. Zakres testów

### 2.1. Funkcjonalności objęte testami

- **Moduł uwierzytelniania**:
  - Rejestracja nowego użytkownika.
  - Logowanie i wylogowywanie.
  - Ochrona tras wymagających zalogowania.
- **Moduł zarządzania notatkami**:
  - Tworzenie nowej notatki.
  - Wyświetlanie listy notatek z paginacją.
  - Wyświetlanie szczegółów pojedynczej notatki.
  - Edycja istniejącej notatki.
  - Usuwanie notatki.
- **Moduł generowania quizów**:
  - Inicjowanie procesu generowania quizu na podstawie notatki.
  - Obsługa komunikacji z zewnętrznym API (OpenRouter).
  - Wyświetlanie i przeglądanie wygenerowanego quizu.
  - Akceptacja i zapisanie quizu.
- **Interfejs użytkownika**:
  - Responsywność na różnych urządzeniach (desktop, tablet, mobile).
  - Działanie komponentów UI (modale, powiadomienia, toole).

### 2.2. Funkcjonalności wyłączone z testów

- Testy obciążeniowe zewnętrznego API (OpenRouter).
- Dogłębne testy jednostkowe komponentów z biblioteki Shadcn/ui (zakładamy ich poprawność).

## 3. Typy testów

- **Testy jednostkowe (Unit Tests)**: Weryfikacja pojedynczych funkcji, komponentów React i customowych hooków w izolacji.
- **Testy integracyjne (Integration Tests)**: Sprawdzanie współpracy między komponentami (np. formularz z walidacją) oraz między warstwą serwisu a mockowanym klientem Supabase.
- **Testy End-to-End (E2E)**: Symulacja rzeczywistych scenariuszy użytkownika w przeglądarce, weryfikująca cały przepływ danych od interfejsu po bazę danych.
- **Testy wizualnej regresji (Visual Regression Testing)**: Automatyczne porównywanie zrzutów ekranu interfejsu w celu wykrycia niezamierzonych zmian wizualnych.
- **Testy bezpieczeństwa (Security Testing)**: Manualne i automatyczne testy weryfikujące mechanizmy autoryzacji i kontroli dostępu (szczególnie zasady RLS w Supabase).
- **Testy manualne (Manual Testing)**: Eksploracyjne testy użyteczności i weryfikacja scenariuszy trudnych do zautomatyzowania.

## 4. Scenariusze testowe dla kluczowych funkcjonalności

| ID    | Funkcjonalność         | Scenariusz                                                                                              | Oczekiwany rezultat                                                                                              | Priorytet |
| ----- |------------------------| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------- |
| **AUTH-01** | Rejestracja            | Użytkownik wypełnia formularz poprawnymi danymi i klika "Zarejestruj się".                               | Konto zostaje utworzone, użytkownik jest zalogowany i przekierowany na stronę główną.                               | Krytyczny |
| **AUTH-02** | Rejestracja            | Użytkownik próbuje zarejestrować się z zajętym adresem e-mail.                                          | Wyświetlany jest komunikat o błędzie "Użytkownik o tym adresie e-mail już istnieje".                                | Wysoki    |
| **AUTH-03** | Logowanie              | Użytkownik podaje poprawne dane logowania.                                                              | Użytkownik zostaje zalogowany i przekierowany na stronę z notatkami.                                               | Krytyczny |
| **AUTH-04** | Logowanie              | Użytkownik podaje niepoprawne hasło.                                                                    | Wyświetlany jest komunikat o błędzie "Nieprawidłowe dane logowania".                                                | Wysoki    |
| **AUTH-05** | Dostęp do routów       | Niezalogowany użytkownik próbuje wejść na stronę `/notes`.                                              | Użytkownik zostaje przekierowany na stronę logowania.                                                              | Krytyczny |
| **NOTE-01** | Tworzenie notatki      | Zalogowany użytkownik tworzy nową notatkę z tytułem i treścią.                                          | Notatka pojawia się jako pierwsza na liście notatek.                                                                | Krytyczny |
| **NOTE-02** | Edycja notatki         | Użytkownik edytuje treść istniejącej notatki.                                                           | Zmiany są zapisywane i widoczne po ponownym otwarciu notatki.                                                        | Krytyczny |
| **NOTE-03** | Usuwanie notatki       | Użytkownik usuwa notatkę z listy.                                                                       | Notatka znika z listy, a po odświeżeniu strony nadal jest niewidoczna.                                              | Krytyczny |
| **NOTE-04** | Dostęp do notatek      | Użytkownik A próbuje uzyskać dostęp do notatki użytkownika B poprzez bezpośredni URL.                   | Aplikacja zwraca błąd 404 (lub analogiczny) i nie wyświetla treści notatki.                                         | Krytyczny |
| **QUIZ-01** | Generowanie quizu      | Użytkownik klika przycisk "Generuj quiz" na stronie notatki.                                             | Otwiera się modal, proces generowania się rozpoczyna. Po chwili wyświetla się wygenerowany quiz do przeglądu.        | Wysoki    |
| **QUIZ-02** | Błąd generowania quizu | Występuje błąd podczas komunikacji z API OpenRouter.                                                    | Użytkownik widzi czytelny komunikat o błędzie, a aplikacja pozostaje stabilna.                                      | Średni    |

## 5. Środowisko testowe

- **Środowisko lokalne**: Programistyczne, do uruchamiania testów jednostkowych i integracyjnych.
- **Środowisko Staging/Testowe**:
  - Dedykowana instancja aplikacji wdrożona na platformie hostingowej (np. Vercel, Netlify).
  - Osobny projekt Supabase z wyizolowaną bazą danych, zasilony danymi testowymi.
  - Na tym środowisku będą uruchamiane testy E2E i przeprowadzane testy manualne.
- **Przeglądarki**: Testy będą przeprowadzane na najnowszych wersjach Chrome, Firefox i Safari.

## 6. Narzędzia do testowania

- **Test Runner**: Vitest (dla testów jednostkowych i integracyjnych).
- **Biblioteki do testowania**: React Testing Library.
- **Testy E2E**: Playwright.
- **Testy wizualnej regresji**: Playwright lub Storybook z dodatkiem do VRT.
- **CI/CD**: GitHub Actions (do automatycznego uruchamiania testów po każdym pushu do repozytorium).

## 7. Harmonogram testów

- Testy jednostkowe i integracyjne będą tworzone równolegle z rozwojem nowych funkcjonalności.
- Pełna regresja E2E będzie uruchamiana automatycznie przed każdym wdrożeniem na środowisko produkcyjne.
- Testy manualne i eksploracyjne będą przeprowadzane po zakończeniu prac nad większymi funkcjonalnościami (np. po zaimplementowaniu całego modułu quizów).

## 8. Kryteria akceptacji testów

### 8.1. Kryteria wejścia

- Kod źródłowy został zintegrowany z głównym branchem.
- Aplikacja została pomyślnie zbudowana i wdrożona na środowisku testowym.

### 8.2. Kryteria wyjścia

- 100% testów E2E dla ścieżki krytycznej musi zakończyć się sukcesem.
- Pokrycie kodu testami jednostkowymi i integracyjnymi na poziomie co najmniej 80%.
- Brak otwartych błędów o priorytecie "Krytyczny" i "Wysoki".
- Wszystkie testy manualne dla danej funkcjonalności zostały zakończone i zaakceptowane.

## 9. Role i odpowiedzialności

- **Deweloperzy**:
  - Pisanie testów jednostkowych i integracyjnych dla tworzonego kodu.
  - Naprawa błędów zgłoszonych przez zespół QA.
- **Inżynier QA**:
  - Projektowanie i implementacja testów E2E.
  - Przeprowadzanie testów manualnych i eksploracyjnych.
  - Zarządzanie procesem zgłaszania i śledzenia błędów.
  - Ostateczna akceptacja funkcjonalności przed wdrożeniem.

## 10. Procedury raportowania błędów

Wszystkie znalezione błędy będą raportowane w systemie do śledzenia zadań (np. GitHub Issues) i powinny zawierać:

- **Tytuł**: Krótki, zwięzły opis problemu.
- **Opis**: Szczegółowy opis błędu, w tym:
  - Kroki do reprodukcji.
  - Oczekiwany rezultat.
  - Rzeczywisty rezultat.
- **Środowisko**: Wersja aplikacji, przeglądarka, system operacyjny.
- **Priorytet**: Krytyczny, Wysoki, Średni, Niski.
- **Załączniki**: Zrzuty ekranu, nagrania wideo, logi z konsoli.
