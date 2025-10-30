import { FileText, Play } from "lucide-react";
import StepHeader from "../../components/stepheader";
import { Card } from "../../components/ui";

export default function Step3Format({
  outputType,
  setOutputType,
  selectedProjects,
  setStep,
}: {
  outputType: "presentation" | "report";
  setOutputType: (v: "presentation" | "report") => void;
  selectedProjects: string[];
  setStep: (s: 1 | 2 | 3 | 4) => void;
}) {
  return (
    <section>
      <StepHeader
        title="Hva vil du presentere?"
        subtitle="Velg formatet – levende presentasjon eller PDF-rapport."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card
          selected={outputType === "presentation"}
          onClick={() => setOutputType("presentation")}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">
              <Play size={18} />
            </div>
            <div>
              <div className="text-xl font-semibold">Presentasjon</div>
              <p className="text-neutral-600 mt-1 text-sm">
                Lysbildefremvisning i nettleseren.
              </p>
            </div>
          </div>
        </Card>
        <Card
          selected={outputType === "report"}
          onClick={() => setOutputType("report")}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-xl font-semibold">Rapport (PDF)</div>
              <p className="text-neutral-600 mt-1 text-sm">
                Utskriftsvennlig, ferdig for deling.
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          {selectedProjects.length} prosjekter valgt
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-full border"
            onClick={() => setStep(2)}
          >
            Endre prosjekter
          </button>
          <button
            className="px-4 py-2 rounded-full border bg-black text-white"
            onClick={() => setStep(4)}
          >
            Lag utkast
          </button>
        </div>
      </div>
    </section>
  );
}
