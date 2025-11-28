import StepHeader from "../../components/stepheader";
import Pill from "../../components/pill";
import { Card, cx } from "../../components/ui";

// Color palette for category tags
const TAG_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300" },
  { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
  { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300" },
  { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-300" },
  { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-300" },
];

// Get color for a category ID (consistent color for same ID)
function getTagColor(categoryId: string) {
  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = categoryId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 items-stretch">
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
              <div className="flex flex-col h-full p-1">
                <div className="flex-1 flex justify-between flex-col">
                  <div className="font-semibold">
                    <div
                      className={cx(
                        "w-4 h-4 rounded-full grid place-items-center border",
                        on ? "bg-black text-white" : "bg-white"
                      )}
                    >
                      {/* <ImageIcon size={18} /> */}
                    </div>
                    {p.title}{" "}
                    {p.client && (
                      <p className="text-neutral-600 text-sm mt-1">
                        {p.client}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    {p.categories.map((cid: string) => {
                      const cat = categories.find((c: any) => c.id === cid);
                      const color = getTagColor(cid);
                      return (
                        <span
                          key={cid}
                          className={`text-xs px-2 py-1 rounded-full border ${color.bg} ${color.text} ${color.border}`}
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
          className="inline-flex border border items-center gap-2 px-4 py-2 rounded-full border border-black bg-black text-white disabled:bg-neutral-300 disabled:border-none"
        >
          Fortsett
        </button>
      </div>
    </section>
  );
}
