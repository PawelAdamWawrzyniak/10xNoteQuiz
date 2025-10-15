import { useState, useMemo, useEffect } from "react";
import { useQuizGeneration } from "@/lib/hooks/useQuizGeneration";
import { QuizGenerationModal } from "@/components/QuizGenerationModal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface QuizGenerationControllerProps {
  noteId: string;
  hasUserApiKey: boolean;
  freeQuizzesRemaining: number;
}

export function QuizGenerationController({
  noteId,
  hasUserApiKey,
  freeQuizzesRemaining,
}: QuizGenerationControllerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generationState, generateQuiz, acceptQuiz, rejectQuiz, resetState } = useQuizGeneration(noteId);

  const isGenerating = useMemo(
    () => generationState.status !== "idle" && generationState.status !== "accepted",
    [generationState.status]
  );

  // Open the modal whenever the generation process starts
  useEffect(() => {
    if (isGenerating) {
      setIsModalOpen(true);
    }
  }, [isGenerating]);

  const handleGenerateClick = () => {
    generateQuiz();
  };

  const handleCloseModal = () => {
    // Do not close the modal if the process is still running,
    // allow closing only on idle or success/error states that have a close button.
    if (
      generationState.status === "loading" ||
      generationState.status === "timeout" ||
      generationState.status === "accepting"
    ) {
      return;
    }
    setIsModalOpen(false);
    resetState();
  };

  const handleAccept = (quizId: string) => {
    console.log("[Controller] handleAccept called for quizId:", quizId);
    const promise = acceptQuiz(quizId);

    toast.promise(promise, {
      loading: "Accepting quiz...",
      success: () => {
        console.log("[Controller] Toast success");
        // Close modal after showing the success toast
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
        return "Quiz was accepted";
      },
      error: (err) => {
        console.error("[Controller] Toast error:", err);
        return err.message || "Failed to accept quiz.";
      },
    });
  };

  const handleReject = (quizId: string) => {
    const promise = rejectQuiz(quizId);

    toast.promise(promise, {
      loading: "Rejecting and regenerating quiz...",
      success: "Quiz rejected! New quiz generated successfully.",
      error: (err) => err.message || "Failed to reject quiz.",
    });
  };

  const handleCancel = () => {
    resetState();
    setIsModalOpen(false);
  };

  const buttonTooltip = !hasUserApiKey
    ? `You have ${freeQuizzesRemaining} free quiz generations remaining.`
    : "Generate a new quiz from this note.";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleGenerateClick} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Quiz"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{buttonTooltip}</p>
        </TooltipContent>
      </Tooltip>

      <QuizGenerationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        generationState={generationState}
        onAccept={handleAccept}
        onReject={handleReject}
        onWaitLonger={generateQuiz} // Re-triggering generation resets the timeout
        onCancel={handleCancel}
      />
    </TooltipProvider>
  );
}
