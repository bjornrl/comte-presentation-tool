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
import SpikedPresentation from "./SpikedPresentation";
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
    title: output === "report" ? "Takk" : "Comte Bureau",
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
      <div className="h-full w-full p-12 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-semibold mb-4">
            {slide.title ?? "Comte Bureau"}
          </h1>
          <p className="text-xl text-neutral-600">
            Vi er et tverrfaglig team som utvikler bedre løsninger gjennom
            design, innsikt og innovasjon.
          </p>
        </div>
        <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.squarespace-cdn.com/content/v1/64e366db2607f31b2c125e32/team-photo.jpg"
            alt="Comte Bureau team"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="mt-8 text-center text-neutral-600">
          <p>comte.no</p>
        </div>
      </div>
    );
  if (slide.kind === "category") {
    const cat = cms.categories.find((c: any) => c.id === slide.categoryId);
    // const hero =
    //   heroForCategory(cms, slide.categoryId) ||
    //   "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1740";

    return (
      <div className="relative h-full w-full bg-[var(--color-white)]">
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
              <h2 className="text-[clamp(40px,6vw,90px)] leading-[0.95]">
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
      <div className="relative h-full w-full bg-[var(--color-white)]">
        {/* top meta */}
        <div className="absolute top-6 left-10 right-10 text-sm text-neutral-800 flex items-center justify-between">
          <div>ComteBureau</div>
          <div className="font-medium">Tilbudsforslag</div>
          <div>{new Date().getFullYear()}</div>
        </div>

        <div className="relative h-full w-full bg-[var(--color-white)]">
          {/* top/meta etc... */}

          <div className="relative px-10 pt-24 pb-8 h-full flex flex-col gap-12">
            {/* headline */}
            <h2 className="text-[clamp(36px,6vw,90px)] leading-[0.95] mb-8">
              Vi kan <span className="italic">hjelpe deg</span> med
            </h2>

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
          ${i === 0 ? "bg-stone-100 text-[var(--color-black)]" : ""}
          ${i === 1 ? "bg-red-600 text-[var(--color-white)]" : ""}
          ${i === 2 ? "bg-yellow-400 text-[var(--color-white)]" : ""}
          ${i === 3 ? "bg-purple-300 text-[var(--color-black)]" : ""}
          ${i === 4 ? "bg-purple-300 text-[var(--color-black)]" : ""}
          ${i === 5 ? "bg-stone-100 text-[var(--color-black)]" : ""}
          ${i === 6 ? "bg-[var(--color-black)] text-[var(--color-white)]" : ""}
          ${i === 7 ? "bg-orange-300 text-[var(--color-black)]" : ""}
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
    const cat = cms.categories.find(
      (c: any) => c.id === slide.categoryId
    ) as any;

    // Parse stats from category (should be an array of strings like "50+ prosjekter")
    const statsArray = Array.isArray(cat?.stats)
      ? cat.stats
      : cat?.stats
      ? [cat.stats]
      : [];

    // Parse each stat to extract number and text
    const parsedStats = statsArray.map((stat: string) => {
      const match = stat.match(/^(\d+[+\-]?)\s+(.+)$/);
      if (match) {
        return { number: match[1], text: match[2] };
      }
      return { number: null, text: stat };
    });

    return (
      <div className="flex flex-row justify-between p-12 gap-48 h-full">
        {/* Title section */}
        <div
          id="title"
          className="h-1/3 w-full flex flex-col justify-start text-left text-[clamp(2rem,5vw,5rem)] font-semibold"
        >
          <h2 className="text-[clamp(2rem,5vw,5rem)] font-semibold leading-[0.95] mt-12">
            {cat?.statsTitle ?? "Over 20 years of experience"}
          </h2>
          {cat?.statsDescription && (
            <p className="text-neutral-600 text-lg w-1/2 mt-12">
              {cat.statsDescription}
            </p>
          )}
        </div>

        {/* Grid with lines */}
        <div
          className="
      divide-y divide-[var(--color-black)]/20 w-full flex flex-col justify-center
    "
        >
          {parsedStats.map(
            (item: { number: string | null; text: string }, i: number) => (
              <div
                key={i}
                className="flex flex-col text-left items-start justify-center text-center leading-none p-4"
              >
                {item.number ? (
                  <>
                    <p className="text-[clamp(1.5rem,8vw,10rem)] text-left">
                      {item.number}
                    </p>
                    <p className="mt-2 text-neutral-600">{item.text}</p>
                  </>
                ) : (
                  <p className="text-7xl text-left">{item.text}</p>
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  }
  if (slide.kind === "project") {
    const proj = cms.projects.find((p: any) => p.id === slide.projectId) as any;
    return (
      <div className="h-full w-full p-12 grid grid-cols-2 gap-6 items-center">
        <div className="col-span-6">
          <h2
            className="text-6xl font-semibold text-neutral-900"
            style={{ fontFamily: "var(--font-family)" }}
          >
            {proj?.title}
          </h2>
        </div>
        <div className="col-span-6 grid grid-cols-2 mt-3 text-lg gap-3">
          <div className="flex flex-col text-left">
            {/* Bullet points for presentation */}
            {proj?.bulletPoints && proj.bulletPoints.length > 0 ? (
              <div className="space-y-3 text-neutral-900 text-lg list-disc list-inside mb-4">
                {proj.bulletPoints.map((point: string, i: number) => (
                  <p key={i} className="text-lg leading-relaxed">
                    {point}
                  </p>
                ))}
              </div>
            ) : (
              <>
                <div
                  className="text-neutral-700 mb-4"
                  dangerouslySetInnerHTML={{ __html: proj?.excerpt || "" }}
                />
                {proj?.solution && (
                  <div
                    className="text-neutral-700 mt-4 mb-4"
                    dangerouslySetInnerHTML={{ __html: proj.solution }}
                  />
                )}
              </>
            )}
            {/* Client info and stats - always visible at bottom */}
            <div className="flex flex-row justify-between gap-4 mt-auto pt-4">
              {/* Stats */}
              <div className="flex flex-col justify-end gap-8 pt-2">
                {proj?.stat1 &&
                  (() => {
                    // Extract number and rest of text
                    const match = proj.stat1.match(/^(\d+[+\-]?)\s*(.*)$/);
                    const number = match ? match[1] : null;
                    const rest = match ? match[2] : proj.stat1;
                    return (
                      <div className="flex flex-col">
                        {number && (
                          <p className="text-9xl font-bold text-neutral-900">
                            {number}
                          </p>
                        )}
                        <p
                          className={`${
                            number ? "text-lg" : "text-3xl font-bold"
                          } text-neutral-700`}
                        >
                          {rest}
                        </p>
                      </div>
                    );
                  })()}
                {proj?.stat2 &&
                  (() => {
                    // Extract number (with + or -) and rest of text
                    const match = proj.stat2.match(/^(\d+[+\-]?)\s+(.+)$/);
                    const number = match ? match[1] : null;
                    const rest = match ? match[2] : proj.stat2;
                    return (
                      <div className="flex flex-col">
                        {number && (
                          <p className="text-9xl font-bold text-neutral-900">
                            {number}
                          </p>
                        )}
                        <p
                          className={`${
                            number ? "text-lg" : "text-3xl font-bold"
                          } text-neutral-700`}
                        >
                          {rest}
                        </p>
                      </div>
                    );
                  })()}
              </div>
              {/* Client info */}
              <div className="flex flex-col text-right justify-end gap-2 text-sm text-neutral-600">
                {proj?.client && (
                  <p>
                    Klient:{" "}
                    <strong className="text-neutral-900">{proj.client}</strong>
                  </p>
                )}
                {proj?.location && (
                  <p>
                    Lokasjon:{" "}
                    <strong className="text-neutral-900">
                      {proj.location}
                    </strong>
                  </p>
                )}
                {proj?.year && (
                  <p>
                    År:{" "}
                    <strong className="text-neutral-900">{proj.year}</strong>
                  </p>
                )}
                {proj?.industry && (
                  <p>
                    Industri:{" "}
                    <strong className="text-neutral-900">
                      {proj.industry}
                    </strong>
                  </p>
                )}
              </div>
            </div>
          </div>
          {(proj?.images ?? []).slice(0, 1).map((src: string, i: number) => (
            <div
              key={i}
              className="w-full h-full bg-neutral-200 rounded-xl overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-auto object-contain" />
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
    <div className="fixed inset-0 z-50 bg-[var(--color-black)]/95 text-[var(--color-white)]">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <button
          className="px-3 py-2 rounded-full border border-[var(--color-white)]/30"
          onClick={onClose}
        >
          <X size={16} />
          Lukk
        </button>
      </div>
      <div className="h-full w-full grid place-items-center">
        <div className="w-full h-full bg-[var(--color-white)] text-neutral-900 rounded-sm shadow-2xl overflow-hidden">
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
    <div className="fixed inset-0 z-50 bg-[var(--color-white)]">
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
            className="bg-[var(--color-white)] w-[210mm] h-[297mm] shadow rounded-xl overflow-hidden print:shadow-none print:rounded-none"
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
  const styles = `:root{--font-family:'Instrument Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;--color-white:#eaeae5;--color-black:#032435} *{box-sizing:border-box} body{margin:0;background:#f5f5f5;font-family:var(--font-family)} .page{width:210mm;height:297mm;background:var(--color-white);margin:8mm auto;padding:16mm;page-break-after:always;border-radius:12px;box-shadow:0 5px 30px rgba(0,0,0,.08)} @media print{body{background:var(--color-white)} .page{margin:0;box-shadow:none;border-radius:0}}`;
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
    return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:48px;text-align:center"><h1 style="font-size:48px;font-weight:600;margin-bottom:16px">${
      slide.title ?? "Comte Bureau"
    }</h1><p style="font-size:20px;color:#525252;margin-bottom:32px">Vi er et tverrfaglig team som utvikler bedre løsninger gjennom design, innsikt og innovasjon.</p><div style="width:100%;max-width:800px;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)"><img src="https://images.squarespace-cdn.com/content/v1/64e366db2607f31b2c125e32/team-photo.jpg" alt="Comte Bureau team" style="width:100%;height:auto;object-fit:cover"/></div><p style="margin-top:32px;color:#525252">comte.no</p></div>`;
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
    const cat = cms.categories.find(
      (c: any) => c.id === slide.categoryId
    ) as any;
    const statsArray = Array.isArray(cat?.stats)
      ? cat.stats
      : cat?.stats
      ? [cat.stats]
      : [];
    const statsHTML = statsArray
      .map((stat: string) => {
        const match = stat.match(/^(\d+[+\-]?)\s+(.+)$/);
        if (match) {
          return `<div style="margin-bottom:16px"><div style="font-size:48px;font-weight:600">${match[1]}</div><div style="font-size:18px;color:#666;margin-top:8px">${match[2]}</div></div>`;
        }
        return `<div style="font-size:48px;font-weight:600;margin-bottom:16px">${stat}</div>`;
      })
      .join("");
    return `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:48px">${statsHTML}</div>`;
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
  const [showSpiked, setShowSpiked] = useState(false);

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
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full border bg-[var(--color-white)]"
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
                handleSpike={() => setShowSpiked(true)}
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
      {showSpiked && (
        <SpikedPresentation
          slides={slides}
          cms={cms}
          onClose={() => setShowSpiked(false)}
        />
      )}
    </div>
  );
}
