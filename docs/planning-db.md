<conversation_summary>
<decisions>
1.  Zostanie utworzona osobna, publiczna tabela `profiles` do przechowywania danych aplikacji, połączona z `auth.users`.
2.  Zostaną zaimplementowane zarówno tagi, jak i kategorie do organizowania notatek.
3.  Quizy będą miały statusy `pending_acceptance`, `accepted` oraz `rejected`.
4.  Dane dla systemu powtórek (SRS) będą przechowywane w dedykowanej tabeli `srs_data`.
5.  Szczegółowe odpowiedzi użytkownika w quizach będą przechowywane w formacie JSONB.
6.  Zasady RLS zostaną wdrożone na wszystkich tabelach w celu zapewnienia, że użytkownicy mają dostęp tylko do swoich danych.
7.  Notatka będzie należeć do jednej kategorii i do wielu tagów.
8.  Domyślny klucz API będzie przechowywany jako zmienna środowiskowa, a nie w bazie danych.
9.  Treść promptu AI i surowa odpowiedź modelu będą zapisywane w tabeli `quizzes`.
10. Dla encji `users`, `notes` i `quizzes` zostanie zastosowana strategia usuwania kaskadowego (`ON DELETE CASCADE`).
11. Zostaną utworzone indeksy na kluczach głównych, obcych oraz na polach tekstowych używanych do filtrowania (`tags.name`, `categories.name`).
12. Limity (np. liczba tagów) będą implementowane w logice aplikacji, a nie w bazie danych.
13. Statystyki postępów będą na razie obliczane na bieżąco (on-the-fly).
14. Zostanie dodana kolumna do przechowywania wersji modelu AI użytego do generacji quizu.
15. Zostaną dodane ograniczenia `CHECK` w celu zapewnienia integralności danych (np. dla wyniku procentowego).
16. Tagi i kategorie będą przypisane do konkretnego użytkownika i unikalne w jego obrębie.
17. Zostanie zaimplementowany mechanizm śledzenia i limitowania użycia darmowego generowania quizów.
18. Rekord próby rozwiązania quizu (`quiz_attempts`) będzie tworzony po jego zakończeniu.
19. Kolejność pytań w quizie będzie przechowywana i indeksowana.
20. Domyślnym sortowaniem notatek będzie data ostatniej modyfikacji (malejąco).
</decisions>

<matched_recommendations>
1.  Stworzenie tabeli `public.profiles` w relacji 1-do-1 z `auth.users` w celu oddzielenia danych aplikacji od danych uwierzytelniających.
2.  Zaimplementowanie relacji 1-do-wielu dla kategorii (notatka ma jedną kategorię) oraz wiele-do-wielu dla tagów (poprzez tabelę łączącą `note_tags`).
3.  Przechowywanie "ustrukturyzowanej listy odpowiedzi" dla pytań otwartych oraz odpowiedzi użytkownika w elastycznych kolumnach typu `JSONB`.
4.  Szyfrowanie kluczy API użytkowników za pomocą rozszerzenia `pgsodium`.
5.  Włączenie Row-Level Security (RLS) na wszystkich tabelach i tworzenie polityk opartych na `auth.uid() = user_id` w celu izolacji danych użytkowników.
6.  Zastosowanie reguł `ON DELETE CASCADE` dla kluczy obcych, aby zapewnić integralność referencyjną przy usuwaniu głównych encji.
7.  Utworzenie indeksów B-tree na kluczach obcych oraz polach tekstowych (`tags.name`, `categories.name`) w celu optymalizacji wydajności zapytań filtrujących i wyszukujących.
8.  Przechowywanie metadanych generowania AI, takich jak treść promptu, surowa odpowiedź oraz wersja modelu, w celu ułatwienia debugowania i przyszłych optymalizacji.
9.  Zapewnienie integralności danych na poziomie bazy poprzez użycie odpowiednich typów danych (`TIMESTAMPTZ` dla dat, `ENUM` dla statusów), ograniczeń `NOT NULL` i `CHECK` (np. wynik w zakresie 0-100).
10. Zaprojektowanie tabel `tags` i `categories` jako powiązanych z `user_id` i dodanie złożonego ograniczenia `UNIQUE` na parach (`user_id`, `name`), aby zapewnić unikalność w obrębie konta użytkownika.
</matched_recommendations>

<database_planning_summary>
Celem jest stworzenie schematu bazy danych PostgreSQL dla aplikacji do generowania quizów, w pełni zintegrowanej z Supabase.

**Kluczowe Encje i Relacje:**

*   **Uwierzytelnianie**: Wykorzystany zostanie schemat `auth` Supabase. Tabela `public.profiles` (relacja 1:1 z `auth.users`) będzie przechowywać dane aplikacji, takie jak zaszyfrowany klucz API i limit darmowych quizów.
*   **Notes**: Główna encja `notes` będzie powiązana z `user_id`. Będzie miała relację 1-do-wielu z `categories` (`category_id` może być `NULL`) oraz wiele-do-wielu z `tags` (przez tabelę `note_tags`).
*   **Organizacja**: Tabele `categories` i `tags` będą powiązane z `user_id`, a ich nazwy będą unikalne w obrębie danego użytkownika.
*   **Quizzes**: Tabela `quizzes` będzie powiązana z `notes` i będzie przechowywać status (`pending_acceptance`, `accepted`, `rejected`), metadane generacji AI (prompt, odpowiedź, model) oraz inne informacje.
*   **Pytania i Odpowiedzi**: Tabela `questions` (powiązana z `quizzes`) będzie zawierać treść, typ pytania (`ENUM`), pozycję (`order`) oraz dane o poprawnych odpowiedziach (np. w `JSONB`). Tabela `answers` obsłuży opcje dla pytań wielokrotnego wyboru.
*   **Wyniki**: Tabela `quiz_attempts` będzie śledzić próby rozwiązania quizu przez użytkownika (wynik, data ukończenia). Tabela `user_answers` przechowa konkretne odpowiedzi udzielone w danej próbie w formacie `JSONB`.
*   **System Powtórek (SRS)**: Dedykowana tabela `srs_data` (relacja 1:1 z `notes`) przechowa dane potrzebne do algorytmu SRS (`due_date`, `interval`, `ease_factor`).

**Bezpieczeństwo i Wydajność:**

*   **Bezpieczeństwo**: Podstawą jest wdrożenie RLS na wszystkich tabelach, aby odizolować dane poszczególnych użytkowników. Klucze API użytkowników będą szyfrowane przy użyciu `pgsodium`.
*   **Integralność Danych**: Zastosowana zostanie strategia `ON DELETE CASCADE` dla głównych encji (użytkownicy, notatki, quizy), aby uniknąć osieroconych danych.
*   **Wydajność**: Zostaną utworzone indeksy na wszystkich kluczach głównych i obcych. Dodatkowo, kolumny tekstowe często używane w filtrowaniu (`tags.name`, `categories.name`) oraz kolumna `questions.order` również zostaną zindeksowane, aby przyspieszyć operacje odczytu.

</database_planning_summary>

<unresolved_issues>
*   **Implementacja Cron Joba**: Użytkownik wspomniał o potrzebie stworzenia zadania `cron`, które resetowałoby liczniki darmowych quizów. Jest to zadanie związane z infrastrukturą/logiką aplikacji, a nie bezpośrednio ze schematem bazy danych, i wymaga dalszego zaplanowania.
</unresolved_issues>
</conversation_summary>
