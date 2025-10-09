# Dokument wymagań produktu (PRD) - Aplikacja do tworzenia quizów z notatek 10xNoteQuiz

## 1. Przegląd produktu
Produkt to aplikacja webowa zaprojektowana, aby wspierać proces nauki, szczególnie dla uczniów i studentów. Umożliwia tworzenie notatek w formacie Markdown, a następnie automatyczne generowanie z nich spersonalizowanych quizów przy użyciu sztucznej inteligencji. Aplikacja integruje mechanizm powtórek w interwałach (Spaced Repetition System), aby zoptymalizować proces zapamiętywania materiału. Użytkownicy zarządzają własnymi kluczami API do modeli AI, co zapewnia kontrolę nad kosztami i prywatnością danych.

## 2. Problem użytkownika
Tworzenie własnych notatek jest sprawdzoną metodą ułatwiającą zapamiętywanie nowego materiału. Jednakże, proces weryfikacji wiedzy, taki jak tworzenie testów czy quizów, jest czasochłonny i często pomijany. Uczniowie i studenci potrzebują narzędzia, które zautomatyzuje tworzenie materiałów do sprawdzania wiedzy na podstawie ich własnych notatek, oszczędzając tym samym cenny czas i pozwalając skupić się na nauce.

## 3. Wymagania funkcjonalne
- FW-01: System Kont Użytkowników: Użytkownicy mogą tworzyć konta i logować się za pomocą adresu e-mail i hasła.
- FW-02: Zarządzanie Kluczami API: Użytkownicy mogą bezpiecznie dodawać i zarządzać własnymi kluczami API do modeli AI. Klucze są przechowywane w formie zaszyfrowanej. W przypadku braku klucza użytkownika, aplikacja korzysta z domyślnego klucza API z ograniczonym użyciem.
- FW-03: Zarządzanie Notatkami: Pełna funkcjonalność CRUD (tworzenie, odczyt, aktualizacja, usuwanie) dla notatek w formacie Markdown.
- FW-04: Organizacja Notatek: Możliwość kategoryzowania notatek za pomocą tagów, kategorii.
- FW-05: Generowanie Quizów przez AI: Możliwość wygenerowania quizu dla dowolnej notatki. Quizy są tworzone według zdefiniowanego schematu: 2 pytania Prawda/Fałsz, 4-5 pytań zamkniętych (wielokrotnego wyboru), 1-2 pytania otwarte z krótką odpowiedzią tekstową.
- FW-06: Weryfikacja Quizów: Użytkownik może zaakceptować wygenerowany quiz lub go odrzucić, co skutkuje ponownym wygenerowaniem.
- FW-07: Zarządzanie Quizami: Użytkownik może usunąć quiz lub wygenerować nowy. Do jednej notatki może być przypisanych wiele quizów.
- FW-08: Rozwiązywanie Quizów: Interfejs do rozwiązywania quizów.
- FW-09: Automatyczna Weryfikacja Odpowiedzi: Odpowiedzi na pytania tekstowe są weryfikowane automatycznie na podstawie ustrukturyzowanej listy odpowiedzi dostarczonej przez AI.
- FW-10: Wyniki i Statystyki: Widok wyników ostatniego quizu oraz zagregowane statystyki i wykresy postępów dla danej notatki.
- FW-12: System Powtórek (SRS): Implementacja algorytmu Spaced Repetition (np. przy użyciu biblioteki `srs.js`) do planowania sesji powtórkowych na podstawie wyników w quizach.

## 4. Granice produktu
### W zakresie MVP:
- Wszystkie funkcjonalności wymienione w sekcji "Wymagania funkcjonalne".

### Funkcje opcjonalne (poza MVP):
- Automatyczne podsumowania notatek przez AI.
- Możliwość edycji pojedynczych pytań w quizie.
- Zaawansowane opcje generowania quizu (np. kontrola liczby pytań, poziomu trudności).
- Funkcja odzyskiwania zapomnianego hasła.
- Funkcja podsumowania notatki przez AI + tworzenie mapy myśli 
- Weryfikacja odpowiedzi tekstowych przez LLM jako alternatywa dla automatycznej weryfikacji.
- Wsparcie dla Kodu: Obsługa formatowania składni kodu wewnątrz notatek.

