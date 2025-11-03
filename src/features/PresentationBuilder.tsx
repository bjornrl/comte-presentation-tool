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
    title: "Comte Bureau",
    subtitle: "Innovations that change how we live",
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

// Category Helper

// function heroForCategory(cms: any, categoryId: string) {
//   // Prefer explicit hero from Categories.csv (optional new column "Hero")
//   const cat = cms.categories.find((c: any) => c.id === categoryId);
//   const explicit = (cat && (cat.hero || cat.Hero)) as string | undefined;
//   if (explicit) return explicit;

//   // Otherwise pick first image from first project in this category
//   const proj = cms.projects.find((p: any) =>
//     (p.categories || []).includes(categoryId)
//   );
//   const first = proj?.images?.[0];
//   if (first) return first;

//   // Fallback Unsplash
//   return "https://images.unsplash.com/photo-1761872936374-ec038c00d705?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740";
// }

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
    // const hero =
    //   heroForCategory(cms, slide.categoryId) ||
    //   "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1740";

    return (
      <div className="relative h-full w-full bg-white">
        {/* top meta */}
        <div className="absolute top-6 left-10 right-10 text-sm text-neutral-800 flex items-center justify-between">
          <div>ComteBureau</div>
          <div className="font-medium">Tilbudsforslag</div>
          <div>{new Date().getFullYear()}</div>
        </div>

        {/* main grid */}
        <div className="relative px-10 pt-24 pb-10 h-full grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* text column */}
          <div className="flex flex-col justify-between text-left">
            <div className="space-y-4">
              <h2 className="font-serif text-[clamp(40px,6vw,90px)] leading-[0.95]">
                {cat?.title ?? "Kategori"}
              </h2>
              <p className="text-[clamp(32px,1.5vw,44px)] text-neutral-600 max-w-lg leading-relaxed">
                I Comte Bureau
              </p>
            </div>

            <p className="text-neutral-700 italic text-3xl mt-8">
              {cat?.blurb ?? "Beskrivelse av kategorien."}
            </p>
          </div>

          {/* hero image */}
          <div className="w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              // src={hero}
              src={
                "https://images.unsplash.com/photo-1761872936374-ec038c00d705?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740"
              }
              alt={cat?.title ?? "Kategori"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* footer */}
        <div className="absolute left-10 bottom-6 text-xs text-neutral-600">
          ComteBureau
        </div>
      </div>
    );
  }

  if (slide.kind === "expertise") {
    const cat = (cms.categories as any[]).find(
      (c: any) => c.id === slide.categoryId
    );
    const expertiseList = (cat?.expertise || []) as string[];

    // pick category hero or fallback
    // const baseHero =
    //   cat?.Hero ||
    //   "https://source.unsplash.com/1600x600/?creative,workspace,design";

    // Generate placeholder images per expertise item
    // const expertiseImages = expertiseList.map(
    //   (item) =>
    //     `https://source.unsplash.com/800x400/?${encodeURIComponent(
    //       item
    //     )},design`
    // );

    return (
      <div className="relative h-full w-full bg-white">
        {/* top meta */}
        <div className="absolute top-6 left-10 right-10 text-sm text-neutral-800 flex items-center justify-between">
          <div>ComteBureau</div>
          <div className="font-medium">Tilbudsforslag</div>
          <div>{new Date().getFullYear()}</div>
        </div>

        <div className="relative h-full w-full bg-white">
          {/* top/meta etc... */}

          <div className="relative px-10 pt-24 pb-8 h-full flex flex-col gap-12">
            {/* headline */}
            <div className="font-serif text-[clamp(36px,6vw,90px)] leading-[0.95] mb-8">
              Vi kan <span className="italic">hjelpe deg</span> med
            </div>

            {/* LIST fills remaining space */}

            <div className="flex-1 grid grid-cols-4 grid-rows-2 gap-1 min-h-0">
              {Array.from({ length: 8 }).map((_, i) => {
                const item = expertiseList[i];
                return (
                  <div
                    key={i}
                    className={`
          flex flex-col justify-between rounded-sm p-2
          ${item ? "transition-colors hover:brightness-95" : ""}
          ${i === 0 ? "bg-stone-100 text-black" : ""}
          ${i === 1 ? "bg-red-600 text-white" : ""}
          ${i === 2 ? "bg-yellow-400 text-white" : ""}
          ${i === 3 ? "bg-purple-300 text-black" : ""}
          ${i === 4 ? "bg-purple-300 text-black" : ""}
          ${i === 5 ? "bg-stone-100 text-black" : ""}
          ${i === 6 ? "bg-black text-white" : ""}
          ${i === 7 ? "bg-orange-300 text-black" : ""}
        `}
                  >
                    {item ? (
                      <>
                        {/* label (category title) */}
                        <p className="uppercase text-xs tracking-wide opacity-70">
                          {cat?.title ?? "Ekspertise"}
                        </p>

                        {/* main value (expertise name) */}
                        <div className="flex flex-row justify-between items-end">
                          <p className="font-semibold leading-[0.9] text-left text-[clamp(25px,6vw,14px)] break-words">
                            {item}
                          </p>

                          {/* optional placeholder for something small */}
                          <p className="text-right text-sm opacity-70">
                            8 prosjekter{" "}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* footer */}
            <div className="mt-8 text-xs text-neutral-600">ComteBureau</div>
          </div>
        </div>
      </div>
    );
  }

  if (slide.kind === "stats") {
    // const cat = (cms.categories as any[]).find(
    //   (c: any) => c.id === slide.categoryId
    // );
    return (
      // <div className="h-full w-full p-16 flex flex-col justify-center items-center">
      //   <div className="text-5xl font-semibold text-center">
      //     {cat?.stats || ""}
      //   </div>
      // </div>

      <div className="flex flex-col h-full">
        {/* Title section */}
        <div
          id="title"
          className="h-1/3 flex items-center justify-center text-[clamp(2rem,5vw,5rem)] font-semibold"
        >
          Stats
        </div>

        {/* Grid with lines */}
        <div
          className="
      grid grid-cols-3 grid-rows-2 w-full flex-1
      divide-x divide-y divide-black/20
    "
        >
          {[
            { label: "69", sub: "projects done" },
            { label: "350", sub: "people inteviewed" },
            { label: "21", sub: "years of experience within the field" },
            { label: "34", sub: "collaborators worked with" },
            { label: "15", sub: "pitches to members of congress" },
            { label: "45+", sub: "news articles" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center text-center leading-none p-4"
            >
              <p className="font-semibold text-[clamp(1.5rem,6vw,6rem)] leading-none">
                {item.label}
              </p>
              <p className="mt-2 text-[clamp(0.8rem,2vw,1.25rem)] text-neutral-600">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (slide.kind === "project") {
    const proj = cms.projects.find((p: any) => p.id === slide.projectId);
    return (
      <div className="h-full w-full p-12 grid grid-cols-2 gap-6 items-center">
        <div className="col-span-6">
          <div className="text-4xl font-semibold">{proj?.title}</div>
          <p className="text-neutral-700 mt-3 text-lg">{proj?.excerpt}</p>
        </div>
        <div className="col-span-6 grid grid-cols-2 gap-3">
          <div className="flex flex-col justify-between">
            <p className="text-left text-2xl">{proj?.excerpt}</p>
            <div className="flex flex-row justify-between">
              <div>
                <div className="flex flex-col gap-[clamp(0.1rem,0.6vw,0.6rem)]">
                  <p className="text-left font-bold leading-[0.9] text-[clamp(40px,8vw,112px)]">
                    200
                  </p>
                  <p className="text-left text-[clamp(12px,1.2vw,16px)] text-neutral-700">
                    personer innvolvert
                  </p>
                </div>
                <div className="flex flex-col gap-[clamp(0.1rem,0.6vw,0.6rem)]">
                  <p className="text-left font-bold leading-[0.9] text-[clamp(40px,8vw,112px)]">
                    48
                  </p>
                  <p className="text-left text-[clamp(12px,1.2vw,16px)] text-neutral-700">
                    personer innvolvert
                  </p>
                </div>
              </div>
              <div className="flex flex-col h-full justify-end w-full">
                <p className="text-right italic">
                  Client: <strong>Sykehusbygg</strong>
                </p>
                <p className="text-right italic">
                  Area <strong>Stavanger</strong>
                </p>
                <p className="text-right italic">
                  Collaborators <strong>Canoe, Æra</strong>
                </p>
                <p className="text-right italic">
                  Year <strong>2022-2023</strong>
                </p>
              </div>
            </div>
          </div>
          {(proj?.images ?? []).slice(0, 1).map((src: string, i: number) => (
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
  return null;
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
  if (slide.kind === "project") {
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
  return "";
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
    <div className="w-full min-w-[1280px] min-h-screen bg-neutral-50 text-neutral-900">
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
