import { useState } from "react";
import { NotesToolbar } from "@/components/NotesToolbar";
import { NotesList } from "@/components/NotesList";
import { PaginationControls } from "@/components/PaginationControls";
import { DeleteNoteDialog } from "@/components/DeleteNoteDialog";
import { useNotesQuery, useDeleteNoteMutation } from "@/lib/hooks/useNotes";
import type { NotesFilterViewModel } from "@/types";
import { toast } from "sonner";

export function NotesView() {
  const [filters, setFilters] = useState<NotesFilterViewModel>({
    page: 1,
    pageSize: 20,
    sortBy: "updated_at",
    order: "desc",
  });

  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const { data, isLoading, error } = useNotesQuery(filters);
  const deleteMutation = useDeleteNoteMutation();

  const handleCreateNew = () => {
    window.location.href = "/notes/new";
  };

  const handleEdit = (noteId: string) => {
    window.location.href = `/notes/${noteId}/edit`;
  };

  const handleDeleteClick = (noteId: string) => {
    setDeleteNoteId(noteId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteNoteId) return;

    try {
      await deleteMutation.mutateAsync(deleteNoteId);
      toast.success("Notatka została usunięta");
      setDeleteNoteId(null);
    } catch (error) {
      toast.error("Nie udało się usunąć notatki");
      console.error("Delete error:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteNoteId(null);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="text-center">
          <p className="text-lg text-destructive">Wystąpił błąd podczas ładowania notatek</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <NotesToolbar onCreateNew={handleCreateNew} />

      <NotesList notes={data?.data || []} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      {data && data.pagination.total_pages > 1 && (
        <div className="mt-8">
          <PaginationControls
            currentPage={data.pagination.current_page}
            totalPages={data.pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <DeleteNoteDialog
        isOpen={deleteNoteId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
