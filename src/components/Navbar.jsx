import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

const links = [
  {
    label: "Destinations",
    to: "/#destinations",
    children: [
      { label: "Bali, Indonesia", to: "/destinations/bali" },
      { label: "Santorini, Greece", to: "/destinations/santorini" },
      { label: "Maldives", to: "/destinations/maldives" },
      { label: "Kyoto, Japan", to: "/destinations/kyoto" },
      { label: "Swiss Alps", to: "/destinations/swiss-alps" },
    ],
  },
  { label: "Trips", to: "/coastal-trips" },
  { label: "About", to: "/#about" },
  {
    label: "Blog",
    to: "/travel-journal",
    children: [
      { label: "Travel Guides", to: "/travel-journal?cat=Destinations" },
      { label: "Packing Tips", to: "/travel-journal?cat=Backpacking" },
      { label: "Traveler Stories", to: "/travel-journal?cat=Culture" },
    ],
  },
  { label: "Testimonial", to: "/#testimonial" },
];

function Logo() {
  return (
    <svg
      viewBox="0 0 72 48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-[54px] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105 lg:h-11 lg:w-[66px]"
      aria-hidden="true"
    >
      <path
        d="M5 43 L28 10 Q31 6 34 10 L44 24"
        stroke="#0e8fae"
        strokeWidth="7"
      />
      <path
        d="M24 43 L41 21 Q44 17 47 21 L67 43"
        stroke="#27b9d3"
        strokeWidth="7"
      />
      <path d="M30 43 Q38 34 46 43" stroke="#0e8fae" strokeWidth="5" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`animate-fade-down sticky top-0 z-50 bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_30px_-12px_rgba(11,43,63,0.25)]" : ""
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-6 lg:h-[100px] lg:px-[62px]">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <Logo />
          <span className="text-[32px] font-semibold tracking-tight text-ink lg:text-[40px]">
            Tidepost
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden xl:block">
          <ul className="flex items-center gap-14">
            {links.map((link, i) => (
              <li
                key={link.label}
                className="group animate-fade-down relative"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <Link
                  to={link.to}
                  className="relative flex items-center gap-1.5 py-2 text-[19px] font-medium text-ink transition-colors duration-300 hover:text-aqua after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-aqua after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                </Link>

                {link.children && (
                  <div className="invisible absolute left-0 top-full z-50 translate-y-2 pt-4 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="w-60 rounded-2xl bg-white p-2 shadow-[0_20px_50px_-15px_rgba(11,43,63,0.3)] ring-1 ring-black/5">
                      {link.children.map((c) => (
                        <li key={c.label}>
                          <Link
                            to={c.to}
                            className="block rounded-xl px-4 py-2.5 text-base font-medium text-ink/80 transition-all duration-200 hover:bg-foam hover:pl-6 hover:text-aqua"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + burger */}
        <div className="flex items-center gap-3">
          <Link
            to="/plan-your-trip"
            className="group animate-fade-down hidden items-center gap-3 rounded-full bg-ink px-8 py-[1.1rem] text-[19px] font-semibold text-white shadow-lg shadow-ink/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-aqua hover:shadow-xl hover:shadow-aqua/30 active:scale-95 sm:inline-flex"
            style={{ animationDelay: "500ms" }}
          >
            Plan Your Trip
            <ChevronRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid size-11 place-items-center rounded-full text-ink transition hover:bg-foam xl:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-white transition-all duration-500 xl:hidden ${
          open ? "max-h-[620px] border-t border-slate-100" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-lg font-medium text-ink transition hover:bg-foam hover:pl-6 hover:text-aqua"
              >
                {l.label}
              </Link>
              {l.children && (
                <ul className="mb-1 ml-4 border-l border-slate-200 pl-3">
                  {l.children.map((c) => (
                    <li key={c.label}>
                      <Link
                        to={c.to}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-base text-ink/75 transition hover:bg-foam hover:pl-5 hover:text-aqua"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="pt-2 sm:hidden">
            <Link
              to="/plan-your-trip"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white"
            >
              Plan Your Trip <ChevronRight className="size-5" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
