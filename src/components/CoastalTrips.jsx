import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, Search, SearchX, Star, X } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Swap these with your own image (e.g. import hero from "../assets/hero.webp") if you like
const HERO_IMG =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2400&q=80";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80";

const headline = [["Explore"], ["Extraordinary", "Trips"]];

function CoastalHero() {
  const heroRef = useRef(null);

  // Gentle mouse parallax (updates CSS variables, no re-render)
  const onMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--px", `${x * -22}px`);
    el.style.setProperty("--py", `${y * -14}px`);
  };
  const onLeave = () => {
    const el = heroRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0px");
    el.style.setProperty("--py", "0px");
  };

  return (
    <section
      id="home"
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate flex h-[580px] items-end overflow-hidden bg-gradient-to-br from-[#0e8fae] to-ink md:h-[660px] lg:h-[calc(100vh-100px)] lg:max-h-[880px] lg:min-h-[640px]"
    >
      {/* Background image with slow zoom-out + parallax */}
      <div
        className="absolute -inset-6 -z-20 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: "translate3d(var(--px,0px), var(--py,0px), 0)" }}
      >
        <img
          src={HERO_IMG}
          alt="Green coastal cliffs meeting turquoise ocean"
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMG)
              e.currentTarget.src = FALLBACK_IMG;
          }}
          className="ct-zoom h-full w-full object-cover"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/65 via-transparent to-ink/25" />

      {/* Content */}
      <div className="mx-auto w-full max-w-[1700px] px-6 pb-14 lg:px-[62px] lg:pb-20">
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[96px]">
          {headline.map((line, li) => (
            <span key={li} className="block overflow-hidden pb-[0.12em]">
              <span
                className="ct-line block"
                style={{ animationDelay: `${450 + li * 160}ms` }}
              >
                {line.map((word) => (
                  <span
                    key={word}
                    className="mr-[0.22em] inline-block cursor-default transition-all duration-300 ease-out last:mr-0 hover:-translate-y-1.5 hover:text-[#8be9f8]"
                  >
                    {word}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="ct-up mt-5 max-w-[760px] text-lg leading-snug text-white/90 sm:text-2xl lg:mt-7 lg:text-[32px]"
          style={{ animationDelay: "900ms" }}
        >
          Discover breathtaking destinations, curated for unforgettable journeys
          around the world.
        </p>
      </div>
    </section>
  );
}

const FILTERS = ["All", "Surfing", "Hiking", "Travel", "Culture", "Wellness"];

// Change `to` to your own detail routes whenever you're ready (e.g. "/trips/bali")
const DESTINATIONS = [
  {
    id: "bali",
    name: "Bali, Indonesia",
    tags: ["Surfing", "Culture", "Nature"],
    categories: ["Surfing", "Culture"],
    days: 7,
    price: 1200,
    rating: 4.8,
    to: "/#trips",
    img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "maldives",
    name: "Maldives",
    tags: ["Snorkeling", "Island Hopping"],
    categories: ["Travel", "Wellness"],
    days: 6,
    price: 1400,
    rating: 4.9,
    to: "/#trips",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "costa-rica",
    name: "Costa Rica",
    tags: ["Rainforest", "Hiking", "Wildlife"],
    categories: ["Hiking", "Wellness"],
    days: 8,
    price: 1490,
    rating: 4.9,
    to: "/#trips",
    img: "https://images.unsplash.com/photo-1518259102261-b40117eabbfc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "portugal",
    name: "Portugal",
    tags: ["Surf", "Coastal Towns"],
    categories: ["Surfing", "Travel"],
    days: 6,
    price: 1790,
    rating: 4.7,
    to: "/#trips",
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "thailand",
    name: "Thailand",
    tags: ["Island Hopping", "Culture"],
    categories: ["Travel", "Culture"],
    days: 7,
    price: 1430,
    rating: 4.8,
    to: "/#trips",
    img: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "peru",
    name: "Peru",
    tags: ["Hiking", "Ancient Ruins"],
    categories: ["Hiking", "Culture"],
    days: 10,
    price: 1720,
    rating: 4.9,
    to: "/#trips",
    img: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
  },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function DestinationCard({ d, index, inView }) {
  return (
    <Link
      to={d.to}
      aria-label={`${d.name} – ${d.days} days from $${d.price}`}
      style={{ animationDelay: `${index * 90}ms` }}
      className={`group block overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_4px_18px_-8px_rgba(11,43,63,0.18)] outline-none transition-all duration-500 ease-out hover:-translate-y-2 hover:border-aqua/40 hover:shadow-[0_28px_50px_-18px_rgba(14,143,174,0.45)] focus-visible:ring-4 focus-visible:ring-aqua/40 active:scale-[0.99] ${
        inView ? "ds-card" : "opacity-0"
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-foam">
        <img
          src={d.img}
          alt={d.name}
          loading="lazy"
          onError={(e) => {
            const fb =
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
            if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
          }}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-4 right-4 inline-flex translate-y-4 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-ink opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View Trip
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-5">
        <h3 className="text-[26px] font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-aqua">
          {d.name}
        </h3>

        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[17px] text-[#6f93a8]">
          {d.tags.map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2">
              {i > 0 && <span className="text-[#9db6c4]">•</span>}
              {t}
            </span>
          ))}
        </p>

        <div className="mt-6 flex items-center justify-between text-ink">
          <div className="flex items-center gap-2.5 text-[17px]">
            <Calendar className="size-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
            <span className="font-medium">{d.days} Days</span>
            <span className="ml-1">
              From{" "}
              <span className="font-semibold">${d.price.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[17px] font-medium">
            <Star className="size-5 fill-ink text-ink transition-all duration-500 group-hover:rotate-[72deg] group-hover:scale-125 group-hover:fill-amber-400 group-hover:text-amber-400" />
            {d.rating}
          </div>
        </div>
      </div>
    </Link>
  );
}

function DestinationExplorer() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [ref, inView] = useInView();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DESTINATIONS.filter((d) => {
      const matchFilter = active === "All" || d.categories.includes(active);
      const matchQuery =
        !q ||
        [d.name, ...d.tags, ...d.categories]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchFilter && matchQuery;
    });
  }, [query, active]);

  const reset = () => {
    setQuery("");
    setActive("All");
  };

  return (
    <section id="explore" ref={ref} className="bg-[#f8fbfd] py-12 lg:py-20">
      <style>{`
        @keyframes ds-rise { from { opacity: 0; transform: translateY(36px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes ds-pop  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .ds-card { animation: ds-rise .85s cubic-bezier(.22,1,.36,1) both; }
        .ds-pop  { animation: ds-pop .7s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .ds-card, .ds-pop { animation: none !important; opacity: 1 !important; } }
      `}</style>

      <div className="mx-auto max-w-[1700px] px-6 lg:px-[62px]">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div
            className={`relative w-full lg:max-w-[440px] ${inView ? "ds-pop" : "opacity-0"}`}
          >
            <Search className="pointer-events-none absolute left-6 top-1/2 size-6 -translate-y-1/2 text-ink" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations..."
              aria-label="Search destinations"
              className="h-[62px] w-full rounded-full border border-slate-300/80 bg-white pl-16 pr-12 text-lg text-ink outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-aqua/60 focus:border-aqua focus:shadow-[0_0_0_5px_rgba(39,185,211,0.18)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-foam hover:text-ink active:scale-90"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div
            className="flex flex-wrap gap-3"
            role="tablist"
            aria-label="Filter by category"
          >
            {FILTERS.map((f, i) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(f)}
                  style={{ animationDelay: `${120 + i * 70}ms` }}
                  className={`rounded-full border px-7 py-[1.1rem] text-lg font-medium transition-all duration-300 active:scale-95 ${
                    inView ? "ds-pop" : "opacity-0"
                  } ${
                    isActive
                      ? "border-ink bg-ink text-white shadow-lg shadow-ink/25"
                      : "border-slate-300/80 bg-white text-ink hover:-translate-y-0.5 hover:border-aqua hover:text-aqua hover:shadow-md"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result count */}
        <p className="mt-6 text-base text-slate-500" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-ink">{results.length}</span>{" "}
          {results.length === 1 ? "destination" : "destinations"}
        </p>

        {/* Grid */}
        {results.length > 0 ? (
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((d, i) => (
              <DestinationCard
                key={`${active}-${d.id}`}
                d={d}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        ) : (
          <div className="ds-pop mt-10 flex flex-col items-center rounded-[22px] border border-dashed border-slate-300 bg-white py-20 text-center">
            <SearchX className="size-12 text-aqua" />
            <h3 className="mt-4 text-2xl font-semibold text-ink">
              No destinations found
            </h3>
            <p className="mt-2 text-slate-500">
              Try a different keyword or category.
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-full bg-ink px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua active:scale-95"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CoastalTrips() {
  return (
    <>
      <style>{`
        @keyframes ct-down { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: none; } }
        @keyframes ct-up   { from { opacity: 0; transform: translateY(28px); }  to { opacity: 1; transform: none; } }
        @keyframes ct-line { from { transform: translateY(110%); } to { transform: none; } }
        @keyframes ct-zoom { from { transform: scale(1.22); opacity: .6; } to { transform: scale(1.02); opacity: 1; } }
        .ct-down { animation: ct-down .8s cubic-bezier(.22,1,.36,1) both; }
        .ct-up   { animation: ct-up 1s cubic-bezier(.22,1,.36,1) both; }
        .ct-line { animation: ct-line 1s cubic-bezier(.22,1,.36,1) both; }
        .ct-zoom { animation: ct-zoom 2.6s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .ct-down, .ct-up, .ct-line, .ct-zoom { animation: none !important; }
        }
      `}</style>

      <Navbar />
      <main>
        <CoastalHero />
        <DestinationExplorer />
      </main>
      <Footer />
    </>
  );
}
