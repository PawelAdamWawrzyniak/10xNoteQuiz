import type { QuizQuestionDto } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuizQuestionProps {
  question: QuizQuestionDto;
  userAnswer: string | null | undefined;
  onAnswer: (answer: string | null) => void;
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
  userAnswer: string | null | undefined;
  onAnswer: (answer: string | null) => void;
}) {
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
  userAnswer: string | null | undefined;
  onAnswer: (answer: string | null) => void;
}) {
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

function ShortAnswerQuestion({
  question,
  userAnswer,
  onAnswer,
}: {
  question: QuizQuestionDto;
  userAnswer: string | null | undefined;
  onAnswer: (answer: string | null) => void;
}) {
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
