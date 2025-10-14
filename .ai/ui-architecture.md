<conversation_summary>
<decisions>
1.  **Panel Główny (Dashboard)**: Zamiast dwóch list notatek, w panelu głównym znajdzie się jedna lista wszystkich notatek oraz przycisk "Rozpocznij powtórki". System po jego kliknięciu samodzielnie pobierze notatki przeznaczone do powtórki na dany dzień, a użytkownik będzie informowany o liczbie pozostałych powtórek w sesji.
2.  **Generowanie Quizu**: Proces generowania quizu będzie synchroniczny z perspektywy użytkownika (zablokuje UI spinnerem). Zrezygnowano z ręcznego przycisku "Anuluj". Zamiast tego, po upływie ustalonego czasu (wstępnie 10 sekund), użytkownik otrzyma opcje "Poczekaj jeszcze" lub "Anuluj i spróbuj później".
3.  **UI Feedback**: Dla wszystkich operacji modyfikujących dane (CRUD) zostanie zastosowane podejście "pesymistyczne", informujące użytkownika o postępie za pomocą zlokalizowanych wskaźników ładowania (spinnerów) w obrębie komponentu, a nie blokującej całą stronę nakładki.
4.  **Organizacja Widoków**: Widok szczegółów notatki skupi się na prezentacji jej treści. Akcje "Edytuj" i "Usuń" zostaną umieszczone na bocznym pasku akcji. Listy quizów oraz statystyki będą osobnymi, dedykowanymi stronami dostępnymi z głównego menu nawigacyjnego.
5.  **Brak Powtórek**: Jeśli użytkownik rozpocznie sesję powtórkową, a żadne notatki nie będą do niej zakwalifikowane, system wyświetli przyjazny komunikat z wezwaniem do akcji (CTA) zachęcającym do przejrzenia notatek.
6.  **Lista Quizów**: Będzie zaimplementowana jako tabela. Akcja "Rozwiąż" będzie dostępna tylko dla quizów, które są częścią zaplanowanej sesji powtórkowej. Dla pozostałych quizów dostępne będą opcje "Podgląd", "Usuń" oraz "Zobacz notatkę".
7.  **Filtrowanie**: Stan filtrów na liście notatek i na liście quizów będzie od siebie niezależny i nie będzie przenoszony między tymi widokami.
</decisions>
<matched_recommendations>
1.  **Dedykowany Endpoint dla Powtórek**: Wprowadzono do planu API nowy endpoint `GET /notes/due-for-review`, aby efektywnie pobierać notatki gotowe do sesji powtórkowej.
2.  **Dynamiczne Tworzenie Tagów/Kategorii**: W formularzu edycji notatki zostanie zaimplementowany komponent typu combobox, który pozwoli na wybór istniejących tagów/kategorii oraz na ich dynamiczne tworzenie bez opuszczania formularza.
3.  **Zarządzanie Stanem Serwera**: Do zarządzania stanem, buforowania danych (caching) i synchronizacji z API zostanie wykorzystana dedykowana biblioteka, taka jak React Query (TanStack Query).
4.  **Scentralizowana Obsługa Błędów**: Zostanie stworzony mechanizm mapujący kody błędów API (np. 402, 409, 503) na zrozumiałe dla użytkownika komunikaty, wyświetlane w formie powiadomień (toastów) lub okien modalnych dla krytycznych błędów.
5.  **Komunikacja nt. Klucza API**: Użytkownik będzie informowany o liczbie pozostałych darmowych quizów za pomocą stałego, ale możliwego do zamknięcia banera, który będzie zawierał również CTA kierujące do ustawień profilu w celu dodania własnego klucza API.
6.  **Responsywność (Mobile-First)**: Architektura UI będzie tworzona zgodnie z podejściem "mobile-first", zapewniając czytelność i użyteczność kluczowych widoków, takich jak lista notatek (jedna kolumna) i edytor Markdown (uproszczony interfejs), na mniejszych ekranach.
7.  **Dostępność (a11y)**: Niestandardowe, interaktywne komponenty (interfejs quizu, menedżer tagów) będą w pełni dostępne z poziomu klawiatury i zgodne z wytycznymi WAI-ARIA, aby zapewnić obsługę przez czytniki ekranu.
</matched_recommendations>
<ui_architecture_planning_summary>
### Główne wymagania dotyczące architektury UI
Architektura UI dla MVP ma na celu stworzenie intuicyjnego i wydajnego interfejsu do zarządzania notatkami i generowania z nich quizów. Kluczowe jest zapewnienie płynnego przepływu pracy, od tworzenia notatek, przez generowanie i rozwiązywanie quizów, aż po ustrukturyzowany system powtórek (SRS). Interfejs musi być responsywny, dostępny i w jasny sposób komunikować się z użytkownikiem, zwłaszcza w kontekście operacji asynchronicznych i potencjalnych błędów API.

