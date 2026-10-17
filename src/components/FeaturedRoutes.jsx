import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DetailModal, EASE, MediaCard, px, toast, u, useInView } from "./shared";

const regions = ["All", "Asia", "Africa", "Australia", "Europe"];

/* 12 routes (3 per region). "All" shows the 3 featured ones. */
const routes = [
  {
    id: "bacuit", featured: true, region: "Asia",
    place: "Bacuit Archipelago, Philippines", title: "For adventure and beyond",
    desc: "From hidden surf spots to vibrant island culture, this route has it all.",
    d: "9 days", s: "Nov – Mar", l: "Intermediate", p: 1490, pos: "50% 45%",
    srcs: [u("1459745930869-b3d0d72c3cbb"), u("1455264745730-cb3b76250ae8")],
  },
  {
    id: "santorini", featured: true, region: "Europe",
    place: "Santorini, Greece", title: "Chase waves, catch sunsets",
    desc: "Cliff-top villages, calm Aegean mornings and golden evenings.",
    d: "7 days", s: "May – Sep", l: "Beginner", p: 1180, pos: "50% 55%",
    srcs: [px(3215009), px(1010657), px(163864)],
  },
  {
    id: "siargao", featured: true, region: "Asia",
    place: "Siargao, Philippines", title: "Island vibes, endless waves",
    desc: "Palm-lined beaches and the famous Cloud 9 reef break.",
    d: "8 days", s: "Aug – Nov", l: "All levels", p: 1320, pos: "50% 55%",
    srcs: [
      px(20311304, "palm-trees-on-exotic-island-in-ocean"),
      px(33980644, "tropical-palm-trees-under-blue-sky-in-paradise-setting"),
      u("1559627755-42212e5c5fdf"),
    ],
  },
  {
    id: "uluwatu", region: "Asia",
    place: "Uluwatu, Indonesia", title: "Cliff-top breaks, temple sunsets",
    desc: "Reef barrels below, ocean temples above.",
    d: "10 days", s: "Apr – Oct", l: "Advanced", p: 1650, pos: "50% 50%",
    srcs: [u("1559627755-42212e5c5fdf"), u("1526342122811-2a9c8512023d")],
  },
  {
    id: "ericeira", region: "Europe",
    place: "Ericeira, Portugal", title: "Whitewashed coast, world-class reefs",
    desc: "Europe's first surf reserve, fresh seafood and slow evenings.",
    d: "7 days", s: "Sep – Nov", l: "Intermediate", p: 1090, pos: "50% 50%",
    srcs: [u("1551524358-f34c0214781d"), u("1530870110042-98b2cb110834")],
  },
  {
    id: "hossegor", region: "Europe",
    place: "Hossegor, France", title: "Pine forests, powerful barrels",
    desc: "Beach breaks that pump all autumn long.",
    d: "6 days", s: "Sep – Oct", l: "Advanced", p: 1240, pos: "50% 50%",
    srcs: [u("1530870110042-98b2cb110834"), u("1551524358-f34c0214781d")],
  },
  {
    id: "taghazout", region: "Africa",
    place: "Taghazout, Morocco", title: "Golden coast, mellow point breaks",
    desc: "Argan groves, tagine lunches and long, forgiving rides.",
    d: "8 days", s: "Oct – Mar", l: "Beginner", p: 980, pos: "50% 50%",
    srcs: [u("1513569143478-b38b2c0ef97f"), u("1523606772308-64a28db0ef2c")],
  },
  {
    id: "jbay", region: "Africa",
    place: "Jeffreys Bay, South Africa", title: "The longest right-hand rides",
    desc: "A legendary point break and a wild, welcoming coast.",
    d: "9 days", s: "Jun – Sep", l: "Advanced", p: 1560, pos: "50% 50%",
    srcs: [u("1455264745730-cb3b76250ae8"), u("1459745930869-b3d0d72c3cbb")],
  },
  {
    id: "capeverde", region: "Africa",
    place: "Sal, Cape Verde", title: "Trade winds, desert beaches",
    desc: "Warm water, bright light and empty lineups.",
    d: "7 days", s: "Oct – Apr", l: "Intermediate", p: 1120, pos: "50% 50%",
    srcs: [u("1526342122811-2a9c8512023d"), u("1523606772308-64a28db0ef2c")],
  },
  {
    id: "byron", region: "Australia",
    place: "Byron Bay, Australia", title: "Lighthouse lines, laid-back days",
    desc: "Easy-going point breaks and a hinterland full of cafés.",
    d: "8 days", s: "Feb – May", l: "All levels", p: 1710, pos: "50% 50%",
    srcs: [u("1493225255756-d9584f8606e9"), u("1527731149372-fae504a1185f")],
  },
  {
    id: "goldcoast", region: "Australia",
    place: "Gold Coast, Australia", title: "Blue walls, long point rides",
    desc: "Sand-bottom points with some of the best waves on earth.",
    d: "7 days", s: "Mar – Jun", l: "Intermediate", p: 1680, pos: "50% 50%",
    srcs: [u("1609870025624-98b62826e80a"), u("1493225255756-d9584f8606e9")],
  },
  {
    id: "noosa", region: "Australia",
    place: "Noosa Heads, Australia", title: "Gentle longboard waves",
    desc: "National-park trails and rolling, friendly peelers.",
    d: "6 days", s: "Dec – Apr", l: "Beginner", p: 1390, pos: "50% 50%",
    srcs: [u("1527731149372-fae504a1185f"), u("1612025344470-df9818c785a4")],
  },
];

