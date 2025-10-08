<conversation_summary>
<decisions>
1.  **Grupa docelowa**: Produkt kierowany jest do uczniów lub studentów.
2.  **System uwierzytelniania**: W MVP zaimplementowane zostanie logowanie za pomocą adresu e-mail i hasła. Funkcja odzyskiwania hasła zostanie dodana jako funkcja opcjonalna.
3.  **Zarządzanie notatkami**: Użytkownicy będą mogli organizować notatki za pomocą tagów, kategorii. Dodana zostanie funkcja wsparcia dla formatowania składni kodu w notatkach.
4.  **Generowanie quizów**: AI będzie tworzyć quizy według z góry zdefiniowanego schematu: 2 pytania typu prawda/fałsz, 4-5 pytań zamkniętych wielokrotnego wyboru oraz 1-2 pytania z odpowiedzią tekstową (weryfikowane automatycznie).
5.  **Zarządzanie quizami**: Użytkownik będzie mógł zaakceptować lub odrzucić wygenerowany quiz. Odrzucenie spowoduje ponowne wygenerowanie. W MVP nie będzie możliwości edycji pojedynczych pytań.
6.  **Algorytm powtórek (SRS)**: Zostanie zaimplementowany z użyciem biblioteki `srs.js`. System będzie traktował wszystkie zaakceptowane quizy dla danej notatki jako jedną pulę do planowania powtórek.
7.  **Weryfikacja odpowiedzi**: Pytania z odpowiedzią tekstową będą weryfikowane automatycznie po stronie aplikacji na podstawie ustrukturyzowanej listy poprawnych odpowiedzi dostarczonej przez AI.
8.  **Integracja z AI**: Użytkownicy będą korzystać z własnych kluczy API do wybranych modeli AI. Klucze te będą przechowywane w bazie danych w formie zaszyfrowanej.
9.  **Prywatność danych**: Aplikacja zapewni, że dane użytkowników (notatki) nie będą wykorzystywane do trenowania modeli AI, co zostanie zweryfikowane w politykach użytkowania danych dostawców API i zakomunikowane w polityce prywatności produktu.
</decisions>

<matched_recommendations>
1.  **Zdefiniowanie grupy docelowej**: Sprecyzowanie, że grupą docelową są m.in. uczniowie, doprowadziło do dodania kluczowej funkcji formatowania kodu.
2.  **Uproszczenie mechanizmu logowania**: Dyskusja na temat złożoności pełnego systemu logowania (e-mail/hasło) doprowadziła do decyzji o przeniesieniu funkcji odzyskiwania hasła do opcjonalnych.
3.  **Mechanizm oceny quizów AI**: Zaakceptowano rekomendację wprowadzenia prostego mechanizmu akceptacji/odrzucenia quizu jako podstawy do mierzenia kryterium sukcesu.
4.  **Wybór biblioteki SRS**: Podjęto decyzję o rozpoczęciu implementacji algorytmu powtórek od sugerowanej, prostej biblioteki `srs.js`.
5.  **Bezpieczne przechowywanie kluczy API**: Zastosowana zostanie rekomendacja dotycząca bezpiecznego przechowywania kluczy API użytkowników (szyfrowanie w bazie danych).
6.  **Automatyczna weryfikacja odpowiedzi**: Zaakceptowano rekomendację, aby w MVP wdrożyć automatyczną weryfikację odpowiedzi w kodzie aplikacji, co jest rozwiązaniem bardziej niezawodnym i efektywnym kosztowo.
7.  **Weryfikacja polityki prywatności dostawców AI**: Przyjęto zalecenie dotyczące weryfikacji polityk użytkowania danych dostawców modeli AI w celu zapewnienia prywatności notatek użytkowników.
</matched_recommendations>

<prd_planning_summary>
Na podstawie przeprowadzonej rozmowy, zebrano kluczowe wymagania dla dokumentu PRD dla MVP aplikacji do nauki.

**a. Główne wymagania funkcjonalne produktu:**
Produkt będzie aplikacją webową umożliwiającą użytkownikom (uczniom, studentom) tworzenie i zarządzanie notatkami w formacie Markdown z obsługą formatowania kodu. Centralną funkcją będzie generowanie quizów na podstawie notatek przez AI, zgodnie z ustalonym schematem pytań (P/F, zamknięte, pytania z odpowiedzią tekstową weryfikowane automatycznie). Użytkownicy będą mogli akceptować lub odrzucać quizy. Aplikacja będzie wykorzystywać algorytm Spaced Repetition (SRS) do planowania powtórek, traktując wszystkie quizy danej notatki jako całość. System kont będzie oparty o e-mail/hasło, a użytkownicy będą podłączać własne klucze API do modeli AI.

**b. Kluczowe historie użytkownika i ścieżki korzystania:**
Główny przepływ użytkownika (user flow) wygląda następująco:
1.  Użytkownik rejestruje się i loguje do aplikacji.
2.  Tworzy nową notatkę (lub edytuje istniejącą), używając składni Markdown i dodając fragmenty kodu. Organizuje swoje notatki za pomocą kategorii i tagów.
3.  Chcąc sprawdzić swoją wiedzę, inicjuje generowanie quizu przez AI dla wybranej notatki.
4.  Przegląda wygenerowany quiz i decyduje, czy go akceptuje. Jeśli nie, generuje go ponownie.
5.  Rozwiązuje zaakceptowany quiz, a jego odpowiedzi na pytania tekstowe są automatycznie sprawdzane przez system.
6.  Po zakończeniu quizu, wyświetlany jest wynik, a w dashbordzie można przeglądać swoje wyniki w tabelkach i na wykresach
7.  System automatycznie planuje dla niego sesję powtórkową dla tej notatki zgodnie z algorytmem SRS.

**c. Ważne kryteria sukcesu i sposoby ich mierzenia:**
-   **Akceptacja quizów AI**: Co najmniej 75% quizów generowanych przez AI musi być akceptowanych przez użytkowników. Mierzone będzie to poprzez stosunek liczby zaakceptowanych quizów do liczby wszystkich wygenerowanych (zaakceptowane + odrzucone).
-   **Wykorzystanie AI**: Co najmniej 75% wszystkich utworzonych w systemie quizów powinno pochodzić z generacji przez AI (a nie być tworzonych manualnie, jeśli taka funkcja pojawi się w przyszłości).

</prd_planning_summary>

<unresolved_issues>
- **Model biznesowy**: Pozostaje do ustalenia, w jaki sposób aplikacja będzie monetyzowana. Skoro użytkownicy ponoszą koszty zapytań do API AI, należy zdefiniować, czy aplikacja będzie oferować płatny plan subskrypcyjny za dostęp do swoich funkcji (np. algorytm SRS, zaawansowane zarządzanie notatkami), czy będzie darmowa, a w przyszłości pojawią się dodatkowe, płatne funkcje premium.
</unresolved_issues>
</conversation_summary>
