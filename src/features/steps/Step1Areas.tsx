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
      <div className=" min-w-[1280px]p-12 flex flex-col justify-center items-center">
        <StepHeader
          title="Områder"
          subtitle="Velg ett område for å lage presentasjon"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 gap-1">
        {categories.map((c: any, i: number) => {
          const hoverColors = [
            "hover:bg-yellow-100",
            "hover:bg-blue-100",
            "hover:bg-green-100",
            "hover:bg-rose-100",
            "hover:bg-purple-100",
            "hover:bg-orange-100",
          ];

          const hoverColor = hoverColors[i % hoverColors.length];

          return (
            <Card
              key={c.id}
              selected={activeCategory === c.id}
              onClick={() => {
                setActiveCategory(c.id);
                setSelectedProjects([]);
                setStep(2);
              }}
              hoverColor={hoverColor}
            >
              <div className="flex flex-row items-start gap-3 p-4 min-h-20">
                {/* <div className="w-1/8 h-auto aspect-square rounded-full bg-black text-white grid place-items-center">
                  <ArrowRight size={18} />
                </div> */}
                <div>
                  <div className="text-[clamp(25px,8vw,25px)] font-semibold min-h-20">
                    {c.title}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
