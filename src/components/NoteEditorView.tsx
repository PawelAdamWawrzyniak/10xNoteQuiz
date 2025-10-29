import { NoteForm } from "@/components/NoteForm";
import { useNoteQuery, useCreateNoteMutation, useUpdateNoteMutation } from "@/lib/hooks/useNotes";
import type { NoteFormViewModel } from "@/types";
import { toast } from "sonner";

interface NoteEditorViewProps {
  mode: "create" | "edit";
  noteId?: string;
}

export function NoteEditorView({ mode, noteId }: NoteEditorViewProps) {
  const { data: note, isLoading, error } = useNoteQuery(mode === "edit" ? noteId : undefined);
  const createMutation = useCreateNoteMutation();
  const updateMutation = useUpdateNoteMutation();

  const handleSubmit = async (data: NoteFormViewModel) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Notatka została utworzona");
        window.location.href = "/notes";
      } else if (mode === "edit" && noteId) {
        await updateMutation.mutateAsync({ noteId, data });
        toast.success("Notatka została zaktualizowana");
        window.location.href = "/notes";
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save note:", error);
      toast.error("Wystąpił błąd podczas zapisywania notatki");
    }
  };

  const handleCancel = () => {
    // Ensure navigation works by using window.location.assign
    window.location.assign("/notes");
  };

  // Loading state for edit mode
  if (mode === "edit" && isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  // Error state for edit mode
  if (mode === "edit" && error) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="text-center">
          <p className="text-lg text-destructive">Nie udało się załadować notatki</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
          <button onClick={handleCancel} className="mt-4 text-primary hover:underline">
            Wróć do listy notatek
          </button>
        </div>
      </div>
    );
  }

  // Check if note exists for edit mode
  if (mode === "edit" && !note) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Notatka nie została znaleziona</p>
          <button onClick={handleCancel} className="mt-4 text-primary hover:underline">
            Wróć do listy notatek
          </button>
        </div>
      </div>
    );
  }

  const initialData: NoteFormViewModel | undefined =
    mode === "edit" && note
      ? {
          title: note.title,
          content: note.content,
          categoryId: note.category_id,
          tags: note.tags,
        }
      : undefined;

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <NoteForm
        mode={mode}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
