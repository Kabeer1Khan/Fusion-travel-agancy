import { useEffect, useRef, useState } from "react";
import { Compass, Heart, Leaf, UsersRound } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Images from the internet (Pexels CDN). If the first URL fails,     */
/*  the next one in `srcs` is used automatically.                      */
/* ------------------------------------------------------------------ */
const pexels = (id, w = 1100) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const photos = {
  turtle: {
    srcs: [
      pexels(7169293),
      "https://images.pexels.com/photos/31094871/pexels-photo-31094871/free-photo-of-diving-with-sea-turtles-in-saipan-s-vibrant-reef.jpeg?auto=compress&cs=tinysrgb&w=1100",
    ],
    alt: "Diver swimming alongside a sea turtle over a coral reef",
  },
  sunset: {
    srcs: [pexels(6953269), pexels(13568681)],
    alt: "Traveler watching the sunset from a rocky cliff above the sea",
  },
  group: {
    srcs: [pexels(6125822), pexels(4453155)],
    alt: "Friends sitting together watching the sunset",
  },
};

const features = [
  {
    label: "Sustainable\nTravel",
    Icon: Leaf,
    hover: "group-hover/feat:-rotate-12 group-hover/feat:scale-110",
  },
  {
    label: "Local\nCommunities",
    Icon: UsersRound,
    hover: "group-hover/feat:scale-110",
  },
  {
    label: "Small\nGroups",
    Icon: Heart,
    hover: "group-hover/feat:animate-heartbeat",
  },
  {
    label: "Less Is Travel",
    Icon: Compass,
    hover: "group-hover/feat:rotate-[360deg]",
  },
];

