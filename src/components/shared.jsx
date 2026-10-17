import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Heart, Mail, MapPin, Share2, X } from "lucide-react";

export const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* ---------------------------- image helpers ---------------------------- */
export const u = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const TURTLE =
  "https://images.unsplash.com/flagged/photo-1552015079-01226be103c4?auto=format&fit=crop&w=1000&q=80";

export const px = (id, slug, w = 1000) =>
  slug
    ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}/free-photo-of-${slug}.jpeg?auto=compress&cs=tinysrgb&w=${w}`
    : `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/* ------------------------------- hooks -------------------------------- */
export function useInView(threshold = 0.15) {
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ----------------------- image with automatic fallback ---------------- */
export function Photo({ srcs, alt = "", objPos = "50% 50%", className = "" }) {
  const [i, setI] = useState(0);
  return (
    <img
      src={srcs[i]}
      alt={alt}
      loading="lazy"
      draggable="false"
      onError={() => setI((n) => (n + 1 < srcs.length ? n + 1 : n))}
      className={className}
      style={{ objectPosition: objPos }}
    />
  );
}

/* ------------------------------ icons --------------------------------- */
export function SnorkelIcon({ className = "", strokeWidth = 1.7 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="8" width="14" height="8.5" rx="3.6" />
      <path d="M9.5 8v8.5" />
      <path d="M16.5 11.2 19.6 8V4.2" />
      <path d="M19.6 4.2h2" />
    </svg>
  );
}

/* -------------------------------- toast -------------------------------- */
const TOAST_EVENT = "tidepost:toast";
export const toast = (message) =>
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));

export function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const id = Date.now() + Math.random();
      setItems((l) => [...l, { id, msg: e.detail }]);
      setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3300);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 flex-col items-center gap-2 px-4"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="animate-toast rounded-full bg-deep px-6 py-3 text-[0.95rem] font-medium text-white shadow-[0_18px_40px_-12px_rgba(4,31,46,0.6)] ring-1 ring-white/15"
        >
          {t.msg}
        </div>
      ))}
    </div>,
    document.body
  );
}

/* -------------------------------- modal -------------------------------- */
export function Modal({ open, onClose, label, children, maxWidth = "max-w-[880px]" }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 380);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        onClick={() => closeRef.current()}
        className={`absolute inset-0 bg-[#041f2e]/70 backdrop-blur-sm transition-opacity duration-500 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-[28px] bg-white shadow-[0_40px_90px_-20px_rgba(4,31,46,0.6)] outline-none transition-all duration-500 ${EASE} ${
          shown ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0"
        }`}
      >
        <button
          onClick={() => closeRef.current()}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white text-deep shadow-lg transition-all duration-300 hover:rotate-90 hover:bg-aqua hover:text-white"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

