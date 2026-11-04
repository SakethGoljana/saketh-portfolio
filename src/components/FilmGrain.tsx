export default function FilmGrain() {
  return (
    <>
      {/* Cinematic 35mm Analog Film Grain Layer (Dark Mode ONLY - Disabled in Light Mode for pure paper white) */}
      <div
        aria-hidden="true"
        className="hidden dark:block fixed inset-0 pointer-events-none z-[60] opacity-[0.06] mix-blend-overlay select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grainNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grainNoise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
      />

      {/* Cinematic Lens Vignette (Dark Mode ONLY) */}
      <div
        aria-hidden="true"
        className="hidden dark:block fixed inset-0 pointer-events-none z-[58] select-none"
        style={{
          background: `radial-gradient(ellipse 95% 85% at 50% 48%, transparent 45%, rgba(6, 6, 9, 0.45) 80%, rgba(4, 4, 6, 0.85) 100%)`,
        }}
      />
    </>
  );
}
