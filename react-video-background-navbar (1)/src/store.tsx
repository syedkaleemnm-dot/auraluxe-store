import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/* ═══════════════ TYPES ═══════════════ */
export type Color = { name: string; hex: string };
export type Product = {
  id: string; name: string; price: number; oldPrice?: number;
  img: string[]; colors: Color[]; sizes: string[]; tags: string[];
  desc: string; fabric: string;
  isNew?: boolean; isSig?: boolean; isLtd?: boolean;
};
export type Category = { name: string; image: string };
export type SocialLink = { label: string; url: string };

export type SiteContent = {
  hero: {
    words: string[]; tagline: string; subtitle: string;
    locationLeft: string; locationRight: string; videoUrl: string;
  };
  menuLinks: string[];
  navItems: { label: string; id: string }[];
  newArrivals: { sectionNum: string; sectionLabel: string; title: string; viewAllText: string };
  featured: {
    campaignLabel: string; campaignTitle: string; campaignCta: string;
    signatureLabel: string; signatureTitle: string; signatureCta: string;
    quote: string; quoteAuthor: string;
  };
  shopByCollection: { sectionNum: string; title: string };
  signatureSection: { sectionNum: string; title: string; description: string };
  collectionSection: { sectionNum: string; title: string; emptyMessage: string; clearFiltersText: string };
  editorial: {
    sectionNum: string; title: string; volume: string;
    lookLabel: string; lookTitle: string;
    locationTag: string; text: string; shopStoryText: string;
  };
  theHouse: {
    sectionLabel: string; title: string; paragraphs: string[];
    stat1Value: string; stat1Label: string; stat2Value: string; stat2Label: string;
  };
  newsletter: {
    label: string; title: string; description: string;
    placeholder: string; buttonText: string; successMessage: string;
  };
  contact: {
    sectionNum: string; title: string;
    careLabel: string; careEmail: string; carePhone: string;
    atelierLabel: string; atelierAddress: string; atelierNote: string;
    socialLinks: SocialLink[];
    formNameLabel: string; formEmailLabel: string; formPhoneLabel: string;
    formSubjects: string[]; formMessageLabel: string; formSubmitText: string;
    formSuccessTitle: string; formSuccessText: string; formRetryText: string;
  };
  footer: {
    tagline: string;
    shopLabel: string; shopLinks: string[];
    careLabel: string; careLinks: string[];
    legalLabel: string; legalLinks: string[]; developerCredit: string;
    copyright: string; locationsText: string;
  };
  products: Product[];
  categories: Category[];
  settings: { siteName: string; adminPassword: string };
};

/* ═══════════════ BRAND IMAGES ═══════════════ */
const IMG = {
  a: "https://i.ibb.co/3yMdnzNK/IMG-20260805-WA0036.jpg",
  b: "https://i.ibb.co/7xxrCN2S/IMG-20260805-WA0033.jpg",
  c: "https://i.ibb.co/9mBJyKfr/IMG-20260805-WA0022.jpg",
  d: "https://i.ibb.co/gbsqX5gy/IMG-20260805-WA0014.jpg",
};

