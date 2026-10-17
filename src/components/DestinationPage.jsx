import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Compass,
  Globe,
  Leaf,
  Mail,
  Sparkles,
  Timer,
  User,
  Users,
  X,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getDestination } from "./destinationsData";
import { getOverview } from "./overviewData";
import { getItinerary } from "./itineraryData";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80";

function DestinationHero({ d }) {
  const heroRef = useRef(null);

  // Gentle mouse parallax (CSS variables, no re-render)
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

  const words = d.name.split(" ");
  const meta = [
    { Icon: Timer, label: `${d.days} Days` },
    { Icon: Activity, label: d.level },
    { Icon: Compass, label: d.season },
  ];

  return (
    <section
      id="destination-hero"
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate flex h-[560px] items-center overflow-hidden bg-gradient-to-br from-[#0e8fae] to-ink md:h-[620px] lg:h-[700px]"
    >
      {/* Background image: slow zoom-out + parallax */}
      <div
        className="absolute -inset-6 -z-20 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: "translate3d(var(--px,0px), var(--py,0px), 0)" }}
      >
        <img
          src={d.img}
          alt={d.name}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMG)
              e.currentTarget.src = FALLBACK_IMG;
          }}
          className="dp-zoom h-full w-full object-cover"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/40 via-transparent to-ink/20" />

      {/* Content */}
      <div className="mx-auto w-full max-w-[1700px] px-6 lg:px-[62px]">
        <Link
          to="/coastal-trips"
          className="dp-up group mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white lg:mb-8"
          style={{ animationDelay: "250ms" }}
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          All trips
        </Link>

        <h1 className="flex flex-wrap gap-x-[0.25em] text-[44px] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[104px]">
          {words.map((w, i) => (
            <span key={w + i} className="block overflow-hidden pb-[0.14em]">
              <span
                className="dp-word block"
                style={{ animationDelay: `${350 + i * 140}ms` }}
              >
                <span className="inline-block cursor-default transition-colors duration-300 hover:text-[#8be9f8]">
                  {w}
                </span>
              </span>
            </span>
          ))}
        </h1>

        <p
          className="dp-up mt-3 max-w-[900px] text-xl leading-snug text-white/95 sm:text-2xl lg:mt-4 lg:text-[38px]"
          style={{ animationDelay: "800ms" }}
        >
          {d.tagline}
        </p>

        {/* Meta row */}
        <div className="mt-8 flex flex-wrap items-center gap-x-0 gap-y-4 text-white lg:mt-12">
          {meta.map(({ Icon, label }, i) => (
            <div key={label} className="flex items-center">
              {i > 0 && (
                <span
                  className="dp-fade mx-5 hidden h-9 w-px bg-white/35 sm:block lg:mx-8"
                  style={{ animationDelay: `${1000 + i * 120}ms` }}
                />
              )}
              <div
                className="dp-up group flex cursor-default items-center gap-3 transition-transform duration-300 hover:-translate-y-1 max-sm:mr-6"
                style={{ animationDelay: `${950 + i * 120}ms` }}
              >
                <Icon
                  strokeWidth={1.8}
                  className="size-6 transition-all duration-500 group-hover:rotate-[14deg] group-hover:scale-125 group-hover:text-[#8be9f8] lg:size-8"
                />
                <span className="text-lg font-medium transition-colors duration-300 group-hover:text-[#8be9f8] lg:text-[28px]">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={`/plan-your-trip?trip=${d.slug}`}
          className="dp-up group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#c6f3fb] px-9 py-4 text-lg font-semibold text-ink shadow-xl shadow-ink/25 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-aqua/40 active:scale-95 lg:mt-12 lg:px-12 lg:py-5 lg:text-[24px]"
          style={{ animationDelay: "1350ms" }}
        >
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/70 transition-transform duration-700 group-hover:translate-x-[500%]" />
          <span className="relative">Book This Trip</span>
          <ArrowRight className="relative size-6 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>
    </section>
  );
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "gallery", label: "Gallery" },
  { id: "guide", label: "Useful Guide" },
  { id: "reviews", label: "Reviews" },
];

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, show];
}