### Poza zakresem:
- Interfejs głosowy do odpowiadania na pytania.
- Elementy grywalizacji (punkty, odznaki, rankingi).
- Funkcje społecznościowe, takie jak dzielenie się notatkami z innymi użytkownikami.

## 5. Historyjki użytkowników
### Uwierzytelnianie i Zarządzanie Kontem
- ID: US-001
- Tytuł: Rejestracja nowego użytkownika
- Opis: Jako nowy użytkownik, chcę móc założyć konto w aplikacji przy użyciu mojego adresu e-mail i hasła, abym mógł zacząć tworzyć notatki i quizy.
- Kryteria akceptacji:
    - Formularz rejestracji zawiera pola na adres e-mail, hasło i potwierdzenie hasła.
    - System waliduje poprawność formatu adresu e-mail.
    - System sprawdza, czy hasła w obu polach są identyczne.
    - System informuje użytkownika, jeśli konto o podanym adresie e-mail już istnieje.
    - Po pomyślnej rejestracji użytkownik jest automatycznie zalogowany i przekierowany do głównego panelu aplikacji.

- ID: US-002
- Tytuł: Logowanie do aplikacji
- Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji przy użyciu mojego adresu e-mail i hasła, abym miał dostęp do swoich notatek.
- Kryteria akceptacji:
    - Formularz logowania zawiera pola na adres e-mail i hasło.
    - System informuje użytkownika o wprowadzeniu nieprawidłowego e-maila lub hasła.
    - Po pomyślnym zalogowaniu użytkownik jest przekierowany do głównego panelu aplikacji.

- ID: US-003
- Tytuł: Wylogowanie z aplikacji
- Opis: Jako zalogowany użytkownik, chcę móc się wylogować z aplikacji, aby zabezpieczyć swoje konto.
- Kryteria akceptacji:
    - W interfejsie użytkownika znajduje się widoczny przycisk "Wyloguj".
    - Po kliknięciu przycisku sesja użytkownika jest kończona, a on sam jest przekierowywany na stronę logowania.

- ID: US-004
- Tytuł: Zarządzanie kluczem API
- Opis: Jako użytkownik, chcę móc zapisać swój klucz API do modelu AI w ustawieniach konta, aby aplikacja mogła generować dla mnie quizy.
- Kryteria akceptacji:
    - W ustawieniach konta znajduje się pole do wprowadzenia i zapisania klucza API.
    - System szyfruje klucz API przed zapisaniem go w bazie danych.
    - Użytkownik może zaktualizować lub usunąć zapisany klucz API.
    - Aplikacja informuje użytkownika, jeśli próba generacji quizu nie powiedzie się z powodu nieprawidłowego lub brakującego klucza API.

- ID: US-022
- Tytuł: Generowanie quizu bez własnego klucza API
- Opis: Jako nowy użytkownik, chcę móc wygenerować quiz bez konieczności natychmiastowego podawania własnego klucza API, aby móc szybko przetestować podstawową funkcjonalność aplikacji.
- Kryteria akceptacji:
    - Gdy użytkownik nie ma zapisanego klucza API w ustawieniach, przycisk "Generuj quiz" jest nadal aktywny.
    - Po kliknięciu "Generuj quiz", aplikacja używa domyślnego, wbudowanego klucza API do komunikacji z AI.
    - Użytkownik jest informowany (np. za pomocą dyskretnego komunikatu), że korzysta z klucza domyślnego, co może wiązać się z pewnymi ograniczeniami (np. limit zapytań).
    - Generowanie quizu przebiega pomyślnie, tak jak w przypadku użycia własnego klucza.

### Zarządzanie Notatkami
- ID: US-005
- Tytuł: Tworzenie nowej notatki
- Opis: Jako użytkownik, chcę móc stworzyć nową notatkę z tytułem i treścią w formacie Markdown, aby zapisać ważne informacje.
- Kryteria akceptacji:
    - Aplikacja udostępnia edytor tekstu obsługujący składnię Markdown.
    - Użytkownik może nadać notatce tytuł oraz wprowadzić treść.
    - Po zapisaniu notatka pojawia się na liście moich notatek.

