import { Badge } from "@/components/ui/badge";

const technologies = [
  { name: "Astro 5", category: "Framework" },
  { name: "React 19", category: "UI Library" },
  { name: "TypeScript 5", category: "Language" },
  { name: "Tailwind 4", category: "Styling" },
  { name: "Shadcn/ui", category: "Components" },
  { name: "Supabase", category: "Backend" },
  { name: "OpenRouter", category: "AI Gateway" },
];

export const TechStack = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Zbudowane na najlepszych technologiach
          </h2>
          <p className="text-lg text-muted-foreground">
            Nowoczesny stack zapewniający wydajność, skalowalność i świetne doświadczenie użytkownika
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-8">
            {technologies.map((tech, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="px-4 py-2 text-base border-primary/20 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <span className="font-semibold">{tech.name}</span>
                <span className="ml-2 text-muted-foreground text-sm">· {tech.category}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