/* Sticky tabs: sliding underline + scroll-spy.
   Future sections: give them id="itinerary", id="gallery", id="guide", id="reviews"
   and the tabs will scroll to them and highlight automatically. */
function DestinationTabs() {
  const [active, setActive] = useState("overview");
  const [bar, setBar] = useState({ left: 0, width: 0, ready: false });
  const btns = useRef({});

  const measure = useCallback(() => {
    const el = btns.current[active];
    if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [active]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + (window.innerWidth >= 1024 ? 200 : 160);
      let cur = TABS[0].id;
      for (const t of TABS) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= line)
          cur = t.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = window.innerWidth >= 1024 ? 170 : 140;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky top-20 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl lg:top-[100px]">
      <style>{`
        @keyframes ov-down { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        .ov-down { animation: ov-down .8s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .ov-down { animation: none !important; } }
      `}</style>
      <div className="mx-auto max-w-[1700px] px-6 lg:px-[62px]">
        <div
          role="tablist"
          aria-label="Trip sections"
          className="relative flex gap-9 overflow-x-auto [scrollbar-width:none] lg:gap-[72px] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (btns.current[t.id] = el)}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => go(t.id)}
              style={{ animationDelay: `${i * 70}ms` }}
              className={`ov-down shrink-0 whitespace-nowrap py-5 text-lg font-medium transition-colors duration-300 active:scale-95 lg:py-6 lg:text-[24px] ${
                active === t.id
                  ? "text-ink"
                  : "text-slate-500 hover:text-[#1f66d6]"
              }`}
            >
              {t.label}
            </button>
          ))}
          <span
            className="pointer-events-none absolute bottom-0 h-[4px] rounded-full bg-[#1f66d6] transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{
              left: bar.left,
              width: bar.width,
              opacity: bar.ready ? 1 : 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function DestinationOverview({ d }) {
  const o = getOverview(d.slug);
  const [ref, show] = useReveal();
  if (!o) return null;

  const items = [
    { Icon: Compass, title: "Best For", text: o.bestFor },
    { Icon: Briefcase, title: "Itinerary Type", text: o.itinerary },
    { Icon: Leaf, title: "Nature", text: o.nature },
    { Icon: Users, title: "Sustainability", text: o.sustainability },
  ];
  const reveal = (cls) => (show ? cls : "opacity-0");

  return (
    <section id="overview" ref={ref} className="bg-white py-12 lg:py-20">
      <style>{`
        @keyframes ov-up  { from { opacity: 0; transform: translateY(34px); } to { opacity: 1; transform: none; } }
        @keyframes ov-img { from { opacity: 0; clip-path: inset(0 0 100% 0 round 28px); transform: translateY(40px); } to { opacity: 1; clip-path: inset(0 0 0 0 round 28px); transform: none; } }
        .ov-up  { animation: ov-up 1s cubic-bezier(.22,1,.36,1) both; }
        .ov-img { animation: ov-img 1.3s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .ov-up, .ov-img { animation: none !important; opacity: 1 !important; clip-path: none !important; } }
      `}</style>

      <div className="mx-auto max-w-[1700px] px-6 lg:px-[62px]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Text side */}
          <div>
            <h2
              className={`${reveal("ov-up")} text-[40px] font-bold leading-tight tracking-tight text-ink lg:text-[60px]`}
            >
              Trip Overview
            </h2>

            <p
              className={`${reveal("ov-up")} mt-5 max-w-[780px] text-lg leading-[1.7] text-[#5b7186] lg:mt-6 lg:text-[24px]`}
              style={{ animationDelay: "120ms" }}
            >
              {o.description}
            </p>

            <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-14">
              {items.map(({ Icon, title, text }, i) => (
                <li
                  key={title}
                  className={reveal("ov-up")}
                  style={{ animationDelay: `${260 + i * 130}ms` }}
                >
                  <div className="group flex cursor-default items-center gap-5 rounded-3xl p-3 -m-3 transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#f3f8ff]">
                    <span className="grid size-[84px] shrink-0 place-items-center rounded-full bg-[#eaf3ff] text-[#1f66d6] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#1f66d6] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#1f66d6]/30 lg:size-[108px]">
                      <Icon
                        strokeWidth={1.6}
                        className="size-9 transition-transform duration-500 group-hover:rotate-[14deg] lg:size-12"
                      />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-ink transition-colors duration-300 group-hover:text-[#1f66d6] lg:text-[26px]">
                        {title}
                      </h3>
                      <p className="mt-1 text-base leading-snug text-[#5b7186] lg:text-[20px]">
                        {text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Image side */}
          <div className={reveal("ov-img")} style={{ animationDelay: "200ms" }}>
            <div className="group relative aspect-[1/1.02] overflow-hidden rounded-[28px] bg-foam shadow-[0_30px_70px_-30px_rgba(11,43,63,0.45)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-30px_rgba(31,102,214,0.45)]">
              <img
                src={o.img}
                alt={d.name}
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== d.img)
                    e.currentTarget.src = d.img;
                }}
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-[1200ms] group-hover:translate-x-[520%]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuideAvatar({ g, className = "" }) {
  const [bad, setBad] = useState(false);
  const initials = g.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  if (bad)
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-[#0e8fae] to-ink text-4xl font-semibold text-white ${className}`}
      >
        {initials}
      </div>
    );
  return (
    <img
      src={g.img}
      alt={g.name}
      loading="lazy"
      onError={() => setBad(true)}
      className={`object-cover ${className}`}
    />
  );
}

function GuideModal({ g, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${g.name} profile`}
    >
      <div
        onClick={onClose}
        className="it-fade absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />
      <div className="it-pop relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[28px] bg-white p-7 shadow-2xl sm:p-9">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-slate-500 transition-all duration-300 hover:rotate-90 hover:bg-foam hover:text-ink active:scale-90"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-5">
          <GuideAvatar
            g={g}
            className="size-24 shrink-0 rounded-full ring-4 ring-[#eaf3ff]"
          />
          <div>
            <h3 className="text-2xl font-semibold text-ink sm:text-[30px]">
              {g.name}
            </h3>
            <p className="text-[#5b7186]">
              {g.role} • {g.years}
            </p>
          </div>
        </div>

        <p className="mt-6 leading-relaxed text-[#5b7186]">{g.bio}</p>

        <div className="mt-6">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
            <Globe className="size-4 text-[#1f66d6]" /> Languages
          </p>
          <div className="flex flex-wrap gap-2">
            {g.languages.map((l) => (
              <span
                key={l}
                className="rounded-full bg-[#eaf3ff] px-4 py-1.5 text-sm font-medium text-[#1f66d6]"
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles className="size-4 text-[#1f66d6]" /> Specialties
          </p>
          <div className="flex flex-wrap gap-2">
            {g.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full bg-[#f3f8ff] px-4 py-1.5 text-sm font-medium text-ink ring-1 ring-slate-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <a
          href={`mailto:guides@tidepost.travel?subject=${encodeURIComponent(
            `Question for ${g.name}`,
          )}`}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#0b5a85] px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f66d6] active:scale-95"
        >
          <Mail className="size-5" />
          Message {g.name.split(" ")[0]}
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
      </div>
    </div>,
    document.body,
  );
}

function DestinationItinerary({ d }) {
  const data = getItinerary(d.slug);
  const [ref, show] = useReveal(0.1);
  const [guideOpen, setGuideOpen] = useState(false);
  const closeGuide = useCallback(() => setGuideOpen(false), []);
  if (!data) return null;

  const { itinerary, guide, gallery } = data;
  const reveal = (cls) => (show ? cls : "opacity-0");
  const cardClass =
    "h-full rounded-[28px] bg-white p-6 shadow-[0_10px_40px_-18px_rgba(11,43,63,0.2)] ring-1 ring-slate-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(31,102,214,0.3)] lg:p-9";

  return (
    <section
      id="itinerary"
      ref={ref}
      className="bg-gradient-to-b from-[#f4f9fd] to-white py-12 lg:py-20"
    >
      <style>{`
        @keyframes it-up    { from { opacity: 0; transform: translateY(34px); } to { opacity: 1; transform: none; } }
        @keyframes it-line  { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes it-vline { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes it-img   { from { opacity: 0; clip-path: inset(100% 0 0 0 round 20px); transform: scale(.94); } to { opacity: 1; clip-path: inset(0 0 0 0 round 20px); transform: none; } }
        @keyframes it-fade  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes it-pop   { from { opacity: 0; transform: translateY(24px) scale(.95); } to { opacity: 1; transform: none; } }
        .it-up    { animation: it-up 1s cubic-bezier(.22,1,.36,1) both; }
        .it-line  { animation: it-line 1.2s cubic-bezier(.22,1,.36,1) both; }
        .it-vline { animation: it-vline 1.6s cubic-bezier(.22,1,.36,1) both; }
        .it-img   { animation: it-img 1.2s cubic-bezier(.22,1,.36,1) both; }
        .it-fade  { animation: it-fade .35s ease both; }
        .it-pop   { animation: it-pop .5s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .it-up, .it-line, .it-vline, .it-img, .it-fade, .it-pop { animation: none !important; opacity: 1 !important; clip-path: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1700px] px-6 lg:px-[62px]">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ───────── Itinerary Highlights ───────── */}
          <div className={reveal("it-up")}>
            <div className={cardClass}>
              <div className="flex items-center gap-4">
                <Compass
                  strokeWidth={1.7}
                  className="size-8 shrink-0 text-[#1f66d6] lg:size-10"
                />
                <h2 className="text-2xl font-semibold tracking-tight text-ink lg:text-[36px]">
                  Itinerary Highlights
                </h2>
                <span
                  className={`${reveal("it-line")} h-px flex-1 origin-left bg-[#7cc4ec]`}
                  style={{ animationDelay: "450ms" }}
                />
              </div>

              <ul className="relative mt-7 space-y-1 lg:mt-9">
                <span
                  className={`${reveal("it-vline")} absolute bottom-5 left-[5px] top-5 w-px origin-top bg-[#bfe0f5]`}
                  style={{ animationDelay: "400ms" }}
                />
                {itinerary.map((text, i) => (
                  <li
                    key={`${d.slug}-${i}`}
                    className={reveal("it-up")}
                    style={{ animationDelay: `${250 + i * 90}ms` }}
                  >
                    <div className="group relative flex cursor-default items-center gap-4 rounded-2xl py-2.5 pr-3 transition-all duration-300 hover:translate-x-1.5 hover:bg-[#f3f8ff] lg:gap-6">
                      <span className="size-[11px] shrink-0 rounded-full bg-[#4aa8e8] transition-all duration-300 group-hover:scale-[1.6] group-hover:bg-[#1f66d6]" />
                      <span className="w-[84px] shrink-0 rounded-full bg-[#eef6fd] py-1.5 text-center text-base font-medium text-ink shadow-sm transition-all duration-300 group-hover:bg-[#1f66d6] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#1f66d6]/30 lg:w-[92px] lg:text-xl">
                        Day {i + 1}
                      </span>
                      <span className="text-base leading-snug text-[#4d6579] transition-colors duration-300 group-hover:text-ink lg:text-[21px]">
                        {text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ───────── Meet Your Local Guide ───────── */}
          <div className={reveal("it-up")} style={{ animationDelay: "150ms" }}>
            <div className={`${cardClass} flex flex-col`}>
              <div className="flex items-center gap-4">
                <User
                  strokeWidth={1.8}
                  className="size-7 shrink-0 text-[#1f66d6] lg:size-9"
                />
                <h2 className="text-2xl font-semibold tracking-tight text-ink lg:text-[36px]">
                  Meet Your Local Guide
                </h2>
              </div>

              <div className="mt-8 flex flex-1 flex-col items-center gap-8 sm:flex-row lg:mt-10 lg:gap-12">
                <div
                  className={`${reveal("it-img")} group shrink-0`}
                  style={{ animationDelay: "350ms" }}
                >
                  <div className="rounded-full p-1.5 ring-2 ring-transparent transition-all duration-500 group-hover:scale-105 group-hover:ring-aqua/60 group-hover:shadow-xl group-hover:shadow-aqua/30">
                    <div className="size-[170px] overflow-hidden rounded-full lg:size-[240px]">
                      <GuideAvatar
                        g={guide}
                        className="size-full transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h3
                    className={`${reveal("it-up")} text-3xl font-semibold text-ink lg:text-[40px]`}
                    style={{ animationDelay: "450ms" }}
                  >
                    {guide.name}
                  </h3>
                  <p
                    className={`${reveal("it-up")} mt-2 text-lg text-[#5b7186] lg:text-[22px]`}
                    style={{ animationDelay: "540ms" }}
                  >
                    {guide.role} • {guide.years}
                  </p>
                  <p
                    className={`${reveal("it-up")} mt-5 text-base italic leading-[1.8] text-[#6a8397] lg:text-[22px]`}
                    style={{ animationDelay: "630ms" }}
                  >
                    “{guide.quote}”
                  </p>

                  <div
                    className={reveal("it-up")}
                    style={{ animationDelay: "740ms" }}
                  >
                    <button
                      onClick={() => setGuideOpen(true)}
                      className="group relative mt-7 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0b5a85] px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-[#0b5a85]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1f66d6] hover:shadow-2xl hover:shadow-[#1f66d6]/35 active:scale-95 lg:px-10 lg:py-5 lg:text-[22px]"
                    >
                      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[500%]" />
                      <Users className="relative size-6" />
                      <span className="relative">View Full Profile</span>
                      <ArrowRight className="relative size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Photo strip ───────── */}
        <div className="mt-6 grid gap-5 md:grid-cols-[1.16fr_1fr_1.16fr] lg:mt-8 lg:gap-7">
          {gallery.map((src, i) => (
            <div
              key={`${d.slug}-${i}`}
              className={reveal("it-img")}
              style={{ animationDelay: `${500 + i * 150}ms` }}
            >
              <div className="group relative h-56 overflow-hidden rounded-[20px] bg-foam shadow-[0_14px_40px_-20px_rgba(11,43,63,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(31,102,214,0.45)] md:h-[250px] lg:h-[275px]">
                <img
                  src={src}
                  alt={`${d.name} photo ${i + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== d.img)
                      e.currentTarget.src = d.img;
                  }}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-[1200ms] group-hover:translate-x-[520%]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {guideOpen && <GuideModal g={guide} onClose={closeGuide} />}
    </section>
  );
}

function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center bg-[#f8fbfd] px-6 py-24 text-center">
      <div className="dp-up">
        <p className="text-sm font-semibold uppercase tracking-widest text-aqua">
          Destination not found
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-ink lg:text-6xl">
          This trip doesn’t exist yet
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Pick another destination from our trips page.
        </p>
        <Link
          to="/coastal-trips"
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua active:scale-95"
        >
          Browse all trips
          <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>
    </section>
  );
}

export default function DestinationPage() {
  const { slug } = useParams();
  const d = getDestination(slug);

  return (
    <>
      <style>{`
        @keyframes dp-up   { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
        @keyframes dp-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dp-word { from { transform: translateY(110%); } to { transform: none; } }
        @keyframes dp-zoom { from { transform: scale(1.22); opacity: .6; } to { transform: scale(1.02); opacity: 1; } }
        .dp-up   { animation: dp-up 1s cubic-bezier(.22,1,.36,1) both; }
        .dp-fade { animation: dp-fade 1s ease both; }
        .dp-word { animation: dp-word 1s cubic-bezier(.22,1,.36,1) both; }
        .dp-zoom { animation: dp-zoom 2.6s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .dp-up, .dp-fade, .dp-word, .dp-zoom { animation: none !important; }
        }
      `}</style>

      <Navbar />
      <main>
        {d ? (
          <>
            {/* key = animations replay when the slug changes */}

            <DestinationHero key={d.slug} d={d} />
            <DestinationTabs />
            <DestinationOverview key={d.slug} d={d} />
            <DestinationItinerary key={d.slug} d={d} />
            {/* ▼ FUTURE SECTIONS GO HERE (overview, itinerary, gallery, pricing, FAQ…) */}
          </>
        ) : (
          <NotFound />
        )}
      </main>
      <Footer />
    </>
  );
}
