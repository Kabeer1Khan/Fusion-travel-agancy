import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import { EASE, Modal, Toaster, toast, useInView } from "./shared";

/* ------------------------------ data ---------------------------------- */
const exploreLinks = [
  { label: "Trips", href: "/coastal-trips" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Experiences", href: "/#experiences" },
  { label: "Travel Journal", href: "/travel-journal" },
];

const companyLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Sustainability", href: "/#about" },
  { label: "Help", action: "help" },
  { label: "Contact", href: "mailto:hello@tidepost.travel?subject=Hello%20Tidepost" },
];

const faqs = [
  {
    q: "How do I book a trip?",
    a: "Open any route or experience, press “Plan this trip” and our team replies within one working day with dates and a tailored itinerary.",
  },
  {
    q: "Are your trips suitable for beginners?",
    a: "Yes. Every route lists a skill level, and groups are capped at 8 people so coaching stays personal.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Change your dates for free up to 30 days before departure. After that we credit the amount toward a future trip.",
  },
  {
    q: "How is Tidepost sustainable?",
    a: "We use locally owned stays, small groups and reef-safe gear, and part of every booking funds beach and reef restoration.",
  },
];

/* ------------------------------ icons --------------------------------- */
function LogoMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 72 48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 43 L28 10 Q31 6 34 10 L44 24" stroke="currentColor" strokeWidth="7" />
      <path d="M24 43 L41 21 Q44 17 47 21 L67 43" stroke="currentColor" strokeWidth="7" />
      <path d="M30 43 Q38 34 46 43" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}

