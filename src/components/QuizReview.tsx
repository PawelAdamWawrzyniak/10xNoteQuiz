import type { QuizGenerationResponseDto } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface QuizReviewProps {
  quiz: QuizGenerationResponseDto;
  onAccept: (quizId: string) => void;
  onReject: (quizId: string) => void;
  isRegenerated?: boolean;
}

export function QuizReview({ quiz, onAccept, onReject, isRegenerated }: QuizReviewProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-bold">Quiz Review</h2>
        <p className="text-muted-foreground">Review the generated quiz. Accept it or generate a new one.</p>
      </div>

      {isRegenerated && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            New quiz generated successfully! Review the questions below.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-h-[60vh] overflow-y-auto rounded-md border p-4 space-y-4">
        {quiz.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>Question {index + 1}</CardTitle>
              <CardDescription>Type: {question.type.replace(/_/g, " ")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{question.content}</p>
              {question.answers && question.answers.length > 0 && (
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {question.answers.map((answer) => (
                    <li key={answer.id} className="text-sm text-muted-foreground">
                      {answer.content}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => onReject(quiz.id)}>
          Reject & Regenerate
        </Button>
        <Button onClick={() => onAccept(quiz.id)}>Accept Quiz</Button>
      </div>
    </div>
  );
}
