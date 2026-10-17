import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, Mail, MapPin, Phone, Send, Check } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { toast } from "./shared";

const HERO_IMG =
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2400&q=80";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2400&q=80";

const DESTINATION_OPTIONS = [
  { value: "bali", label: "Bali, Indonesia" },
  { value: "santorini", label: "Santorini, Greece" },
  { value: "maldives", label: "Maldives" },
  { value: "kyoto", label: "Kyoto, Japan" },
  { value: "swiss-alps", label: "Swiss Alps" },
  { value: "costa-rica", label: "Costa Rica" },
  { value: "portugal", label: "Portugal" },
  { value: "thailand", label: "Thailand" },
  { value: "peru", label: "Peru" },
  { value: "other", label: "Not sure yet, inspire me!" },
];

const ROUTE = "M96 400 C90 340, 120 305, 190 300 S 238 280, 240 226";

function useReveal(threshold = 0.05) {
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

/* ───────────────────────── social icons ───────────────────────── */
const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    svg: (
      <>
        <rect x="6" y="6" width="28" height="28" rx="8.5" stroke="currentColor" strokeWidth="3.2" />
        <circle cx="20" cy="20" r="6.5" stroke="currentColor" strokeWidth="3.2" />
        <circle cx="28.4" cy="11.6" r="2" fill="currentColor" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    svg: (
      <>
        <circle cx="20" cy="20" r="18" fill="currentColor" />
        <path
          d="M21.6 32V21.6h3.5l.6-4.1h-4.1v-2.6c0-1.2.4-2 2.1-2h2.1V9.3c-.4-.1-1.6-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.3v3.1h-3.5v4.1h3.5V32h4.1z"
          fill="#fff"
        />
      </>
    ),
  },
  {
    name: "X",
    href: "https://x.com/",
    svg: (
      <>
        <rect x="3" y="3" width="34" height="34" rx="9" fill="currentColor" />
        <g transform="translate(9.5 9.5) scale(.86)">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            fill="#fff"
          />
        </g>
      </>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    svg: (
      <>
        <rect x="3" y="8" width="34" height="24" rx="7" fill="currentColor" />
        <path d="M16.5 14.5v11l9.5-5.5z" fill="#fff" />
      </>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    svg: (
      <>
        <rect x="3" y="3" width="34" height="34" rx="8" fill="currentColor" />
        <g transform="translate(9.5 9.5) scale(.86)">
          <path
            d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4v11.5H3zM9.75 9.75h3.83v1.57h.05c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.66 4.8 6.12v5.88h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4z"
            fill="#fff"
          />
        </g>
      </>
    ),
  },
];

function BirdIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 5.8a8.5 8.5 0 01-2.4.66 4.2 4.2 0 001.84-2.32 8.4 8.4 0 01-2.66 1.02 4.2 4.2 0 00-7.15 3.83A11.9 11.9 0 013 4.9a4.2 4.2 0 001.3 5.6 4.2 4.2 0 01-1.9-.52v.05a4.2 4.2 0 003.36 4.12 4.2 4.2 0 01-1.9.07 4.2 4.2 0 003.92 2.92A8.4 8.4 0 012 18.9 11.9 11.9 0 008.46 20.8c7.75 0 11.98-6.42 11.98-11.98v-.55A8.5 8.5 0 0022 5.8z" />
    </svg>
  );
}

/* ───────────────────────── hero ───────────────────────── */
function PlanHero() {
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

  const words = ["Plan", "Your", "Trip"];

  return (
    <section
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate flex h-[320px] items-end overflow-hidden bg-gradient-to-br from-[#0e8fae] to-ink md:h-[340px] lg:h-[380px]"
    >
      <div
        className="absolute -inset-6 -z-20 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: "translate3d(var(--px,0px), var(--py,0px), 0)" }}
      >
        <img
          src={HERO_IMG}
          alt="Traveler watching the sunset over a tropical coast"
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMG)
              e.currentTarget.src = FALLBACK_IMG;
          }}
          className="pt-zoom h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/75 via-ink/20 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/55 via-transparent to-ink/10" />

      <div className="mx-auto w-full max-w-[1700px] px-6 pb-8 lg:px-[62px] lg:pb-10">
        <h1 className="flex flex-wrap gap-x-[0.25em] text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[76px]">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.12em]">
              <span
                className="pt-word block"
                style={{ animationDelay: `${350 + i * 130}ms` }}
              >
                <span className="inline-block cursor-default transition-colors duration-300 hover:text-[#8be9f8]">
                  {w}
                </span>
              </span>
            </span>
          ))}
        </h1>

        <p
          className="pt-up mt-2 max-w-[560px] text-lg leading-snug text-white/95 lg:mt-3 lg:text-[24px]"
          style={{ animationDelay: "800ms" }}
        >
          Let’s turn your travel dreams into reality! Get in touch and we’ll
          help you create the perfect adventure.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── contact info ───────────────────────── */