const INK = "#0a4560";

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    svg: (
      <>
        <rect width="40" height="40" rx="11" fill="#fff" />
        <rect x="9.5" y="9.5" width="21" height="21" rx="6.5" stroke={INK} strokeWidth="2.6" />
        <circle cx="20" cy="20" r="5" stroke={INK} strokeWidth="2.6" />
        <circle cx="26.3" cy="13.7" r="1.5" fill={INK} />
      </>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    svg: (
      <>
        <circle cx="20" cy="20" r="20" fill="#fff" />
        <path
          d="M21.6 32V21.6h3.5l.6-4.1h-4.1v-2.6c0-1.2.4-2 2.1-2h2.1V9.3c-.4-.1-1.6-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.3v3.1h-3.5v4.1h3.5V32h4.1z"
          fill={INK}
        />
      </>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    svg: (
      <>
        <rect width="40" height="40" rx="11" fill="#fff" />
        <rect x="8" y="12" width="24" height="16.5" rx="5" fill={INK} />
        <path d="M17.5 16.5v7.5l6.5-3.75z" fill="#fff" />
      </>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.com/",
    svg: (
      <>
        <rect width="40" height="40" rx="11" fill="#fff" />
        <path
          d="M12 14c2-1.3 4-1.8 4-1.8l.5 1c1-.2 2-.2 3 0l.5-1s2 .5 4 1.8c2.2 3.3 3 6.800 2.800 10.200-1.600 1.200-3.200 1.700-3.200 1.700l-1-1.600c.5-.2 1-.5 1.400-.8-.3.2-.9.5-1.600.7-1.800.5-3.800.5-5.600 0-.7-.2-1.300-.5-1.600-.7.400.3.900.600 1.400.800l-1 1.600s-1.600-.5-3.200-1.700c-.2-3.400.6-6.900 2.800-10.200z"
          fill={INK}
        />
        <circle cx="16.7" cy="21" r="1.7" fill="#fff" />
        <circle cx="23.3" cy="21" r="1.7" fill="#fff" />
      </>
    ),
  },
];

/* ------------------------------ FAQ ----------------------------------- */
function Faq({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-deep transition-colors hover:text-lagoon"
      >
        {q}
        <span
          className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
            open ? "rotate-180 bg-aqua text-white" : "bg-sea text-deep"
          }`}
        >
          {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ${EASE} ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-[0.95rem] leading-relaxed text-slate-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ footer -------------------------------- */
export default function Footer() {
  const [ref, show] = useInView(0.1);
  const [helpOpen, setHelpOpen] = useState(false);
  const [faqIdx, setFaqIdx] = useState(0);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const closeHelp = useCallback(() => setHelpOpen(false), []);
  const scrollTop = (e) => {
    e?.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (e) => {
    e.preventDefault();
    if (status === "loading") return;
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      setShakeKey((k) => k + 1);
      inputRef.current?.focus();
      return;
    }
    setStatus("loading");
    setMessage("");
    timers.current.push(
      setTimeout(() => {
        setStatus("success");
        setMessage(`Welcome aboard! We’ll write to ${value}.`);
        setEmail("");
        toast("You’re on the list. Welcome to Tidepost!");
        timers.current.push(
          setTimeout(() => {
            setStatus("idle");
            setMessage("");
          }, 5000)
        );
      }, 1200)
    );
  };

  const rise = (ms) => ({ transitionDelay: `${ms}ms` });
  const fade = `transition-all duration-[900ms] ${EASE} ${
    show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  const linkClass =
    "relative inline-block py-1.5 text-[1.08rem] text-white/90 transition-all duration-300 hover:translate-x-1.5 hover:text-[#7fe0ec] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-[#7fe0ec] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <footer ref={ref} className="relative text-white">
      <Toaster />

      {/* wave transition */}
      <div className="relative h-[90px] bg-[#eaf6f9] sm:h-[110px] lg:h-[130px]">
        <svg
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <g className="animate-wave-bob-slow">
            <path
              d="M0 130V72C90 22 230 2 340 27C460 54 520 96 680 101C880 107 1020 71 1180 79C1300 85 1380 101 1440 97V130Z"
              fill="#cfeaf0"
              opacity="0.75"
            />
          </g>
          <g className="animate-wave-bob">
            <path
              d="M0 130V98C130 70 280 64 440 86C620 110 760 96 940 78C1120 60 1300 72 1440 92V130Z"
              fill="#dcf1f5"
              opacity="0.9"
            />
          </g>
          <path
            d="M0 130V94C180 80 330 86 520 100C720 114 900 114 1100 100C1250 90 1360 86 1440 92V130Z"
            fill="#0b4a66"
          />
        </svg>
      </div>

      {/* body */}
      <div className="bg-linear-to-b from-[#0b4a66] to-[#06304a]">
        <div className="mx-auto max-w-[1500px] px-6 pb-8 pt-6 lg:px-[62px]">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.45fr] lg:gap-10">
            {/* brand */}
            <div className={fade} style={rise(100)}>
              <a href="#home" onClick={scrollTop} className="group inline-flex items-center gap-3">
                <LogoMark className="h-11 w-[66px] text-white transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105" />
                <span className="text-[2.5rem] font-semibold tracking-tight">Tidepost</span>
              </a>
              <p className="mt-6 max-w-[18rem] text-[1.6rem] font-semibold leading-snug text-[#9fdbe6]">
                Premium sustainable adventure travel
              </p>
            </div>

            {/* explore */}
            <nav aria-label="Explore" className={fade} style={rise(220)}>
              <h3 className="text-[1.1rem] font-semibold">Explore</h3>
              <ul className="mt-4 space-y-1">
                {exploreLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={linkClass}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* company */}
            <nav aria-label="Company" className={fade} style={rise(340)}>
              <h3 className="text-[1.1rem] font-semibold">Company</h3>
              <ul className="mt-4 space-y-1">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    {l.action === "help" ? (
                      <button onClick={() => setHelpOpen(true)} className={linkClass}>
                        {l.label}
                      </button>
                    ) : (
                      <a href={l.href} className={linkClass}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* newsletter */}
            <div className={`sm:col-span-2 lg:col-span-1 ${fade}`} style={rise(460)}>
              <h3 className="text-[1.1rem] font-semibold italic">Become a member</h3>

              <form onSubmit={submit} noValidate className="mt-4">
                <div
                  key={shakeKey}
                  className={`relative ${status === "error" ? "animate-shake" : ""}`}
                >
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setMessage("");
                      }
                    }}
                    placeholder="Your email address"
                    aria-label="Your email address"
                    aria-invalid={status === "error"}
                    autoComplete="email"
                    className={`h-14 w-full rounded-full border bg-transparent pl-6 pr-16 text-white outline-none transition-all duration-300 placeholder:text-white/70 focus:bg-white/5 focus:shadow-[0_0_0_4px_rgba(20,184,200,0.25)] ${
                      status === "error"
                        ? "border-rose-300"
                        : "border-white/50 focus:border-aqua"
                    }`}
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    disabled={status === "loading"}
                    className={`group absolute right-1.5 top-1.5 grid size-11 place-items-center rounded-full text-deep shadow-lg transition-all duration-300 hover:scale-110 hover:bg-aqua hover:text-white active:scale-95 ${
                      status === "success" ? "bg-emerald-300" : "bg-white"
                    }`}
                  >
                    {status === "loading" ? (
                      <span className="size-5 animate-spin rounded-full border-2 border-deep/30 border-t-deep" />
                    ) : status === "success" ? (
                      <Check key="ok" className="animate-check-pop size-5" />
                    ) : (
                      <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    )}
                  </button>
                </div>

                <p
                  aria-live="polite"
                  className={`mt-2 min-h-5 px-2 text-sm transition-colors ${
                    status === "error" ? "text-rose-300" : "text-[#9fdbe6]"
                  }`}
                >
                  {message}
                </p>
              </form>

              <ul className="mt-3 flex items-center gap-5">
                {socials.map((s, i) => (
                  <li
                    key={s.name}
                    className={`transition-all duration-700 ${EASE} ${
                      show ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-50 opacity-0"
                    }`}
                    style={rise(800 + i * 110)}
                  >
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className="block transition-all duration-300 hover:-translate-y-1.5 hover:rotate-6 hover:scale-110 hover:drop-shadow-[0_10px_16px_rgba(20,184,200,0.55)] active:scale-95"
                    >
                      <svg viewBox="0 0 40 40" fill="none" className="size-10">
                        {s.svg}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* bottom bar */}
          <div
            className={`mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 ${fade}`}
            style={rise(700)}
          >
            <p className="text-[0.98rem] text-white/85">
              © {new Date().getFullYear()} Tidepost. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-[0.9rem] text-white/85">
              <span>Travel More</span>
              <span className="text-white/60">•</span>
              <span>A Greener Tomorrow</span>
              <button
                onClick={scrollTop}
                aria-label="Back to top"
                className="group ml-1 grid size-9 place-items-center rounded-full text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <LogoMark className="h-5 w-[30px] transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* help modal */}
      <Modal open={helpOpen} onClose={closeHelp} label="Help centre" maxWidth="max-w-[620px]">
        <div className="p-7 sm:p-9">
          <p className="text-sm font-semibold text-lagoon">Help centre</p>
          <h3 className="mt-1 text-[1.8rem] font-bold tracking-tight text-deep">
            How can we help?
          </h3>
          <div className="mt-5">
            {faqs.map((f, i) => (
              <Faq
                key={f.q}
                q={f.q}
                a={f.a}
                open={faqIdx === i}
                onToggle={() => setFaqIdx(faqIdx === i ? -1 : i)}
              />
            ))}
          </div>
          <a
            href="mailto:help@tidepost.travel?subject=I%20need%20help"
            className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-deep px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua active:scale-95"
          >
            Still stuck? Email us
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        </div>
      </Modal>
    </footer>
  );
}