### Kluczowe widoki, ekrany i przepływy użytkownika
-   **Panel Główny (Dashboard)**: Centralny punkt aplikacji, wyświetlający listę wszystkich notatek użytkownika oraz główny przycisk "Rozpocznij powtórki".
-   **Widok Listy Notatek**: Paginowana, sortowalna i filtrowalna lista notatek.
-   **Widok Szczegółów Notatki**: Prezentuje wyrenderowaną treść notatki w formacie Markdown. Posiada boczny panel z akcjami "Edytuj" i "Usuń".
-   **Edytor Notatek**: Formularz do tworzenia i edycji notatek, wyposażony w edytor Markdown oraz dynamiczny komponent do zarządzania tagami i kategoriami.
-   **Przepływ Generowania Quizu**: Inicjowany z widoku notatki, blokuje UI za pomocą modala ze wskaźnikiem ładowania. Posiada mechanizm timeout (~10s) z opcjami dla użytkownika. Po wygenerowaniu następuje krok akceptacji lub odrzucenia quizu.
-   **Przepływ Sesji Powtórkowej**: Uruchamiany z panelu głównego, pobiera notatki przez `GET /notes/due-for-review` i prezentuje użytkownikowi kolejne quizy do rozwiązania, informując o postępach w sesji.
-   **Widok Listy Quizów**: Dedykowana strona w menu, prezentująca wszystkie quizy w formie tabeli, z informacjami o statusie i notatce-rodzicu oraz akcjami (Rozwiąż/Podgląd, Usuń, Zobacz notatkę).
-   **Panel Statystyk**: Dedykowana strona w menu, prezentująca postępy użytkownika. Składa się z:
    -   **Kart KPI**: Wyświetlających kluczowe wskaźniki (łączna liczba notatek, rozwiązane quizy, średni wynik, notatki do powtórki).
    -   **Wykresu Postępów**: Liniowy wykres pokazujący średnie wyniki z quizów w ujęciu tygodniowym.
    -   **Tabeli Historii**: Paginowana lista ostatnich prób rozwiązania quizów z wynikami i linkami do notatek.
-   **Ustawienia Profilu**: Strona umożliwiająca użytkownikowi zarządzanie swoim kluczem API.

### Strategia integracji z API i zarządzania stanem
-   **Zarządzanie Stanem**: Aplikacja wykorzysta bibliotekę React Query (TanStack Query) do obsługi stanu serwera. Zapewni to automatyczne buforowanie, unieważnianie cache'u po mutacjach danych (np. po edycji notatki) oraz optymistyczne odświeżanie danych w tle.
-   **Integracja z API**: Zastosowane zostanie podejście pesymistyczne – interfejs będzie czekał na potwierdzenie z API przed odzwierciedleniem zmiany, komunikując stan operacji za pomocą zlokalizowanych wskaźników ładowania.
-   **Obsługa Błędów**: Zaimplementowany zostanie globalny system obsługi błędów, który będzie przechwytywał odpowiedzi z API i na podstawie kodów statusu HTTP wyświetlał odpowiednie, przyjazne dla użytkownika komunikaty.

### Kwestie dotyczące responsywności, dostępności i bezpieczeństwa
-   **Responsywność**: Projekt UI będzie realizowany w podejściu "mobile-first", dostosowując układy (np. z tabeli na listę jednokolumnową) i interfejsy (np. uproszczony edytor) do mniejszych ekranów.
-   **Dostępność**: Komponenty, zwłaszcza te niestandardowe, będą tworzone z myślą o pełnej obsłudze za pomocą klawiatury oraz zgodności ze standardami ARIA, aby zapewnić poprawne działanie z technologiami asystującymi.
-   **Bezpieczeństwo**: Uwierzytelnianie będzie oparte o tokeny JWT dostarczane przez Supabase. Aplikacja kliencka będzie odpowiedzialna za bezpieczne przechowywanie tokenu i dołączanie go do nagłówka `Authorization` we wszystkich chronionych zapytaniach do API.

</ui_architecture_planning_summary>
<unresolved_issues>
-   **Timeout Generowania Quizu**: Dokładny czas, po którym interfejs ma zaproponować użytkownikowi opcje w przypadku przedłużającego się generowania quizu, wymaga jeszcze weryfikacji i potencjalnej konfiguracji (obecnie założono 10 sekund).
</unresolved_issues>
</conversation_summary>
