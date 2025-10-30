import type { QuizQuestionDto } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuizQuestionProps {
  question: QuizQuestionDto;
  userAnswer: string | string[] | null | undefined;
  onAnswer: (answer: string | string[] | null) => void;
}

export function QuizQuestion({ question, userAnswer, onAnswer }: QuizQuestionProps) {
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

function TrueFalseQuestion({
  question,
  userAnswer,
  onAnswer,
}: {
  question: QuizQuestionDto;
  userAnswer: string | string[] | null | undefined;
  onAnswer: (answer: string | string[] | null) => void;
}) {
  const stringAnswer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
        <CardDescription>True/False Question</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={stringAnswer || ""} onValueChange={onAnswer}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`${question.id}-true`} />
            <Label htmlFor={`${question.id}-true`}>Prawda</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`${question.id}-false`} />
            <Label htmlFor={`${question.id}-false`}>Fałsz</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

function MultipleChoiceQuestion({
  question,
  userAnswer,
  onAnswer,
}: {
  question: QuizQuestionDto;
  userAnswer: string | string[] | null | undefined;
  onAnswer: (answer: string | string[] | null) => void;
}) {
  const selectedAnswers = Array.isArray(userAnswer) ? userAnswer : [];

  const toggleAnswer = (answerId: string) => {
    const newSelection = selectedAnswers.includes(answerId)
      ? selectedAnswers.filter((id) => id !== answerId)
      : [...selectedAnswers, answerId];
    onAnswer(newSelection.length > 0 ? newSelection : null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
        <CardDescription>Multiple Choice - Select all that apply</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.answers?.map((answer) => (
          <div key={answer.id} className="flex items-center space-x-2">
            <Checkbox
              id={answer.id}
              checked={selectedAnswers.includes(answer.id)}
              onCheckedChange={() => toggleAnswer(answer.id)}
            />
            <Label htmlFor={answer.id} className="cursor-pointer">
              {answer.content}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ShortAnswerQuestion({
  question,
  userAnswer,
  onAnswer,
}: {
  question: QuizQuestionDto;
  userAnswer: string | string[] | null | undefined;
  onAnswer: (answer: string | string[] | null) => void;
}) {
  const stringAnswer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.content}</CardTitle>
        <CardDescription>Short Answer Question</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={stringAnswer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
        />
      </CardContent>
    </Card>
  );
}
