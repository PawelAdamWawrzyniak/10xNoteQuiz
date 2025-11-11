# Plan Implementacji - Strona Rozwiązywania Quizów

## 📋 Przegląd

Implementacja strony do rozwiązywania zaakceptowanych quizów zgodnie z:

- **PRD**: Historyjka FW-08 (Rozwiązywanie Quizów)
- **Historyjki użytkownika**: US-017, US-018
- **Architektura UI**: Dedykowany widok do rozwiązywania quizów

## 🎯 Wymagania Funkcjonalne

### Z PRD (FW-08):

- Interfejs do rozwiązywania quizów
- Prezentacja pytań z notatki
- Obsługa różnych typów pytań (Prawda/Fałsz, wielokrotnego wyboru, otwarte)
- Możliwość udzielania odpowiedzi na wszystkie pytania

### Z US-017:

- Wyświetlanie jednego pytania na raz
- Interfejs do zaznaczania odpowiedzi (P/F, wielokrotnego wyboru)
- Pole tekstowe dla pytań otwartych
- Możliwość zakończenia quizu po odpowiedzeniu na wszystkie pytania

### Z US-018:

- Natychmiastowe wyświetlenie wyniku po zakończeniu
- Procent poprawnych odpowiedzi
- Przegląd wszystkich pytań z oznaczeniem poprawnych/błędnych odpowiedzi

## 🏗️ Struktura Komponentów

```
src/
├── pages/
│   └── quizzes/
│       └── [quizId]/
│           └── solve.astro          # Nowa strona do rozwiązywania quizu
├── components/
│   ├── QuizSolver.tsx               # Główny komponent orkiestrujący
│   ├── QuizQuestion.tsx             # Komponent pojedynczego pytania
│   ├── QuizProgress.tsx             # Pasek postępu
│   ├── QuizResults.tsx              # Widok wyników po zakończeniu
│   └── QuizResultsDetail.tsx        # Szczegółowy przegląd odpowiedzi
├── lib/
│   ├── hooks/
│   │   └── useQuizSolver.ts         # Hook zarządzający stanem rozwiązywania
│   └── services/
│       └── quiz-attempt.service.ts  # Serwis do submisji odpowiedzi
└── types.ts                         # Rozszerzenie istniejących typów
```

## 📦 Typy Danych (Rozszerzenie types.ts)

```typescript
/** DTO dla odpowiedzi użytkownika na pojedyncze pytanie */
export interface UserAnswerDto {
  question_id: string;
  answer: string | null; // string dla short_answer/true_false, uuid dla multiple_choice
}

/** DTO dla wyniku pojedynczego pytania */
export interface QuestionResultDto {
  question_id: string;
  user_answer: string | null;
  is_correct: boolean;
  correct_answers_data: {
    correct_answer_id?: string; // dla multiple_choice
    acceptable_answers?: string[]; // dla short_answer
    correct_value?: boolean; // dla true_false
  };
}

/** DTO dla wyniku próby rozwiązania quizu */
export interface QuizAttemptResultDto {
  id: string;
  quiz_id: string;
  score_percentage: number;
  completed_at: string;
  results: QuestionResultDto[];
}

/** ViewModel dla stanu rozwiązywania quizu */
export interface QuizSolvingState {
  currentQuestionIndex: number;
  userAnswers: Map<string, string | null>;
  isSubmitting: boolean;
  result?: QuizAttemptResultDto;
}

/** DTO dla szczegółów quizu do rozwiązania (z pełnymi danymi pytań) */
export interface QuizToSolveDto {
  id: string;
  note_id: string;
  note_title: string;
  status: "accepted";
  questions: QuizQuestionDto[];
  created_at: string;
}
```

## 🔧 Implementacja Krok po Kroku

### 1. Backend Service (quiz-attempt.service.ts)

```typescript
/**
 * Pobiera szczegóły quizu do rozwiązania
 * Weryfikuje czy quiz jest w statusie 'accepted'
 */
export async function getQuizForSolving(
  supabase: SupabaseClient,
  quizId: string,
  userId: string
): Promise<QuizToSolveDto | null>;

/**
 * Submituje odpowiedzi użytkownika
 * POST /api/quizzes/{quizId}/attempts
 */
export async function submitQuizAttempt(quizId: string, answers: UserAnswerDto[]): Promise<QuizAttemptResultDto>;
```

