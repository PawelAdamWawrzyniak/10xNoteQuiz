import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoteFormSchema } from "@/lib/schemas/note.schemas";
import type { NoteFormViewModel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NoteFormProps {
  initialData?: NoteFormViewModel;
  onSubmit: (data: NoteFormViewModel) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

export function NoteForm({ initialData, onSubmit, onCancel, isSubmitting, mode }: NoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormViewModel>({
    resolver: zodResolver(NoteFormSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      categoryId: null,
      tags: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Nowa Notatka" : "Edytuj Notatkę"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Tytuł <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Wprowadź tytuł notatki"
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Treść <span className="text-destructive">*</span>
            </label>
            <textarea
              id="content"
              {...register("content")}
              rows={15}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder="Wprowadź treść notatki w formacie Markdown..."
              disabled={isSubmitting}
            />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
            <p className="text-xs text-muted-foreground">Możesz używać składni Markdown do formatowania tekstu</p>
          </div>

          {/* Category Field - placeholder for future implementation */}
          <div className="space-y-2">
            <label htmlFor="categoryId" className="text-sm font-medium">
              Kategoria <span className="text-muted-foreground text-xs">(opcjonalne)</span>
            </label>
            <input
              id="categoryId"
              type="text"
              {...register("categoryId")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
              placeholder="Funkcja dostępna wkrótce"
              disabled={true}
            />
            <p className="text-xs text-muted-foreground">Kategorie będą dostępne w przyszłej wersji</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Anuluj
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Zapisywanie..." : mode === "create" ? "Utwórz Notatkę" : "Zapisz Zmiany"}
        </Button>
      </div>
    </form>
  );
}
