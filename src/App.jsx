import { useState, useEffect, useRef, useCallback } from "react";
import { ContentProvider, useContent, useAuth } from "./context/ContentContext";
import { SEO } from "./components/SEO";
import { Arrow, Reveal, useReveal, sanitize, LoadingSpinner, Button, Card, Section, Container } from "./components/Shared";

/* ═══════════════════════════════════════════════════════════════
   PALETTE
   ═══════════════════════════════════════════════════════════════ */
const C = {
  bg: "#ebf4f5", fg: "#1a1a2e", primary: "#4a7c9b", accent: "#6b9dc4",
  secondary: "#b5c6e0", muted: "#dde8ea", mutedFg: "#5a6a7a", border: "#c8d8e4",
  adminBg: "#0f1117", adminSidebar: "#161920", adminCard: "#1c1f28",
  adminBorder: "#2a2d38", adminAccent: "#6b9dc4", adminText: "#c8cdd5",
  adminWhite: "#eaedf2", danger: "#e55555", success: "#48bb78",
};

/* ═══════════════════════════════════════════════════════════════
   DEFAULT CONTENT
   ═══════════════════════════════════════════════════════════════ */
const DEFAULT_CONTENT = {
  seo: {
    title: "Woo Tong | Digital Design Agency",
    description: "We craft premium digital experiences that elevate brands and transform businesses.",
    ogUrl: "https://wootong.com",
    ogType: "website",
    keywords: "design, digital agency, branding, web development, AI, UX",
  },
  nav: { brandName: "WOO TONG", ctaText: "LET'S TALK" },
  hero: {
    line1: "I've created visual storytelling",
    line2: "and interactive experiences",
    line3: "that help",
    phrases: ["elevate brands", "design futures", "build products", "create impact"],
  },
  clients: ["Finova", "Luxe Retail", "DataFlow", "MedTech", "TechVentures", "NovaCorp", "Altair", "Meridian"],
  caseStudies: [
    { id: "cs1", title: "Redefining Digital Banking", client: "Finova", category: "Digital Products", year: "2024", colorFrom: "#4a7c9b", colorTo: "#6b9dc4" },
    { id: "cs2", title: "E-commerce Reimagined", client: "Luxe Retail", category: "Platforms", year: "2024", colorFrom: "#6b9dc4", colorTo: "#b5c6e0" },
    { id: "cs3", title: "AI-Powered Analytics", client: "DataFlow", category: "Applied AI", year: "2023", colorFrom: "#b5c6e0", colorTo: "#4a7c9b" },
    { id: "cs4", title: "Healthcare Innovation", client: "MedTech", category: "Digital Products", year: "2023", colorFrom: "#4a7c9b", colorTo: "#b5c6e0" },
  ],
  services: [
    { n: "01", title: "Brand & Identity", desc: "Distinctive identities that resonate and endure." },
    { n: "02", title: "Digital Products", desc: "End-to-end design and development users love." },
    { n: "03", title: "Web Development", desc: "Custom platforms built for performance and scale." },
    { n: "04", title: "Applied AI", desc: "Intelligent solutions for personalized experiences." },
  ],
  testimonial: {
    quote: "Working with Woo Tong transformed our digital presence. Their attention to detail and strategic thinking delivered results beyond expectations.",
    name: "Sarah Chen",
    role: "CEO, TechVentures",
  },
  about: {
    heading: "We believe in the power of thoughtful design",
    description: "Founded with a passion for exceptional digital experiences, we've grown into a team of designers, developers, and strategists who share a common goal: creating work that matters.",
    stats: [
      { value: "5+", label: "Projects Delivered" },
      { value: "100%", label: "Client Retention" },
    ],
  },
  contact: {
    heading: "Ready to start your project?",
    description: "Let's discuss how we can help achieve your goals.",
    email: "hello@wootong.com",
    buttonText: "LET'S TALK",
  },
  footer: {
    tagline: "Crafting premium digital experiences that elevate brands.",
    companyLinks: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
    ],
    socialLinks: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Dribbble", href: "#" },
    ],
  },
  adminPassword: "admin123",
};

/* ═══════════════════════════════════════════════════════════════
   CONTENT CONTEXT  (Now uses API with localStorage fallback)
   ═══════════════════════════════════════════════════════════════ */
// ContentProvider and useContent are now imported from ./context/ContentContext
// The sanitize function is also exported from ./components/Shared

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
// Arrow, useReveal, Reveal, and sanitize are now imported from ./components/Shared

