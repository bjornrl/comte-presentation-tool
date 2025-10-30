import { Images } from "lucide-react";
import StepHeader from "../../components/stepheader";
import Pill from "../../components/pill";
import { Card, cx } from "../../components/ui";

export default function Step2Projects({
  categories,
  filteredProjects,
  selectedProjects,
  setSelectedProjects,
  query,
  setQuery,
  setStep,
}: {
  categories: any[];
  filteredProjects: any[];
  selectedProjects: string[];
  setSelectedProjects: (updater: (prev: string[]) => string[]) => void;
  query: string;
  setQuery: (q: string) => void;
  setStep: (s: 1 | 2 | 3 | 4) => void;
}) {
  return (
    <section>
      <StepHeader
        title="Hvilke prosjekter vil du inkludere?"
        subtitle="Slå på prosjekter som er relevante. Du kan søke og filtrere."
      />
      <div className="mb-4 flex items-center gap-3">
        <input
          className="w-full md:max-w-sm rounded-xl border px-3 py-2 bg-white"
          placeholder="Søk i prosjekter…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Pill>{selectedProjects.length} valgt</Pill>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p: any) => {
          const on = selectedProjects.includes(p.id);
          return (
            <Card
              key={p.id}
              selected={on}
              onClick={() =>
                setSelectedProjects((prev) =>
                  prev.includes(p.id)
                    ? prev.filter((x) => x !== p.id)
                    : [...prev, p.id]
                )
              }
            >
              <div className="flex items-start gap-3">
                <div
                  className={cx(
                    "w-10 h-10 rounded-full grid place-items-center border",
                    on ? "bg-black text-white" : "bg-white"
                  )}
                >
                  <Images size={18} />
                </div>
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <p className="text-neutral-600 text-sm line-clamp-3">
                    {p.excerpt}
                  </p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {p.categories.map((cid: string) => {
                      const cat = categories.find((c: any) => c.id === cid);
                      return (
                        <span
                          key={cid}
                          className="text-xs px-2 py-1 rounded-full border"
                        >
                          {cat?.title ?? cid}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          disabled={!selectedProjects.length}
          onClick={() => setStep(3)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-black text-white disabled:bg-neutral-300"
        >
          Fortsett
        </button>
      </div>
    </section>
  );
}