function ContactItem({ icon, title, children, href, delay, reveal, external }) {
  const Wrapper = href ? "a" : "div";
  const props = href
    ? {
        href,
        ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
      }
    : {};
  return (
    <div className={reveal("pt-left")} style={{ animationDelay: `${delay}ms` }}>
      <Wrapper
        {...props}
        className="group flex items-center gap-5 rounded-3xl p-2 -m-2 transition-all duration-300 hover:translate-x-1.5 hover:bg-[#f1f9fb]"
      >
        <span className="grid size-[72px] shrink-0 place-items-center rounded-full bg-[#0b4a66] text-white shadow-lg shadow-[#0b4a66]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-aqua group-hover:shadow-aqua/40 lg:size-[80px]">
          {icon}
        </span>
        <div>
          <h3 className="text-xl font-semibold text-[#0b4a66] lg:text-[22px]">
            {title}
          </h3>
          <div className="mt-0.5 text-lg leading-snug text-[#245572] transition-colors duration-300 group-hover:text-aqua lg:text-[22px]">
            {children}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

function ContactColumn({ reveal }) {
  const iconCls =
    "size-8 transition-transform duration-500 group-hover:-rotate-[12deg] group-hover:scale-110 lg:size-9";
  return (
    <div className="flex flex-col gap-8 lg:gap-9 lg:pt-2">
      <ContactItem
        reveal={reveal}
        delay={150}
        href="mailto:hello@tidepost.travel?subject=Planning%20my%20trip"
        title="Email Us"
        icon={<Mail strokeWidth={1.7} className={iconCls} />}
      >
        hello@tidepost.travel
      </ContactItem>

      <ContactItem
        reveal={reveal}
        delay={260}
        href="tel:+15551234567"
        title="Call Us"
        icon={<Phone strokeWidth={1.7} className={iconCls} />}
      >
        +1 (555) 123-4567
      </ContactItem>

      <ContactItem
        reveal={reveal}
        delay={370}
        external
        href="https://www.google.com/maps/search/?api=1&query=Bali%2C%20Indonesia"
        title="Visit Us"
        icon={<MapPin strokeWidth={1.7} className={iconCls} />}
      >
        123 Destination Drive
        <br />
        Bali, Indonesia 80361
      </ContactItem>

      <div className={reveal("pt-left")} style={{ animationDelay: "480ms" }}>
        <div className="group flex items-center gap-5">
          <span className="grid size-[72px] shrink-0 place-items-center rounded-full bg-[#0b4a66] text-white shadow-lg shadow-[#0b4a66]/20 transition-all duration-500 hover:scale-110 hover:bg-aqua lg:size-[80px]">
            <BirdIcon className="size-8 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6 lg:size-9" />
          </span>
          <div>
            <h3 className="text-xl font-semibold text-[#0b4a66] lg:text-[22px]">
              Follow Us
            </h3>
            <ul className="mt-2 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="block text-[#0b4a66] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-6 hover:scale-125 hover:text-aqua active:scale-95"
                  >
                    <svg viewBox="0 0 40 40" fill="none" className="size-8">
                      {s.svg}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── form ───────────────────────── */
const inputBase =
  "w-full rounded-xl border bg-white px-4 text-base text-[#0b4a66] outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-aqua/60 focus:border-aqua focus:shadow-[0_0_0_4px_rgba(39,185,211,0.18)] lg:text-lg";

function Field({ id, label, required, error, children }) {
  return (
    <div className="group/field">
      <label
        htmlFor={id}
        className="mb-2 block text-base font-semibold text-[#0b4a66] transition-colors duration-300 group-focus-within/field:text-aqua lg:text-lg"
      >
        {label}
        {required && " *"}
      </label>
      {children}
      <p
        role="alert"
        className={`overflow-hidden text-sm text-rose-500 transition-all duration-300 ${
          error ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {error}
      </p>
    </div>
  );
}

function PlanForm({ reveal }) {
  const [params] = useSearchParams();
  const tripParam = params.get("trip");
  const validTrip = DESTINATION_OPTIONS.some((o) => o.value === tripParam)
    ? tripParam
    : "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    trip: validTrip,
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [shake, setShake] = useState(0);
  const [selectFocus, setSelectFocus] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // /plan-your-trip?trip=bali pre-selects the destination
  useEffect(() => {
    if (validTrip) setForm((f) => ({ ...f, trip: validTrip }));
  }, [validTrip]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: "" }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      er.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10)
      er.message = "Tell us a little more (at least 10 characters).";
    return er;
  };

  const submit = (e) => {
    e.preventDefault();
    if (status === "loading") return;
    const formEl = e.currentTarget;
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      setShake((k) => k + 1);
      requestAnimationFrame(() =>
        formEl.querySelector('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    const first = form.name.trim().split(" ")[0];
    setStatus("loading");
    timers.current.push(
      setTimeout(() => {
        setStatus("success");
        setForm({ name: "", email: "", trip: "", message: "" });
        toast(`Thanks ${first}! We’ll reply within one working day.`);
        timers.current.push(setTimeout(() => setStatus("idle"), 4500));
      }, 1300),
    );
  };

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className={reveal("pt-up")} style={{ animationDelay: "150ms" }}>
      <div className="h-full rounded-[22px] bg-white p-6 shadow-[0_10px_40px_-18px_rgba(11,43,63,0.22)] ring-1 ring-slate-100 transition-shadow duration-500 hover:shadow-[0_30px_60px_-28px_rgba(14,143,174,0.35)] lg:p-8">
        <h2 className="text-3xl font-semibold tracking-tight text-[#0b4a66] lg:text-[36px]">
          Send Us a Message
        </h2>

        <form onSubmit={submit} noValidate className="mt-5">
          <div
            key={shake}
            className={`space-y-4 lg:space-y-5 ${hasErrors ? "pt-shake" : ""}`}
          >
            <Field id="pt-name" label="Full Name" required error={errors.name}>
              <input
                id="pt-name"
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                className={`${inputBase} h-[54px] ${
                  errors.name ? "border-rose-400 bg-rose-50/40" : "border-slate-200"
                }`}
              />
            </Field>

            <Field id="pt-email" label="Email Address" error={errors.email}>
              <input
                id="pt-email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={`${inputBase} h-[54px] ${
                  errors.email ? "border-rose-400 bg-rose-50/40" : "border-slate-200"
                }`}
              />
            </Field>

            <Field id="pt-trip" label="Destination / Trip Interest">
              <div className="relative">
                <select
                  id="pt-trip"
                  value={form.trip}
                  onChange={update("trip")}
                  onFocus={() => setSelectFocus(true)}
                  onBlur={() => setSelectFocus(false)}
                  className={`${inputBase} h-[54px] cursor-pointer appearance-none border-slate-200 pr-12 ${
                    form.trip ? "text-[#0b4a66]" : "text-slate-500"
                  }`}
                >
                  <option value="">Select a destination</option>
                  {DESTINATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#0b4a66] transition-transform duration-300 ${
                    selectFocus ? "rotate-180 text-aqua" : ""
                  }`}
                />
              </div>
            </Field>

            <Field id="pt-message" label="Message" required error={errors.message}>
              <textarea
                id="pt-message"
                value={form.message}
                onChange={update("message")}
                placeholder="Tell us about your dream trip..."
                aria-invalid={!!errors.message}
                className={`${inputBase} min-h-[120px] resize-y py-3.5 ${
                  errors.message ? "border-rose-400 bg-rose-50/40" : "border-slate-200"
                }`}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`group relative mt-5 flex h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-full text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] ${
              status === "success"
                ? "bg-emerald-500 shadow-emerald-500/30"
                : "bg-[#0b4a66] shadow-[#0b4a66]/25 hover:bg-aqua hover:shadow-aqua/35"
            }`}
          >
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[500%]" />
            {status === "loading" ? (
              <>
                <span className="relative size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                <span className="relative">Sending...</span>
              </>
            ) : status === "success" ? (
              <>
                <Check className="pt-pop relative size-6" />
                <span className="relative">Message Sent!</span>
              </>
            ) : (
              <>
                <span className="relative">Send Message</span>
                <Send className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1.5" />
              </>
            )}
          </button>

          <p
            aria-live="polite"
            className={`overflow-hidden text-center text-sm text-emerald-600 transition-all duration-500 ${
              status === "success" ? "mt-3 max-h-6 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            Thank you! A travel expert will contact you within one working day.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ───────────────────────── map card ───────────────────────── */
function MapCard({ reveal }) {
  const wrapRef = useRef(null);

  const onMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", `${x * -16}px`);
    el.style.setProperty("--my", `${y * -12}px`);
  };
  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  return (
    <div
      className={`${reveal("pt-pop")} min-h-[420px] lg:min-h-0`}
      style={{ animationDelay: "300ms" }}
    >
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="pt-map relative h-full min-h-[420px] overflow-hidden rounded-[22px] bg-[#cdeef1] shadow-[0_10px_40px_-18px_rgba(11,43,63,0.22)] ring-1 ring-slate-100 transition-shadow duration-500 hover:shadow-[0_30px_60px_-28px_rgba(14,143,174,0.45)]"
      >
        <div
          className="absolute -inset-5 transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: "translate3d(var(--mx,0px), var(--my,0px), 0)" }}
        >
          <svg
            viewBox="0 0 500 540"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
            role="img"
            aria-label="Illustrated travel map with a flight route to a pin"
          >
            <defs>
              <linearGradient id="pt-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#bfe5ea" />
                <stop offset="1" stopColor="#d7f0f2" />
              </linearGradient>
            </defs>
            <rect width="500" height="540" fill="url(#pt-bg)" />

            {/* land blocks */}
            <path d="M0 0H140L110 60L40 90L0 70Z" fill="#a9dbe2" />
            <path d="M140 0H330L300 70L220 110L130 70Z" fill="#cdeef1" />
            <path d="M330 0H500V120L420 140L360 90Z" fill="#b6e2e8" />
            <path d="M0 90L110 60L170 140L120 230L0 250Z" fill="#d9f2f4" />
            <path d="M170 140L300 70L360 90L420 140L400 250L290 300L180 260L120 230Z" fill="#e7f7f8" />
            <path d="M420 140L500 120V330L430 360L400 250Z" fill="#c4e8ed" />
            <path d="M0 250L120 230L180 260L200 380L100 440L0 400Z" fill="#c1e6eb" />
            <path d="M180 260L290 300L330 400L260 480L200 380Z" fill="#dff3f5" />
            <path d="M290 300L400 250L430 360L380 470L330 400Z" fill="#f0fafa" />
            <path d="M430 360L500 330V540H400L380 470Z" fill="#b4e0e6" />
            <path d="M0 400L100 440L130 540H0Z" fill="#d3eff2" />
            <path d="M100 440L200 380L260 480L240 540H130Z" fill="#a9dbe2" />
            <path d="M260 480L330 400L380 470L400 540H240Z" fill="#cdeef1" />

            {/* roads & borders */}
            <g fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2" strokeLinejoin="round">
              <path d="M0 70L110 60L170 140L300 70L330 0" />
              <path d="M110 60L140 0" />
              <path d="M120 230L180 260L290 300L400 250L420 140L360 90" />
              <path d="M200 380L260 480" />
              <path d="M330 400L380 470" />
              <path d="M0 400L100 440L200 380" />
              <path d="M430 360L500 330" />
              <path d="M40 90C80 150 90 200 120 230" strokeOpacity=".5" />
              <path d="M300 70C330 150 350 200 400 250" strokeOpacity=".5" />
            </g>

            {/* animated dashed route */}
            <path
              d={ROUTE}
              fill="none"
              stroke="#0a4560"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="7 9"
              className="pt-route"
            />

            {/* pin */}
            <g transform="translate(240 190)">
              <g className="pt-bob">
                <path
                  d="M0 -26C-14 -26 -24 -16 -24 -3C-24 14 0 36 0 36C0 36 24 14 24 -3C24 -16 14 -26 0 -26Z"
                  fill="#0a4560"
                />
                <circle cx="0" cy="-4" r="9" fill="#fff" />
              </g>
            </g>
            <ellipse cx="240" cy="228" rx="6" ry="3" fill="#0a4560" opacity=".35">
              <animate attributeName="rx" from="6" to="30" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="ry" from="3" to="12" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from=".45" to="0" dur="2.2s" repeatCount="indefinite" />
            </ellipse>

            {/* plane flying along the route */}
            <g opacity="0">
              <path
                d="M-14 0L-4 -3L-6 -14L-2 -14L6 -4L14 -2C17 -1 17 1 14 2L6 4L-2 14L-6 14L-4 3Z"
                fill="#0a4560"
              />
              <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={ROUTE} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.08;0.9;1"
                dur="7s"
                repeatCount="indefinite"
              />
            </g>

            {/* compass */}
            <g transform="translate(440 462)">
              <g className="pt-compass">
                <circle r="46" fill="#fff" fillOpacity=".35" stroke="#0a4560" strokeWidth="2.5" />
                <circle r="38" fill="none" stroke="#0a4560" strokeWidth="1.5" />
                <g stroke="#0a4560" strokeWidth="1.5">
                  <path d="M0 -46V-38M0 46V38M-46 0H-38M46 0H38" />
                </g>
                <g className="pt-wobble">
                  <path d="M0 -32L7 0L0 32L-7 0Z" fill="#0a4560" />
                  <path d="M-32 0L0 -7L32 0L0 7Z" fill="#0a4560" fillOpacity=".55" />
                  <path d="M0 -32L7 0H-7Z" fill="#fff" fillOpacity=".5" />
                </g>
                <circle r="4" fill="#fff" stroke="#0a4560" strokeWidth="1.5" />
              </g>
              <g fill="#0a4560" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" textAnchor="middle">
                <text y="-54" fontSize="14">N</text>
                <text y="62" fontSize="9">S</text>
                <text x="-56" y="3" fontSize="9">W</text>
                <text x="56" y="3" fontSize="9">E</text>
              </g>
            </g>
          </svg>
        </div>

        {/* handwritten tagline */}
        <div className="pointer-events-none absolute right-5 top-6 -rotate-[12deg] text-center lg:right-9 lg:top-10">
          {["Adventure", "is closer than", "you think"].map((t, i) => (
            <p
              key={t}
              className={`${reveal("pt-up")} text-[30px] leading-[1.12] text-[#0a4560] lg:text-[44px]`}
              style={{
                fontFamily: "'Caveat', 'Segoe Script', 'Brush Script MT', cursive",
                animationDelay: `${900 + i * 180}ms`,
              }}
            >
              {t}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */
export default function PlanTrip() {
  const [ref, show] = useReveal();
  const reveal = (cls) => (show ? cls : "opacity-0");

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap");
        @keyframes pt-up    { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: none; } }
        @keyframes pt-left  { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
        @keyframes pt-pop   { from { opacity: 0; transform: scale(.92) translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes pt-word  { from { transform: translateY(110%); } to { transform: none; } }
        @keyframes pt-zoom  { from { transform: scale(1.22); opacity: .6; } to { transform: scale(1.02); opacity: 1; } }
        @keyframes pt-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(3px); } }
        @keyframes pt-march { to { stroke-dashoffset: -64; } }
        @keyframes pt-bob   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes pt-wobble{ 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(10deg); } }
        .pt-up    { animation: pt-up 1s cubic-bezier(.22,1,.36,1) both; }
        .pt-left  { animation: pt-left 1s cubic-bezier(.22,1,.36,1) both; }
        .pt-pop   { animation: pt-pop 1s cubic-bezier(.22,1,.36,1) both; }
        .pt-word  { animation: pt-word 1s cubic-bezier(.22,1,.36,1) both; }
        .pt-zoom  { animation: pt-zoom 2.6s cubic-bezier(.22,1,.36,1) both; }
        .pt-shake { animation: pt-shake .5s ease both; }
        .pt-route { animation: pt-march 3s linear infinite; }
        .pt-bob   { animation: pt-bob 2.2s ease-in-out infinite; }
        .pt-wobble{ transform-box: fill-box; transform-origin: center; animation: pt-wobble 4s ease-in-out infinite; }
        .pt-compass { transform-box: fill-box; transform-origin: center; transition: transform 1.6s cubic-bezier(.22,1,.36,1); }
        .pt-map:hover .pt-compass { transform: rotate(360deg); }
        @media (prefers-reduced-motion: reduce) {
          .pt-up, .pt-left, .pt-pop, .pt-word, .pt-zoom, .pt-shake, .pt-route, .pt-bob, .pt-wobble { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      <Navbar />

      <main>
        <PlanHero />

        <section ref={ref} className="bg-white py-8 lg:py-10">
          <div className="mx-auto max-w-[1700px] px-6 lg:px-[62px]">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.5fr_1fr] lg:gap-8">
              <ContactColumn reveal={reveal} />
              <PlanForm reveal={reveal} />
              <MapCard reveal={reveal} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}