### 2. Hook (useQuizSolver.ts)

```typescript
export function useQuizSolver(quiz: QuizToSolveDto) {
  // Stan
  const [state, setState] = useState<QuizSolvingState>({
    currentQuestionIndex: 0,
    userAnswers: new Map(),
    isSubmitting: false,
  });

  // Metody
  const answerQuestion = (questionId: string, answer: string | null) => void;
  const goToNextQuestion = () => void;
  const goToPreviousQuestion = () => void;
  const goToQuestion = (index: number) => void;
  const canSubmit = () => boolean; // czy wszystkie pytania mają odpowiedź
  const submitQuiz = async () => Promise<void>;

  return { state, answerQuestion, goToNextQuestion, goToPreviousQuestion, goToQuestion, canSubmit, submitQuiz };
}
```

### 3. Strona Astro (quizzes/[quizId]/solve.astro)

```astro
---
import Layout from "@/layouts/Layout.astro";
import { QuizSolver } from "@/components/QuizSolver";
import { getQuizForSolving } from "@/lib/services/quiz-attempt.service";

const { quizId } = Astro.params;
const { user, supabase } = Astro.locals;

// Sprawdzenie autoryzacji
if (!user) {
  return Astro.redirect("/auth/login");
}

if (!quizId) {
  return new Response("Quiz ID is required", { status: 400 });
}

// Pobranie danych quizu
const quiz = await getQuizForSolving(supabase, quizId, user.id);

if (!quiz) {
  return new Response("Quiz not found or not accessible", { status: 404 });
}

if (quiz.status !== "accepted") {
  return new Response("This quiz cannot be solved", { status: 400 });
}
---

<Layout title={`Solve Quiz: ${quiz.note_title}`}>
  <main class="container mx-auto max-w-4xl py-12">
    <QuizSolver client:load quiz={quiz} />
  </main>
</Layout>
```

### 4. Główny Komponent (QuizSolver.tsx)

```typescript
export function QuizSolver({ quiz }: { quiz: QuizToSolveDto }) {
  const { state, answerQuestion, goToNextQuestion, goToPreviousQuestion, canSubmit, submitQuiz } = useQuizSolver(quiz);

  // Jeśli quiz został zakończony, pokaż wyniki
  if (state.result) {
    return <QuizResults result={state.result} quiz={quiz} />;
  }

  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header z tytułem notatki */}
      <div>
        <a href={`/notes/${quiz.note_id}`}>← Back to Note</a>
        <h1>{quiz.note_title}</h1>
      </div>

      {/* Pasek postępu */}
      <QuizProgress
        current={state.currentQuestionIndex + 1}
        total={quiz.questions.length}
        progress={progress}
      />

      {/* Pytanie */}
      <QuizQuestion
        question={currentQuestion}
        userAnswer={state.userAnswers.get(currentQuestion.id)}
        onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
      />

      {/* Nawigacja */}
      <div className="flex justify-between">
        <Button
          onClick={goToPreviousQuestion}
          disabled={state.currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {state.currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button onClick={goToNextQuestion}>
            Next
          </Button>
        ) : (
          <Button
            onClick={submitQuiz}
            disabled={!canSubmit() || state.isSubmitting}
          >
            {state.isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        )}
      </div>

      {/* Mini mapa pytań */}
      <div className="flex gap-2 flex-wrap">
        {quiz.questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => goToQuestion(idx)}
            className={cn(
              "w-10 h-10 rounded-md",
              state.userAnswers.has(q.id) ? "bg-primary" : "bg-muted",
              idx === state.currentQuestionIndex && "ring-2"
            )}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 5. Komponent Pytania (QuizQuestion.tsx)

```typescript
interface QuizQuestionProps {
  question: QuizQuestionDto;
  userAnswer: string | null | undefined;
  onAnswer: (answer: string | null) => void;
}

