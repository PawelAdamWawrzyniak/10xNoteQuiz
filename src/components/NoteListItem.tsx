import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { NoteListItemDto } from "@/types";

interface NoteListItemProps {
  note: NoteListItemDto;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
}

export function NoteListItem({ note, onEdit, onDelete }: NoteListItemProps) {
  const formattedDate = new Date(note.updated_at).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold line-clamp-2">{note.title}</CardTitle>
          <div className="flex gap-2 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onEdit(note.id)} aria-label="Edytuj notatkę">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(note.id)}
              aria-label="Usuń notatkę"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Zaktualizowano: {formattedDate}</p>
      </CardContent>
    </Card>
  );
}