/* ═══════════════ DEFAULT CONTENT ═══════════════ */
export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    words: ["WHEN", "MODESTY", "MEETS", "ELEGANCE"],
    tagline: "WHAT WE DO",
    subtitle: "Aura Lux is a premium abayas brand",
    locationLeft: "DUBAI", locationRight: "PAKISTAN",
    videoUrl: "https://files.catbox.moe/3o5lfw.mp4",
  },
  menuLinks: ["ABOUT", "COLLECTION", "NEW ARRIVALS", "BAG", "TALK"],
  navItems: [
    { label: "COLLECTION", id: "collection" },
    { label: "NEW ARRIVALS", id: "newArrivals" },
    { label: "THE HOUSE", id: "house" },
    { label: "EDITORIAL", id: "editorial" },
    { label: "CONTACT", id: "contact" },
  ],
  newArrivals: { sectionNum: "01", sectionLabel: "NEW SEASON", title: "New Arrivals", viewAllText: "VIEW ALL" },
  featured: {
    campaignLabel: "AW 2026 CAMPAIGN", campaignTitle: "The Art of Modest Couture",
    campaignCta: "EXPLORE COLLECTION", signatureLabel: "SIGNATURE",
    signatureTitle: "Sayah Evening", signatureCta: "SHOP NOW",
    quote: '"We design for the woman who carries silence as luxury."',
    quoteAuthor: "— AURA LUXE ATELIER, DUBAI",
  },
  shopByCollection: { sectionNum: "02", title: "Shop by Collection" },
  signatureSection: { sectionNum: "03", title: "Signature Abayas", description: "Each Signature piece carries hand-finished details, weighted drapes and architectural silence." },
  collectionSection: { sectionNum: "04", title: "Collection", emptyMessage: "No abayas match your filters.", clearFiltersText: "CLEAR FILTERS" },
  editorial: {
    sectionNum: "05", title: "Editorial", volume: "VOL. II — 2026",
    lookLabel: "LOOK 01", lookTitle: "Noor — In Motion",
    locationTag: "AL QUOZ, DUBAI", text: "Modesty as quiet power. No logos. Only line, fabric, presence.",
    shopStoryText: "SHOP THE STORY",
  },
  theHouse: {
    sectionLabel: "THE HOUSE", title: "A house built on silence, cut & cloth.",
    paragraphs: [
      "AURA LUXE was founded between Dubai and Lahore with a single obsession: to make the Abaya feel couture without losing its sanctity.",
      "Every piece is patterned in our atelier, draped on live forms, and tested for movement, prayer, and wind. We do not follow trends. We construct archival garments.",
    ],
    stat1Value: "80+", stat1Label: "HOURS PER PIECE", stat2Value: "35", stat2Label: "MAX EDITION SIZE",
  },
  newsletter: {
    label: "STAY CLOSE TO THE HOUSE", title: "Join the Private Circle",
    description: "First access to limited editions, atelier notes and private viewings.",
    placeholder: "EMAIL ADDRESS", buttonText: "SUBSCRIBE", successMessage: "You are now part of the house.",
  },
  contact: {
    sectionNum: "06", title: "Contact",
    careLabel: "CUSTOMER CARE", careEmail: "care@auraluxe.com", carePhone: "+971 50 123 4567",
    atelierLabel: "ATELIER", atelierAddress: "Dubai Design District, Building 7", atelierNote: "By appointment only",
    socialLinks: [
      { label: "INSTAGRAM", url: "https://www.instagram.com/aura.luxe_11/" },
      { label: "TIKTOK", url: "https://www.tiktok.com/@YOUR_USERNAME" },
    ],
    formNameLabel: "FULL NAME", formEmailLabel: "EMAIL", formPhoneLabel: "PHONE",
    formSubjects: ["ORDER INQUIRY", "SIZE ADVICE", "PRESS", "OTHER"],
    formMessageLabel: "MESSAGE", formSubmitText: "SEND MESSAGE",
    formSuccessTitle: "Message received.", formSuccessText: "We'll reply within 24 hours.", formRetryText: "SEND ANOTHER",
  },
  footer: {
    tagline: "Luxury Abaya house. Dubai — Pakistan. Crafting quiet couture since 2021.",
    shopLabel: "SHOP", shopLinks: ["Collection", "New Arrivals", "Signature", "Editorial"],
    careLabel: "CLIENT CARE", careLinks: ["Size Guide", "Shipping", "Returns", "FAQ"],
    legalLabel: "LEGAL", legalLinks: ["Privacy Policy", "Terms & Conditions"],
    developerCredit: "Designed & Developed by SYED KALEEM",
    copyright: "© 2026 AURA LUXE", locationsText: "DUBAI · PAKISTAN · WORLDWIDE SHIPPING",
  },
  products: [
    { id: "01", name: "NOOR ABAYA", price: 485, img: [IMG.a, IMG.b], colors: [{ name: "Onyx", hex: "#111" }, { name: "Stone", hex: "#C9BBA5" }], sizes: ["XS", "S", "M", "L", "XL"], tags: ["New Arrivals", "Signature", "Black", "Luxury"], desc: "Cut from lightweight Nida crepe with a fluid silhouette. Hand-finished edges and invisible seams deliver couture-level purity.", fabric: "Premium Nida Crepe · Breathable · Modesty lined", isNew: true, isSig: true },
    { id: "02", name: "LAYLA EMBROIDERED", price: 620, img: [IMG.b, IMG.c], colors: [{ name: "Noir", hex: "#0a0a0a" }, { name: "Sand", hex: "#D8CFC0" }, { name: "Sage", hex: "#9CAF88" }], sizes: ["S", "M", "L"], tags: ["New Arrivals", "Embroidered", "Occasion", "Luxury"], desc: "Intricate tonal embroidery adorns sleeves and front panel. Inspired by archways of Old Dubai, each stitch placed by hand.", fabric: "Embroidered Nida · Lined sleeves · Dry clean", isNew: true },
    { id: "03", name: "ZAHRA PURE", price: 390, img: [IMG.c, IMG.d], colors: [{ name: "Black", hex: "#000" }, { name: "Ecru", hex: "#F5F1E9" }], sizes: ["XS", "S", "M", "L", "XL"], tags: ["New Arrivals", "Everyday", "Black"], desc: "Everyday couture engineered for movement, with hidden pockets and a weightless feel.", fabric: "Light Nida · Wrinkle-resistant · Everyday wear", isNew: true },
    { id: "04", name: "SAYAH EVENING", price: 845, oldPrice: 920, img: [IMG.d, IMG.a], colors: [{ name: "Midnight", hex: "#121212" }, { name: "Burgundy", hex: "#4B1D1D" }], sizes: ["S", "M", "L"], tags: ["Occasion", "Luxury", "Signature", "Limited Edition"], desc: "Couture occasion piece with satin binding and sculpted sleeves. Limited to 80 pieces worldwide.", fabric: "Satin-trimmed crepe · Handpressed · Limited", isSig: true, isLtd: true },
    { id: "05", name: "MIRA CLOUD", price: 445, img: [IMG.a, IMG.c], colors: [{ name: "Dune", hex: "#C2B5A1" }, { name: "Black", hex: "#000" }], sizes: ["XS", "S", "M", "L"], tags: ["New Arrivals", "Everyday", "Black"], desc: "Softest drape with subtle A-line. Designed to be worn open or closed.", fabric: "Air Nida · Super soft · All day comfort", isNew: true },
    { id: "06", name: "ALYA ROYALE", price: 740, img: [IMG.b, IMG.d], colors: [{ name: "Noir", hex: "#000" }], sizes: ["S", "M", "L", "XL"], tags: ["Signature", "Luxury", "Embroidered"], desc: "Regal abaya with matte crystal detailing at the cuffs. Editorial statement, understated luxury.", fabric: "Crystal studded crepe · Couture finish", isSig: true },
    { id: "07", name: "HIBA LIGHT", price: 365, img: [IMG.c, IMG.a], colors: [{ name: "Stone White", hex: "#EDE6DA" }, { name: "Black", hex: "#000" }], sizes: ["XS", "S", "M", "L"], tags: ["Everyday", "Signature"], desc: "Minimal, clean, pure. The essential AURA abaya reinvented each season.", fabric: "Essential Nida · 360gsm · Long-lasting" },
    { id: "08", name: "ELITE NOIR", price: 1250, img: [IMG.d, IMG.b], colors: [{ name: "Obsidian", hex: "#060606" }], sizes: ["S", "M"], tags: ["Limited Edition", "Luxury", "Signature", "Black"], desc: "Architectural shoulders, liquid drape. The culmination of atelier technique. Only 35 made.", fabric: "Heavy silk crepe · Atelier handmade", isSig: true, isLtd: true },
    { id: "09", name: "AMARA DRAPE", price: 520, img: [IMG.a, IMG.d], colors: [{ name: "Charcoal", hex: "#2E2E2E" }, { name: "Ivory", hex: "#FAF5EF" }], sizes: ["S", "M", "L", "XL"], tags: ["New Arrivals", "Signature", "Luxury"], desc: "Cascading waterfall drape with structured shoulder. Effortless day-to-evening versatility.", fabric: "Double-weave Nida · Weighted hem · Luxe finish", isNew: true, isSig: true },
    { id: "10", name: "FARIDA CAPE", price: 680, img: [IMG.b, IMG.a], colors: [{ name: "Jet", hex: "#0D0D0D" }, { name: "Taupe", hex: "#B5A99A" }], sizes: ["S", "M", "L"], tags: ["Occasion", "Embroidered", "Luxury"], desc: "Dramatic cape-sleeve silhouette with concealed button front. Designed for grand occasions.", fabric: "Silk-blend crepe · Cape detail · Occasion wear" },
    { id: "11", name: "RANIA SILK", price: 950, img: [IMG.c, IMG.b], colors: [{ name: "Pearl", hex: "#D5CFC7" }, { name: "Black", hex: "#000" }], sizes: ["XS", "S", "M", "L"], tags: ["New Arrivals", "Luxury", "Signature", "Limited Edition"], desc: "Pure silk construction with hand-rolled seams. The quietest luxury in the house collection.", fabric: "100% Mulberry Silk · Hand-rolled hems · Lined", isNew: true, isSig: true, isLtd: true },
    { id: "12", name: "DANA EVERYDAY", price: 340, img: [IMG.d, IMG.c], colors: [{ name: "Black", hex: "#000" }, { name: "Oat", hex: "#E9E0D1" }, { name: "Clay", hex: "#B8977E" }], sizes: ["XS", "S", "M", "L", "XL"], tags: ["Everyday", "Black"], desc: "The foundation of a modest wardrobe. Engineered for comfort from morning until evening.", fabric: "Everyday Nida · Machine washable · Travel-friendly" },
  ],
  categories: [
    { name: "New Arrivals", image: IMG.a }, { name: "Signature", image: IMG.b },
    { name: "Everyday", image: IMG.c }, { name: "Occasion", image: IMG.d },
    { name: "Embroidered", image: IMG.b }, { name: "Luxury", image: IMG.a },
    { name: "Black", image: IMG.d }, { name: "Limited Edition", image: IMG.c },
  ],
  settings: { siteName: "AURA LUXE", adminPassword: "23231111" },
};