/* Collage frames: position is in % of the collage box, depth = mouse parallax px */
const frames = [
  {
    key: "turtle",
    clip: "tp-clip-turtle",
    photo: photos.turtle,
    caption: "Snorkel with sea turtles",
    pos: "left-[3.4%] top-[0.6%] w-[50.9%] h-[56.5%]",
    depth: [-14, -9],
    delay: 150,
    from: "-translate-x-12 translate-y-8 -rotate-6 scale-90",
    objPos: "50% 50%",
  },
  {
    key: "sunset",
    clip: "tp-clip-sunset",
    photo: photos.sunset,
    caption: "Golden-hour viewpoints",
    pos: "left-[55.9%] top-[8.7%] w-[41.5%] h-[42%]",
    depth: [18, 10],
    delay: 350,
    from: "-translate-y-10 translate-x-6 rotate-6 scale-90",
    objPos: "50% 60%",
  },
  {
    key: "group",
    clip: "tp-clip-group",
    photo: photos.group,
    caption: "New friends, shared sunsets",
    pos: "left-[12%] top-[52%] w-[88%] h-[45.5%]",
    depth: [-8, 12],
    delay: 550,
    from: "translate-y-20 scale-90 rotate-2",
    objPos: "50% 40%",
  },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* ------------------------------ helpers ----------------------------- */
function useInView(threshold = 0.15) {
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

function Photo({ srcs, alt, objPos, className }) {
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

const fadeUp = (show) =>
  `transition-all duration-[900ms] ${EASE} ${
    show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

/* ------------------------------ component --------------------------- */
export default function Meaningful() {
  const [sectionRef, show] = useInView(0.15);
  const collageRef = useRef(null);

  const handleMove = (e) => {
    const el = collageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const handleLeave = () => {
    const el = collageRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-linear-to-b from-white to-[#f3f9fb]"
    >
      {/* organic clip-paths for the three photos */}
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="tp-clip-turtle" clipPathUnits="objectBoundingBox">
            <path d="M0.14 0.03 C0.35 0 0.62 0 0.84 0.04 C0.96 0.07 1 0.16 1 0.3 L1 0.82 C1 0.91 0.96 0.95 0.88 0.96 C0.72 0.98 0.54 1 0.38 1 C0.22 1 0.1 0.92 0.04 0.8 C0 0.72 0 0.6 0 0.5 L0 0.18 C0 0.09 0.05 0.04 0.14 0.03 Z" />
          </clipPath>
          <clipPath id="tp-clip-sunset" clipPathUnits="objectBoundingBox">
            <path d="M0.12 0.01 C0.35 0 0.6 0.01 0.8 0.05 C0.95 0.09 1 0.18 1 0.3 L0.98 0.84 C0.98 0.94 0.92 0.99 0.82 1 C0.6 1 0.35 1 0.12 0.98 C0.04 0.97 0 0.91 0 0.82 L0 0.14 C0 0.05 0.05 0.01 0.12 0.01 Z" />
          </clipPath>
          <clipPath id="tp-clip-group" clipPathUnits="objectBoundingBox">
            <path d="M0.06 0.2 C0.12 0.1 0.28 0.07 0.45 0.04 C0.62 0.02 0.8 0 0.92 0 C0.98 0 1 0.06 1 0.14 C1 0.35 1 0.55 0.99 0.75 C0.98 0.9 0.95 0.97 0.88 0.99 C0.65 1 0.35 0.99 0.1 0.95 C0.04 0.93 0.03 0.88 0.02 0.8 L0 0.3 C0 0.24 0.02 0.22 0.06 0.2 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-[62px] lg:py-28">
        {/* ------------------------- LEFT: collage ------------------------ */}
        <div
          ref={collageRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative mx-auto aspect-[82/77] w-full max-w-[680px]"
        >
          {/* soft blob */}
          <div
            className={`absolute left-0 top-[66%] z-0 h-[33%] w-[32%] origin-bottom-left transition-all duration-[1200ms] ${EASE} ${
              show ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="h-full w-full animate-blob-morph bg-linear-to-br from-[#d7f2f3] to-[#bfe8ec]" />
          </div>

          {frames.map((f) => (
            <div
              key={f.key}
              className={`absolute z-10 ${f.pos} transition-transform duration-500 ease-out will-change-transform`}
              style={{
                transform: `translate3d(calc(var(--mx,0) * ${f.depth[0]}px), calc(var(--my,0) * ${f.depth[1]}px), 0)`,
              }}
            >
              {/* entry reveal layer */}
              <div
                className={`h-full w-full transition-all duration-[1300ms] ${EASE} ${
                  show
                    ? "translate-x-0 translate-y-0 rotate-0 scale-100 opacity-100"
                    : `opacity-0 ${f.from}`
                }`}
                style={{ transitionDelay: `${f.delay}ms` }}
              >
                {/* hover layer (lift + shadow) */}
                <div className="group relative h-full w-full transition-[filter,translate] duration-500 ease-out [filter:drop-shadow(0_16px_22px_rgba(10,60,82,0.16))] hover:-translate-y-2 hover:[filter:drop-shadow(0_30px_34px_rgba(10,60,82,0.28))]">
                  {/* shaped frame */}
                  <div
                    className="relative h-full w-full overflow-hidden bg-sea"
                    style={{ clipPath: `url(#${f.clip})` }}
                  >
                    {/* slow unveil zoom */}
                    <div
                      className={`h-full w-full transition-transform duration-[1800ms] ${EASE} ${
                        show ? "scale-100" : "scale-[1.35]"
                      }`}
                      style={{ transitionDelay: `${f.delay}ms` }}
                    >
                      <Photo
                        srcs={f.photo.srcs}
                        alt={f.photo.alt}
                        objPos={f.objPos}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                      />
                    </div>

                    {/* caption chip on hover */}
                    <span className="pointer-events-none absolute bottom-[9%] left-1/2 -translate-x-1/2 translate-y-6 whitespace-nowrap rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-semibold text-deep opacity-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-[13px]">
                      {f.caption}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* palm tree + dashed circle */}
          <div
            className={`absolute left-[0.5%] top-[51%] z-20 w-[12.5%] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              show ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{ transitionDelay: "1000ms", transformOrigin: "50% 100%" }}
          >
            <svg viewBox="0 0 100 130" fill="none" className="w-full overflow-visible" aria-hidden="true">
              <circle
                className="animate-dash-spin"
                style={{ transformOrigin: "52px 44px" }}
                cx="52"
                cy="44"
                r="42"
                stroke="#58c5d0"
                strokeWidth="1.6"
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
              <g className="animate-palm-sway" style={{ transformOrigin: "44px 128px" }}>
                <path
                  d="M42 128 C41 104 43 80 47 57"
                  stroke="#2fb3c4"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <g fill="#2fb3c4">
                  <path d="M47 57 C41 36 23 30 5 44 C21 40 35 46 47 57Z" />
                  <path d="M47 57 C51 34 69 22 91 30 C73 32 59 42 47 57Z" />
                  <path d="M47 57 C31 52 15 62 9 80 C21 66 35 62 47 57Z" />
                  <path d="M47 57 C59 50 77 56 87 72 C73 62 59 60 47 57Z" />
                  <path d="M47 57 C45 40 45 24 53 10 C53 26 51 42 47 57Z" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* ------------------------- RIGHT: content ----------------------- */}
        <div className="relative">
          <p
            className={`font-display text-[0.8rem] font-medium uppercase tracking-[0.22em] text-lagoon sm:text-sm ${fadeUp(show)}`}
            style={{ transitionDelay: "200ms" }}
          >
            Travel &amp; Explore
          </p>

          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,4rem)] font-bold leading-[1.12] tracking-tight text-deep">
            {["Meaningful trips", "for people who"].map((line, i) => (
              <span key={line} className="-mb-[0.18em] block overflow-hidden pb-[0.18em]">
                <span
                  className={`block transition-transform duration-[1100ms] ${EASE} ${
                    show ? "translate-y-0" : "translate-y-[115%]"
                  }`}
                  style={{ transitionDelay: `${350 + i * 150}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
            <span className="-mb-[0.18em] block overflow-hidden pb-[0.18em] pr-3">
              <span
                className={`block transition-transform duration-[1100ms] ${EASE} ${
                  show ? "translate-y-0" : "translate-y-[115%]"
                }`}
                style={{ transitionDelay: "650ms" }}
              >
                care about{" "}
                <em
                  className="inline-block pr-1 font-editorial text-[1.05em] font-medium italic text-lagoon transition-[clip-path] duration-[1400ms] ease-out"
                  style={{
                    clipPath: show ? "inset(-20% -10% -20% 0)" : "inset(-20% 100% -20% 0)",
                    transitionDelay: "1100ms",
                  }}
                >
                  the planet
                </em>
              </span>
            </span>
          </h2>

          <p
            className={`mt-8 max-w-[40rem] text-[1.05rem] leading-[1.8] text-[#587080] lg:text-[1.2rem] ${fadeUp(show)}`}
            style={{ transitionDelay: "900ms" }}
          >
            There’s a small category worth a passport. A community bound together with local
            memories, new friendships and a shared desire to make a positive impact. Join us for
            travel that’s good for people, the planet, and the places we call home.
          </p>

          <ul className="mt-12 grid max-w-[40rem] grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {features.map(({ label, Icon, hover }, i) => (
              <li
                key={label}
                className={`group/feat flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  show ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-75 opacity-0"
                }`}
                style={{ transitionDelay: `${1200 + i * 130}ms` }}
              >
                <span className="relative grid size-[78px] place-items-center rounded-full bg-sea text-deep transition-all duration-500 group-hover/feat:-translate-y-2 group-hover/feat:bg-aqua group-hover/feat:text-white group-hover/feat:shadow-[0_18px_30px_-10px_rgba(20,184,200,0.65)] lg:size-[92px]">
                  <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-aqua opacity-0 group-hover/feat:animate-ring-out" />
                  <Icon
                    strokeWidth={1.5}
                    className={`size-9 transition-transform duration-700 lg:size-11 ${hover}`}
                  />
                </span>
                <span className="mt-4 whitespace-pre-line font-display text-[1rem] font-medium leading-snug text-deep transition-colors duration-300 group-hover/feat:text-lagoon lg:text-[1.15rem]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}