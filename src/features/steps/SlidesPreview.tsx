import useCMS from "../../components/useCMS";
import type { Slide } from "../../components/buildSlides";

export default function SlidesPreview({ slides }: { slides: Slide[] }) {
  const cms = useCMS();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {slides.map((s, i) => {
        const base = "rounded-4xl border p-4 min-h-[140px] bg-white";
        if (s.kind === "cover")
          return (
            <div key={i} className={base}>
              <div className="text-sm opacity-60">Cover</div>
              <div className="mt-2 text-xl font-semibold">{s.title}</div>
              {s.subtitle && (
                <div className="text-neutral-600">{s.subtitle}</div>
              )}
            </div>
          );
        if (s.kind === "outro")
          return (
            <div key={i} className={base}>
              <div className="text-sm opacity-60">Outro</div>
              <div className="mt-2 text-xl font-semibold">
                {s.title ?? "Takk"}
              </div>
            </div>
          );
        if (s.kind === "category") {
          const cmsNow = cms as any;
          const cat = cmsNow.categories.find((c: any) => c.id === s.categoryId);
          return (
            <div key={i} className={base}>
              <div className="text-sm opacity-60">Kategori</div>
              <div className="mt-2 text-lg font-semibold">{cat?.title}</div>
              <p className="text-neutral-600 mt-1 text-sm">{cat?.blurb}</p>
            </div>
          );
        }
        if (s.kind === "expertise") {
          const cmsNow = cms as any;
          const cat = cmsNow.categories.find((c: any) => c.id === s.categoryId);
          return (
            <div key={i} className={base}>
              <div className="text-sm opacity-60">Ekspertise</div>
              <div className="mt-2 text-sm">
                {(cat?.expertise || [])
                  .slice(0, 2)
                  .map((e: string, idx: number) => (
                    <div key={idx}>• {e}</div>
                  ))}
              </div>
            </div>
          );
        }
        if (s.kind === "stats") {
          const cmsNow = cms as any;
          const cat = cmsNow.categories.find((c: any) => c.id === s.categoryId);
          return (
            <div key={i} className={base}>
              <div className="text-sm opacity-60">Statistikk</div>
              <div className="mt-2 text-lg font-semibold">
                {cat?.stats || ""}
              </div>
            </div>
          );
        }
        const cmsNow = cms as any;
        const proj = cmsNow.projects.find((p: any) => p.id === s.projectId);
        return (
          <div key={i} className={base}>
            <div className="text-sm opacity-60">Prosjekt</div>
            <div className="mt-2 font-semibold">{proj?.title}</div>
            <p className="text-neutral-600 text-sm line-clamp-3">
              {proj?.excerpt}
            </p>
          </div>
        );
      })}
    </div>
  );
}
