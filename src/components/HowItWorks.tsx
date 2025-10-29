import { FileText, Sparkles, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: FileText,
    title: "1. Twórz notatki",
    description: "Pisz notatki w prostym formacie Markdown. Organizuj je za pomocą tagów i kategorii.",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    title: "2. Generuj quizy",
    description: "AI automatycznie tworzy quizy z Twoich notatek - pytania zamknięte, prawda/fałsz i otwarte.",
    color: "text-secondary",
  },
  {
    icon: Brain,
    title: "3. Ucz się efektywnie",
    description: "System SRS planuje powtórki w optymalnych momentach, zwiększając zapamiętywanie o 10x.",
    color: "text-accent",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Jak to działa?</h2>
          <p className="text-lg text-muted-foreground">Trzy proste kroki do skutecznej nauki</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-2 transition-all hover:shadow-[var(--shadow-elegant)] hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              <CardContent className="pt-8 pb-6 space-y-4">
                <div className={`inline-flex items-center justify-center rounded-2xl bg-muted p-4 ${step.color}`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
