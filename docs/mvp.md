# MVP

## Główny problem

Tworzenie własnych notatek pozwala nam lepiej zapamiętać to czego się uczymy. Warto też sprawdzać na ile znamy dobrze temat, jednak tworzenie własnych quizów czy planów powtórek może zająć nam cenny czas.

## Najmniejszy zestaw funkcjonalności

    - 1. Prosty system kont użytkowników (logowanie email/hasło) do zarządzania notatkami.
    - 2. Zarządzanie notatkami w formacie markdown: tworzenie, edycja, usuwanie, oraz kategoryzowanie (tagi, kategorie).
    - 3. Tworzenie quizu dla notatki przez AI (w oparciu o zdefiniowany schemat: 2 P/F, 4-5 zamkniętych, 1-2 pytania z odpowiedzią tekstową, weryfikowane automatycznie).
    - 4. Zarządzanie quizami: możliwość usunięcia całego quizu lub wygenerowania nowego. Użytkownik może mieć kilka quizów do jednej notatki.
    - 5. Widok wyników quizów dla danej notatki + wykres.
    - 6. Prosty algorytm powtórek (Spaced Repetition) oparty o gotową bibliotekę (np. srs.js).
    - 7. Interface webowy.
    - 8. Wsparcie dla formatowania kodu w notatkach i quizach.

## Opcjonalne Funkcje

    - Podsumowanie Notatek prze AI
    - Możliwość edycji pojedynczych pytań w quizie
    - Użytkownik ma kontrolę nad generowaniem quizu (liczba pytań, poziom trudności)
    - Odzyskiwanie zapomnianego hasła
    - Weryfikacja odpowiedzi przez LLM

## Co NIE wchodzi w zakres MVP

    - Interface głosowy, aby odpowiadać na qizy
    - Elementów grywalizacji, aby zaagażować użytkownika
    - Dzielenie się notatkami i innymi użytkownikami

## Kryteria sukcesu

    - 75% quizów wygenerowanych przez AI jest akceptowane przez użytkownika
    - Użytkownicy tworzą 75% quizów z wykorzystaniem AI