/* ═══════════════════════════════════════════════════════════════
   SITE — NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function Navigation() {
  const { content } = useContent();
  const d = content.nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navItems = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header role="banner" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? "rgba(235,244,245,0.82)" : "transparent", backdropFilter: scrolled ? "blur(18px) saturate(1.6)" : "none", WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.6)" : "none", borderBottom: scrolled ? `1px solid ${C.border}44` : "1px solid transparent", transition: "all 0.4s ease" }}>
        <nav aria-label="Main navigation" style={{ maxWidth: 1440, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 24px" }}>
          <a href="#" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: C.fg, textDecoration: "none", fontFamily: "var(--font-serif)" }} aria-label="Home">
            {sanitize(d.brandName)}
          </a>
          <div style={{ position: "absolute", right: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <a href="#contact" className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 8, background: C.fg, color: C.bg, padding: "10px 20px", borderRadius: 999, fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "opacity 0.2s" }}>
              {sanitize(d.ctaText)}
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(235,244,245,0.5)" }} />
            </a>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ display: "flex", alignItems: "center", gap: 8, background: C.muted, color: C.fg, border: "none", padding: "10px 20px", borderRadius: 999, fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", cursor: "pointer" }}>
              MENU
              <span style={{ display: "flex", gap: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.mutedFg }} />
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.mutedFg }} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div role="dialog" aria-modal="true" aria-label="Site menu" style={{ position: "fixed", inset: 0, zIndex: 60, background: C.fg, transform: menuOpen ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.55s cubic-bezier(0.76,0,0.24,1)", display: "flex", flexDirection: "column", padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="#" style={{ fontSize: 18, fontWeight: 600, color: C.bg, textDecoration: "none", fontFamily: "var(--font-serif)" }}>{sanitize(d.brandName)}</a>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(235,244,245,0.1)", border: "none", color: C.bg, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ marginTop: 100, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{ fontSize: "clamp(36px,7vw,72px)", fontWeight: 300, color: "rgba(235,244,245,0.5)", textDecoration: "none", transition: "color 0.3s", fontFamily: "var(--font-serif)" }}
              onMouseEnter={e => e.currentTarget.style.color = C.bg}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(235,244,245,0.5)"}
            >{item.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(235,244,245,0.35)" }}>{sanitize(content.contact.email)}</span>
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, color: C.fg, padding: "12px 24px", borderRadius: 999, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
            Start a project <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.mutedFg }} />
          </a>
        </div>
      </div>
    </>
  );
}

/* ═══ HERO ════════════════════════════════════════════════════ */
function Hero() {
  const { content } = useContent();
  const d = content.hero;
  const phrases = d.phrases || [];
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState("in");

  useEffect(() => {
    if (phrases.length < 2) return;
    const iv = setInterval(() => {
      setAnim("out");
      setTimeout(() => { setIdx(p => (p + 1) % phrases.length); setAnim("in"); }, 400);
    }, 3200);
    return () => clearInterval(iv);
  }, [phrases.length]);

  return (
    <section aria-label="Hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bg }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", width: "100%", padding: "140px 24px 0" }}>
        <h1 className="hero-anim-1" style={{ maxWidth: 780, fontFamily: "var(--font-serif)", fontSize: "clamp(32px,5vw,60px)", fontWeight: 400, lineHeight: 1.15, color: C.fg, margin: 0 }}>
          {sanitize(d.line1)}<br />{sanitize(d.line2)}<br />{sanitize(d.line3)}{" "}
          <span style={{ display: "inline-block", position: "relative", verticalAlign: "bottom", overflow: "hidden", height: "1.18em", minWidth: 180 }}>
            <span className={`phrase-${anim}`} key={idx} style={{ display: "inline-block", background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>
              {phrases[idx] || ""}
            </span>
          </span>
        </h1>
      </div>
      <div className="hero-anim-2" style={{ maxWidth: 1440, margin: "48px auto 0", width: "100%", padding: "0 24px", flex: 1, paddingBottom: 60 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 360, borderRadius: 24, overflow: "hidden", background: C.fg }}>
          <div style={{ position: "absolute", left: -60, top: -60, width: 340, height: 340, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},${C.accent})`, opacity: 0.55, filter: "blur(80px)" }} />
          <div style={{ position: "absolute", right: "20%", bottom: -100, width: 400, height: 400, borderRadius: "50%", background: `linear-gradient(135deg,${C.secondary},${C.accent})`, opacity: 0.35, filter: "blur(90px)" }} />
          <div style={{ position: "absolute", right: 60, top: "30%", width: 260, height: 260, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary}cc,transparent)`, filter: "blur(60px)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(${C.bg}22 1px,transparent 1px),linear-gradient(90deg,${C.bg}22 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        </div>
      </div>
      <div style={{ maxWidth: 1440, margin: "0 auto", width: "100%", padding: "0 24px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, color: `${C.mutedFg}44` }}>+</span>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.mutedFg }}>Scroll to explore</span>
          <span style={{ fontSize: 14, color: `${C.mutedFg}44` }}>+</span>
        </div>
      </div>
    </section>
  );
}

/* ═══ CLIENTS ═════════════════════════════════════════════════ */
function Clients() {
  const { content } = useContent();
  const list = content.clients || [];
  const doubled = [...list, ...list];
  if (!list.length) return null;
  return (
    <section aria-label="Clients" style={{ background: C.bg, padding: "40px 0", borderTop: `1px solid ${C.border}66`, borderBottom: `1px solid ${C.border}66`, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 56, animation: "ticker 28s linear infinite", width: "max-content" }}>
        {doubled.map((c, i) => (
          <span key={i} style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mutedFg, opacity: 0.5, whiteSpace: "nowrap", fontFamily: "var(--font-serif)" }}>{sanitize(c)}</span>
        ))}
      </div>
    </section>
  );
}