- ID: US-006
- Tytuł: Przeglądanie listy notatek
- Opis: Jako użytkownik, chcę widzieć listę wszystkich moich notatek, abym mógł łatwo znaleźć i zarządzać informacjami.
- Kryteria akceptacji:
    - Główny panel aplikacji wyświetla listę notatek użytkownika.
    - Każdy element listy pokazuje tytuł notatki oraz datę ostatniej modyfikacji.
    - Użytkownik może sortować i filtrować notatki (np. po tagach, kategoriach).

- ID: US-007
- Tytuł: Wyświetlanie pojedynczej notatki
- Opis: Jako użytkownik, chcę móc otworzyć i przeczytać treść wybranej notatki.
- Kryteria akceptacji:
    - Kliknięcie na notatkę z listy otwiera widok jej pełnej treści.
    - Treść notatki jest poprawnie renderowana z formatowania Markdown.

- ID: US-008
- Tytuł: Edycja istniejącej notatki
- Opis: Jako użytkownik, chcę móc edytować treść i tytuł istniejącej notatki, aby zaktualizować informacje.
- Kryteria akceptacji:
    - W widoku notatki dostępny jest przycisk "Edytuj".
    - Po jego kliknięciu uruchamia się edytor z załadowaną treścią notatki.
    - Zapisane zmiany są widoczne w widoku notatki i na liście notatek.

- ID: US-009
- Tytuł: Usuwanie notatki
- Opis: Jako użytkownik, chcę móc usunąć notatkę, której już nie potrzebuję.
- Kryteria akceptacji:
    - Użytkownik może usunąć notatkę z poziomu listy notatek lub widoku pojedynczej notatki.
    - Przed usunięciem system prosi o potwierdzenie operacji.
    - Po usunięciu notatka znika z listy.

- ID: US-010
- Tytuł: Organizowanie notatek
- Opis: Jako użytkownik, chcę móc dodawać tagi i przypisywać notatki do kategorii, aby lepiej je organizować.
- Kryteria akceptacji:
    - Podczas tworzenia lub edycji notatki można dodać/usunąć tagi.
    - Można przypisać notatkę do istniejącej kategorii lub stworzyć nową.
    - Tagi i kategorie są widoczne na liście notatek i służą do filtrowania.

- ID: US-011
- Tytuł: Formatowanie kodu w notatkach
- Opis: Jako użytkownik (np. programista), chcę móc wstawiać fragmenty kodu do notatek z odpowiednim formatowaniem składni, aby były czytelne.
- Kryteria akceptacji:
    - Edytor Markdown obsługuje bloki kodu (np. ```język ... ```).
    - W widoku notatki kod jest wyświetlany z kolorowaniem składni dla popularnych języków programowania.

### Generowanie i Zarządzanie Quizami
- ID: US-012
- Tytuł: Generowanie quizu z notatki
- Opis: Jako użytkownik, chcę móc wygenerować quiz na podstawie treści mojej notatki, aby sprawdzić swoją wiedzę.
- Kryteria akceptacji:
    - W widoku notatki znajduje się przycisk "Generuj quiz".
    - Po kliknięciu aplikacja wysyła treść notatki do AI i wyświetla wygenerowane pytania.
    - Quiz jest generowany zgodnie z predefiniowanym schematem (2 P/F, 4-5 zamkniętych, 1-2 otwarte).

- ID: US-013
- Tytuł: Akceptacja wygenerowanego quizu
- Opis: Jako użytkownik, po przejrzeniu wygenerowanego quizu, chcę go zaakceptować, jeśli jest dla mnie odpowiedni.
- Kryteria akceptacji:
    - Po wygenerowaniu quizu pojawiają się przyciski "Akceptuj" i "Odrzuć".
    - Po kliknięciu "Akceptuj", quiz zostaje zapisany i powiązany z notatką.
    - Zaakceptowany quiz jest gotowy do rozwiązania.

- ID: US-014
- Tytuł: Odrzucenie i ponowne generowanie quizu
- Opis: Jako użytkownik, jeśli wygenerowany quiz mi nie odpowiada, chcę go odrzucić i spróbować wygenerować nowy.
- Kryteria akceptacji:
    - Po kliknięciu "Odrzuć", aplikacja ponownie wysyła zapytanie do AI w celu wygenerowania nowego zestawu pytań.
    - Stary zestaw pytań jest odrzucany i nie jest zapisywany.

