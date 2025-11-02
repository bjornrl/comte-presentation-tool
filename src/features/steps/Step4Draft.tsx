import { Download } from "lucide-react";
import StepHeader from "../../components/stepheader";
import downloadJSON from "../../components/downloadJSON";
import SlidesPreview from "./SlidesPreview";
import type { Slide } from "../../components/buildSlides";

export default function Step4Draft({
  slides,
  outputType,
  handleGenerate,
}: {
  slides: Slide[];
  outputType: "presentation" | "report";
  handleGenerate: () => void;
}) {
  return (
    <section className="flex flex-col items-center">
      <StepHeader title="Utkast" subtitle="Forhåndsvisning av slides" />
      <SlidesPreview slides={slides} />
      <div className="w-full mt-6 flex items-center justify-end gap-3">
        <button
          className="px-4 py-2 flex flex-row justify-center items-center gap-2 rounded-full border"
          onClick={() => downloadJSON("slides.json", slides)}
        >
          <Download size={16} /> Last ned slides.json
        </button>
        <button
          className="px-4 py-2 rounded-full border bg-black text-white"
          onClick={handleGenerate}
        >
          Generer {outputType === "presentation" ? "presentasjon" : "PDF"}
        </button>
      </div>
    </section>
  );
}
