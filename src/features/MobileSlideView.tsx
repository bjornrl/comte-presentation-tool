import NumberTicker from "../components/fancy/text/basic-number-ticker";
import type { Slide } from "../components/buildSlides";
import useCMS from "../components/useCMS";

// Fallback image for presentations when no images are available
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1613575831056-0acd5da8f6e8?w=2000&q=80&auto=format&fit=crop";

// ===== Mobile Slide Renderer =====
export default function MobileSlideView({
  slide,
  cms,
}: {
  slide: Slide;
  cms: ReturnType<typeof useCMS>;
}) {
  if (slide.kind === "cover")
    return (
      <div
        className="h-full w-full grid place-items-center"
        style={{ padding: "var(--mobile-padding-xl)" }}
      >
        <div className="text-left">
          <div
            className="font-semibold"
            style={{ fontSize: "var(--mobile-h1)" }}
          >
            {slide.title}
          </div>
          {slide.subtitle && (
            <div
              className="text-red-600"
              style={{
                fontSize: "var(--mobile-text-lg)",
                marginTop: "var(--mobile-gap-md)",
              }}
            >
              {slide.subtitle}
            </div>
          )}
        </div>
      </div>
    );

  if (slide.kind === "outro")
    return (
      <div
        className="h-full w-full flex flex-col items-center justify-center"
        style={{ padding: "var(--mobile-padding-xl)" }}
      >
        <div
          className="text-center"
          style={{ marginBottom: "var(--mobile-gap-lg)" }}
        >
          <h1
            className="font-semibold"
            style={{
              fontSize: "var(--mobile-h1)",
              marginBottom: "var(--mobile-padding-base)",
            }}
          >
            {slide.title ?? "Comte Bureau"}
          </h1>
          <p
            className="text-neutral-600"
            style={{ fontSize: "var(--mobile-text-lg)" }}
          >
            Vi er et tverrfaglig team som utvikler bedre løsninger gjennom
            design, innsikt og innovasjon.
          </p>
        </div>
        <div
          className="w-full overflow-hidden shadow-lg"
          style={{
            maxWidth: "100%",
            borderRadius: "var(--mobile-radius-base)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cms/images/comte-team/comte-team.jpeg"
            alt="Comte Bureau team"
            className="w-full h-auto object-cover"
          />
        </div>
        <div
          className="text-center text-neutral-600"
          style={{
            marginTop: "var(--mobile-gap-lg)",
            fontSize: "var(--mobile-text-base)",
          }}
        >
          <p>comte.no</p>
        </div>
      </div>
    );

  if (slide.kind === "category") {
    const cat = cms.categories.find((c: any) => c.id === slide.categoryId);
    return (
      <div
        className="relative h-full w-full bg-[var(--color-white)]"
        style={{ padding: "var(--mobile-padding-lg)" }}
      >
        <div className="h-full flex flex-col justify-between">
          <div
            style={{ gap: "var(--mobile-gap-base)" }}
            className="flex flex-col"
          >
            <h2
              className="leading-tight"
              style={{ fontSize: "var(--mobile-h2)" }}
            >
              {cat?.title ?? "Kategori"}
            </h2>
            <p
              className="text-neutral-600 leading-relaxed"
              style={{ fontSize: "var(--mobile-text-xl)" }}
            >
              I Comte Bureau
            </p>
            <p
              className="text-neutral-700 italic"
              style={{
                fontSize: "var(--mobile-text-xl)",
                marginTop: "var(--mobile-padding-base)",
              }}
            >
              {cat?.blurb ?? "Beskrivelse av kategorien."}
            </p>
          </div>
          <div
            className="text-neutral-600"
            style={{
              fontSize: "var(--mobile-text-xs)",
              marginTop: "var(--mobile-padding-base)",
            }}
          >
            ComteBureau
          </div>
        </div>
      </div>
    );
  }

  if (slide.kind === "expertise") {
    const cat = (cms.categories as any[]).find(
      (c: any) => c.id === slide.categoryId
    );
    const expertiseList = (cat?.expertise || []) as string[];

    return (
      <div
        className="relative h-full w-full bg-[var(--color-white)]"
        style={{ padding: "var(--mobile-padding-lg)" }}
      >
        <div
          className="h-full flex flex-col"
          style={{ gap: "var(--mobile-gap-lg)" }}
        >
          <h2
            className="leading-tight"
            style={{
              fontSize: "var(--mobile-h2)",
              marginBottom: "var(--mobile-padding-base)",
            }}
          >
            Vi kan <span className="italic">hjelpe deg</span> med
          </h2>
          <div
            className="flex-1 grid grid-cols-2"
            style={{ gap: "var(--mobile-gap-sm)" }}
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const item = expertiseList[i];
              return (
                <div
                  key={i}
                  className={`
                    flex flex-col justify-between
                    ${item ? "transition-colors hover:brightness-95" : ""}
                    ${i === 0 ? "bg-stone-100 text-[var(--color-black)]" : ""}
                    ${i === 1 ? "bg-red-600 text-[var(--color-white)]" : ""}
                    ${i === 2 ? "bg-yellow-400 text-[var(--color-white)]" : ""}
                    ${i === 3 ? "bg-purple-300 text-[var(--color-black)]" : ""}
                    ${i === 4 ? "bg-purple-300 text-[var(--color-black)]" : ""}
                    ${i === 5 ? "bg-stone-100 text-[var(--color-black)]" : ""}
                    ${
                      i === 6
                        ? "bg-[var(--color-black)] text-[var(--color-white)]"
                        : ""
                    }
                    ${i === 7 ? "bg-orange-300 text-[var(--color-black)]" : ""}
                  `}
                  style={{
                    padding: "var(--mobile-padding-sm)",
                    borderRadius: "var(--mobile-radius-sm)",
                  }}
                >
                  {item ? (
                    <>
                      <p
                        className="uppercase tracking-wide opacity-70"
                        style={{ fontSize: "var(--mobile-text-xs)" }}
                      >
                        {cat?.title ?? "Ekspertise"}
                      </p>
                      <p
                        className="font-semibold leading-[0.9] text-left break-words"
                        style={{ fontSize: "var(--mobile-text-lg)" }}
                      >
                        {item}
                      </p>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div
            className="text-neutral-600"
            style={{
              marginTop: "var(--mobile-padding-base)",
              fontSize: "var(--mobile-text-xs)",
            }}
          >
            ComteBureau
          </div>
        </div>
      </div>
    );
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

    const parsedStats = statsArray.map((stat: string) => {
      const match = stat.match(/^(\d+)([+\-%]?)\s+(.+)$/);
      if (match) {
        return { number: match[1], sign: match[2], text: match[3] };
      }
      return { number: null, sign: null, text: stat };
    });

    // Get first 3 stats for the grid
    const gridStats = parsedStats.slice(0, 3);

    return (
      <div
        className="h-full w-full"
        style={{ padding: "var(--mobile-padding-lg)" }}
      >
        <div
          className="grid grid-cols-2 grid-rows-2 h-full"
          style={{ gap: "var(--mobile-gap-base)" }}
        >
          {/* Cell 1: Stats Title */}
          <div className="flex flex-col justify-center">
            <p
              className="leading-tight"
              style={{ fontSize: "var(--mobile-h2)" }}
            >
              {cat?.statsTitle ?? "Over 20 years of experience"}
            </p>
            {cat?.statsDescription && (
              <p
                className="text-red-600"
                style={{
                  fontSize: "var(--mobile-text-sm)",
                  marginTop: "var(--mobile-gap-sm)",
                }}
              >
                {cat.statsDescription}
              </p>
            )}
          </div>

          {/* Cells 2-4: Stat numbers */}
          {gridStats.map(
            (
              item: {
                number: string | null;
                sign: string | null;
                text: string;
              },
              i: number
            ) => (
              <div
                key={i}
                className="flex flex-col justify-center text-left leading-none"
              >
                {item.number ? (
                  <>
                    <p style={{ fontSize: "var(--mobile-stat-large)" }}>
                      <NumberTicker
                        from={0}
                        target={parseInt(item.number) || 0}
                        autoStart={true}
                        transition={{
                          duration: 3.5,
                          type: "tween",
                          ease: "easeInOut",
                        }}
                        onComplete={() => console.log("complete")}
                        onStart={() => console.log("start")}
                      />
                      {item.sign && <span>{item.sign}</span>}
                    </p>
                    <p
                      className="text-neutral-600"
                      style={{
                        marginTop: "var(--mobile-gap-sm)",
                        fontSize: "var(--mobile-text-sm)",
                      }}
                    >
                      {item.text}
                    </p>
                  </>
                ) : (
                  <p
                    className="text-left"
                    style={{ fontSize: "var(--mobile-text-sm)" }}
                  >
                    {item.text}
                  </p>
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
      <div
        className="h-full w-full flex flex-col"
        style={{
          padding: "var(--mobile-padding-lg)",
          gap: "var(--mobile-gap-base)",
        }}
      >
        {/* Mobile: Stack everything vertically */}
        <div className="flex-shrink-0">
          <h2
            className="font-semibold text-neutral-900"
            style={{
              fontFamily: "var(--font-family)",
              fontSize: "var(--mobile-h2)",
            }}
          >
            {proj?.title}
          </h2>
        </div>

        {/* Image on mobile - full width */}
        <div className="flex-shrink-0 w-full" style={{ aspectRatio: "16/9" }}>
          {((proj?.images ?? []).length > 0
            ? (proj?.images ?? []).slice(0, 1)
            : [FALLBACK_IMAGE]
          ).map((src: string, i: number) => (
            <div
              key={i}
              className="w-full h-full bg-neutral-200 overflow-hidden flex items-center justify-center"
              style={{ borderRadius: "var(--mobile-radius-base)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Text content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {proj?.bulletPoints && proj.bulletPoints.length > 0 ? (
            <div
              className="text-neutral-900"
              style={{
                gap: "var(--mobile-gap-sm)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {proj.bulletPoints.map((point: string, i: number) => (
                <p
                  key={i}
                  className="leading-relaxed"
                  style={{ fontSize: "var(--mobile-text-base)" }}
                >
                  {point}
                </p>
              ))}
            </div>
          ) : (
            <>
              <div
                className="text-neutral-700"
                style={{ fontSize: "var(--mobile-text-base)" }}
                dangerouslySetInnerHTML={{ __html: proj?.excerpt || "" }}
              />
              {proj?.solution && (
                <div
                  className="text-neutral-700"
                  style={{
                    fontSize: "var(--mobile-text-base)",
                    marginTop: "var(--mobile-padding-base)",
                  }}
                  dangerouslySetInnerHTML={{ __html: proj.solution }}
                />
              )}
            </>
          )}
        </div>

        {/* Stats and client info - at bottom */}
        <div
          className="flex-shrink-0 flex flex-col border-t border-neutral-200"
          style={{
            gap: "var(--mobile-gap-base)",
            paddingTop: "var(--mobile-padding-base)",
          }}
        >
          {/* Stats */}
          {proj?.stat1 && (
            <div className="flex flex-col">
              {(() => {
                const match = proj.stat1.match(/^(\d+[+\-]?)\s*(.*)$/);
                const number = match ? match[1] : null;
                const rest = match ? match[2] : proj.stat1;
                return (
                  <>
                    {number && (
                      <p
                        className="font-bold text-neutral-900"
                        style={{ fontSize: "var(--mobile-stat-large)" }}
                      >
                        <NumberTicker
                          from={0}
                          target={parseInt(number.replace(/[^0-9]/g, "")) || 0}
                          autoStart={true}
                          transition={{
                            duration: 2.5,
                            type: "tween",
                            ease: "easeInOut",
                          }}
                        />
                        {number.includes("+") && "+"}
                        {number.includes("-") && "-"}
                      </p>
                    )}
                    <p
                      className="text-neutral-700"
                      style={{
                        fontSize: number
                          ? "var(--mobile-text-base)"
                          : "var(--mobile-text-lg)",
                        fontWeight: number ? "normal" : "bold",
                      }}
                    >
                      {rest}
                    </p>
                  </>
                );
              })()}
            </div>
          )}
          {proj?.stat2 && (
            <div className="flex flex-col">
              {(() => {
                const match = proj.stat2.match(/^(\d+[+\-]?)\s+(.+)$/);
                const number = match ? match[1] : null;
                const rest = match ? match[2] : proj.stat2;
                return (
                  <>
                    {number && (
                      <p
                        className="font-bold text-neutral-900"
                        style={{ fontSize: "var(--mobile-stat-large)" }}
                      >
                        <NumberTicker
                          from={0}
                          target={parseInt(number.replace(/[^0-9]/g, "")) || 0}
                          autoStart={true}
                          transition={{
                            duration: 2.5,
                            type: "tween",
                            ease: "easeInOut",
                          }}
                        />
                        {number.includes("+") && "+"}
                        {number.includes("-") && "-"}
                      </p>
                    )}
                    <p
                      className="text-neutral-700"
                      style={{
                        fontSize: number
                          ? "var(--mobile-text-base)"
                          : "var(--mobile-text-lg)",
                        fontWeight: number ? "normal" : "bold",
                      }}
                    >
                      {rest}
                    </p>
                  </>
                );
              })()}
            </div>
          )}

          {/* Client info */}
          <div
            className="flex flex-col text-neutral-600"
            style={{
              gap: "var(--mobile-gap-xs)",
              fontSize: "var(--mobile-text-xs)",
            }}
          >
            {proj?.client && (
              <p>
                Klient:{" "}
                <strong className="text-neutral-900">{proj.client}</strong>
              </p>
            )}
            {proj?.location && (
              <p>
                Lokasjon:{" "}
                <strong className="text-neutral-900">{proj.location}</strong>
              </p>
            )}
            {proj?.year && (
              <p>
                År: <strong className="text-neutral-900">{proj.year}</strong>
              </p>
            )}
            {proj?.industry && (
              <p>
                Industri:{" "}
                <strong className="text-neutral-900">{proj.industry}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
