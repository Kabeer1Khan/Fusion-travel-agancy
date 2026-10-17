import { useCallback, useRef, useState } from "react";
import { ArrowRight, Camera, Flame, Footprints, Mountain, Sailboat, Sunset, Waves } from "lucide-react";
import { DetailModal, EASE, MediaCard, SnorkelIcon, TURTLE, px, toast, u, useInView } from "./shared";

const experiences = [
  {
    id: "turtles", icon: SnorkelIcon,
    place: "Great Barrier Reef, Australia", title: "Snorkel with sea turtles",
    desc: "Explore the vibrant underwater world and meet amazing marine life.",
    facts: [["Duration", "Half day"], ["Group size", "Up to 8"], ["Level", "All levels"], ["From", "$180"]],
    pos: "50% 55%",
    srcs: [TURTLE, px(7169293), px(31094871, "diving-with-sea-turtles-in-saipan-s-vibrant-reef")],
  },
  {
    id: "campfire", icon: Flame,
    place: "Bali, Indonesia", title: "Campfire on the beach",
    desc: "Good friends, good food, unforgettable nights.",
    facts: [["Duration", "Evening"], ["Group size", "Up to 12"], ["Level", "Everyone"], ["From", "$65"]],
    pos: "50% 60%",
    srcs: [u("1444210971048-6130cf0c46cf"), px(34722486, "silhouettes-on-a-beach-during-sunset")],
  },
  {
    id: "sunset-surf", icon: Camera,
    place: "Maldives", title: "Sunset surf session",
    desc: "The best waves, the best views.",
    facts: [["Duration", "3 hours"], ["Group size", "Up to 6"], ["Level", "Beginner+"], ["From", "$120"]],
    pos: "50% 60%",
    srcs: [
      px(34722486, "silhouettes-on-a-beach-during-sunset"),
      px(18716583, "seashore-at-sunset"),
      u("1513569143478-b38b2c0ef97f"),
    ],
  },
  {
    id: "amalfi", icon: Mountain,
    place: "Amalfi Coast, Italy", title: "Scenic coastal drives",
    desc: "Beautiful roads, hidden gems.",
    facts: [["Duration", "Full day"], ["Group size", "Up to 6"], ["Level", "Easy"], ["From", "$210"]],
    pos: "55% 50%",
    srcs: [u("1658653117780-7ba8b5f5d6ad"), px(163864)],
  },
  /* revealed by “View all experiences” */
  {
    id: "hike", icon: Footprints, extra: true,
    place: "Madeira, Portugal", title: "Cliff-top sunrise hike",
    desc: "Wake early, climb high, breakfast above the clouds.",
    facts: [["Duration", "5 hours"], ["Group size", "Up to 10"], ["Level", "Moderate"], ["From", "$90"]],
    pos: "50% 50%",
    srcs: [px(13568681), px(6953269)],
  },
  {
    id: "learn", icon: Waves, extra: true,
    place: "Taghazout, Morocco", title: "Learn to surf",
    desc: "Small-group coaching on gentle, friendly waves.",
    facts: [["Duration", "2 hours"], ["Group size", "Up to 6"], ["Level", "Beginner"], ["From", "$75"]],
    pos: "50% 50%",
    srcs: [u("1523606772308-64a28db0ef2c"), u("1551524358-f34c0214781d")],
  },
  {
    id: "islands", icon: Sailboat, extra: true,
    place: "El Nido, Philippines", title: "Island-hopping by boat",
    desc: "Hidden lagoons, empty beaches, fresh grilled lunch.",
    facts: [["Duration", "Full day"], ["Group size", "Up to 12"], ["Level", "Everyone"], ["From", "$95"]],
    pos: "50% 55%",
    srcs: [
      px(33980644, "tropical-palm-trees-under-blue-sky-in-paradise-setting"),
      px(20311304, "palm-trees-on-exotic-island-in-ocean"),
    ],
  },
  {
    id: "sail", icon: Sunset, extra: true,
    place: "Santorini, Greece", title: "Caldera sunset sailing",
    desc: "Glide past the cliffs as the sky turns gold.",
    facts: [["Duration", "4 hours"], ["Group size", "Up to 10"], ["Level", "Everyone"], ["From", "$140"]],
    pos: "50% 55%",
    srcs: [px(1010657), px(3215009), px(163864)],
  },
];

const base = experiences.filter((e) => !e.extra);
const extra = experiences.filter((e) => e.extra);

const toDetail = (e) => ({
  ...e,
  tag: "Real trip · Real story",
  long: `${e.desc} Hosted by local guides, kept to a small group and built to leave ${e.place.split(",")[0]} better than we found it.`,
});

