import { QueryClientProvider } from "@/components/QueryClientProvider";
import { NotesView } from "@/components/NotesView";

export function NotesApp() {
  return (
    <QueryClientProvider>
      <NotesView />
    </QueryClientProvider>
  );
}