- ID: US-015
- Tytuł: Przeglądanie zapisanych quizów
- Opis: Jako użytkownik, chcę widzieć listę wszystkich zaakceptowanych quizów dla danej notatki.
- Kryteria akceptacji:
    - W widoku notatki znajduje się sekcja z listą powiązanych z nią quizów.
    - Użytkownik może rozpocząć rozwiązywanie dowolnego z zapisanych quizów.

- ID: US-016
- Tytuł: Usuwanie quizu
- Opis: Jako użytkownik, chcę móc usunąć cały quiz, jeśli uznam, że nie jest już potrzebny.
- Kryteria akceptacji:
    - Na liście quizów przy każdym z nich znajduje się opcja "Usuń".
    - System prosi o potwierdzenie przed usunięciem quizu.

### Rozwiązywanie Quizu i Wyniki
- ID: US-017
- Tytuł: Rozwiązywanie quizu
- Opis: Jako użytkownik, chcę móc odpowiedzieć na wszystkie pytania w quizie, aby sprawdzić swoją wiedzę.
- Kryteria akceptacji:
    - Aplikacja wyświetla jedno pytanie na raz.
    - Interfejs umożliwia zaznaczenie odpowiedzi dla pytań P/F i zamkniętych oraz wpisanie tekstu dla pytań otwartych.
    - Po udzieleniu odpowiedzi na wszystkie pytania użytkownik może zakończyć quiz.

- ID: US-018
- Tytuł: Weryfikacja odpowiedzi i podsumowanie wyniku
- Opis: Jako użytkownik, po zakończeniu quizu chcę natychmiast zobaczyć swój wynik i dowiedzieć się, na które pytania odpowiedziałem poprawnie, a na które błędnie.
- Kryteria akceptacji:
    - Odpowiedzi na pytania otwarte są automatycznie sprawdzane przez system.
    - Po zakończeniu quizu wyświetlane jest podsumowanie: procent poprawnych odpowiedzi.
    - Użytkownik może przejrzeć wszystkie pytania z zaznaczonymi swoimi odpowiedziami oraz wskazaniem poprawnych.

- ID: US-019
- Tytuł: Przeglądanie historii wyników
- Opis: Jako użytkownik, chcę mieć dostęp do historii moich wyników z quizów dla danej notatki, aby śledzić swoje postępy.
- Kryteria akceptacji:
    - W widoku notatki dostępna jest zakładka/sekcja "Wyniki".
    - Wyświetlana jest tabela z datami podejść do quizów i uzyskanymi wynikami.
    - Dostępny jest prosty wykres wizualizujący postępy w czasie.

### System Powtórek (SRS)
- ID: US-020
- Tytuł: Automatyczne planowanie powtórek
- Opis: Jako użytkownik, chcę, aby system automatycznie planował dla mnie sesje powtórkowe dla materiału z notatki na podstawie moich wyników w quizach, zgodnie z algorytmem SRS.
- Kryteria akceptacji:
    - Po rozwiązaniu quizu system (korzystając z biblioteki SRS) oblicza datę następnej powtórki dla danej notatki.
    - W głównym panelu aplikacji użytkownik widzi, które notatki są zaplanowane do powtórki danego dnia.
    - Wszystkie zaakceptowane quizy dla notatki traktowane są jako jedna pula pytań do powtórek.

- ID: US-021
- Tytuł: Przeprowadzanie sesji powtórkowej
- Opis: Jako użytkownik, chcę móc rozpocząć zaplanowaną sesję powtórkową, podczas której system będzie prezentował mi pytania z quizów.
- Kryteria akceptacji:
    - Użytkownik może rozpocząć sesję powtórkową dla notatki, która ma zaplanowaną powtórkę.
    - System losowo wybiera pytania z puli wszystkich quizów powiązanych z daną notatką.
    - Wynik sesji powtórkowej jest wykorzystywany przez algorytm SRS do zaplanowania kolejnej powtórki.

## 6. Metryki sukcesu
- MS-01: Wskaźnik akceptacji quizów: Co najmniej 75% quizów generowanych przez AI jest akceptowanych przez użytkowników. Mierzone jako stosunek liczby zaakceptowanych quizów do liczby wszystkich wygenerowanych (zaakceptowane + odrzucone).
- MS-02: Wykorzystanie generacji AI: Co najmniej 75% wszystkich quizów w systemie pochodzi z generacji przez AI. Mierzone jako stosunek quizów stworzonych przez AI do wszystkich quizów.
