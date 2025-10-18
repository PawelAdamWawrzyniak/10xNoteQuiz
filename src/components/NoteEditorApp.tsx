import { QueryClientProvider } from "@/components/QueryClientProvider";
import { NoteEditorView } from "@/components/NoteEditorView";

interface NoteEditorAppProps {
  mode: "create" | "edit";
  noteId?: string;
}

export function NoteEditorApp({ mode, noteId }: NoteEditorAppProps) {
  return (
    <QueryClientProvider>
      <NoteEditorView mode={mode} noteId={noteId} />
    </QueryClientProvider>
  );
}
