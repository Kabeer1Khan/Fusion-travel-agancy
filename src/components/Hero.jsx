import { useRef } from "react";
import { ArrowRight, CalendarDays, ChevronRight, Compass, MapPin } from "lucide-react";
import heroImg from "../assets/hero_imgs/hero_image.webp";

// Using the hero photo (zoomed) for the Bali card.
// Swap with your own file, e.g. import baliImg from "../assets/hero_imgs/bali.webp"
const baliImg = heroImg;

const avatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
];

const headline = ["More than", "travel — it’s a", "new perspective."];
const delay = (ms) => ({ animationDelay: `${ms}ms` });

export default function Hero() {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  };

  return (
    <section id="home">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="hero-shape relative isolate overflow-hidden bg-[#0a5a8a] xl:h-[calc(100vh-6.25rem)] xl:min-h-[820px]"
      >
        {/* Background image (parallax + slow zoom-out entrance) */}
        <div
          className="absolute -inset-4 z-0 transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: "translate3d(calc(var(--mx,0) * -16px), calc(var(--my,0) * -10px), 0)",
          }}
        >
          <img
            src={heroImg}
            alt="Traveler sitting on a cliff overlooking the ocean at sunset"
            fetchPriority="high"
            className="animate-zoom-out h-full w-full object-cover object-[62%_center]"
          />
        </div>

        {/* Readability overlay */}
        <div className="absolute inset-0 z-[1] bg-linear-to-r from-[#07406a]/60 via-[#07406a]/10 to-transparent" />

        {/* Bottom waves */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[36%] min-h-[190px] xl:h-[45%]">
          <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="foam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ecfafc" />
                <stop offset="1" stopColor="#d6f1f7" />
              </linearGradient>
            </defs>
            <g className="animate-wave-bob-slow">
              <path
                d="M1600 62 C1578 135 1505 200 1395 250 C1275 305 1130 330 1040 370 C1005 386 975 400 950 430 L1600 430 Z"
                fill="#ffffff"
                opacity="0.45"
                transform="translate(0 -12)"
              />
            </g>
            <g className="animate-wave-bob">
              <path
                d="M1600 74 C1575 148 1500 210 1390 258 C1270 312 1125 338 1035 378 C1000 394 975 410 955 430 L1600 430 Z"
                fill="url(#foam)"
              />
            </g>
            <path
              d="M0 322 C140 338 280 384 500 392 C760 402 980 384 1120 378 L1120 430 L0 430 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* "Explore Together" script */}
        <p
          className="animate-script-in pointer-events-none absolute bottom-[7%] right-[5%] z-10 hidden -rotate-[14deg] font-script text-4xl leading-[1.05] text-ink md:block"
          style={delay(2000)}
        >
          Explore
          <br />
          <span className="ml-6">Together</span>
        </p>

        {/* Content */}
        <div className="relative z-10 px-6 pb-36 pt-16 sm:px-10 md:pt-24 xl:h-full xl:px-[70px] xl:pb-0 xl:pt-[128px]">
          <p
            className="animate-fade-up text-[0.8rem] font-semibold uppercase tracking-[0.32em] text-white sm:text-sm"
            style={delay(300)}
          >
            Explore Dream Discover
          </p>

          <h1 className="mt-7 text-[clamp(2.6rem,5.2vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-white">
            {headline.map((line, i) => (
              <span key={line} className="-mb-2 block overflow-hidden pb-2">
                <span className="animate-line-reveal block" style={delay(500 + i * 150)}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="animate-fade-up mt-7 max-w-[28rem] text-[1.15rem] leading-[1.6] text-white/95"
            style={delay(1000)}
          >
            Tidepost brings fresh paths, hidden gems, and unforgettable experiences, helping you see
            the world in a whole new way.
          </p>

          <a
            href="#destinations"
            className="group animate-fade-up relative mt-9 inline-flex items-center gap-4 overflow-hidden rounded-full bg-mint py-[1.15rem] pl-7 pr-8 text-[1.3rem] font-semibold text-ink shadow-[0_12px_30px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.45)] active:scale-95"
            style={delay(1200)}
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Compass
              strokeWidth={1.6}
              className="relative size-8 transition-transform duration-700 group-hover:rotate-[360deg]"
            />
            <span className="relative">Explore Now</span>
            <ChevronRight className="relative size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>

          {/* Social proof */}
          <div className="mt-14 flex items-center gap-5">
            <div className="flex -space-x-3.5">
              {avatars.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="animate-pop relative size-[50px] rounded-full border-[3px] border-white object-cover shadow-md transition-all duration-300 hover:z-10 hover:-translate-y-1.5 hover:scale-110"
                  style={delay(1500 + i * 120)}
                />
              ))}
            </div>
            <span className="h-12 w-px bg-white/40" />
            <div className="animate-fade-up" style={delay(1900)}>
              <p className="text-lg font-semibold text-white">4.8/5 (2.8K+ reviews)</p>
              <p className="text-sm text-white/90">Loved by 2M+ travelers</p>
            </div>
          </div>

          {/* Bali card */}
          <div
            className="mt-14 w-full max-w-[450px] transition-transform duration-500 ease-out xl:absolute xl:right-[4%] xl:top-[123px] xl:mt-0 xl:w-[450px]"
            style={{
              transform: "translate3d(calc(var(--mx,0) * 14px), calc(var(--my,0) * 10px), 0)",
            }}
          >
            <div className="card-motion">
              <article className="group/card rounded-[28px] bg-white p-2.5 shadow-[0_30px_60px_-20px_rgba(6,40,70,0.55)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_70px_-20px_rgba(6,40,70,0.65)]">
                <div className="relative">
                  <div className="relative h-[190px] overflow-hidden rounded-[22px]">
                    <img
                      src={baliImg}
                      alt="Bali coastline"
                      className="h-full w-full origin-[85%_75%] scale-[1.9] object-cover object-[85%_75%] transition-transform duration-700 group-hover/card:scale-[2.05]"
                    />
                    <div className="absolute bottom-0 left-0 flex items-center gap-2 rounded-tr-2xl bg-white/90 px-4 py-2.5 font-semibold text-ink backdrop-blur-md">
                      <MapPin className="size-5 fill-ink" />
                      Bali, Indonesia
                    </div>
                  </div>

                  <button
                    aria-label="View Bali trip"
                    className="absolute -bottom-1 right-3 grid size-12 place-items-center rounded-full bg-aqua text-white shadow-lg shadow-aqua/40 ring-4 ring-white transition-all duration-300 hover:scale-110 hover:bg-ink active:scale-95"
                  >
                    <ArrowRight className="size-5 transition-transform duration-300 group-hover/card:-rotate-45" />
                  </button>
                </div>

                <div className="px-3 pb-3 pt-4">
                  <h3 className="text-[1.35rem] font-semibold text-ink">Bali’s Hidden Nature Awaits</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-500">
                    From hidden beaches to mountain views, Bali has it all. Are you ready?
                  </p>
                  <div className="mt-3.5 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays className="size-[18px]" />
                    <span>8 Days</span>
                    <span>·</span>
                    <span>From $1,200</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}