import { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, Heart, ShoppingBag, Search, Plus, Minus, ArrowUpRight } from "lucide-react";
import { ContentProvider, useContent, type Color, type Product } from "./store";
import AdminApp from "./admin/AdminApp";

/* ─── SVG Logos ─── */
const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="none">
    <path d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z" fill="white" />
  </svg>
);
/* ─── Social Glyphs ─── */
const IconInstagram = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconTikTok = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.5 3h-2.7v12.2a2.4 2.4 0 1 1-2.4-2.4c.2 0 .4 0 .6.1V10a5.4 5.4 0 1 0 4.5 5.3V9.2a6.6 6.6 0 0 0 3.9 1.3V7.8a3.9 3.9 0 0 1-3.9-3.9V3Z" />
  </svg>
);
const socialIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("insta")) return <IconInstagram />;
  if (l.includes("tik")) return <IconTikTok />;
  return null;
};

const LogoDark = ({ size = 22 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path d="M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z" fill="#111" />
  </svg>
);

/* ─── App Content ─── */
function AppContent() {
  const { content } = useContent();
  const P = content?.products || [];
  const categories = content?.categories || [];
  const CATS = categories.map(c => c.name);

  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [pdp, setPdp] = useState<Product | null>(null);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [sticky, setSticky] = useState(false);

  const [activeCat, setActiveCat] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [fColor, setFColor] = useState("All");
  const [fSize, setFSize] = useState("All");
  const [q, setQ] = useState("");

  const [cart, setCart] = useState<{ p: Product; size: string; color: Color; qty: number }[]>([]);
  const [wl, setWl] = useState<string[]>([]);
  const [selSize, setSelSize] = useState("M");
  const [selColor, setSelColor] = useState<Color | null>(null);
  const [selQty, setSelQty] = useState(1);

  const [contactDone, setContactDone] = useState(false);
  const [subbed, setSubbed] = useState(false);
  const [subEmail, setSubEmail] = useState("");

  const rCol = useRef<HTMLDivElement>(null);
  const rNew = useRef<HTMLDivElement>(null);
  const rHouse = useRef<HTMLDivElement>(null);
  const rEdit = useRef<HTMLDivElement>(null);
  const rContact = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setSticky(window.scrollY > window.innerHeight - 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (pdp) { setSelColor(pdp.colors[0]); setSelSize(pdp.sizes.includes("M") ? "M" : pdp.sizes[0]); setSelQty(1); }
  }, [pdp]);

  const go = (r: React.RefObject<HTMLDivElement | null>) => { setMenuOpen(false); r.current?.scrollIntoView({ behavior: "smooth" }); };

  const nav = (l: string) => {
    if (l === "COLLECTION") go(rCol);
    if (l === "NEW ARRIVALS") go(rNew);
    if (l === "ABOUT") go(rHouse);
    if (l === "TALK") go(rContact);
    if (l === "BAG") { setMenuOpen(false); setBagOpen(true); }
  };

  const toggleWl = (id: string) => setWl(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const addBag = (product: Product, sz?: string, cl?: Color, qt?: number) => {
    const s = sz || selSize, c = cl || selColor || product.colors[0], n = qt || selQty;
    setCart(prev => {
      const i = prev.findIndex(x => x.p.id === product.id && x.size === s && x.color.name === c.name);
      if (i !== -1) { const cp = [...prev]; cp[i].qty += n; return cp; }
      return [...prev, { p: product, size: s, color: c, qty: n }];
    });
    setBagOpen(true);
  };

  const filtered = useMemo(() => {
    let l = [...P];
    if (activeCat !== "All") l = l.filter(p => p.tags.includes(activeCat));
    if (fColor !== "All") l = l.filter(p => p.colors.some(c => c.name === fColor));
    if (fSize !== "All") l = l.filter(p => p.sizes.includes(fSize));
    if (q.trim()) l = l.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(q.toLowerCase())));
    if (sortBy === "low") l.sort((a, b) => a.price - b.price);
    if (sortBy === "high") l.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") l.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return l;
  }, [activeCat, fColor, fSize, sortBy, q]);

  const arrivals = P.filter(x => x.isNew).slice(0, 2);
  const sub = cart.reduce((s, i) => s + i.p.price * i.qty, 0);
  const bagCount = cart.reduce((s, i) => s + i.qty, 0);
  const uColors = Array.from(new Set(P.flatMap(p => p.colors.map(c => c.name))));

  /* ─── Editorial Card (New Arrivals only) ─── */
  const EditorialCard = ({ p }: { p: Product }) => (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
        <img src={p.img[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]" />
        <button onClick={() => toggleWl(p.id)} aria-label="Wishlist"
          className="absolute top-4 right-4 w-8 h-8 bg-white/70 backdrop-blur-sm grid place-items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Heart size={13} strokeWidth={1.5} className={wl.includes(p.id) ? "fill-neutral-900 stroke-neutral-900" : "stroke-neutral-700"} />
        </button>
      </div>
      <div className="pt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="fs text-[11px] tracking-[0.18em] text-neutral-800">{p.name}</h3>
          <p className="fs text-[11px] text-neutral-400 mt-1.5 tabular-nums">${p.price}</p>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setPdp(p)} className="fs text-[9px] tracking-[0.2em] text-neutral-500 border-b border-neutral-200 pb-1 hover:text-neutral-900 hover:border-neutral-900 transition-colors">VIEW</button>
          <button onClick={() => addBag(p)} className="fs text-[9px] tracking-[0.2em] text-neutral-900 border-b border-neutral-900 pb-1 hover:opacity-50 transition-opacity">ADD TO BAG</button>
        </div>
      </div>
    </div>
  );

  /* ─── Product Card Component ─── */
  const Card = ({ p }: { p: Product }) => (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <img src={p.img[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1s] ease-out group-hover:scale-105" />
        {p.img[1] && <img src={p.img[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" />}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.isLtd && <span className="bg-neutral-900 text-white text-[8px] tracking-[0.18em] px-2.5 py-1 uppercase">Limited</span>}
          {p.isNew && <span className="bg-white text-neutral-900 text-[8px] tracking-[0.18em] px-2.5 py-1 uppercase">New</span>}
        </div>

        {/* Wishlist */}
        <button onClick={e => { e.stopPropagation(); toggleWl(p.id); }} className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm grid place-items-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Heart size={13} strokeWidth={1.5} className={wl.includes(p.id) ? "fill-neutral-900 stroke-neutral-900" : "stroke-neutral-600"} />
        </button>

        {/* Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <button onClick={e => { e.stopPropagation(); setPdp(p); }} className="flex-1 bg-white/95 backdrop-blur-sm text-[9px] tracking-[0.2em] py-3 hover:bg-white transition-colors">QUICK VIEW</button>
          <button onClick={e => { e.stopPropagation(); addBag(p); }} className="w-11 bg-neutral-900 text-white grid place-items-center hover:bg-neutral-800 transition-colors"><ShoppingBag size={13} /></button>
        </div>
      </div>
      <button onClick={() => setPdp(p)} className="w-full text-left pt-4 pb-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[11px] tracking-[0.16em] text-neutral-800">{p.name}</h3>
          <span className="text-[11px] text-neutral-500 tabular-nums">${p.price}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {p.colors.map(c => <span key={c.name} className="w-2.5 h-2.5 rounded-full border border-neutral-200" style={{ background: c.hex }} />)}
        </div>
      </button>
    </div>
  );

  return (
    <div className="bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        .ff{font-family:'Cormorant Garamond',serif}
        .fs{font-family:'Inter',sans-serif}
        .font-serif-headline{font-family:'Cormorant Garamond',serif}
        .font-pixel{font-family:'Cormorant Garamond',serif;letter-spacing:0.08em}
        ::-webkit-scrollbar{width:0;height:0}
        *{scrollbar-width:none}
        html{scroll-behavior:smooth}
      `}</style>

      {/* ══════════ HERO — LOCKED ══════════ */}
      <div className="relative h-screen w-full overflow-hidden bg-black text-white">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover lg:scale-[1.2]" src={content.hero.videoUrl} />
        <div className="relative z-10 flex h-full flex-col justify-between px-5 sm:px-8 md:px-10 lg:px-14 py-6">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-6">
              <a href="#" className="inline-flex items-center"><Logo /></a>
              <div className="flex flex-col">
                <span className="text-base md:text-lg tracking-[0.12em] font-light">AURA</span>
                <span className="font-pixel text-lg md:text-xl tracking-wide">LUXE</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-6">
              <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="p-2 hover:opacity-70 transition-opacity"><Menu size={24} /></button>
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] md:text-xs tracking-[0.15em] font-light text-white/90">{content.hero.locationLeft}</span>
                <span className="text-[10px] md:text-xs tracking-[0.15em] font-light text-white/90 pb-1 mb-1 border-b border-white/40 w-20 sm:w-24">{content.hero.locationRight}</span>
              </div>
            </div>
          </div>
          <div className="my-auto py-6 translate-y-20 sm:translate-y-24 lg:translate-y-28">
            <h1 className="font-serif-headline font-light tracking-[0.03em] uppercase text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4.25rem] leading-[0.95]">
              {content.hero.words.map((w, i) => <span key={i} className="block">{w}</span>)}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-2">
            <div className="w-full sm:max-w-xs border-t border-white/30 pt-4">
              <p className="font-pixel text-[10px] tracking-[0.2em] text-white/60 uppercase mb-1">{content.hero.tagline}</p>
              <p className="text-[10px] md:text-xs tracking-wide text-white/90">{content.hero.subtitle}</p>
            </div>
          </div>
        </div>

        {/* FULLSCREEN MENU */}
        <div className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="flex items-center justify-between px-6 py-6">
            <a href="#" className="inline-flex items-center"><Logo /></a>
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="p-2 hover:opacity-70 transition-opacity"><X size={24} /></button>
          </div>
          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            {content.menuLinks.map((link, i) => (
              <button key={link} onClick={() => nav(link)} className="text-2xl tracking-widest hover:opacity-70 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-white" style={{ transitionDelay: menuOpen ? `${100+i*60}ms` : "0ms", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(1rem)" }}>
                {link}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* ══════════ END HERO ══════════ */}

      {/* ─── STICKY NAV ─── */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${sticky ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="bg-white/90 backdrop-blur-xl border-b border-neutral-100">
          <div className="flex items-center justify-between px-5 sm:px-8 lg:px-14 h-16">
            <div className="flex items-center gap-10">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5">
                <LogoDark size={18} />
                <span className="fs text-[10px] tracking-[0.22em] font-medium text-neutral-800">AURA LUXE</span>
              </button>
              <nav className="hidden lg:flex items-center gap-8">
                {content.navItems.map(x => {
                  const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = { collection: rCol, newArrivals: rNew, house: rHouse, editorial: rEdit, contact: rContact };
                  return <button key={x.id} onClick={() => { const r = refMap[x.id]; if (r) go(r); }} className="fs text-[9px] tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors">{x.label}</button>;
                })}
              </nav>
            </div>
            <div className="flex items-center gap-0.5">
              <button onClick={() => setSearchOpen(true)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-neutral-50 transition-colors"><Search size={15} strokeWidth={1.5} /></button>
              <button onClick={() => setWishlistOpen(true)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-neutral-50 transition-colors relative">
                <Heart size={15} strokeWidth={1.5} />
                {wl.length > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-neutral-900 rounded-full" />}
              </button>
              <button onClick={() => setBagOpen(true)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-neutral-50 transition-colors relative">
                <ShoppingBag size={15} strokeWidth={1.5} />
                {bagCount > 0 && <span className="absolute -top-0.5 -right-0.5 fs text-[8px] bg-neutral-900 text-white w-4 h-4 grid place-items-center rounded-full">{bagCount}</span>}
              </button>
              <button onClick={() => setMenuOpen(true)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-neutral-50 transition-colors lg:hidden"><Menu size={15} strokeWidth={1.5} /></button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ 01 · NEW ARRIVALS ═══ */}
      <section ref={rNew} className="px-5 sm:px-8 lg:px-14 pt-32 pb-28">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="fs text-[9px] tracking-[0.3em] text-neutral-400 mb-3">{content.newArrivals.sectionNum}</p>
              <h2 className="ff text-[36px] sm:text-[52px] font-light leading-[0.9] tracking-tight">{content.newArrivals.title}</h2>
            </div>
            <button onClick={() => { setActiveCat("New Arrivals"); go(rCol); }} className="hidden sm:flex items-center gap-2 fs text-[9px] tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors pb-1 border-b border-neutral-200 hover:border-neutral-900">
              {content.newArrivals.viewAllText} <ArrowUpRight size={10} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 max-w-[1100px]">
            {arrivals.map(p => <EditorialCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ═══ 02 · FEATURED ═══ */}
      <section className="px-5 sm:px-8 lg:px-14 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative aspect-[4/5] lg:aspect-[16/9] overflow-hidden bg-neutral-100">
            <img src={P[0].img[0]} alt="campaign" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 sm:p-12 lg:p-16 text-white max-w-lg">
              <p className="fs text-[9px] tracking-[0.25em] text-white/60 mb-4">{content.featured.campaignLabel}</p>
              <h3 className="ff text-[28px] sm:text-[40px] font-light leading-[0.95]">{content.featured.campaignTitle}</h3>
              <button onClick={() => go(rCol)} className="mt-8 fs text-[9px] tracking-[0.22em] border border-white/30 px-7 py-3.5 hover:bg-white hover:text-neutral-900 transition-all duration-300">{content.featured.campaignCta}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRANSITION ═══ */}
      <div className="py-12 sm:py-16" />

      {/* ═══ COMPLETE COLLECTION ═══ */}
      <section ref={rCol} className="px-5 sm:px-8 lg:px-14 py-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div>
              <p className="fs text-[9px] tracking-[0.3em] text-neutral-400 mb-3">{content.collectionSection.sectionNum}</p>
              <h2 className="ff text-[40px] sm:text-[56px] font-light leading-[0.88]">{content.collectionSection.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: "COLLECTION", val: activeCat, set: setActiveCat, opts: ["All",...CATS] },
                { label: "COLOR", val: fColor, set: setFColor, opts: ["All",...uColors] },
                { label: "SIZE", val: fSize, set: setFSize, opts: ["All","XS","S","M","L","XL"] },
                { label: "SORT", val: sortBy, set: setSortBy, opts: [{ v:"featured",l:"FEATURED" },{ v:"newest",l:"NEWEST" },{ v:"low",l:"PRICE ↑" },{ v:"high",l:"PRICE ↓" }] },
              ].map(f => (
                <select key={f.label} value={f.val} onChange={e => (f.set as (v:string)=>void)(e.target.value)} className="fs bg-transparent border border-neutral-200 rounded-none px-3 py-2 text-[9px] tracking-[0.15em] text-neutral-600 focus:outline-none focus:border-neutral-900 appearance-none cursor-pointer">
                  {Array.isArray(f.opts) && f.opts.map(o => typeof o === "string" ? <option key={o} value={o}>{o.toUpperCase()}</option> : <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              ))}
            </div>
          </div>
          <p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mb-8">{filtered.length} ABAYAS</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-10 gap-y-16">
            {filtered.map(p => <Card key={p.id} p={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="ff text-[24px] font-light text-neutral-400">{content.collectionSection.emptyMessage}</p>
              <button onClick={() => { setActiveCat("All"); setFColor("All"); setFSize("All"); }} className="mt-6 fs text-[9px] tracking-[0.2em] border-b border-neutral-300 pb-1 text-neutral-500 hover:text-neutral-900">{content.collectionSection.clearFiltersText}</button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ 06 · EDITORIAL ═══ */}
      <section ref={rEdit} className="bg-neutral-900 text-white">
        <div className="px-5 sm:px-8 lg:px-14 py-14 flex justify-between items-end border-b border-white/10">
          <div>
            <p className="fs text-[9px] tracking-[0.3em] text-white/40 mb-3">{content.editorial.sectionNum}</p>
            <h2 className="ff text-[36px] sm:text-[48px] font-light leading-[0.9]">{content.editorial.title}</h2>
          </div>
          <span className="hidden sm:block fs text-[9px] tracking-[0.2em] text-white/30">{content.editorial.volume}</span>
        </div>
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img src={P[1].img[0]} className="h-full w-full object-cover" alt="editorial" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="fs text-[9px] tracking-[0.2em] text-white/50">{content.editorial.lookLabel}</p>
              <p className="ff text-[24px] font-light mt-2">{content.editorial.lookTitle}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-10 sm:p-14 lg:p-20">
            <div>
              <p className="fs text-[9px] tracking-[0.25em] text-white/30 mb-10">{content.editorial.locationTag}</p>
              <p className="ff text-[26px] sm:text-[32px] font-light leading-[1.25] max-w-md">{content.editorial.text}</p>
            </div>
            <button onClick={() => go(rCol)} className="mt-14 fs text-[9px] tracking-[0.2em] text-white/50 border-b border-white/20 pb-1.5 self-start hover:text-white hover:border-white transition-colors">{content.editorial.shopStoryText}</button>
          </div>
        </div>
      </section>

      {/* ═══ 07 · THE HOUSE ═══ */}
      <section ref={rHouse} className="px-5 sm:px-8 lg:px-14 py-28">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p className="fs text-[9px] tracking-[0.3em] text-neutral-400 mb-8">{content.theHouse.sectionLabel}</p>
            <h2 className="ff text-[40px] sm:text-[52px] font-light leading-[0.88]">{content.theHouse.title}</h2>
            <div className="mt-12 space-y-6 fs text-[12px] leading-[1.9] font-light text-neutral-500">
              {content.theHouse.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-14 grid grid-cols-2 gap-8 border-t border-neutral-100 pt-8">
              <div><p className="ff text-[32px] font-light">{content.theHouse.stat1Value}</p><p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mt-1">{content.theHouse.stat1Label}</p></div>
              <div><p className="ff text-[32px] font-light">{content.theHouse.stat2Value}</p><p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mt-1">{content.theHouse.stat2Label}</p></div>
            </div>
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
            <img src={P[2].img[0]} alt="house" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ═══ 08 · NEWSLETTER ═══ */}
      <section className="bg-neutral-900 text-white px-5 sm:px-8 lg:px-14 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="fs text-[9px] tracking-[0.3em] text-white/40 mb-6">{content.newsletter.label}</p>
          <h2 className="ff text-[32px] sm:text-[48px] font-light leading-[0.9]">{content.newsletter.title}</h2>
          <p className="fs text-[11px] text-white/40 mt-6 max-w-md mx-auto leading-relaxed font-light">{content.newsletter.description}</p>
          <div className="mt-10 max-w-sm mx-auto">
            {!subbed ? (
              <div className="flex border-b border-white/20 pb-3">
                <input value={subEmail} onChange={e => setSubEmail(e.target.value)} placeholder={content.newsletter.placeholder} className="bg-transparent flex-1 fs text-[10px] tracking-[0.15em] placeholder:text-white/25 focus:outline-none text-white" />
                <button onClick={() => { if (subEmail.includes("@")) setSubbed(true); }} className="fs text-[9px] tracking-[0.2em] text-white/60 hover:text-white transition-colors ml-4">{content.newsletter.buttonText}</button>
              </div>
            ) : (
              <p className="fs text-[10px] tracking-[0.15em] border border-white/20 p-4 text-white/70">{content.newsletter.successMessage}</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 09 · CONTACT ═══ */}
      <section ref={rContact} className="px-5 sm:px-8 lg:px-14 py-24">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2">
            <p className="fs text-[9px] tracking-[0.3em] text-neutral-400 mb-3">{content.contact.sectionNum}</p>
            <h2 className="ff text-[36px] font-light leading-[0.9]">{content.contact.title}</h2>
            <div className="mt-10 space-y-8 fs text-[11px] text-neutral-500 leading-relaxed">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-neutral-400 mb-2">{content.contact.careLabel}</p>
                <p>{content.contact.careEmail}</p>
                <p>{content.contact.carePhone}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] text-neutral-400 mb-2">{content.contact.atelierLabel}</p>
                <p>{content.contact.atelierAddress}</p>
                <p>{content.contact.atelierNote}</p>
              </div>
              <div className="flex gap-5 text-[9px] tracking-[0.18em] text-neutral-400">
                {content.contact.socialLinks.map(s => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                    {socialIcon(s.label)}{s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            {!contactDone ? (
              <form onSubmit={e => { e.preventDefault(); setContactDone(true); }} className="grid sm:grid-cols-2 gap-5">
                <input required placeholder={content.contact.formNameLabel} className="border-b border-neutral-200 py-4 bg-transparent fs text-[10px] tracking-[0.12em] placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors" />
                <input required type="email" placeholder={content.contact.formEmailLabel} className="border-b border-neutral-200 py-4 bg-transparent fs text-[10px] tracking-[0.12em] placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors" />
                <input placeholder={content.contact.formPhoneLabel} className="border-b border-neutral-200 py-4 bg-transparent fs text-[10px] tracking-[0.12em] placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors" />
                <select className="border-b border-neutral-200 py-4 bg-transparent fs text-[10px] tracking-[0.12em] text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors">
                  {content.contact.formSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
                <textarea required rows={3} placeholder={content.contact.formMessageLabel} className="sm:col-span-2 border-b border-neutral-200 py-4 bg-transparent fs text-[10px] tracking-[0.12em] placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 resize-none transition-colors" />
                <button type="submit" className="sm:col-span-2 bg-neutral-900 text-white py-4 fs text-[9px] tracking-[0.22em] hover:bg-neutral-800 transition-colors mt-2">{content.contact.formSubmitText}</button>
              </form>
            ) : (
              <div className="border border-neutral-100 p-16 text-center">
                <p className="ff text-[24px] font-light">{content.contact.formSuccessTitle}</p>
                <p className="fs text-[11px] text-neutral-400 mt-3">{content.contact.formSuccessText}</p>
                <button onClick={() => setContactDone(false)} className="mt-8 fs text-[9px] tracking-[0.2em] border-b border-neutral-300 pb-1 text-neutral-500 hover:text-neutral-900">{content.contact.formRetryText}</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-neutral-900 text-white px-5 sm:px-8 lg:px-14 pt-16 pb-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-14 pb-14 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5"><Logo /><span className="fs text-[10px] tracking-[0.22em]">AURA LUXE</span></div>
              <p className="fs text-[10px] text-white/30 mt-5 max-w-[240px] leading-relaxed font-light">{content.footer.tagline}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 fs text-[10px]">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-white/30 mb-4">{content.footer.shopLabel}</p>
                <div className="space-y-2.5 text-white/60">
                  {content.footer.shopLinks.map(l => <button key={l} onClick={() => go(rCol)} className="block hover:text-white transition-colors">{l}</button>)}
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] text-white/30 mb-4">{content.footer.careLabel}</p>
                <div className="space-y-2.5 text-white/60">
                  <button onClick={() => setSizeGuide(true)} className="block hover:text-white transition-colors">{content.footer.careLinks[0]}</button>
                  {content.footer.careLinks.slice(1).map(l => <span key={l} className="block">{l}</span>)}
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] text-white/30 mb-4">{content.footer.legalLabel}</p>
                <div className="space-y-2.5 text-white/60">
                  {content.footer.legalLinks.map(l => <span key={l} className="block">{l}</span>)}
                  <span className="block pt-2">{content.footer.developerCredit}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-8 fs text-[8px] tracking-[0.15em] text-white/20">
            <span>{content.footer.copyright}</span>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block">{content.footer.locationsText}</span>
              <a href="#admin" className="text-white/10 hover:text-white/40 transition-colors">CMS</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════ PRODUCT DETAIL ══════════ */}
      {pdp && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-neutral-100 flex items-center justify-between px-5 sm:px-8 lg:px-14 h-14">
            <button onClick={() => setPdp(null)} className="fs text-[9px] tracking-[0.2em] text-neutral-500 flex items-center gap-2 hover:text-neutral-900 transition-colors"><X size={14} /> CLOSE</button>
            <span className="ff text-[16px] font-light tracking-wide">{pdp.name}</span>
            <button onClick={() => setBagOpen(true)} className="relative"><ShoppingBag size={16} strokeWidth={1.5} />{bagCount > 0 && <span className="absolute -top-2 -right-2 fs text-[7px] bg-neutral-900 text-white w-3.5 h-3.5 grid place-items-center rounded-full">{bagCount}</span>}</button>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-[1px] bg-neutral-100">
              {pdp.img.map((src, i) => (
                <div key={i} className={`${pdp.img.length === 1 ? "col-span-2" : ""} aspect-[3/4] bg-neutral-50 overflow-hidden`}>
                  <img src={src} alt={pdp.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="px-6 sm:px-10 lg:px-14 py-10 lg:py-14 lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:overflow-auto">
              <p className="fs text-[9px] tracking-[0.2em] text-neutral-400">{pdp.tags.join(" · ").toUpperCase()}</p>
              <h1 className="ff text-[32px] sm:text-[40px] font-light leading-[0.9] mt-4">{pdp.name}</h1>
              <p className="fs text-[16px] mt-4 text-neutral-700">${pdp.price}{pdp.oldPrice && <span className="text-neutral-300 line-through text-[13px] ml-2">${pdp.oldPrice}</span>}</p>
              <p className="fs text-[12px] leading-[1.8] text-neutral-500 mt-8 max-w-[400px] font-light">{pdp.desc}</p>

              <div className="mt-10">
                <p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mb-4">COLOR — {selColor?.name.toUpperCase()}</p>
                <div className="flex gap-2.5">
                  {pdp.colors.map(c => (
                    <button key={c.name} onClick={() => setSelColor(c)} className={`flex items-center gap-2.5 border px-4 py-2.5 transition-all duration-200 ${selColor?.name === c.name ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 hover:border-neutral-400"}`}>
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-200" style={{ background: c.hex }} />
                      <span className="fs text-[9px] tracking-[0.15em]">{c.name.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="fs text-[9px] tracking-[0.2em] text-neutral-400">SIZE</p>
                  <button onClick={() => setSizeGuide(true)} className="fs text-[9px] tracking-[0.15em] text-neutral-400 border-b border-neutral-200 pb-0.5 hover:text-neutral-900 hover:border-neutral-900 transition-colors">SIZE GUIDE</button>
                </div>
                <div className="flex gap-2">
                  {pdp.sizes.map(s => (
                    <button key={s} onClick={() => setSelSize(s)} className={`w-12 h-12 fs text-[10px] tracking-[0.12em] border transition-all duration-200 ${selSize === s ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-200 hover:border-neutral-400"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center border border-neutral-200">
                  <button onClick={() => setSelQty(Math.max(1, selQty-1))} className="w-11 h-11 grid place-items-center hover:bg-neutral-50 transition-colors"><Minus size={13} /></button>
                  <span className="w-8 text-center fs text-[12px]">{selQty}</span>
                  <button onClick={() => setSelQty(selQty+1)} className="w-11 h-11 grid place-items-center hover:bg-neutral-50 transition-colors"><Plus size={13} /></button>
                </div>
              </div>

              <div className="mt-8 grid gap-2.5">
                <button onClick={() => addBag(pdp)} className="bg-neutral-900 text-white py-4 fs text-[9px] tracking-[0.22em] hover:bg-neutral-800 transition-colors">ADD TO BAG — ${pdp.price * selQty}</button>
                <button onClick={() => { addBag(pdp); setCheckout(true); }} className="border border-neutral-900 py-4 fs text-[9px] tracking-[0.22em] hover:bg-neutral-900 hover:text-white transition-all duration-200">BUY NOW</button>
                <button onClick={() => toggleWl(pdp.id)} className="py-3 fs text-[9px] tracking-[0.18em] flex items-center justify-center gap-2 text-neutral-400 hover:text-neutral-900 transition-colors">
                  <Heart size={13} strokeWidth={1.5} className={wl.includes(pdp.id) ? "fill-neutral-900 stroke-neutral-900" : ""} /> {wl.includes(pdp.id) ? "SAVED" : "ADD TO WISHLIST"}
                </button>
              </div>

              <div className="mt-14 space-y-6 fs text-[10px] leading-relaxed text-neutral-500">
                <div className="border-t border-neutral-100 pt-6">
                  <p className="text-[9px] tracking-[0.2em] text-neutral-400 mb-2">FABRIC & CARE</p>
                  <p>{pdp.fabric}</p>
                </div>
                <div className="border-t border-neutral-100 pt-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-neutral-400 mb-2">SHIPPING</p>
                    <p>3-5 days worldwide. Dubai same-day. Free on $500+.</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.2em] text-neutral-400 mb-2">RETURNS</p>
                    <p>14-day returns. Unworn with tags. Limited editions final sale.</p>
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mb-6">YOU MAY ALSO LIKE</p>
                <div className="grid grid-cols-2 gap-4">
                  {P.filter(x => x.id !== pdp.id).slice(0, 2).map(x => (
                    <button key={x.id} onClick={() => setPdp(x)} className="text-left group">
                      <div className="aspect-[3/4] overflow-hidden bg-neutral-100"><img src={x.img[0]} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" alt={x.name} /></div>
                      <p className="fs text-[9px] tracking-[0.15em] mt-3 text-neutral-700">{x.name}</p>
                      <p className="fs text-[9px] text-neutral-400">${x.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ BAG DRAWER ══════════ */}
      <div className={`fixed inset-0 z-[70] transition-all duration-300 ${bagOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setBagOpen(false)} className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${bagOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-[90vw] sm:w-[400px] bg-white shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${bagOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
          <div className="flex items-center justify-between px-6 h-14 border-b border-neutral-100 flex-shrink-0">
            <span className="fs text-[10px] tracking-[0.18em] text-neutral-700">BAG — {bagCount}</span>
            <button onClick={() => setBagOpen(false)} className="w-8 h-8 grid place-items-center rounded-full border border-neutral-100 hover:bg-neutral-50 transition-colors"><X size={13} /></button>
          </div>
          <div className="flex-1 overflow-auto p-6 space-y-5">
            {cart.length === 0 ? (
              <div className="py-20 text-center">
                <p className="ff text-[22px] font-light text-neutral-400">Your bag is empty.</p>
                <button onClick={() => { setBagOpen(false); go(rCol); }} className="mt-8 bg-neutral-900 text-white px-8 py-3 fs text-[9px] tracking-[0.2em] hover:bg-neutral-800 transition-colors">SHOP COLLECTION</button>
              </div>
            ) : cart.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-20 h-[104px] bg-neutral-100 overflow-hidden flex-shrink-0"><img src={item.p.img[0]} className="w-full h-full object-cover" alt={item.p.name} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="fs text-[10px] tracking-[0.14em] text-neutral-800 truncate">{item.p.name}</h4>
                    <button onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))} className="fs text-[8px] tracking-[0.15em] text-neutral-300 hover:text-neutral-900 transition-colors flex-shrink-0">REMOVE</button>
                  </div>
                  <p className="fs text-[9px] text-neutral-400 mt-1">{item.color.name} · {item.size}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-neutral-100">
                      <button onClick={() => setCart(prev => prev.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty-1) } : it))} className="w-7 h-7 grid place-items-center"><Minus size={9} /></button>
                      <span className="w-5 text-center fs text-[10px]">{item.qty}</span>
                      <button onClick={() => setCart(prev => prev.map((it, i) => i === idx ? { ...it, qty: it.qty+1 } : it))} className="w-7 h-7 grid place-items-center"><Plus size={9} /></button>
                    </div>
                    <span className="fs text-[10px] text-neutral-700 tabular-nums">${item.p.price * item.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-neutral-100 p-6 flex-shrink-0">
              <div className="flex justify-between fs text-[10px] tracking-[0.15em] mb-1"><span className="text-neutral-500">SUBTOTAL</span><span className="text-neutral-800 tabular-nums">${sub}</span></div>
              <p className="fs text-[9px] text-neutral-300 mb-5">Shipping at checkout.</p>
              <button onClick={() => { setBagOpen(false); setCheckout(true); }} className="w-full bg-neutral-900 text-white py-3.5 fs text-[9px] tracking-[0.22em] hover:bg-neutral-800 transition-colors">CHECKOUT</button>
              <button onClick={() => { setBagOpen(false); go(rCol); }} className="w-full mt-2 border border-neutral-200 py-3.5 fs text-[9px] tracking-[0.22em] hover:bg-neutral-50 transition-colors">CONTINUE SHOPPING</button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ SEARCH ══════════ */}
      <div className={`fixed inset-0 z-[65] bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${searchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
        <div className="flex items-center justify-between px-5 sm:px-8 lg:px-14 h-16 border-b border-neutral-100">
          <div className="flex items-center gap-3 flex-1">
            <Search size={16} strokeWidth={1.5} className="text-neutral-400" />
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search abayas…" className="bg-transparent flex-1 fs text-[13px] tracking-[0.05em] focus:outline-none placeholder:text-neutral-300" />
          </div>
          <button onClick={() => { setSearchOpen(false); setQ(""); }} className="fs text-[9px] tracking-[0.18em] text-neutral-500 border border-neutral-200 px-5 py-2 rounded-full hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200 ml-4">CLOSE</button>
        </div>
        <div className="px-5 sm:px-8 lg:px-14 py-10 max-h-[calc(100vh-64px)] overflow-auto">
          {q.trim() ? (
            <>
              <p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mb-8">{filtered.length} RESULTS</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
                {filtered.slice(0,8).map(p => (
                  <button key={p.id} onClick={() => { setPdp(p); setSearchOpen(false); setQ(""); }} className="text-left group">
                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden"><img src={p.img[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" /></div>
                    <p className="fs text-[10px] tracking-[0.14em] mt-3 text-neutral-700">{p.name}</p>
                    <p className="fs text-[9px] text-neutral-400">${p.price}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div>
              <p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mb-6">POPULAR</p>
              <div className="flex flex-wrap gap-2">
                {["Black","Noor","Embroidered","Limited","Signature","Everyday"].map(t => (
                  <button key={t} onClick={() => setQ(t)} className="border border-neutral-200 px-5 py-2.5 fs text-[9px] tracking-[0.12em] text-neutral-500 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200 rounded-full">{t.toUpperCase()}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════ WISHLIST ══════════ */}
      <div className={`fixed inset-0 z-[70] transition-all duration-300 ${wishlistOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setWishlistOpen(false)} className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${wishlistOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-[90vw] sm:w-[380px] bg-white shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${wishlistOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
          <div className="flex items-center justify-between px-6 h-14 border-b border-neutral-100">
            <span className="fs text-[10px] tracking-[0.18em] text-neutral-700">WISHLIST — {wl.length}</span>
            <button onClick={() => setWishlistOpen(false)} className="w-8 h-8 grid place-items-center rounded-full border border-neutral-100 hover:bg-neutral-50 transition-colors"><X size={13} /></button>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {wl.length === 0 ? <p className="fs text-[10px] text-neutral-400 py-10 text-center">No saved abayas yet.</p> :
              <div className="space-y-5">
                {P.filter(x => wl.includes(x.id)).map(p => (
                  <div key={p.id} className="flex gap-4">
                    <img src={p.img[0]} alt={p.name} className="w-20 h-[104px] object-cover bg-neutral-100 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="fs text-[10px] tracking-[0.14em] text-neutral-800">{p.name}</p>
                      <p className="fs text-[9px] text-neutral-400 mt-1">${p.price}</p>
                      <div className="flex gap-2.5 mt-3">
                        <button onClick={() => { setPdp(p); setWishlistOpen(false); }} className="fs text-[8px] border border-neutral-200 px-3 py-1.5 tracking-[0.15em] hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200">VIEW</button>
                        <button onClick={() => toggleWl(p.id)} className="fs text-[8px] text-neutral-300 hover:text-neutral-900 tracking-[0.15em] transition-colors">REMOVE</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>

      {/* ══════════ SIZE GUIDE ══════════ */}
      {sizeGuide && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div onClick={() => setSizeGuide(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-[620px] max-h-[85vh] overflow-auto p-8 sm:p-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="fs text-[9px] tracking-[0.2em] text-neutral-400 mb-2">SIZING</p>
                <h3 className="ff text-[24px] font-light">Size Guide</h3>
              </div>
              <button onClick={() => setSizeGuide(false)} className="w-8 h-8 border border-neutral-100 grid place-items-center rounded-full hover:bg-neutral-50 transition-colors"><X size={13} /></button>
            </div>
            <p className="fs text-[11px] leading-relaxed text-neutral-500 mb-8 font-light">AURA LUXE Abayas are designed modestly oversized. Select your regular dress size. Between sizes? Size down for a cleaner cut, up for drape.</p>
            <table className="w-full fs text-[10px] border-collapse">
              <thead><tr className="bg-neutral-900 text-white"><th className="p-3 text-left tracking-[0.12em] font-normal">SIZE</th><th className="p-3 text-left tracking-[0.12em] font-normal">BUST</th><th className="p-3 text-left tracking-[0.12em] font-normal">WAIST</th><th className="p-3 text-left tracking-[0.12em] font-normal">LENGTH</th></tr></thead>
              <tbody>
                {[["XS","48\"","50\"","56\""],["S","50\"","52\"","56\""],["M","52\"","54\"","57\""],["L","54\"","56\"","57\""],["XL","56\"","58\"","58\""]].map(r => (
                  <tr key={r[0]} className="border-b border-neutral-100"><td className="p-3 font-medium">{r[0]}</td><td className="p-3 text-neutral-500">{r[1]}</td><td className="p-3 text-neutral-500">{r[2]}</td><td className="p-3 text-neutral-500">{r[3]}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="fs text-[9px] text-neutral-400 mt-6 leading-relaxed">Garment measurements in inches. Model 5'10" wearing S. Advice: care@auraluxe.com</p>
          </div>
        </div>
      )}

      {/* ══════════ CHECKOUT ══════════ */}
      {checkout && (
        <div className="fixed inset-0 z-[80] bg-white overflow-auto">
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-neutral-100 flex items-center justify-between px-5 sm:px-8 lg:px-14 h-14">
            <button onClick={() => setCheckout(false)} className="fs text-[9px] tracking-[0.18em] text-neutral-500 flex items-center gap-2 hover:text-neutral-900 transition-colors"><X size={13} /> BACK</button>
            <span className="ff text-[16px] font-light">Checkout</span>
            <span className="fs text-[8px] tracking-[0.2em] text-neutral-300 hidden sm:block">SECURE</span>
          </div>
          <div className="max-w-[1100px] mx-auto grid lg:grid-cols-12 gap-12 p-5 sm:p-8 lg:p-14">
            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="fs text-[10px] tracking-[0.18em] text-neutral-400 border-b border-neutral-100 pb-4 mb-6">CUSTOMER DETAILS</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {["FULL NAME *","EMAIL *","PHONE *","CITY *"].map(ph => (
                    <input key={ph} placeholder={ph} className="border border-neutral-200 p-4 fs text-[10px] tracking-[0.1em] bg-white focus:outline-none focus:border-neutral-900 transition-colors" />
                  ))}
                  <input placeholder="ADDRESS *" className="sm:col-span-2 border border-neutral-200 p-4 fs text-[10px] tracking-[0.1em] bg-white focus:outline-none focus:border-neutral-900 transition-colors" />
                  <select className="border border-neutral-200 p-4 fs text-[10px] tracking-[0.1em] bg-white focus:outline-none focus:border-neutral-900">
                    <option>UAE</option><option>PAKISTAN</option><option>SAUDI ARABIA</option><option>QATAR</option><option>UK</option><option>USA</option>
                  </select>
                  <select className="border border-neutral-200 p-4 fs text-[10px] tracking-[0.1em] bg-white focus:outline-none focus:border-neutral-900">
                    <option>STANDARD 3-5 DAYS — $25</option><option>EXPRESS 1-2 DAYS — $45</option><option>DUBAI SAME-DAY — $15</option>
                  </select>
                </div>
              </div>
              <div>
                <h3 className="fs text-[10px] tracking-[0.18em] text-neutral-400 border-b border-neutral-100 pb-4 mb-6">PAYMENT</h3>
                <div className="border border-neutral-100 p-6">
                  <p className="fs text-[10px] tracking-[0.12em] text-neutral-600">Payment gateway will be connected on production.</p>
                  <div className="mt-5 flex gap-2 fs text-[8px] tracking-[0.15em] text-neutral-400">
                    {["VISA","MASTERCARD","APPLE PAY","TABBY"].map(x => <span key={x} className="border border-neutral-100 px-3 py-2">{x}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:sticky lg:top-[80px] h-fit">
              <div className="bg-neutral-50 p-6 sm:p-8">
                <h3 className="fs text-[10px] tracking-[0.18em] text-neutral-500 mb-6">ORDER — {bagCount} ITEMS</h3>
                <div className="space-y-4 max-h-[320px] overflow-auto">
                  {cart.map((item, i) => (
                    <div key={i} className="flex gap-3 fs text-[10px]">
                      <img src={item.p.img[0]} alt={item.p.name} className="w-14 h-[72px] object-cover bg-neutral-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="tracking-[0.1em] text-neutral-700 truncate">{item.p.name}</p>
                        <p className="text-neutral-400 mt-0.5">{item.color.name} · {item.size} · ×{item.qty}</p>
                      </div>
                      <span className="text-neutral-700 tabular-nums flex-shrink-0">${item.p.price * item.qty}</span>
                    </div>
                  ))}
                  {cart.length === 0 && <p className="fs text-[10px] text-neutral-400">Bag is empty.</p>}
                </div>
                <div className="border-t border-neutral-200 mt-6 pt-5 space-y-2 fs text-[10px]">
                  <div className="flex justify-between"><span className="text-neutral-400">Subtotal</span><span className="tabular-nums">${sub}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Shipping</span><span className="tabular-nums">$25</span></div>
                  <div className="flex justify-between font-medium text-[12px] pt-3 border-t border-neutral-200"><span>TOTAL</span><span className="tabular-nums">${sub + 25}</span></div>
                </div>
                <button disabled={cart.length === 0} className="mt-6 w-full bg-neutral-900 text-white py-4 fs text-[9px] tracking-[0.22em] disabled:opacity-20 hover:bg-neutral-800 transition-colors">PLACE ORDER</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Root App with Admin Route ─── */
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(window.location.hash === "#admin");
    const onHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (isAdmin) {
    return <ContentProvider><AdminApp /></ContentProvider>;
  }
  return <ContentProvider><AppContent /></ContentProvider>;
}
