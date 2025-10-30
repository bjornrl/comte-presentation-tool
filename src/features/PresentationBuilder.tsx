import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, Download, Printer } from "lucide-react";
// StepHeader is used inside step components
import Pill from "../components/pill";
import useCMS from "../components/useCMS";
import Step1Areas from "./steps/Step1Areas";
import Step2Projects from "./steps/Step2Projects";
import Step3Format from "./steps/Step3Format";
import Step4Draft from "./steps/Step4Draft";
// SlidesPreview is used inside Step4Draft

// Mock CMS moved into useCMS fallback

// ===== Types =====
export type OutputType = "presentation" | "report";

import type { Slide } from "../components/buildSlides";

// ===== Helpers =====

// ===== CMS loader (reads /cms/data.json if present) =====

// ===== Slide builder =====
function buildSlides(
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
  }
  for (const pid of projectIds)
    slides.push({ kind: "project", projectId: pid });
  slides.push({
    kind: "outro",
    title: output === "report" ? "Takk" : "Spørsmål?",
  });
  return slides;
}

// Utility to download JSON (used in Step 4)

// ===== Minimal slide renderer (shared by deck + report) =====
function SlideView({
  slide,
  cms,
}: {
  slide: Slide;
  cms: ReturnType<typeof useCMS>;
}) {
  if (slide.kind === "cover")
    return (
      <div className="h-full w-full grid place-items-center p-16">
        <div className="text-center">
          <div className="text-5xl font-semibold">{slide.title}</div>
          {slide.subtitle && (
            <div className="text-xl text-neutral-600 mt-3">
              {slide.subtitle}
            </div>
          )}
        </div>
      </div>
    );
  if (slide.kind === "outro")
    return (
      <div className="h-full w-full grid place-items-center p-16">
        <div className="text-5xl font-semibold">{slide.title ?? "Takk"}</div>
      </div>
    );
  if (slide.kind === "category") {
    const cat = cms.categories.find((c: any) => c.id === slide.categoryId);
    return (
      <div className="h-full w-full p-16 flex flex-col justify-center">
        <div className="text-7xl font-semibold mb-3">{cat?.title}</div>
        <p className="text-neutral-700 text-xl max-w-3xl">{cat?.blurb}</p>
      </div>
    );
  }
  if (slide.kind === "expertise") {
    const cat = (cms.categories as any[]).find(
      (c: any) => c.id === slide.categoryId
    );
    const expertiseList = (cat?.expertise || []) as string[];
    return (
      <div className="h-full w-full p-16 flex flex-col justify-center">
        <div className="text-4xl font-semibold mb-6">Vi kan hjelpe deg med</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expertiseList.map((item, i) => (
            <div key={i} className="text-xl text-neutral-700">
              • {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (slide.kind === "stats") {
    const cat = (cms.categories as any[]).find(
      (c: any) => c.id === slide.categoryId
    );
    return (
      <div className="h-full w-full p-16 flex flex-col justify-center items-center">
        <div className="text-5xl font-semibold text-center">
          {cat?.stats || ""}
        </div>
      </div>
    );
  }
  const proj = cms.projects.find((p: any) => p.id === slide.projectId);
  return (
    <div className="h-full w-full p-12 grid grid-cols-2 gap-6 items-center">
      <div className="col-span-6">
        <div className="text-4xl font-semibold">{proj?.title}</div>
        <p className="text-neutral-700 mt-3 text-lg">{proj?.excerpt}</p>
        <p className="text-neutral-700 mt-3 text-lg">{proj?.categories}</p>
      </div>
      <div className="col-span-6 grid grid-cols-2 gap-3">
        {(proj?.images ?? []).slice(0, 2).map((src: string, i: number) => (
          <div
            key={i}
            className="aspect-[4/3] bg-neutral-200 rounded-xl overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Deck (Presentation) Overlay =====
function DeckOverlay({
  slides,
  cms,
  onClose,
}: {
  slides: Slide[];
  cms: any;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const go = (delta: number) =>
    setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "Backspace", "PageUp"].includes(e.key)) go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, total]);
  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <button
          className="px-3 py-2 rounded-full border border-white/30"
          onClick={onClose}
        >
          <X size={16} />
          Lukk
        </button>
      </div>
      <div className="h-full w-full grid place-items-center">
        <div className="w-[95vw] h-[90vh] bg-white text-neutral-900 rounded-sm shadow-2xl overflow-hidden">
          <SlideView slide={slides[index]} cms={cms} />
        </div>
      </div>
      <div className="absolute bottom-4 inset-x-0 text-center text-sm opacity-80">
        {index + 1} / {total}
      </div>
    </div>
  );
}

// ===== Report (PDF) Overlay =====
function ReportOverlay({
  slides,
  cms,
  onClose,
}: {
  slides: Slide[];
  cms: any;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Simple print stylesheet is embedded below.
  const downloadHTML = () => {
    const html = renderSelfContainedHTML(slides, cms);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rapport.html";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2 text-sm">
          <button className="px-3 py-2 rounded-full border" onClick={onClose}>
            <X size={16} /> Lukk
          </button>
          <button
            className="px-3 py-2 rounded-full border"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print / PDF
          </button>
          <button
            className="px-3 py-2 rounded-full border"
            onClick={downloadHTML}
          >
            <Download size={16} /> Last ned HTML
          </button>
        </div>
        <Pill>Forhåndsvisning – A4</Pill>
      </div>
      <div
        ref={containerRef}
        className="p-6 grid gap-6 justify-center bg-neutral-100 overflow-auto h-[calc(100vh-56px)]"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="bg-white w-[210mm] h-[297mm] shadow rounded-xl overflow-hidden print:shadow-none print:rounded-none"
          >
            <div className="p-16">
              <SlideView slide={s} cms={cms} />
            </div>
          </div>
        ))}
      </div>
      {/* print CSS */}
      <style>{`@media print { body { -webkit-print-color-adjust: exact; } .print\:shadow-none{box-shadow:none !important} .print\:rounded-none{border-radius:0 !important} }`}</style>
    </div>
  );
}

// ===== Self-contained HTML export for reports =====
function renderSelfContainedHTML(slides: Slide[], cms: any) {
  const styles = `*{box-sizing:border-box} body{margin:0;background:#f5f5f5;font-family:system-ui,-apple-system,Segoe UI,Roboto} .page{width:210mm;height:297mm;background:#fff;margin:8mm auto;padding:16mm;page-break-after:always;border-radius:12px;box-shadow:0 5px 30px rgba(0,0,0,.08)} @media print{body{background:#fff} .page{margin:0;box-shadow:none;border-radius:0}}`;
  const slideHTML = slides
    .map((s) => `<div class="page">${renderSlideHTML(s, cms)}</div>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Rapport</title><style>${styles}</style></head><body>${slideHTML}</body></html>`;
}
function renderSlideHTML(slide: Slide, cms: any): string {
  if (slide.kind === "cover") {
    return `<div style="display:grid;place-items:center;height:100%"><div style="text-align:center"><div style="font-size:48px;font-weight:600">${
      slide.title
    }</div>${
      slide.subtitle
        ? `<div style=\"color:#525252;margin-top:8px;font-size:20px\">${slide.subtitle}</div>`
        : ""
    }</div></div>`;
  }
  if (slide.kind === "outro")
    return `<div style="display:grid;place-items:center;height:100%"><div style="font-size:48px;font-weight:600">${
      slide.title ?? "Takk"
    }</div></div>`;
  if (slide.kind === "category") {
    const cat = cms.categories.find((c: any) => c.id === slide.categoryId);
    return `<div><div style="font-size:28px;font-weight:600">${
      cat?.title ?? "Kategori"
    }</div><p style="margin-top:8px;color:#444;font-size:18px;max-width:700px">${
      cat?.blurb ?? ""
    }</p></div>`;
  }
  if (slide.kind === "expertise") {
    const cat = cms.categories.find((c: any) => c.id === slide.categoryId);
    const expertiseList = (cat?.expertise || []) as string[];
    const items = expertiseList
      .map(
        (item) =>
          `<div style="font-size:18px;color:#444;margin-top:8px">• ${item}</div>`
      )
      .join("");
    return `<div><div style="font-size:28px;font-weight:600;margin-bottom:24px">Vi kan hjelpe deg med</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${items}</div></div>`;
  }
  if (slide.kind === "stats") {
    const cat = cms.categories.find((c: any) => c.id === slide.categoryId);
    return `<div style="display:grid;place-items:center;height:100%"><div style="font-size:48px;font-weight:600;text-align:center">${
      cat?.stats || ""
    }</div></div>`;
  }
  const proj = cms.projects.find((p: any) => p.id === slide.projectId);
  const imgs = (proj?.images ?? [])
    .slice(0, 2)
    .map(
      (src: string) =>
        `<div style="background:#eee;border-radius:12px;overflow:hidden;aspect-ratio:4/3"><img src="${src}" style="width:100%;height:100%;object-fit:cover"/></div>`
    )
    .join("\n");
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center"><div><div style="font-size:24px;font-weight:600">${
    proj?.title ?? "Prosjekt"
  }</div><p style="margin-top:8px;color:#444;font-size:18px">${
    proj?.excerpt ?? ""
  }</p></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${imgs}</div></div>`;
}

// (SlidesPreview moved to ./steps/SlidesPreview)

// ===== Main component =====
export default function PresentationBuilder() {
  const cms = useCMS();
  const { categories, projects } = cms as any;
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [outputType, setOutputType] = useState<OutputType>("presentation");
  const [query, setQuery] = useState("");
  const [showDeck, setShowDeck] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const filteredProjects = useMemo(() => {
    const inCat = activeCategory
      ? projects.filter((p: any) => p.categories.includes(activeCategory))
      : projects;
    const q = query.trim().toLowerCase();
    if (!q) return inCat;
    return inCat.filter(
      (p: any) =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
  }, [projects, activeCategory, query]);

  const slides = useMemo(
    () => buildSlides(activeCategory, selectedProjects, outputType),
    [activeCategory, selectedProjects, outputType]
  );

  const handleGenerate = () => {
    if (outputType === "presentation") setShowDeck(true);
    else setShowReport(true);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 text-neutral-900">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <header className="flex items-center justify-between mb-8">
          <div className="text-sm uppercase tracking-wider opacity-60">
            ComteBureau
          </div>
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full border bg-white"
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : s))}
                aria-label="Tilbake"
              >
                <ChevronLeft size={16} /> Tilbake
              </button>
            )}
            <Pill>2025</Pill>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Step1Areas
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={(id) => setActiveCategory(id)}
                setSelectedProjects={(ids) => setSelectedProjects(ids)}
                setStep={(s) => setStep(s)}
              />
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="step2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Step2Projects
                categories={categories}
                filteredProjects={filteredProjects}
                selectedProjects={selectedProjects}
                setSelectedProjects={(updater) =>
                  setSelectedProjects(updater(selectedProjects))
                }
                query={query}
                setQuery={(q) => setQuery(q)}
                setStep={(s) => setStep(s)}
              />
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="step3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Step3Format
                outputType={outputType}
                setOutputType={(v) => setOutputType(v)}
                selectedProjects={selectedProjects}
                setStep={(s) => setStep(s)}
              />
            </motion.section>
          )}

          {step === 4 && (
            <motion.section
              key="step4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Step4Draft
                slides={slides}
                outputType={outputType}
                handleGenerate={handleGenerate}
              />
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="mt-16 text-xs text-neutral-500">
          © ComteBureau
        </footer>
      </div>

      {showDeck && (
        <DeckOverlay
          slides={slides}
          cms={cms}
          onClose={() => setShowDeck(false)}
        />
      )}
      {showReport && (
        <ReportOverlay
          slides={slides}
          cms={cms}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
