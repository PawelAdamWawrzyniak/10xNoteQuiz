import { Lock, Zap, BookOpen, BarChart3, Tag, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Generowanie AI",
    description: "Automatyczne tworzenie quizów dostosowanych do Twojego materiału",
  },
  {
    icon: Brain,
    title: "System SRS",
    description: "Inteligentne planowanie powtórek dla maksymalnego zapamiętywania",
  },
  {
    icon: BookOpen,
    title: "Markdown",
    description: "Proste i elastyczne tworzenie notatek w popularnym formacie",
  },
  {
    icon: Tag,
    title: "Organizacja",
    description: "Tagi i kategorie dla lepszego zarządzania materiałem",
  },
  {
    icon: BarChart3,
    title: "Statystyki",
    description: "Śledź swoje postępy i analizuj wyniki nauki",
  },
  {
    icon: Lock,
    title: "Własne klucze API",
    description: "Kontrola nad kosztami i prywatnością - używaj własnych kluczy AI",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Wszystko czego potrzebujesz</h2>
          <p className="text-lg text-muted-foreground">Kompleksowe narzędzie do skutecznej nauki</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
            >
              <CardHeader>
                <div className="mb-2 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
