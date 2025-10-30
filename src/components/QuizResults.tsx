import type { QuizAttemptResultDto, QuizToSolveDto } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResultsDetail } from "./QuizResultsDetail";

interface QuizResultsProps {
  result: QuizAttemptResultDto;
  quiz: QuizToSolveDto;
}

export function QuizResults({ result, quiz }: QuizResultsProps) {
  const correctCount = result.results.filter((r) => r.is_correct).length;
  const totalCount = result.results.length;

  return (
    <div className="space-y-6">
      {/* Header with score */}
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

      {/* Detailed review of answers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Review Your Answers</h2>
        {result.results.map((questionResult, idx) => {
          const question = quiz.questions.find((q) => q.id === questionResult.question_id);
          if (!question) return null;

          return (
            <QuizResultsDetail key={question.id} question={question} result={questionResult} questionNumber={idx + 1} />
          );
        })}
      </div>

      {/* Actions */}
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
