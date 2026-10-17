import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, Mountain, X } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ARTICLES, CATEGORIES } from "./journalData";

const HERO_IMG =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80";

function useReveal(threshold = 0.08) {
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

/* ───────────────────────── Hero ───────────────────────── */
function JournalHero() {
  const heroRef = useRef(null);

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

  const words = ["Travel", "Journal"];

  return (
    <section
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate flex h-[300px] items-end overflow-hidden bg-gradient-to-br from-[#0e8fae] to-ink md:h-[360px] lg:h-[420px]"
    >
      <div
        className="absolute -inset-6 -z-20 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: "translate3d(var(--px,0px), var(--py,0px), 0)" }}
      >
        <img
          src={HERO_IMG}
          alt="Green mountains meeting a turquoise lake at sunset"
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMG)
              e.currentTarget.src = FALLBACK_IMG;
          }}
          className="tj-zoom h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/55 via-transparent to-ink/10" />

      <div className="mx-auto w-full max-w-[1700px] px-6 pb-8 lg:px-[62px] lg:pb-12">
        <Mountain
          strokeWidth={1.4}
          className="tj-pop mb-2 size-11 cursor-default text-white transition-transform duration-500 hover:-translate-y-1 hover:scale-110 hover:text-[#8be9f8] lg:size-14"
          style={{ animationDelay: "250ms" }}
        />

        <h1 className="flex flex-wrap gap-x-[0.25em] text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[88px]">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.12em]">
              <span
                className="tj-word block"
                style={{ animationDelay: `${400 + i * 150}ms` }}
              >
                <span className="inline-block cursor-default transition-colors duration-300 hover:text-[#8be9f8]">
                  {w}
                </span>
              </span>
            </span>
          ))}
        </h1>

        <p
          className="tj-up mt-2 max-w-[800px] text-lg leading-snug text-white/95 sm:text-2xl lg:mt-3 lg:text-[32px]"
          style={{ animationDelay: "850ms" }}
        >
          Stories, tips and inspiration for your next adventure.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Card ───────────────────────── */