/* ═══ CASE STUDIES ════════════════════════════════════════════ */
function CaseCard({ s, i }) {
  const [hov, setHov] = useState(false);
  const grad = `linear-gradient(135deg, ${s.colorFrom || C.primary}, ${s.colorTo || C.accent})`;
  return (
    <Reveal delay={i * 100}>
      <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ cursor: "pointer" }}>
        <div style={{ position: "relative", aspectRatio: "4/3", borderRadius: 24, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: grad, transform: hov ? "scale(1.04)" : "scale(1)", transition: "transform 0.65s cubic-bezier(0.25,1,0.5,1)" }} />
          <div style={{ position: "absolute", inset: 0, opacity: hov ? 0.18 : 0, background: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.5), transparent 60%)", transition: "opacity 0.5s" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(20px,4vw,32px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)" }}>{sanitize(s.year)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999, fontSize: 13, background: hov ? "#fff" : "rgba(255,255,255,0.18)", color: hov ? C.fg : "#fff", transition: "all 0.3s" }}>View <Arrow /></span>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>{sanitize(s.client)} / {sanitize(s.category)}</p>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(16px,2vw,24px)", fontWeight: 400, color: "#fff", margin: 0 }}>{sanitize(s.title)}</h3>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function CaseStudies() {
  const { content } = useContent();
  const studies = content.caseStudies || [];
  return (
    <section id="work" aria-label="Selected work" style={{ background: C.bg, padding: "100px 0" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 20 }}>
          <div style={{ maxWidth: 520 }}>
            <Reveal><p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: C.primary, marginBottom: 14 }}>Selected Work</p></Reveal>
            <Reveal delay={100}><h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 400, color: C.fg, margin: 0 }}>Projects that define our craft</h2></Reveal>
          </div>
          <Reveal delay={200}><p style={{ maxWidth: 320, fontSize: 14, lineHeight: 1.7, color: C.mutedFg }}>A curated selection showcasing our approach across industries and challenges.</p></Reveal>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,380px),1fr))", gap: 20 }}>
          {studies.map((s, i) => <CaseCard key={s.id} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══ SERVICES ════════════════════════════════════════════════ */
function ServiceRow({ s, i }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={i * 80}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ padding: "28px 0", cursor: "pointer", borderTop: `1px solid ${C.border}88` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, minWidth: 0 }}>
            <span style={{ fontSize: 12, color: C.mutedFg, flexShrink: 0 }}>{sanitize(s.n)}</span>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: "clamp(16px,2vw,22px)", fontWeight: 500, margin: 0, color: hov ? C.primary : C.fg, transition: "color 0.3s" }}>{sanitize(s.title)}</h3>
              <p style={{ marginTop: 4, fontSize: 13, color: C.mutedFg, maxWidth: 400, opacity: hov ? 1 : 0.7, transition: "opacity 0.3s" }}>{sanitize(s.desc)}</p>
            </div>
          </div>
          <span className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 6, background: C.fg, color: C.bg, padding: "8px 16px", borderRadius: 999, fontSize: 12, opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(8px)", transition: "all 0.3s", whiteSpace: "nowrap", flexShrink: 0 }}>
            View <Arrow />
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function Services() {
  const { content } = useContent();
  return (
    <section id="services" aria-label="Services" style={{ background: C.bg, padding: "100px 0" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ maxWidth: 520, marginBottom: 56 }}>
          <Reveal><p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: C.primary, marginBottom: 14 }}>Services</p></Reveal>
          <Reveal delay={100}><h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 400, color: C.fg, margin: 0 }}>Capabilities tailored to your vision</h2></Reveal>
        </div>
        <div>{(content.services || []).map((s, i) => <ServiceRow key={s.n} s={s} i={i} />)}<div style={{ borderTop: `1px solid ${C.border}88` }} /></div>
      </div>
    </section>
  );
}