const toDetail = (r) => ({
  ...r,
  tag: `${r.region} surf route`,
  long: `${r.desc} Every Tidepost route is led by local guides, capped at small groups and built around locally owned stays, so your trip gives back to ${r.place.split(",")[0]}.`,
  facts: [
    ["Duration", r.d],
    ["Best season", r.s],
    ["Skill level", r.l],
    ["From", `$${r.p.toLocaleString()}`],
  ],
});

/* ------------- pills with a sliding active indicator ------------------- */
function FilterPills({ value, onChange }) {
  const refs = useRef({});
  const [ind, setInd] = useState({ left: 0, top: 0, width: 0, ready: false });

  const measure = useCallback(() => {
    const el = refs.current[value];
    if (el) setInd({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, ready: true });
  }, [value]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div role="tablist" aria-label="Filter routes by region" className="relative flex flex-wrap gap-3">
      <span
        aria-hidden="true"
        className="absolute h-11 rounded-full bg-deep shadow-[0_12px_24px_-8px_rgba(10,60,82,0.7)] transition-all duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
        style={{ left: ind.left, top: ind.top, width: ind.width, opacity: ind.ready ? 1 : 0 }}
      />
      {regions.map((r) => {
        const active = value === r;
        return (
          <button
            key={r}
            ref={(el) => (refs.current[r] = el)}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r)}
            className={`relative z-10 h-11 rounded-full border px-5 text-[0.9rem] font-medium transition-all duration-300 active:scale-95 ${
              active
                ? "border-transparent text-white"
                : "border-[#d4e6ec] bg-white/70 text-deep hover:-translate-y-0.5 hover:border-aqua hover:bg-white hover:text-lagoon"
            }`}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- section ------------------------------ */
export default function FeaturedRoutes() {
  const [sectionRef, show] = useInView(0.12);
  const [region, setRegion] = useState("All");
  const [intro, setIntro] = useState(true);
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(() => new Set());

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setIntro(false), 1800);
    return () => clearTimeout(t);
  }, [show]);

  const list = useMemo(
    () => (region === "All" ? routes.filter((r) => r.featured) : routes.filter((r) => r.region === region)),
    [region]
  );

  const close = useCallback(() => setOpen(false), []);
  const openRoute = (r) => {
    setActive(toDetail(r));
    setOpen(true);
  };
  const toggleSave = () => {
    if (!active) return;
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(active.id)) {
        next.delete(active.id);
        toast("Removed from your wishlist");
      } else {
        next.add(active.id);
        toast(`Saved “${active.title}” to your wishlist`);
      }
      return next;
    });
  };

  const rise = (ms) => ({ transitionDelay: `${ms}ms` });
  const fade = `transition-all duration-[900ms] ${EASE} ${
    show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden bg-[#f3f9fb]"
    >
      <div className="mx-auto max-w-[1500px] px-6 pb-16 pt-16 lg:px-[62px] lg:pb-20 lg:pt-20">
        <div className="grid gap-4 md:grid-cols-2 lg:auto-rows-[236px] lg:grid-cols-[1fr_1fr_0.79fr]">
          {/* ---- text column ---- */}
          <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 lg:pr-6 lg:pt-3">
            <p
              className={`font-display text-[0.78rem] font-semibold uppercase tracking-[0.34em] text-lagoon ${fade}`}
              style={rise(150)}
            >
              Featured routes
            </p>

            <h2 className="mt-6 text-[clamp(2.1rem,3.7vw,3.6rem)] font-bold leading-[1.04] tracking-[-0.04em] text-deep">
              {["12 epic surf routes", "around the world"].map((line, i) => (
                <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                  <span
                    className={`block transition-transform duration-[1100ms] ${EASE} ${
                      show ? "translate-y-0" : "translate-y-[115%]"
                    }`}
                    style={rise(300 + i * 150)}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <p
              className={`mt-7 max-w-[24rem] text-[1.08rem] leading-[1.75] text-[#587080] ${fade}`}
              style={rise(700)}
            >
              Discover some of the most breathtaking surf routes that promise unforgettable
              adventures and epic waves.
            </p>

            <div className={`mt-9 ${fade}`} style={rise(900)}>
              <FilterPills value={region} onChange={setRegion} />
            </div>
          </div>

          {/* ---- cards (re-mount on filter change to replay the entrance) ---- */}
          {list.map((r, i) => (
            <div
              key={`${region}-${r.id}`}
              className={`${show ? "animate-card-in" : "opacity-0"} ${
                i === 0
                  ? "h-[380px] md:row-span-2 md:h-auto lg:row-span-2"
                  : "h-[240px] lg:h-auto"
              }`}
              style={{ animationDelay: `${(intro ? 500 : 0) + i * 130}ms` }}
            >
              <MediaCard
                item={r}
                big={i === 0}
                showDesc={i === 0}
                saved={saved.has(r.id)}
                onOpen={openRoute}
              />
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        item={active}
        open={open}
        onClose={close}
        saved={active ? saved.has(active.id) : false}
        onToggleSave={toggleSave}
      />
    </section>
  );
}