function PalmMini() {
  return (
    <svg viewBox="0 0 60 60" fill="none" className="h-12 w-12 shrink-0 overflow-visible" aria-hidden="true">
      <g className="animate-palm-sway" style={{ transformOrigin: "30px 58px" }}>
        <path d="M29 58C29 46 30 36 32 26" stroke="#2fb3c4" strokeWidth="2.6" strokeLinecap="round" />
        <g fill="#2fb3c4">
          <path d="M32 26C28 14 18 11 6 18c11-2 19 1 26 8Z" />
          <path d="M32 26c2-12 12-18 25-14-10 0-18 4-25 14Z" />
          <path d="M32 26C22 24 12 29 8 40c8-8 16-12 24-14Z" />
          <path d="M32 26c9-3 19 1 24 11-8-6-16-9-24-11Z" />
          <path d="M32 26c-1-9 0-17 5-24 0 9-2 17-5 24Z" />
        </g>
      </g>
    </svg>
  );
}

export default function Experiences() {
  const [sectionRef, show] = useInView(0.12);
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(() => new Set());
  const extraRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  const openItem = (e) => {
    setActive(toDetail(e));
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

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      setTimeout(
        () => extraRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
        350
      );
    }
  };

  const rise = (ms) => ({ transitionDelay: `${ms}ms` });
  const fade = `transition-all duration-[900ms] ${EASE} ${
    show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;
  const gridCols = "sm:grid-cols-2 lg:grid-cols-[1.07fr_1fr_0.98fr_1.1fr] lg:gap-[18px]";

  return (
    <section
      id="trips"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden bg-linear-to-b from-[#f3f9fb] to-[#eaf6f9]"
    >
      {/* soft wave at the top */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="animate-wave-bob-slow pointer-events-none absolute inset-x-0 top-0 h-16 w-full"
        aria-hidden="true"
      >
        <path d="M0 0H1440V40C1240 70 1020 20 760 38C520 54 260 74 0 34Z" fill="#ffffff" opacity="0.7" />
      </svg>

      <div
        id="experiences"
        className="relative mx-auto max-w-[1500px] scroll-mt-24 px-6 pb-24 pt-20 lg:px-[62px] lg:pb-28 lg:pt-24"
      >
        {/* ---- header ---- */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <div
              className={`flex items-end gap-3 ${fade}`}
              style={rise(100)}
            >
              <PalmMini />
              <p className="mb-2 flex items-center font-display text-[0.78rem] font-semibold uppercase tracking-[0.3em] text-lagoon">
                Real trips
                <span className="mx-4 inline-block h-4 w-px bg-lagoon/50" />
                Real stories
              </p>
            </div>

            <h2 className="-mt-1 text-[clamp(2.1rem,3.7vw,3.6rem)] font-bold leading-[1.04] tracking-[-0.04em] text-deep">
              {["Experiences", "beyond the waves"].map((line, i) => (
                <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                  <span
                    className={`block transition-transform duration-[1100ms] ${EASE} ${
                      show ? "translate-y-0" : "translate-y-[115%]"
                    }`}
                    style={rise(250 + i * 150)}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <button
            onClick={toggleExpanded}
            aria-expanded={expanded}
            className={`group relative mb-3 inline-flex items-center gap-3 py-2 text-[1.02rem] font-medium text-lagoon transition-colors duration-300 hover:text-deep ${fade}`}
            style={rise(600)}
          >
            <span className="relative">
              {expanded ? "Show fewer" : "View all experiences"}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <ArrowRight
              className={`size-5 transition-transform duration-500 ${
                expanded ? "-rotate-90 group-hover:-translate-y-1" : "group-hover:translate-x-2"
              }`}
            />
          </button>
        </div>

        {/* ---- main row ---- */}
        <div className={`mt-9 grid gap-4 ${gridCols}`}>
          {base.map((e, i) => (
            <div
              key={e.id}
              className={`h-[330px] sm:h-[340px] ${show ? "animate-card-in" : "opacity-0"}`}
              style={{ animationDelay: `${450 + i * 130}ms` }}
            >
              <MediaCard item={e} badge={e.icon} saved={saved.has(e.id)} onOpen={openItem} />
            </div>
          ))}
        </div>

        {/* ---- extra row (expands smoothly) ---- */}
        <div
          ref={extraRef}
          aria-hidden={!expanded}
          className={`grid transition-all duration-700 ${EASE} ${
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className={`grid gap-4 pb-8 pt-5 ${gridCols}`}>
              {extra.map((e, i) => (
                <div
                  key={e.id}
                  className={`h-[330px] transition-all duration-700 sm:h-[340px] ${EASE} ${
                    expanded ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0"
                  }`}
                  style={{ transitionDelay: expanded ? `${250 + i * 110}ms` : "0ms" }}
                >
                  <MediaCard
                    item={e}
                    badge={e.icon}
                    saved={saved.has(e.id)}
                    onOpen={openItem}
                    tabIndex={expanded ? 0 : -1}
                  />
                </div>
              ))}
            </div>
          </div>
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