/* ═══ TESTIMONIAL ═════════════════════════════════════════════ */
function Testimonial() {
  const { content } = useContent();
  const d = content.testimonial;
  return (
    <section aria-label="Testimonial" style={{ position: "relative", overflow: "hidden", background: C.fg, padding: "100px 0" }}>
      <div style={{ position: "absolute", right: -160, top: -160, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${C.primary}44,transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: -120, bottom: -120, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${C.accent}28,transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 780, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <Reveal><span style={{ fontSize: 48, fontWeight: 300, color: "rgba(235,244,245,0.15)", fontFamily: "var(--font-serif)" }}>&ldquo;</span></Reveal>
        <Reveal delay={100}><blockquote style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(18px,3vw,30px)", fontWeight: 300, lineHeight: 1.5, color: C.bg, margin: "20px 0 36px" }}>{sanitize(d.quote)}</blockquote></Reveal>
        <Reveal delay={200}>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.bg }}>{sanitize(d.name)}</p>
          <p style={{ fontSize: 12, color: "rgba(235,244,245,0.5)", marginTop: 4 }}>{sanitize(d.role)}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ ABOUT ═══════════════════════════════════════════════════
   Stats rendered as plain text — no box/border/background
   ═══════════════════════════════════════════════════════════ */
function About() {
  const { content } = useContent();
  const d = content.about;
  return (
    <section id="about" aria-label="About" style={{ background: C.bg, padding: "100px 0" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <Reveal><p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: C.primary, marginBottom: 14 }}>About</p></Reveal>
        <Reveal delay={100}><h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 400, color: C.fg, margin: "0 0 18px" }}>{sanitize(d.heading)}</h2></Reveal>
        <Reveal delay={200}><p style={{ fontSize: 15, lineHeight: 1.75, color: C.mutedFg, marginBottom: 48 }}>{sanitize(d.description)}</p></Reveal>
        {/* Stats — plain text, no boxes */}
        {(d.stats || []).length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
            {(d.stats || []).map((st, i) => (
              <Reveal key={st.label} delay={300 + i * 100}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 32, fontWeight: 300, color: C.primary, margin: 0, fontFamily: "var(--font-serif)" }}>{sanitize(st.value)}</p>
                  <p style={{ fontSize: 12, color: C.mutedFg, marginTop: 6, letterSpacing: "0.04em" }}>{sanitize(st.label)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══ CONTACT ═════════════════════════════════════════════════ */
function Contact() {
  const { content } = useContent();
  const d = content.contact;
  return (
    <section id="contact" aria-label="Contact" style={{ background: C.bg, padding: "100px 0" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <Reveal><p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: C.primary, marginBottom: 14 }}>Contact</p></Reveal>
        <Reveal delay={100}><h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px,4vw,48px)", fontWeight: 400, color: C.fg, margin: "0 0 18px" }}>{sanitize(d.heading)}</h2></Reveal>
        <Reveal delay={200}><p style={{ fontSize: 15, lineHeight: 1.7, color: C.mutedFg, marginBottom: 40 }}>{sanitize(d.description)}</p></Reveal>
        <Reveal delay={300}>
          <a href={`mailto:${sanitize(d.email)}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.fg, color: C.bg, padding: "14px 32px", borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {sanitize(d.buttonText)} <Arrow size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ FOOTER ══════════════════════════════════════════════════ */
function SiteFooter() {
  const { content } = useContent();
  const d = content.footer;
  return (
    <footer role="contentinfo" style={{ background: C.bg, padding: "48px 0 32px", borderTop: `1px solid ${C.border}66` }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 24px" }}>
        <div className="footer-grid">
          <div>
            <a href="#" style={{ fontSize: 18, fontWeight: 600, color: C.fg, textDecoration: "none", fontFamily: "var(--font-serif)" }}>{sanitize(content.nav.brandName)}</a>
            <p style={{ marginTop: 14, maxWidth: 260, fontSize: 14, lineHeight: 1.7, color: C.mutedFg }}>{sanitize(d.tagline)}</p>
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: C.mutedFg, marginBottom: 14 }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(d.companyLinks || []).map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: 14, color: C.mutedFg, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.fg} onMouseLeave={e => e.currentTarget.style.color = C.mutedFg}>{sanitize(l.label)}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: C.mutedFg, marginBottom: 14 }}>Connect</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(d.socialLinks || []).map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: 14, color: C.mutedFg, textDecoration: "none", transition: "color 0.2s" }} rel="noopener noreferrer"
                  onMouseEnter={e => e.currentTarget.style.color = C.fg} onMouseLeave={e => e.currentTarget.style.color = C.mutedFg}>{sanitize(l.label)}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.border}44`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: C.mutedFg, margin: 0 }}>© 2026 {sanitize(content.nav.brandName)}. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={{ fontSize: 12, color: C.mutedFg, textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ fontSize: 12, color: C.mutedFg, textDecoration: "none" }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SITE PAGE
   ═══════════════════════════════════════════════════════════════ */
function SitePage() {
  const { content } = useContent();
  const seo = content.seo;
  useEffect(() => { document.title = seo.title || "Woo Tong"; }, [seo.title]);
  return (
    <div style={{ overflowX: "hidden" }}>
      <Navigation />
      <main>
        <Hero />
        <Clients />
        <CaseStudies />
        <Services />
        <Testimonial />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN — SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
const inputSt = { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.adminBorder}`, background: C.adminBg, color: C.adminWhite, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" };
const labelSt = { display: "block", fontSize: 12, fontWeight: 500, color: C.adminText, marginBottom: 6, letterSpacing: "0.02em" };
const btnPrimary = { padding: "10px 22px", borderRadius: 8, border: "none", background: C.adminAccent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s", letterSpacing: "0.02em" };
const btnDanger = { ...btnPrimary, background: C.danger };
const btnGhost = { ...btnPrimary, background: "transparent", border: `1px solid ${C.adminBorder}`, color: C.adminText };

function Field({ label, value, onChange, multiline, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelSt}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inputSt, minHeight: 80, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputSt} />
      )}
    </div>
  );
}

function AdminCard({ title, children, actions }) {
  return (
    <div style={{ background: C.adminCard, borderRadius: 12, border: `1px solid ${C.adminBorder}`, padding: 24, marginBottom: 20 }}>
      {title && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: C.adminWhite, margin: 0 }}>{title}</h3>
        {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
      </div>}
      {children}
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, padding: "12px 24px", borderRadius: 10, background: type === "success" ? C.success : C.danger, color: "#fff", fontSize: 13, fontWeight: 600, zIndex: 9999, animation: "fadeUp 0.3s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
      {message}
    </div>
  );
}

/* ═══ ADMIN SECTION EDITORS ═══════════════════════════════════ */
function SeoEditor({ data, set }) {
  return (
    <AdminCard title="SEO & Meta Tags">
      <p style={{ fontSize: 12, color: C.mutedFg, marginBottom: 16 }}>These control search engine results, social media previews, and browser tab title.</p>
      <Field label="Page Title" value={data.title} onChange={v => set({ ...data, title: v })} />
      <Field label="Meta Description" value={data.description} onChange={v => set({ ...data, description: v })} multiline />
      <Field label="Keywords (comma-separated)" value={data.keywords} onChange={v => set({ ...data, keywords: v })} />
      <Field label="Open Graph URL" value={data.ogUrl} onChange={v => set({ ...data, ogUrl: v })} />
      <Field label="OG Type" value={data.ogType} onChange={v => set({ ...data, ogType: v })} />
      <div style={{ padding: 14, borderRadius: 8, background: C.adminBg, border: `1px solid ${C.adminBorder}`, marginTop: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: C.adminAccent, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>SEO Checklist</p>
        {[
          { ok: (data.title || "").length > 10 && (data.title || "").length < 65, text: `Title: ${(data.title || "").length}/60 chars` },
          { ok: (data.description || "").length > 50 && (data.description || "").length < 160, text: `Description: ${(data.description || "").length}/155 chars` },
          { ok: (data.keywords || "").length > 0, text: "Keywords defined" },
          { ok: (data.ogUrl || "").startsWith("https"), text: "HTTPS URL" },
        ].map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.ok ? C.success : C.danger, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: c.ok ? C.success : C.adminText }}>{c.text}</span>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

function NavEditor({ data, set }) {
  return (
    <AdminCard title="Navigation">
      <Field label="Brand Name" value={data.brandName} onChange={v => set({ ...data, brandName: v })} />
      <Field label="CTA Button Text" value={data.ctaText} onChange={v => set({ ...data, ctaText: v })} />
    </AdminCard>
  );
}

function HeroEditor({ data, set }) {
  const updatePhrase = (i, v) => { const p = [...data.phrases]; p[i] = v; set({ ...data, phrases: p }); };
  const addPhrase = () => set({ ...data, phrases: [...data.phrases, "new phrase"] });
  const removePhrase = (i) => set({ ...data, phrases: data.phrases.filter((_, j) => j !== i) });
  return (
    <AdminCard title="Hero Section">
      <Field label="Heading Line 1" value={data.line1} onChange={v => set({ ...data, line1: v })} />
      <Field label="Heading Line 2" value={data.line2} onChange={v => set({ ...data, line2: v })} />
      <Field label="Heading Line 3 (before rotating text)" value={data.line3} onChange={v => set({ ...data, line3: v })} />
      <div style={{ marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <label style={{ ...labelSt, margin: 0 }}>Rotating Phrases</label>
          <button onClick={addPhrase} style={btnGhost}>+ Add</button>
        </div>
        {data.phrases.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={p} onChange={e => updatePhrase(i, e.target.value)} style={{ ...inputSt, flex: 1 }} />
            {data.phrases.length > 1 && <button onClick={() => removePhrase(i)} style={{ ...btnDanger, padding: "8px 14px", fontSize: 12 }}>✕</button>}
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

function ClientsEditor({ data, set }) {
  const add = () => set([...data, "New Client"]);
  const remove = (i) => set(data.filter((_, j) => j !== i));
  const update = (i, v) => { const n = [...data]; n[i] = v; set(n); };
  return (
    <AdminCard title="Clients Ticker" actions={<button onClick={add} style={btnGhost}>+ Add</button>}>
      {data.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={c} onChange={e => update(i, e.target.value)} style={{ ...inputSt, flex: 1 }} />
          <button onClick={() => remove(i)} style={{ ...btnDanger, padding: "8px 14px", fontSize: 12 }}>✕</button>
        </div>
      ))}
    </AdminCard>
  );
}

function CaseStudiesEditor({ data, set }) {
  const add = () => set([...data, { id: `cs${Date.now()}`, title: "New Project", client: "Client", category: "Category", year: "2025", colorFrom: C.primary, colorTo: C.accent }]);
  const remove = (i) => set(data.filter((_, j) => j !== i));
  const update = (i, k, v) => { const n = [...data]; n[i] = { ...n[i], [k]: v }; set(n); };
  return (
    <AdminCard title="Case Studies" actions={<button onClick={add} style={btnGhost}>+ Add Project</button>}>
      {data.map((s, i) => (
        <div key={s.id} style={{ padding: 16, borderRadius: 10, background: C.adminBg, border: `1px solid ${C.adminBorder}`, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.adminAccent }}>Project {i + 1}</span>
            <button onClick={() => remove(i)} style={{ ...btnDanger, padding: "6px 12px", fontSize: 11 }}>Remove</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Title" value={s.title} onChange={v => update(i, "title", v)} />
            <Field label="Client" value={s.client} onChange={v => update(i, "client", v)} />
            <Field label="Category" value={s.category} onChange={v => update(i, "category", v)} />
            <Field label="Year" value={s.year} onChange={v => update(i, "year", v)} />
            <div>
              <label style={labelSt}>Color From</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={s.colorFrom} onChange={e => update(i, "colorFrom", e.target.value)} style={{ width: 40, height: 36, border: "none", borderRadius: 6, cursor: "pointer" }} />
                <input value={s.colorFrom} onChange={e => update(i, "colorFrom", e.target.value)} style={{ ...inputSt, flex: 1 }} />
              </div>
            </div>
            <div>
              <label style={labelSt}>Color To</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={s.colorTo} onChange={e => update(i, "colorTo", e.target.value)} style={{ width: 40, height: 36, border: "none", borderRadius: 6, cursor: "pointer" }} />
                <input value={s.colorTo} onChange={e => update(i, "colorTo", e.target.value)} style={{ ...inputSt, flex: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 48, borderRadius: 8, background: `linear-gradient(135deg, ${s.colorFrom}, ${s.colorTo})` }} />
        </div>
      ))}
    </AdminCard>
  );
}

function ServicesEditor({ data, set }) {
  const add = () => { const n = String(data.length + 1).padStart(2, "0"); set([...data, { n, title: "New Service", desc: "Description here." }]); };
  const remove = (i) => set(data.filter((_, j) => j !== i));
  const update = (i, k, v) => { const n = [...data]; n[i] = { ...n[i], [k]: v }; set(n); };
  return (
    <AdminCard title="Services" actions={<button onClick={add} style={btnGhost}>+ Add</button>}>
      {data.map((s, i) => (
        <div key={i} style={{ padding: 14, borderRadius: 10, background: C.adminBg, border: `1px solid ${C.adminBorder}`, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.adminAccent }}>Service {s.n}</span>
            <button onClick={() => remove(i)} style={{ ...btnDanger, padding: "5px 10px", fontSize: 11 }}>Remove</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 10 }}>
            <Field label="#" value={s.n} onChange={v => update(i, "n", v)} />
            <Field label="Title" value={s.title} onChange={v => update(i, "title", v)} />
          </div>
          <Field label="Description" value={s.desc} onChange={v => update(i, "desc", v)} />
        </div>
      ))}
    </AdminCard>
  );
}

function TestimonialEditor({ data, set }) {
  return (
    <AdminCard title="Testimonial">
      <Field label="Quote" value={data.quote} onChange={v => set({ ...data, quote: v })} multiline />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Name" value={data.name} onChange={v => set({ ...data, name: v })} />
        <Field label="Role / Company" value={data.role} onChange={v => set({ ...data, role: v })} />
      </div>
    </AdminCard>
  );
}

function AboutEditor({ data, set }) {
  const addStat = () => set({ ...data, stats: [...data.stats, { value: "0", label: "New Stat" }] });
  const removeStat = (i) => set({ ...data, stats: data.stats.filter((_, j) => j !== i) });
  const updateStat = (i, k, v) => { const s = [...data.stats]; s[i] = { ...s[i], [k]: v }; set({ ...data, stats: s }); };
  return (
    <AdminCard title="About Section">
      <Field label="Heading" value={data.heading} onChange={v => set({ ...data, heading: v })} />
      <Field label="Description" value={data.description} onChange={v => set({ ...data, description: v })} multiline />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 10 }}>
        <label style={{ ...labelSt, margin: 0 }}>Stats (plain text, no boxes)</label>
        <button onClick={addStat} style={btnGhost}>+ Add</button>
      </div>
      {data.stats.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr 40px", gap: 8, marginBottom: 8 }}>
          <input value={s.value} onChange={e => updateStat(i, "value", e.target.value)} style={inputSt} placeholder="5+" />
          <input value={s.label} onChange={e => updateStat(i, "label", e.target.value)} style={inputSt} placeholder="Label" />
          <button onClick={() => removeStat(i)} style={{ ...btnDanger, padding: "6px", fontSize: 11 }}>✕</button>
        </div>
      ))}
    </AdminCard>
  );
}

function ContactEditor({ data, set }) {
  return (
    <AdminCard title="Contact Section">
      <Field label="Heading" value={data.heading} onChange={v => set({ ...data, heading: v })} />
      <Field label="Description" value={data.description} onChange={v => set({ ...data, description: v })} />
      <Field label="Email Address" value={data.email} onChange={v => set({ ...data, email: v })} type="email" />
      <Field label="Button Text" value={data.buttonText} onChange={v => set({ ...data, buttonText: v })} />
    </AdminCard>
  );
}

function FooterEditor({ data, set }) {
  const addLink = (key) => set({ ...data, [key]: [...data[key], { label: "New Link", href: "#" }] });
  const removeLink = (key, i) => set({ ...data, [key]: data[key].filter((_, j) => j !== i) });
  const updateLink = (key, i, k, v) => { const n = [...data[key]]; n[i] = { ...n[i], [k]: v }; set({ ...data, [key]: n }); };
  return (
    <AdminCard title="Footer">
      <Field label="Tagline" value={data.tagline} onChange={v => set({ ...data, tagline: v })} />
      {[["companyLinks", "Company Links"], ["socialLinks", "Social Links"]].map(([key, title]) => (
        <div key={key} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <label style={{ ...labelSt, margin: 0 }}>{title}</label>
            <button onClick={() => addLink(key)} style={btnGhost}>+ Add</button>
          </div>
          {data[key].map((l, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 40px", gap: 8, marginBottom: 8 }}>
              <input value={l.label} onChange={e => updateLink(key, i, "label", e.target.value)} style={inputSt} placeholder="Label" />
              <input value={l.href} onChange={e => updateLink(key, i, "href", e.target.value)} style={inputSt} placeholder="URL or #anchor" />
              <button onClick={() => removeLink(key, i)} style={{ ...btnDanger, padding: "6px", fontSize: 11 }}>✕</button>
            </div>
          ))}
        </div>
      ))}
    </AdminCard>
  );
}

function SecurityEditor({ data, set }) {
  return (
    <AdminCard title="Admin Security">
      <Field label="Admin Password" value={data} onChange={set} type="password" />
      <div style={{ padding: 14, borderRadius: 8, background: C.adminBg, border: `1px solid ${C.adminBorder}`, marginTop: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: C.adminAccent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Security Notes</p>
        {[
          "Content is stored in browser localStorage — each visitor has their own copy",
          "For a shared CMS, connect to a backend API or KV store (e.g. Cloudflare KV)",
          "Move admin auth to server-side (Workers + JWT) for production use",
          "Enable HTTPS — Cloudflare Pages provides this by default",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 6 }}>
            <span style={{ color: C.adminAccent, fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
            <span style={{ fontSize: 12, color: C.adminText, lineHeight: 1.5 }}>{tip}</span>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

/* ═══ ADMIN LOGIN ═════════════════════════════════════════════ */
function AdminLogin({ onAuth }) {
  const { content } = useContent();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const submit = () => {
    if (locked) return;
    if (attempts >= 5) { setLocked(true); setErr("Too many attempts. Refresh to try again."); return; }
    if (pw === content.adminPassword) {
      onAuth(true);
    } else {
      setAttempts(a => a + 1);
      setErr(`Invalid password. ${4 - attempts} attempts remaining.`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.adminBg, padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380, background: C.adminCard, borderRadius: 16, border: `1px solid ${C.adminBorder}`, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 20 }}>🔒</div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: C.adminWhite, margin: 0 }}>Admin Panel</h1>
          <p style={{ fontSize: 13, color: C.adminText, marginTop: 6 }}>Enter your password to continue</p>
        </div>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Password" disabled={locked} style={{ ...inputSt, padding: "12px 16px", fontSize: 15, marginBottom: 16 }} autoFocus />
        {err && <p style={{ fontSize: 12, color: C.danger, marginBottom: 12 }}>{err}</p>}
        <button onClick={submit} disabled={locked} style={{ ...btnPrimary, width: "100%", padding: "12px", fontSize: 14, opacity: locked ? 0.5 : 1 }}>Sign In</button>
        <p style={{ fontSize: 11, color: C.adminText, textAlign: "center", marginTop: 16, opacity: 0.6 }}>Default: admin123 — change in Security settings</p>
      </div>
    </div>
  );
}

/* ═══ ADMIN PANEL ═════════════════════════════════════════════ */
const adminSections = [
  { id: "seo", label: "SEO & Meta", icon: "🔍" },
  { id: "nav", label: "Navigation", icon: "☰" },
  { id: "hero", label: "Hero", icon: "⬆" },
  { id: "clients", label: "Clients", icon: "★" },
  { id: "caseStudies", label: "Case Studies", icon: "▦" },
  { id: "services", label: "Services", icon: "◆" },
  { id: "testimonial", label: "Testimonial", icon: "❝" },
  { id: "about", label: "About", icon: "ℹ" },
  { id: "contact", label: "Contact", icon: "✉" },
  { id: "footer", label: "Footer", icon: "▬" },
  { id: "security", label: "Security", icon: "🛡" },
];

function AdminPanel() {
  const { content, save } = useContent();
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState("seo");
  const [draft, setDraft] = useState(content);
  const [toast, setToast] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => { setDraft(content); }, [content]);

  const doSave = async () => {
    await save(draft);
    setToast({ message: "Changes saved!", type: "success" });
    setTimeout(() => setToast(null), 2500);
  };

  const doReset = async () => {
    if (!confirm("Reset ALL content to defaults? This cannot be undone.")) return;
    await save(DEFAULT_CONTENT);
    setDraft(DEFAULT_CONTENT);
    setToast({ message: "Reset to defaults", type: "success" });
    setTimeout(() => setToast(null), 2500);
  };

  if (!authed) return <AdminLogin onAuth={setAuthed} />;

  const setField = (key) => (val) => setDraft(d => ({ ...d, [key]: val }));

  const renderEditor = () => {
    switch (section) {
      case "seo": return <SeoEditor data={draft.seo} set={setField("seo")} />;
      case "nav": return <NavEditor data={draft.nav} set={setField("nav")} />;
      case "hero": return <HeroEditor data={draft.hero} set={setField("hero")} />;
      case "clients": return <ClientsEditor data={draft.clients} set={setField("clients")} />;
      case "caseStudies": return <CaseStudiesEditor data={draft.caseStudies} set={setField("caseStudies")} />;
      case "services": return <ServicesEditor data={draft.services} set={setField("services")} />;
      case "testimonial": return <TestimonialEditor data={draft.testimonial} set={setField("testimonial")} />;
      case "about": return <AboutEditor data={draft.about} set={setField("about")} />;
      case "contact": return <ContactEditor data={draft.contact} set={setField("contact")} />;
      case "footer": return <FooterEditor data={draft.footer} set={setField("footer")} />;
      case "security": return <SecurityEditor data={draft.adminPassword} set={v => setDraft(d => ({ ...d, adminPassword: v }))} />;
      default: return null;
    }
  };

  const currentSection = adminSections.find(s => s.id === section);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.adminBg }}>
      <aside className="admin-sidebar" style={{ width: 240, background: C.adminSidebar, borderRight: `1px solid ${C.adminBorder}`, padding: "20px 0", flexShrink: 0, display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 40, overflowY: "auto" }}>
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <a href="#/" style={{ fontSize: 14, fontWeight: 600, color: C.adminAccent, textDecoration: "none" }}>← Back to site</a>
        </div>
        <div style={{ padding: "0 12px", flex: 1 }}>
          {adminSections.map(s => (
            <button key={s.id} onClick={() => { setSection(s.id); setMobileNav(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: section === s.id ? `${C.adminAccent}18` : "transparent", color: section === s.id ? C.adminAccent : C.adminText, fontSize: 13, fontWeight: section === s.id ? 600 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s", marginBottom: 2 }}>
              <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.adminBorder}` }}>
          <button onClick={doReset} style={{ ...btnGhost, width: "100%", fontSize: 12, padding: "8px", color: C.danger, borderColor: `${C.danger}44` }}>Reset to Defaults</button>
        </div>
      </aside>

      {mobileNav && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: C.adminSidebar, padding: 20, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.adminWhite }}>Sections</span>
            <button onClick={() => setMobileNav(false)} style={{ background: "none", border: "none", color: C.adminText, fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>
          {adminSections.map(s => (
            <button key={s.id} onClick={() => { setSection(s.id); setMobileNav(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px", borderRadius: 8, border: "none", background: section === s.id ? `${C.adminAccent}18` : "transparent", color: section === s.id ? C.adminAccent : C.adminText, fontSize: 14, cursor: "pointer", textAlign: "left", marginBottom: 2 }}>
              <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.adminBorder}` }}>
            <a href="#/" style={{ fontSize: 13, color: C.adminAccent, textDecoration: "none" }}>← Back to site</a>
          </div>
        </div>
      )}

      <main className="admin-main" style={{ flex: 1, marginLeft: 240 }}>
        <div style={{ position: "sticky", top: 0, zIndex: 30, background: `${C.adminBg}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.adminBorder}`, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="admin-hamburger" onClick={() => setMobileNav(true)} style={{ background: "none", border: "none", color: C.adminText, fontSize: 20, cursor: "pointer", display: "none", padding: 4 }}>☰</button>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: C.adminWhite, margin: 0 }}>{currentSection?.icon} {currentSection?.label}</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="#/" style={{ ...btnGhost, textDecoration: "none", fontSize: 12, padding: "8px 16px" }}>Preview</a>
            <button onClick={doSave} style={{ ...btnPrimary, fontSize: 12, padding: "8px 20px" }}>Save Changes</button>
          </div>
        </div>
        <div style={{ padding: 28, maxWidth: 720 }}>{renderEditor()}</div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

/* ═══ ROUTER ══════════════════════════════════════════════════ */
function Router() {
  const [route, setRoute] = useState(window.location.hash || "#/");
  useEffect(() => {
    const h = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  if (route === "#/admin") return <AdminPanel />;
  return <SitePage />;
}

/* ═══ APP ═════════════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <SEO 
        title="Woo Tong | Digital Design Agency"
        description="We craft premium digital experiences that elevate brands and transform businesses."
        keywords="design, digital agency, branding, web development, AI, UX"
        ogUrl="https://wootong.com"
        ogType="website"
      />
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root { --font-serif: 'Instrument Serif', Georgia, serif; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: ${C.primary}33; }

        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes heroIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes phraseIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes phraseOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-14px); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .phrase-in { animation: phraseIn 0.4s ease forwards; }
        .phrase-out { animation: phraseOut 0.35s ease forwards; }
        .hero-anim-1 { animation: heroIn 0.9s ease 0.1s both; }
        .hero-anim-2 { animation: heroIn 0.9s ease 0.35s both; }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .admin-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .admin-hamburger { display: block !important; }
        }
      `}} />
      <ContentProvider>
        <Router />
      </ContentProvider>
    </>
  );
}
