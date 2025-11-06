import { Download, Sparkles } from "lucide-react";
import StepHeader from "../../components/stepheader";
import downloadJSON from "../../components/downloadJSON";
import SlidesPreview from "./SlidesPreview";
import type { Slide } from "../../components/buildSlides";

export default function Step4Draft({
  slides,
  outputType,
  handleGenerate,
  handleSpike,
}: {
  slides: Slide[];
  outputType: "presentation" | "report";
  handleGenerate: () => void;
  handleSpike: () => void;
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
          className="px-4 py-2 rounded-full border bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-2"
          onClick={handleSpike}
        >
          <Sparkles size={16} /> Spike it
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
