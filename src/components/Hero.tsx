import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-slate-400/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,_theme(colors.primary/10%)_0%,_transparent_40%)]" />

      {/* Wave */}
      <div className="absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2">
        <svg
          viewBox="0 0 1024 384"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={192}
            r={512}
            fill="url(#gradient-purple)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient
              id="gradient-purple"
              cx={0}
              cy={0}
              r={1}
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(512 192) rotate(90) scale(512)"
            >
              <stop stopColor="oklch(var(--primary))" />
              <stop offset={1} stopColor="oklch(var(--secondary))" stopOpacity={0} />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              Ucz się 10x szybciej z AI
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Przekształć swoje notatki w{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              inteligentne quizy
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Twórz notatki w Markdown, a AI automatycznie wygeneruje
            spersonalizowane quizy. System powtórek SRS zadba o to, żebyś
            zapamiętał materiał na dłużej.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="default"
              size="lg"
              className="group text-base"
              asChild
            >
              <a href="/auth/login">
                Zacznij za darmo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12">
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent">
                AI-Powered
              </div>
              <div className="text-sm text-muted-foreground">
                Generowanie quizów
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-3xl font-bold text-transparent">
                SRS
              </div>
              <div className="text-sm text-muted-foreground">
                System powtórek
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-accent to-primary bg-clip-text text-3xl font-bold text-transparent">
                Markdown
              </div>
              <div className="text-sm text-muted-foreground">Proste notatki</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