/* ═══════════════ STORAGE ═══════════════ */
const STORE_KEY = "aura_luxe_cms";
const AUTH_KEY = "aura_luxe_auth";

export function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Deep merge with defaults to ensure all required fields exist
      return {
        hero: { ...DEFAULT_CONTENT.hero, ...(parsed.hero || {}) },
        menuLinks: parsed.menuLinks || DEFAULT_CONTENT.menuLinks,
        navItems: parsed.navItems || DEFAULT_CONTENT.navItems,
        newArrivals: { ...DEFAULT_CONTENT.newArrivals, ...(parsed.newArrivals || {}) },
        featured: { ...DEFAULT_CONTENT.featured, ...(parsed.featured || {}) },
        shopByCollection: { ...DEFAULT_CONTENT.shopByCollection, ...(parsed.shopByCollection || {}) },
        signatureSection: { ...DEFAULT_CONTENT.signatureSection, ...(parsed.signatureSection || {}) },
        collectionSection: { ...DEFAULT_CONTENT.collectionSection, ...(parsed.collectionSection || {}) },
        editorial: { ...DEFAULT_CONTENT.editorial, ...(parsed.editorial || {}) },
        theHouse: { ...DEFAULT_CONTENT.theHouse, ...(parsed.theHouse || {}) },
        newsletter: { ...DEFAULT_CONTENT.newsletter, ...(parsed.newsletter || {}) },
        contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
        footer: { ...DEFAULT_CONTENT.footer, ...(parsed.footer || {}) },
        products: Array.isArray(parsed.products) ? parsed.products : DEFAULT_CONTENT.products,
        categories: Array.isArray(parsed.categories) ? parsed.categories : DEFAULT_CONTENT.categories,
        settings: {
          siteName: parsed.settings?.siteName || DEFAULT_CONTENT.settings.siteName,
          adminPassword: DEFAULT_CONTENT.settings.adminPassword,
        },
      };
    }
  } catch { /* ignore bad data */ }
  return DEFAULT_CONTENT;
}
export function saveContent(c: SiteContent) { localStorage.setItem(STORE_KEY, JSON.stringify(c)); }
export function isAdminAuthed(): boolean { return localStorage.getItem(AUTH_KEY) === "true"; }
export function setAdminAuth(v: boolean) { v ? localStorage.setItem(AUTH_KEY, "true") : localStorage.removeItem(AUTH_KEY); }

/* ═══════════════ CONTEXT ═══════════════ */
type Ctx = {
  content: SiteContent;
  set: <K extends keyof SiteContent>(key: K, val: SiteContent[K]) => void;
  setField: (path: string, val: unknown) => void;
  reset: () => void;
};

const ContentCtx = createContext<Ctx>({
  content: DEFAULT_CONTENT,
  set: () => {},
  setField: () => {},
  reset: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);
  useEffect(() => { saveContent(content); }, [content]);

  const set = useCallback(<K extends keyof SiteContent>(key: K, val: SiteContent[K]) => {
    setContent(prev => ({ ...prev, [key]: val }));
  }, []);

  const setField = useCallback((path: string, val: unknown) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as Record<string, unknown>;
      const keys = path.split(".");
      let obj: Record<string, unknown> = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] as Record<string, unknown>;
      obj[keys[keys.length - 1]] = val;
      return next as SiteContent;
    });
  }, []);

  const reset = useCallback(() => { setContent(DEFAULT_CONTENT); }, []);

  return <ContentCtx.Provider value={{ content, set, setField, reset }}>{children}</ContentCtx.Provider>;
}

export function useContent() { return useContext(ContentCtx); }
