import { GithubIcon } from "./icons/GithubIcon";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              10xNoteQuiz
            </h3>
            <p className="text-sm text-muted-foreground">
              Aplikacja do skutecznej nauki wspierana przez AI i system powtórek SRS.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Polityki</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/privacy-policy" className="hover:text-foreground transition-colors">
                  Polityka Prywatności
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="hover:text-foreground transition-colors">
                  Polityka Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Github</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/PawelAdamWawrzyniak/10xdevs-project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-muted p-2 hover:bg-primary/10 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 10xNoteQuiz. Wszystkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};
