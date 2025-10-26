import { NoteListItem } from "@/components/NoteListItem";
import type { NoteListItemDto } from "@/types";

interface NotesListProps {
  notes: NoteListItemDto[];
  onView: (noteId: string) => void;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  isLoading?: boolean;
}

export function NotesList({ notes, onView, onEdit, onDelete, isLoading }: NotesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Brak notatek do wyświetlenia</p>
        <p className="text-sm text-muted-foreground mt-2">Utwórz swoją pierwszą notatkę, aby zacząć</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
