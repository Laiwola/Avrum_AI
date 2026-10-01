const partners = [
  "AgriTech Africa",
  "Sasakawa",
  "OCP Africa",
  "IITA",
  "Babban Gona",
  "One Acre Fund",
  "Olam Agri",
  "CGIAR",
];

export function TrustedBy() {
  return (
    <section aria-label="Trusted by" className="border-y border-border bg-surface/60 py-10">
      <div className="marketing-container">
        <p className="text-center text-overline text-muted-foreground">
          Trusted by agronomy teams and cooperatives across 11 countries
        </p>

        <div
          className="relative mt-6 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <ul className="animate-marquee flex w-max items-center gap-10 sm:gap-14">
            {[...partners, ...partners].map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= partners.length}
                className="whitespace-nowrap font-display text-base font-bold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground sm:text-lg"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