/* --------------------------- details modal ---------------------------- */
export function DetailModal({ item, open, onClose, saved, onToggleSave }) {
  const mail = item
    ? `mailto:hello@tidepost.travel?subject=${encodeURIComponent(
        `Plan my trip: ${item.title}`
      )}&body=${encodeURIComponent(
        `Hi Tidepost team,\n\nI'd love to plan "${item.title}" (${item.place}).\n\nPreferred dates:\nGroup size:\n\nThanks!`
      )}`
    : "#";

  const share = async () => {
    const url = `${window.location.href.split("#")[0]}#trips`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, text: `${item.title} · ${item.place}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    } catch {
      /* share cancelled */
    }
  };

  const rise = (ms) => ({ animationDelay: `${ms}ms` });

  return (
    <Modal open={open} onClose={onClose} label={item?.title ?? "Details"}>
      {item && (
        <div className="grid md:grid-cols-[1fr_1.05fr]">
          <div className="relative h-60 overflow-hidden bg-[#0c5877] md:h-auto md:min-h-[460px]">
            <Photo
              srcs={item.srcs}
              alt={item.title}
              objPos={item.pos}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#07344c]/70 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-deep backdrop-blur">
              {item.tag}
            </span>
          </div>

          <div className="flex flex-col p-6 sm:p-9">
            <p
              className="animate-card-in flex items-center gap-1.5 text-sm font-semibold text-lagoon"
              style={rise(80)}
            >
              <MapPin className="size-4" /> {item.place}
            </p>
            <h3
              className="animate-card-in mt-2 text-[1.8rem] font-bold leading-tight tracking-tight text-deep sm:text-[2.1rem]"
              style={rise(150)}
            >
              {item.title}
            </h3>
            <p
              className="animate-card-in mt-4 leading-relaxed text-[#587080]"
              style={rise(220)}
            >
              {item.long ?? item.desc}
            </p>

            <div className="animate-card-in mt-6 grid grid-cols-2 gap-3" style={rise(290)}>
              {item.facts.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#f1f9fb] px-4 py-3">
                  <p className="text-[0.75rem] text-slate-500">{label}</p>
                  <p className="mt-0.5 font-semibold text-deep">{value}</p>
                </div>
              ))}
            </div>

            <div
              className="animate-card-in mt-8 flex flex-wrap items-center gap-3"
              style={rise(360)}
            >
              <a
                href={mail}
                className="group inline-flex items-center gap-2.5 rounded-full bg-deep px-6 py-3.5 font-semibold text-white shadow-lg shadow-deep/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-aqua/40 active:scale-95"
              >
                <Mail className="size-5" />
                Plan this trip
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>

              <button
                onClick={onToggleSave}
                aria-pressed={saved}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-3.5 font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                  saved
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-[#d4e6ec] text-deep hover:border-rose-300 hover:text-rose-500"
                }`}
              >
                <Heart className={`size-5 transition-transform duration-300 ${saved ? "scale-110 fill-current" : ""}`} />
                {saved ? "Saved" : "Save"}
              </button>

              <button
                onClick={share}
                aria-label="Share"
                className="grid size-12 place-items-center rounded-full border border-[#d4e6ec] text-deep transition-all duration-300 hover:-translate-y-0.5 hover:border-aqua hover:text-lagoon active:scale-95"
              >
                <Share2 className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ----------------------------- image card ------------------------------ */
export function MediaCard({
  item,
  badge: Badge,
  big = false,
  showDesc = true,
  saved = false,
  onOpen,
  tabIndex = 0,
}) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
  };

  return (
    <button
      ref={ref}
      type="button"
      tabIndex={tabIndex}
      onClick={() => onOpen(item)}
      onMouseMove={onMove}
      aria-label={`${item.title} — ${item.place}. View details`}
      className="group relative block h-full w-full overflow-hidden rounded-[22px] bg-[#0c5877] text-left shadow-[0_18px_40px_-18px_rgba(10,60,82,0.5)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_34px_60px_-20px_rgba(10,60,82,0.65)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aqua/60"
    >
      <Photo
        srcs={item.srcs}
        objPos={item.pos}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />

      <div className="absolute inset-x-0 bottom-0 h-[68%] bg-linear-to-t from-[#06304a] via-[#0a4a66]/65 to-transparent transition-all duration-500 group-hover:h-[80%]" />

      {/* cursor-following light */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--px,50%)_var(--py,50%),rgba(255,255,255,0.22),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {Badge && (
        <span className="absolute left-4 top-4 grid size-12 place-items-center rounded-full bg-white text-deep shadow-lg transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-aqua group-hover:text-white">
          <Badge className="size-6" strokeWidth={1.6} />
        </span>
      )}

      {saved && (
        <span className="animate-check-pop absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/95 text-rose-500 shadow-md">
          <Heart className="size-4 fill-current" />
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0 transition-transform duration-500 group-hover:-translate-y-1">
          <p className="flex items-center gap-1.5 text-[0.8rem] font-medium text-white/95">
            <MapPin className="size-4 shrink-0 fill-white" />
            <span className="truncate">{item.place}</span>
          </p>
          <h3
            className={`mt-1.5 font-semibold leading-snug text-white ${
              big ? "text-[1.3rem]" : "text-[1.05rem]"
            }`}
          >
            {item.title}
          </h3>
          {showDesc && (
            <p
              className={`mt-1.5 max-w-[17rem] leading-snug text-white/85 ${
                big ? "text-[0.9rem]" : "text-[0.8rem]"
              }`}
            >
              {item.desc}
            </p>
          )}
        </div>

        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-deep shadow-lg transition-all duration-500 group-hover:-rotate-45 group-hover:scale-110 group-hover:bg-aqua group-hover:text-white">
          <ArrowRight className="size-5" />
        </span>
      </div>
    </button>
  );
}