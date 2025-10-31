import { ArrowRight } from "lucide-react";
import StepHeader from "../../components/stepheader";
import { Card } from "../../components/ui";

export default function Step1Areas({
  categories,
  activeCategory,
  setActiveCategory,
  setSelectedProjects,
  setStep,
}: {
  categories: any[];
  activeCategory: string | null;
  setActiveCategory: (id: string) => void;
  setSelectedProjects: (ids: string[]) => void;
  setStep: (s: 1 | 2 | 3 | 4) => void;
}) {
  return (
    <section>
      <div className="p-12 flex flex-col justify-center items-center">
        <StepHeader
          title="Områder"
          subtitle="Velg ett område for å lage presentasjon"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 gap-5">
        {categories.map((c: any) => (
          <Card
            key={c.id}
            selected={activeCategory === c.id}
            onClick={() => {
              setActiveCategory(c.id);
              setSelectedProjects([]);
              setStep(2);
            }}
          >
            {/* <div className="flex flex-col items-start justify-start"> */}
            <div className="flex flex-row items-start gap-3 p-4">
              <div className="w-8 h-8 rounded-full bg-black text-white grid place-items-center">
                <ArrowRight size={18} />
              </div>
              <div>
                <div className="text-xl font-semibold">{c.title}</div>
              </div>
            </div>
            {/* <p className=" pl-4 text-neutral-600 mt-1 text-sm">{c.blurb}</p>
            </div> */}
          </Card>
        ))}
      </div>
    </section>
  );
}