export function QuizQuestion({ question, userAnswer, onAnswer }: QuizQuestionProps) {
  // Renderowanie w zależności od typu pytania
  switch (question.type) {
    case "true_false":
      return <TrueFalseQuestion question={question} userAnswer={userAnswer} onAnswer={onAnswer} />;

    case "multiple_choice":
      return <MultipleChoiceQuestion question={question} userAnswer={userAnswer} onAnswer={onAnswer} />;

    case "short_answer":
      return <ShortAnswerQuestion question={question} userAnswer={userAnswer} onAnswer={onAnswer} />;

    default:
      return <div>Unknown question type</div>;
  }
}

// Sub-komponenty dla każdego typu pytania
function TrueFalseQuestion({ question, userAnswer, onAnswer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
        <CardDescription>True/False Question</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={userAnswer || ""} onValueChange={onAnswer}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`${question.id}-true`} />
            <Label htmlFor={`${question.id}-true`}>True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`${question.id}-false`} />
            <Label htmlFor={`${question.id}-false`}>False</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

function MultipleChoiceQuestion({ question, userAnswer, onAnswer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
        <CardDescription>Multiple Choice Question</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={userAnswer || ""} onValueChange={onAnswer}>
          {question.answers?.map((answer) => (
            <div key={answer.id} className="flex items-center space-x-2">
              <RadioGroupItem value={answer.id} id={answer.id} />
              <Label htmlFor={answer.id}>{answer.content}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

function ShortAnswerQuestion({ question, userAnswer, onAnswer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
        <CardDescription>Short Answer Question</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={userAnswer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
        />
      </CardContent>
    </Card>
  );
}
```

### 6. Komponent Wyników (QuizResults.tsx)

```typescript
interface QuizResultsProps {
  result: QuizAttemptResultDto;
  quiz: QuizToSolveDto;
}

export function QuizResults({ result, quiz }: QuizResultsProps) {
  const correctCount = result.results.filter(r => r.is_correct).length;
  const totalCount = result.results.length;

  return (
    <div className="space-y-6">
      {/* Header z wynikiem */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-5xl font-bold">{result.score_percentage}%</div>
            <p className="text-muted-foreground">
              {correctCount} out of {totalCount} correct
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Przegląd szczegółowy odpowiedzi */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Review Your Answers</h2>
        {result.results.map((questionResult, idx) => {
          const question = quiz.questions.find(q => q.id === questionResult.question_id);
          if (!question) return null;

          return (
            <QuizResultsDetail
              key={question.id}
              question={question}
              result={questionResult}
              questionNumber={idx + 1}
            />
          );
        })}
      </div>

      {/* Akcje */}
      <div className="flex gap-4">
        <Button asChild>
          <a href={`/notes/${quiz.note_id}`}>Back to Note</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/notes">All Notes</a>
        </Button>
      </div>
    </div>
  );
}
```

### 7. Komponent Szczegółów Wyniku (QuizResultsDetail.tsx)

```typescript
interface QuizResultsDetailProps {
  question: QuizQuestionDto;
  result: QuestionResultDto;
  questionNumber: number;
}

export function QuizResultsDetail({ question, result, questionNumber }: QuizResultsDetailProps) {
  return (
    <Card className={result.is_correct ? "border-green-500" : "border-red-500"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question {questionNumber}</CardTitle>
          <Badge variant={result.is_correct ? "default" : "destructive"}>
            {result.is_correct ? "✓ Correct" : "✗ Incorrect"}
          </Badge>
        </div>
        <CardDescription>{question.type.replace(/_/g, " ")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold mb-2">{question.content}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Your answer:</p>
          <p className="font-medium">
            {formatUserAnswer(question, result.user_answer)}
          </p>
        </div>

        {!result.is_correct && (
          <div>
            <p className="text-sm text-muted-foreground">Correct answer:</p>
            <p className="font-medium text-green-600">
              {formatCorrectAnswer(question, result.correct_answers_data)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions
function formatUserAnswer(question: QuizQuestionDto, userAnswer: string | null) {
  if (!userAnswer) return "No answer provided";

  if (question.type === "multiple_choice") {
    const answer = question.answers?.find(a => a.id === userAnswer);
    return answer?.content || "Unknown answer";
  }

  return userAnswer;
}

function formatCorrectAnswer(question: QuizQuestionDto, correctData: any) {
  if (question.type === "multiple_choice" && correctData.correct_answer_id) {
    const answer = question.answers?.find(a => a.id === correctData.correct_answer_id);
    return answer?.content || "Unknown answer";
  }

  if (question.type === "true_false") {
    return correctData.correct_value ? "True" : "False";
  }

  if (question.type === "short_answer" && correctData.acceptable_answers) {
    return correctData.acceptable_answers.join(" / ");
  }

  return "N/A";
}
```

### 8. Komponent Postępu (QuizProgress.tsx)

```typescript
interface QuizProgressProps {
  current: number;
  total: number;
  progress: number;
}

export function QuizProgress({ current, total, progress }: QuizProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Question {current} of {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
```

## 🔌 Endpoint API

### POST /api/quizzes/{quizId}/attempts

**Request Body:**

```json
{
  "answers": [
    {
      "question_id": "uuid",
      "answer": "string | uuid"
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "quiz_id": "uuid",
  "score_percentage": 85,
  "completed_at": "2025-10-29T10:00:00Z",
  "results": [
    {
      "question_id": "uuid",
      "user_answer": "string | uuid",
      "is_correct": true,
      "correct_answers_data": {
        "correct_answer_id": "uuid",
        "acceptable_answers": ["answer1", "answer2"],
        "correct_value": true
      }
    }
  ]
}
```

## 🎨 UI/UX Szczegóły

### Nawigacja między pytaniami:

- ✅ Przyciski Previous/Next
- ✅ Mini mapa z numerami pytań (wizualizacja postępu)
- ✅ Możliwość przeskakiwania do dowolnego pytania
- ✅ Wizualne oznaczenie pytań z odpowiedziami

### Feedback dla użytkownika:

- ✅ Pasek postępu pokazujący % ukończenia
- ✅ Licznik pytań (X of Y)
- ✅ Walidacja przed submisją (wszystkie pytania muszą mieć odpowiedź)
- ✅ Spinner podczas submisji
- ✅ Toast z informacją o sukcesie/błędzie

### Wyniki:

- ✅ Duży, wyraźny wynik procentowy
- ✅ Liczba poprawnych/wszystkich odpowiedzi
- ✅ Szczegółowy przegląd każdego pytania
- ✅ Kolorowe oznaczenia (zielony = poprawne, czerwony = błędne)
- ✅ Pokazanie poprawnej odpowiedzi dla błędnych pytań

### Responsywność:

- ✅ Mobile-first approach
- ✅ Minimapa pytań zawijana na małych ekranach
- ✅ Duże, łatwe do kliknięcia przyciski na urządzeniach dotykowych

### Dostępność (a11y):

- ✅ Pełna obsługa klawiaturą (Tab, Enter, strzałki)
- ✅ ARIA labels dla radio buttons i pól tekstowych
- ✅ Semantyczne HTML (form elements)
- ✅ Focus indicators
- ✅ Screen reader friendly

## 📝 Dodatkowe Komponenty UI (Shadcn/ui)

Wykorzystamy istniejące komponenty:

- ✅ `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription`
- ✅ `Button`
- ✅ `RadioGroup`, `RadioGroupItem`
- ✅ `Label`
- ✅ `Textarea`
- ✅ `Badge`
- ✅ `Alert`
- ⚠️ `Progress` - **do dodania**

Nowy komponent do utworzenia:

```bash
npx shadcn@latest add progress
```

## 🧪 Testy i Walidacja

### Scenariusze testowe:

1. ✅ Użytkownik może rozwiązać quiz z wszystkimi typami pytań
2. ✅ System waliduje czy wszystkie pytania mają odpowiedź przed submisją
3. ✅ Użytkownik może nawigować między pytaniami bez utraty odpowiedzi
4. ✅ Wyniki są poprawnie obliczane i wyświetlane
5. ✅ System pokazuje poprawne odpowiedzi dla błędnych pytań
6. ✅ Quiz można rozwiązać tylko jeśli jest w statusie "accepted"
7. ✅ Użytkownik ma dostęp tylko do własnych quizów

### Error handling:

- ❌ Quiz nie istnieje → 404
- ❌ Quiz nie należy do użytkownika → 403/404
- ❌ Quiz nie jest w statusie "accepted" → 400
- ❌ Błąd sieci podczas submisji → Toast z opcją retry
- ❌ Nieprawidłowe dane w odpowiedziach → 400 z komunikatem

## 🔗 Integracja z Istniejącym Kodem

### Linki do strony rozwiązywania:

1. **Z widoku notatki** - przycisk "Solve Quiz" przy liście quizów
2. **Z listy quizów** - przycisk "Solve" dla zaakceptowanych quizów
3. **Z Dashboard** - dla quizów zaplanowanych do powtórki (SRS)

### Aktualizacje istniejących komponentów:

- `NotesView.tsx` - dodać listę quizów z linkami do rozwiązywania
- Ewentualny nowy komponent `QuizzesList.tsx` dla widoku wszystkich quizów użytkownika

## 📅 Kolejność Implementacji

1. **Typy i Interfaces** (types.ts) - 15 min
2. **Backend Service** (quiz-attempt.service.ts) - 30 min
3. **Hook** (useQuizSolver.ts) - 45 min
4. **Strona Astro** (solve.astro) - 15 min
5. **QuizProgress** - 15 min
6. **QuizQuestion** + sub-komponenty - 60 min
7. **QuizSolver** (główny komponent) - 45 min
8. **QuizResults** - 30 min
9. **QuizResultsDetail** - 30 min
10. **Dodanie Progress component** - 5 min
11. **Integracja z istniejącymi widokami** - 30 min
12. **Testy i walidacja** - 60 min

**Szacowany czas: ~6 godzin**

## ✅ Definition of Done

- [ ] Użytkownik może otworzyć quiz w trybie rozwiązywania
- [ ] Wszystkie typy pytań są poprawnie renderowane
- [ ] Nawigacja między pytaniami działa płynnie
- [ ] System waliduje kompletność odpowiedzi
- [ ] Submisja działa poprawnie z obsługą błędów
- [ ] Wyniki są wyświetlane z pełnymi szczegółami
- [ ] Komponenty są w pełni responsywne
- [ ] Kod jest zgodny z wytycznymi a11y
- [ ] Wszystkie scenariusze testowe przechodzą
- [ ] Integracja z istniejącymi widokami jest kompletna
- [ ] Dokumentacja jest zaktualizowana

## 🚀 Możliwe Rozszerzenia (Post-MVP)

- Timer dla quizu (opcjonalny limit czasowy)
- Możliwość zapisania postępu i kontynuacji później
- Tryb "practice" bez zapisywania wyników
- Eksport wyników do PDF
- Porównanie z poprzednimi próbami
- Hints/podpowiedzi dla pytań (opcjonalne)
- Komentarze/wyjaśnienia dla pytań

---

## 📊 Zgodność z PRD

| Wymaganie                      | Status | Uwagi                                  |
| ------------------------------ | ------ | -------------------------------------- |
| FW-08: Rozwiązywanie Quizów    | ✅     | Pełna implementacja                    |
| US-017: Rozwiązywanie quizu    | ✅     | Interfejs zgodny z kryteriami          |
| US-018: Weryfikacja odpowiedzi | ✅     | Automatyczna weryfikacja + wyniki      |
| Responsywność (mobile-first)   | ✅     | Zgodnie z ui-architecture.md           |
| Dostępność (a11y)              | ✅     | Pełna obsługa klawiatury + ARIA        |
| Integracja z API               | ✅     | Zgodnie z api-plan.md                  |
| Obsługa błędów                 | ✅     | Scentralizowana + przyjazne komunikaty |

---

**UWAGA**: Ten plan czeka na Twój feedback przed rozpoczęciem implementacji! 🎯
