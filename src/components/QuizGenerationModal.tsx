import type { QuizGenerationState } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuizReview } from "@/components/QuizReview";
import { Loader2, AlertTriangle, TimerOff, CheckCircle2 } from "lucide-react";

interface QuizGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationState: QuizGenerationState;
  onAccept: (quizId: string) => void;
  onReject: (quizId: string) => void;
  onWaitLonger: () => void;
  onCancel: () => void;
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <p className="text-lg text-muted-foreground">Generating your quiz...</p>
    <p className="text-sm text-muted-foreground">This may take a moment.</p>
  </div>
);

const AcceptingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <p className="text-lg text-muted-foreground">Accepting quiz...</p>
  </div>
);

const AcceptedMessage = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <CheckCircle2 className="h-12 w-12 text-green-600" />
    <p className="text-lg font-semibold text-green-600">Quiz was accepted!</p>
    <p className="text-sm text-muted-foreground">Closing modal...</p>
  </div>
);

const TimeoutPrompt = ({ onWaitLonger, onCancel }: { onWaitLonger: () => void; onCancel: () => void }) => (
  <>
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <TimerOff className="h-6 w-6 text-yellow-500" />
        Still working on it...
      </DialogTitle>
      <DialogDescription>
        The quiz generation is taking longer than expected. What would you like to do?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="pt-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onWaitLonger}>Wait a little longer</Button>
    </DialogFooter>
  </>
);

const ErrorMessage = ({ message, code, onCancel }: { message: string; code?: number; onCancel: () => void }) => (
  <>
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        An error occurred
      </DialogTitle>
      <DialogDescription>{message}</DialogDescription>
    </DialogHeader>
    <DialogFooter className="pt-4">
      {code === 402 && (
        <Button variant="outline" asChild>
          <a href="/settings">Go to settings</a>
        </Button>
      )}
      <Button onClick={onCancel}>Close</Button>
    </DialogFooter>
  </>
);

export function QuizGenerationModal({
  isOpen,
  onClose,
  generationState,
  onAccept,
  onReject,
  onWaitLonger,
  onCancel,
}: QuizGenerationModalProps) {
  const renderContent = () => {
    switch (generationState.status) {
      case "loading":
        return <LoadingSpinner />;
      case "accepting":
        return <AcceptingSpinner />;
      case "accepted":
        return <AcceptedMessage />;
      case "timeout":
        return <TimeoutPrompt onWaitLonger={onWaitLonger} onCancel={onCancel} />;
      case "success":
        return (
          <QuizReview
            quiz={generationState.quiz}
            onAccept={onAccept}
            onReject={onReject}
            isRegenerated={generationState.isRegenerated}
          />
        );
      case "error":
        return <ErrorMessage message={generationState.message} code={generationState.code} onCancel={onCancel} />;
      case "idle":
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl" onInteractOutside={(e) => e.preventDefault()}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