function ArticleCard({ a, index, onOpen }) {
  return (
    <div
      className="tj-card h-full"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpen(a)}
        aria-label={`Read: ${a.title}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-white text-left shadow-[0_6px_24px_-12px_rgba(11,43,63,0.25)] ring-1 ring-slate-100 outline-none transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_55px_-22px_rgba(31,102,214,0.4)] focus-visible:ring-4 focus-visible:ring-aqua/40 active:scale-[0.99]"
      >
        <div className="relative h-44 overflow-hidden bg-foam sm:h-auto sm:aspect-[3.2/1]">
          <img
            src={a.img}
            alt={a.title}
            loading="lazy"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMG)
                e.currentTarget.src = FALLBACK_IMG;
            }}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-[1100ms] group-hover:translate-x-[520%]" />
        </div>

        <div className="flex flex-1 flex-col p-5 lg:px-6 lg:py-5">
          <span className="w-fit rounded-md bg-[#e3f1fb] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b5a85] transition-colors duration-300 group-hover:bg-[#1f66d6] group-hover:text-white">
            {a.category}
          </span>

          <h3 className="mt-3 max-w-[22rem] text-[22px] font-semibold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-[#1f66d6] lg:text-[24px]">
            {a.title}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-6 text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" />
                {a.date}
              </span>
              <span className="h-4 w-px bg-slate-300" />
              <span className="flex items-center gap-2">
                <Clock className="size-4" />
                {a.read}
              </span>
            </div>
            <span className="grid size-9 -translate-x-2 place-items-center rounded-full bg-[#1f66d6] text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ───────────────────────── Article popup ───────────────────────── */
function ArticleModal({ a, onClose }) {
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
      aria-label={a.title}
    >
      <div
        onClick={onClose}
        className="tj-fade absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />
      <article className="tj-modal relative max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-[28px] bg-white shadow-2xl">
        <div className="relative h-56 overflow-hidden bg-foam sm:h-64">
          <img
            src={a.img}
            alt={a.title}
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMG)
                e.currentTarget.src = FALLBACK_IMG;
            }}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition-all duration-300 hover:rotate-90 hover:bg-white active:scale-90"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-7 sm:p-9">
          <span className="rounded-md bg-[#e3f1fb] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#0b5a85]">
            {a.category}
          </span>
          <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
            {a.title}
          </h3>
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              {a.date}
            </span>
            <span className="h-4 w-px bg-slate-300" />
            <span className="flex items-center gap-2">
              <Clock className="size-4" />
              {a.read}
            </span>
          </div>

          <div className="mt-6 space-y-4 text-[17px] leading-[1.8] text-[#5b7186]">
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/coastal-trips"
              onClick={onClose}
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua active:scale-95"
            >
              Explore our trips
              <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <button
              onClick={onClose}
              className="rounded-full border border-slate-300 px-6 py-3.5 font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua hover:text-aqua active:scale-95"
            >
              Back to journal
            </button>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function TravelJournal() {
  const [params] = useSearchParams();
  const urlCat = params.get("cat");
  const initial = CATEGORIES.includes(urlCat) ? urlCat : "All";

  const [active, setActive] = useState(initial);
  const [open, setOpen] = useState(null);
  const [ref, show] = useReveal();
  const close = useCallback(() => setOpen(null), []);

  // Navbar links like /travel-journal?cat=Culture change the filter
  useEffect(() => {
    setActive(CATEGORIES.includes(urlCat) ? urlCat : "All");
  }, [urlCat]);

  const list =
    active === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === active);

  return (
    <>
      <style>{`
        @keyframes tj-up    { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
        @keyframes tj-word  { from { transform: translateY(110%); } to { transform: none; } }
        @keyframes tj-zoom  { from { transform: scale(1.22); opacity: .6; } to { transform: scale(1.02); opacity: 1; } }
        @keyframes tj-pop   { from { opacity: 0; transform: translateY(16px) scale(.85); } to { opacity: 1; transform: none; } }
        @keyframes tj-card  { from { opacity: 0; transform: translateY(36px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes tj-fade  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tj-modal { from { opacity: 0; transform: translateY(26px) scale(.95); } to { opacity: 1; transform: none; } }
        .tj-up    { animation: tj-up 1s cubic-bezier(.22,1,.36,1) both; }
        .tj-word  { animation: tj-word 1s cubic-bezier(.22,1,.36,1) both; }
        .tj-zoom  { animation: tj-zoom 2.6s cubic-bezier(.22,1,.36,1) both; }
        .tj-pop   { animation: tj-pop .8s cubic-bezier(.22,1,.36,1) both; }
        .tj-card  { animation: tj-card .85s cubic-bezier(.22,1,.36,1) both; }
        .tj-fade  { animation: tj-fade .35s ease both; }
        .tj-modal { animation: tj-modal .5s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .tj-up, .tj-word, .tj-zoom, .tj-pop, .tj-card, .tj-fade, .tj-modal { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      <Navbar />

      <main>
        <JournalHero />

        <section ref={ref} className="bg-white py-8 lg:py-12">
          <div className="mx-auto max-w-[1700px] px-6 lg:px-[62px]">
            {/* Filters */}
            <div
              className="flex flex-wrap gap-3"
              role="tablist"
              aria-label="Filter articles"
            >
              {CATEGORIES.map((c, i) => {
                const isActive = active === c;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(c)}
                    style={{ animationDelay: `${i * 70}ms` }}
                    className={`rounded-full border px-7 py-3.5 text-lg font-medium transition-all duration-300 active:scale-95 ${
                      show ? "tj-pop" : "opacity-0"
                    } ${
                      isActive
                        ? "border-[#0b5a85] bg-[#0b5a85] text-white shadow-lg shadow-[#0b5a85]/25"
                        : "border-slate-200 bg-white text-ink hover:-translate-y-0.5 hover:border-aqua hover:text-aqua hover:shadow-md"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Grid: key changes on filter so cards re-animate */}
            <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {show &&
                list.map((a, i) => (
                  <ArticleCard
                    key={`${active}-${a.id}`}
                    a={a}
                    index={i}
                    onOpen={setOpen}
                  />
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {open && <ArticleModal a={open} onClose={close} />}
    </>
  );
}