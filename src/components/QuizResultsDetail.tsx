import type { QuizQuestionDto, QuestionResultDto } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <p className="font-medium">{formatUserAnswer(question, result.user_answer)}</p>
        </div>

        {!result.is_correct && (
          <div>
            <p className="text-sm text-muted-foreground">Correct answer:</p>
            <p className="font-medium text-green-600">{formatCorrectAnswer(question, result.correct_answers_data)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatUserAnswer(question: QuizQuestionDto, userAnswer: string | null): string {
  if (!userAnswer) return "No answer provided";

  if (question.type === "multiple_choice") {
    const answer = question.answers?.find((a) => a.id === userAnswer);
    return answer?.content || "Unknown answer";
  }

  if (question.type === "true_false") {
    return userAnswer === "true" ? "Prawda" : "Fałsz";
  }

  return userAnswer;
}

function formatCorrectAnswer(
  question: QuizQuestionDto,
  correctData: {
    correct_answer_id?: string;
    acceptable_answers?: string[];
    correct_value?: boolean;
  }
): string {
  if (question.type === "multiple_choice" && correctData.correct_answer_id) {
    const answer = question.answers?.find((a) => a.id === correctData.correct_answer_id);
    return answer?.content || "Unknown answer";
  }

  if (question.type === "true_false") {
    return correctData.correct_value ? "Prawda" : "Fałsz";
  }

  if (question.type === "short_answer" && correctData.acceptable_answers) {
    return correctData.acceptable_answers.join(" / ");
  }

  return "N/A";
}
