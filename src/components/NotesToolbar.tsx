import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NotesToolbarProps {
  onCreateNew: () => void;
}

export function NotesToolbar({ onCreateNew }: NotesToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Moje Notatki</h1>
      <Button onClick={onCreateNew} className="gap-2">
        <Plus className="h-4 w-4" />
        Nowa Notatka
      </Button>
    </div>
  );
}
