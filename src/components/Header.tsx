import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="text-xl font-bold">
          10xNoteQuiz
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
