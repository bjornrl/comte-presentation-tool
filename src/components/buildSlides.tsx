export type OutputType = "presentation" | "report";

export type Slide =
  | { kind: "cover"; title: string; subtitle?: string }
  | { kind: "category"; categoryId: string }
  | { kind: "expertise"; categoryId: string }
  | { kind: "stats"; categoryId: string }
  | { kind: "clients"; categoryId: string }
  | { kind: "project"; projectId: string }
  | { kind: "outro"; title?: string };

// Card and cx moved to ../components/ui.tsx

export default function buildSlides(
  categoryId: string | null,
  projectIds: string[],
  output: OutputType
): Slide[] {
  const slides: Slide[] = [];
  slides.push({
    kind: "cover",
    title: "Tilbudsforslag",
    subtitle: "ComteBureau",
  });
  if (categoryId) {
    slides.push({ kind: "category", categoryId });
    slides.push({ kind: "expertise", categoryId });
    slides.push({ kind: "stats", categoryId });
    slides.push({ kind: "clients", categoryId });
  }
  for (const pid of projectIds)
    slides.push({ kind: "project", projectId: pid });
  slides.push({
    kind: "outro",
    title: output === "report" ? "Takk" : "Spørsmål?",
  });
  return slides;
}
