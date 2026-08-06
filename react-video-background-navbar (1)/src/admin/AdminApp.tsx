import { useState, type ChangeEvent } from "react";
import { Lock, LayoutDashboard, Type, Image, ShoppingBag, Grid3x3, BookOpen, Home, Mail, MapPin, FileText, Settings, LogOut, Plus, Trash2, RotateCcw, Eye } from "lucide-react";
import { useContent, setAdminAuth, isAdminAuthed } from "../store";

/* ═══════════════ REUSABLE FORM COMPONENTS ═══════════════ */
const Field = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.15em] text-neutral-500 uppercase font-medium">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
      className="w-full border border-neutral-200 px-4 py-3 text-[13px] bg-white focus:outline-none focus:border-neutral-900 transition-colors rounded-none" />
  </div>
);

const TextArea = ({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.15em] text-neutral-500 uppercase font-medium">{label}</label>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      className="w-full border border-neutral-200 px-4 py-3 text-[13px] bg-white focus:outline-none focus:border-neutral-900 transition-colors resize-none rounded-none" />
  </div>
);

const ImageField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.15em] text-neutral-500 uppercase font-medium">{label}</label>
    <div className="flex gap-3">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="Image URL"
        className="flex-1 border border-neutral-200 px-4 py-3 text-[13px] bg-white focus:outline-none focus:border-neutral-900 transition-colors rounded-none" />
      {value && <img src={value} alt="" className="w-16 h-16 object-cover border border-neutral-100 flex-shrink-0" />}
    </div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-neutral-100 bg-white p-6 space-y-5">
    <h3 className="text-[12px] tracking-[0.15em] text-neutral-900 font-medium border-b border-neutral-100 pb-3">{title}</h3>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", disabled, small }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger"; disabled?: boolean; small?: boolean;
}) => (
  <button onClick={onClick} disabled={disabled}
    className={`${small ? "px-3 py-1.5 text-[9px]" : "px-5 py-2.5 text-[10px]"} tracking-[0.15em] font-medium transition-all duration-200 rounded-none
    ${variant === "primary" ? "bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-30" : ""}
    ${variant === "secondary" ? "border border-neutral-200 text-neutral-700 hover:bg-neutral-50" : ""}
    ${variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" : ""}`}>
    {children}
  </button>
);

/* ═══════════════ LOGIN ═══════════════ */
function Login({ onLogin }: { onLogin: () => void }) {
  const { content } = useContent();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = () => {
    if (pw === content.settings.adminPassword) { setAdminAuth(true); onLogin(); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-neutral-900 rounded-full grid place-items-center mx-auto mb-4"><Lock size={18} className="text-white" /></div>
          <h1 className="text-[22px] font-light tracking-tight text-neutral-900">Admin Panel</h1>
          <p className="text-[11px] text-neutral-400 mt-2 tracking-wide">AURA LUXE CMS</p>
        </div>
        <div className="bg-white border border-neutral-100 p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.15em] text-neutral-500 uppercase mb-2 font-medium">PASSWORD</label>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} autoFocus
                className={`w-full border px-4 py-3 text-[13px] bg-white focus:outline-none transition-colors rounded-none ${err ? "border-red-400" : "border-neutral-200 focus:border-neutral-900"}`} />
            </div>
            {err && <p className="text-[11px] text-red-500">Incorrect password. Please try again.</p>}
            <button onClick={submit} className="w-full bg-neutral-900 text-white py-3.5 text-[10px] tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors rounded-none">LOGIN</button>
          </div>
        </div>
        <p className="text-center text-[9px] text-neutral-300 mt-6 tracking-wide">Protected area. Unauthorized access prohibited.</p>
      </div>
    </div>
  );
}

/* ═══════════════ SECTION EDITORS ═══════════════ */
function HeroEditor() {
  const { content, setField } = useContent();
  const h = content.hero;
  return (
    <div className="space-y-6">
      <Section title="Hero Headline">
        <p className="text-[11px] text-neutral-400 mb-3">Display words (one per line shown as separate lines)</p>
        <TextArea label="Words (one per line)" value={h.words.join("\n")} onChange={v => setField("hero.words", v.split("\n").filter(Boolean))} rows={4} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tagline" value={h.tagline} onChange={v => setField("hero.tagline", v)} />
          <Field label="Subtitle" value={h.subtitle} onChange={v => setField("hero.subtitle", v)} />
        </div>
      </Section>
      <Section title="Locations">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Left Location" value={h.locationLeft} onChange={v => setField("hero.locationLeft", v)} />
          <Field label="Right Location" value={h.locationRight} onChange={v => setField("hero.locationRight", v)} />
        </div>
      </Section>
      <Section title="Hero Images & Video">
        <Field label="Video URL" value={h.videoUrl} onChange={v => setField("hero.videoUrl", v)} placeholder="https://..." />
        <p className="text-[10px] text-neutral-400 mt-2">Note: Main display images use the 4 brand photos from the Products section.</p>
      </Section>
    </div>
  );
}

function NavEditor() {
  const { content, set } = useContent();
  return (
    <div className="space-y-6">
      <Section title="Mobile Menu Links">
        {content.menuLinks.map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={link} onChange={e => { const nl = [...content.menuLinks]; nl[i] = e.target.value; set("menuLinks", nl); }}
              className="flex-1 border border-neutral-200 px-4 py-2.5 text-[12px] focus:outline-none focus:border-neutral-900 rounded-none" />
            <button onClick={() => set("menuLinks", content.menuLinks.filter((_, j) => j !== i))} className="w-8 h-8 grid place-items-center text-neutral-300 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => set("menuLinks", [...content.menuLinks, "NEW LINK"])} className="flex items-center gap-2 text-[10px] tracking-[0.15em] text-neutral-400 hover:text-neutral-900 transition-colors"><Plus size={12} /> ADD LINK</button>
      </Section>
      <Section title="Sticky Navigation">
        {content.navItems.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={item.label} onChange={e => { const n = [...content.navItems]; n[i] = { ...n[i], label: e.target.value }; set("navItems", n); }} placeholder="Label"
              className="flex-1 border border-neutral-200 px-4 py-2.5 text-[12px] focus:outline-none focus:border-neutral-900 rounded-none" />
            <input value={item.id} onChange={e => { const n = [...content.navItems]; n[i] = { ...n[i], id: e.target.value }; set("navItems", n); }} placeholder="Section ID"
              className="w-32 border border-neutral-200 px-4 py-2.5 text-[12px] focus:outline-none focus:border-neutral-900 rounded-none" />
            <button onClick={() => set("navItems", content.navItems.filter((_, j) => j !== i))} className="w-8 h-8 grid place-items-center text-neutral-300 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => set("navItems", [...content.navItems, { label: "NEW", id: "section" }])} className="flex items-center gap-2 text-[10px] tracking-[0.15em] text-neutral-400 hover:text-neutral-900 transition-colors"><Plus size={12} /> ADD NAV ITEM</button>
      </Section>
    </div>
  );
}

function NewArrivalsEditor() {
  const { content, setField } = useContent();
  const n = content.newArrivals;
  return (
    <Section title="New Arrivals Section">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Section Number" value={n.sectionNum} onChange={v => setField("newArrivals.sectionNum", v)} />
        <Field label="Section Label" value={n.sectionLabel} onChange={v => setField("newArrivals.sectionLabel", v)} />
        <Field label="Title" value={n.title} onChange={v => setField("newArrivals.title", v)} />
        <Field label="View All Text" value={n.viewAllText} onChange={v => setField("newArrivals.viewAllText", v)} />
      </div>
    </Section>
  );
}

function FeaturedEditor() {
  const { content, setField } = useContent();
  const f = content.featured;
  return (
    <div className="space-y-6">
      <Section title="Campaign">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Campaign Label" value={f.campaignLabel} onChange={v => setField("featured.campaignLabel", v)} />
          <Field label="Campaign Title" value={f.campaignTitle} onChange={v => setField("featured.campaignTitle", v)} />
        </div>
        <Field label="CTA Text" value={f.campaignCta} onChange={v => setField("featured.campaignCta", v)} />
      </Section>
      <Section title="Featured Signature">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Signature Label" value={f.signatureLabel} onChange={v => setField("featured.signatureLabel", v)} />
          <Field label="Signature Title" value={f.signatureTitle} onChange={v => setField("featured.signatureTitle", v)} />
        </div>
        <Field label="Signature CTA" value={f.signatureCta} onChange={v => setField("featured.signatureCta", v)} />
      </Section>
      <Section title="House Quote">
        <TextArea label="Quote" value={f.quote} onChange={v => setField("featured.quote", v)} rows={2} />
        <Field label="Author" value={f.quoteAuthor} onChange={v => setField("featured.quoteAuthor", v)} />
      </Section>
    </div>
  );
}

function SectionsEditor() {
  const { content, setField } = useContent();
  return (
    <div className="space-y-6">
      <Section title="Shop by Collection">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Number" value={content.shopByCollection.sectionNum} onChange={v => setField("shopByCollection.sectionNum", v)} />
          <Field label="Title" value={content.shopByCollection.title} onChange={v => setField("shopByCollection.title", v)} />
        </div>
      </Section>
      <Section title="Signature Abayas">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Number" value={content.signatureSection.sectionNum} onChange={v => setField("signatureSection.sectionNum", v)} />
          <Field label="Title" value={content.signatureSection.title} onChange={v => setField("signatureSection.title", v)} />
        </div>
        <TextArea label="Description" value={content.signatureSection.description} onChange={v => setField("signatureSection.description", v)} />
      </Section>
      <Section title="Collection">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Number" value={content.collectionSection.sectionNum} onChange={v => setField("collectionSection.sectionNum", v)} />
          <Field label="Title" value={content.collectionSection.title} onChange={v => setField("collectionSection.title", v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Empty Message" value={content.collectionSection.emptyMessage} onChange={v => setField("collectionSection.emptyMessage", v)} />
          <Field label="Clear Filters Text" value={content.collectionSection.clearFiltersText} onChange={v => setField("collectionSection.clearFiltersText", v)} />
        </div>
      </Section>
    </div>
  );
}

function EditorialEditor() {
  const { content, setField } = useContent();
  const e = content.editorial;
  return (
    <div className="space-y-6">
      <Section title="Editorial Section">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Number" value={e.sectionNum} onChange={v => setField("editorial.sectionNum", v)} />
          <Field label="Title" value={e.title} onChange={v => setField("editorial.title", v)} />
          <Field label="Volume" value={e.volume} onChange={v => setField("editorial.volume", v)} />
          <Field label="Location Tag" value={e.locationTag} onChange={v => setField("editorial.locationTag", v)} />
        </div>
      </Section>
      <Section title="Look Details">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Look Label" value={e.lookLabel} onChange={v => setField("editorial.lookLabel", v)} />
          <Field label="Look Title" value={e.lookTitle} onChange={v => setField("editorial.lookTitle", v)} />
        </div>
        <TextArea label="Editorial Text" value={e.text} onChange={v => setField("editorial.text", v)} rows={2} />
        <Field label="Shop Story Text" value={e.shopStoryText} onChange={v => setField("editorial.shopStoryText", v)} />
      </Section>
    </div>
  );
}

function HouseEditor() {
  const { content, setField } = useContent();
  const h = content.theHouse;
  return (
    <div className="space-y-6">
      <Section title="The House">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Label" value={h.sectionLabel} onChange={v => setField("theHouse.sectionLabel", v)} />
          <Field label="Title" value={h.title} onChange={v => setField("theHouse.title", v)} />
        </div>
        <TextArea label="Paragraph 1" value={h.paragraphs[0] || ""} onChange={v => { const p = [...h.paragraphs]; p[0] = v; setField("theHouse.paragraphs", p); }} rows={3} />
        <TextArea label="Paragraph 2" value={h.paragraphs[1] || ""} onChange={v => { const p = [...h.paragraphs]; p[1] = v; setField("theHouse.paragraphs", p); }} rows={3} />
      </Section>
      <Section title="Stats">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Stat 1 Value" value={h.stat1Value} onChange={v => setField("theHouse.stat1Value", v)} />
          <Field label="Stat 1 Label" value={h.stat1Label} onChange={v => setField("theHouse.stat1Label", v)} />
          <Field label="Stat 2 Value" value={h.stat2Value} onChange={v => setField("theHouse.stat2Value", v)} />
          <Field label="Stat 2 Label" value={h.stat2Label} onChange={v => setField("theHouse.stat2Label", v)} />
        </div>
      </Section>
    </div>
  );
}

function NewsletterEditor() {
  const { content, setField } = useContent();
  const n = content.newsletter;
  return (
    <Section title="Newsletter">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Label" value={n.label} onChange={v => setField("newsletter.label", v)} />
        <Field label="Title" value={n.title} onChange={v => setField("newsletter.title", v)} />
        <Field label="Placeholder" value={n.placeholder} onChange={v => setField("newsletter.placeholder", v)} />
        <Field label="Button Text" value={n.buttonText} onChange={v => setField("newsletter.buttonText", v)} />
      </div>
      <TextArea label="Description" value={n.description} onChange={v => setField("newsletter.description", v)} rows={2} />
      <Field label="Success Message" value={n.successMessage} onChange={v => setField("newsletter.successMessage", v)} />
    </Section>
  );
}

function ContactEditor() {
  const { content, setField } = useContent();
  const c = content.contact;
  return (
    <div className="space-y-6">
      <Section title="Contact Header">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Section Number" value={c.sectionNum} onChange={v => setField("contact.sectionNum", v)} />
          <Field label="Title" value={c.title} onChange={v => setField("contact.title", v)} />
        </div>
      </Section>
      <Section title="Customer Care">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Label" value={c.careLabel} onChange={v => setField("contact.careLabel", v)} />
          <Field label="Email" value={c.careEmail} onChange={v => setField("contact.careEmail", v)} />
          <Field label="Phone" value={c.carePhone} onChange={v => setField("contact.carePhone", v)} />
        </div>
      </Section>
      <Section title="Atelier">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Label" value={c.atelierLabel} onChange={v => setField("contact.atelierLabel", v)} />
          <Field label="Address" value={c.atelierAddress} onChange={v => setField("contact.atelierAddress", v)} />
        </div>
        <Field label="Note" value={c.atelierNote} onChange={v => setField("contact.atelierNote", v)} />
      </Section>
      <Section title="Social Links">
        {c.socialLinks.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={s.label} onChange={e => { const n = [...c.socialLinks]; n[i] = { ...n[i], label: e.target.value }; setField("contact.socialLinks", n); }} placeholder="Label"
              className="flex-1 border border-neutral-200 px-4 py-2.5 text-[12px] focus:outline-none focus:border-neutral-900 rounded-none" />
            <input value={s.url} onChange={e => { const n = [...c.socialLinks]; n[i] = { ...n[i], url: e.target.value }; setField("contact.socialLinks", n); }} placeholder="URL"
              className="flex-1 border border-neutral-200 px-4 py-2.5 text-[12px] focus:outline-none focus:border-neutral-900 rounded-none" />
            <button onClick={() => setField("contact.socialLinks", c.socialLinks.filter((_, j) => j !== i))} className="w-8 h-8 grid place-items-center text-neutral-300 hover:text-red-500"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => setField("contact.socialLinks", [...c.socialLinks, { label: "NEW", url: "#" }])} className="flex items-center gap-2 text-[10px] tracking-[0.15em] text-neutral-400 hover:text-neutral-900"><Plus size={12} /> ADD LINK</button>
      </Section>
      <Section title="Form Labels">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Name Label" value={c.formNameLabel} onChange={v => setField("contact.formNameLabel", v)} />
          <Field label="Email Label" value={c.formEmailLabel} onChange={v => setField("contact.formEmailLabel", v)} />
          <Field label="Phone Label" value={c.formPhoneLabel} onChange={v => setField("contact.formPhoneLabel", v)} />
          <Field label="Message Label" value={c.formMessageLabel} onChange={v => setField("contact.formMessageLabel", v)} />
          <Field label="Submit Text" value={c.formSubmitText} onChange={v => setField("contact.formSubmitText", v)} />
        </div>
        <TextArea label="Subject Options (one per line)" value={c.formSubjects.join("\n")} onChange={v => setField("contact.formSubjects", v.split("\n").filter(Boolean))} rows={3} />
      </Section>
      <Section title="Form Success">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Success Title" value={c.formSuccessTitle} onChange={v => setField("contact.formSuccessTitle", v)} />
          <Field label="Success Text" value={c.formSuccessText} onChange={v => setField("contact.formSuccessText", v)} />
          <Field label="Retry Text" value={c.formRetryText} onChange={v => setField("contact.formRetryText", v)} />
        </div>
      </Section>
    </div>
  );
}

function FooterEditor() {
  const { content, setField } = useContent();
  const f = content.footer;
  return (
    <div className="space-y-6">
      <Section title="Footer Info">
        <TextArea label="Tagline" value={f.tagline} onChange={v => setField("footer.tagline", v)} rows={2} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Copyright" value={f.copyright} onChange={v => setField("footer.copyright", v)} />
          <Field label="Locations Text" value={f.locationsText} onChange={v => setField("footer.locationsText", v)} />
        </div>
      </Section>
      <Section title="Shop Links">
        <TextArea label="Links (one per line)" value={f.shopLinks.join("\n")} onChange={v => setField("footer.shopLinks", v.split("\n").filter(Boolean))} rows={4} />
      </Section>
      <Section title="Client Care Links">
        <TextArea label="Links (one per line)" value={f.careLinks.join("\n")} onChange={v => setField("footer.careLinks", v.split("\n").filter(Boolean))} rows={4} />
      </Section>
      <Section title="Legal Links">
        <TextArea label="Links (one per line)" value={f.legalLinks.join("\n")} onChange={v => setField("footer.legalLinks", v.split("\n").filter(Boolean))} rows={3} />
        <Field label="Developer Credit" value={f.developerCredit} onChange={v => setField("footer.developerCredit", v)} />
      </Section>
    </div>
  );
}

function CategoriesEditor() {
  const { content, set } = useContent();
  return (
    <div className="space-y-6">
      <Section title="Collection Categories">
        <p className="text-[11px] text-neutral-400">These categories appear in "Shop by Collection" and as filter options.</p>
        {content.categories.map((cat, i) => (
          <div key={i} className="flex gap-3 items-start border-b border-neutral-50 pb-4">
            <img src={cat.image} alt="" className="w-14 h-14 object-cover border border-neutral-100 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <input value={cat.name} onChange={e => { const n = [...content.categories]; n[i] = { ...n[i], name: e.target.value }; set("categories", n); }}
                className="w-full border border-neutral-200 px-3 py-2 text-[12px] focus:outline-none focus:border-neutral-900 rounded-none" placeholder="Category name" />
              <input value={cat.image} onChange={e => { const n = [...content.categories]; n[i] = { ...n[i], image: e.target.value }; set("categories", n); }}
                className="w-full border border-neutral-200 px-3 py-2 text-[11px] focus:outline-none focus:border-neutral-900 rounded-none" placeholder="Image URL" />
            </div>
            <button onClick={() => set("categories", content.categories.filter((_, j) => j !== i))} className="w-8 h-8 grid place-items-center text-neutral-300 hover:text-red-500 mt-1"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => set("categories", [...content.categories, { name: "New Category", image: "" }])} className="flex items-center gap-2 text-[10px] tracking-[0.15em] text-neutral-400 hover:text-neutral-900"><Plus size={12} /> ADD CATEGORY</button>
      </Section>
    </div>
  );
}

function ProductsEditor() {
  const { content, set } = useContent();
  const [expanded, setExpanded] = useState<string | null>(null);
  const products = content.products;

  const update = (id: string, field: string, val: unknown) => {
    set("products", products.map(p => p.id === id ? { ...p, [field]: val } : p));
  };
  const addProduct = () => {
    const newId = String(products.length + 1).padStart(2, "0");
    set("products", [...products, {
      id: newId, name: "NEW ABAYA", price: 0, img: ["", "", ""],
      colors: [{ name: "Black", hex: "#000" }], sizes: ["S", "M", "L"],
      tags: ["New Arrivals"], desc: "", fabric: "", isNew: true,
    }]);
    setExpanded(newId);
  };
  const removeProduct = (id: string) => {
    set("products", products.filter(p => p.id !== id));
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-neutral-500">{products.length} products</p>
        <Btn onClick={addProduct}><Plus size={12} className="inline mr-1" /> ADD PRODUCT</Btn>
      </div>
      {products.map(p => (
        <div key={p.id} className="border border-neutral-100 bg-white">
          <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-neutral-50 transition-colors">
            <img src={p.img[0] || ""} alt="" className="w-12 h-16 object-cover bg-neutral-100 border border-neutral-100 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium tracking-wide truncate">{p.name}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">${p.price} · {p.tags[0] || "Uncategorized"}</p>
            </div>
            <div className="flex gap-1.5">
              {p.isNew && <span className="text-[8px] bg-neutral-100 px-2 py-0.5 tracking-wider">NEW</span>}
              {p.isSig && <span className="text-[8px] bg-neutral-900 text-white px-2 py-0.5 tracking-wider">SIG</span>}
              {p.isLtd && <span className="text-[8px] bg-amber-100 text-amber-800 px-2 py-0.5 tracking-wider">LTD</span>}
            </div>
            <Chevron expanded={expanded === p.id} />
          </button>
          {expanded === p.id && (
            <div className="p-5 border-t border-neutral-100 space-y-5 bg-neutral-50/50">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" value={p.name} onChange={v => update(p.id, "name", v)} />
                <Field label="Price ($)" value={String(p.price)} onChange={v => update(p.id, "price", Number(v) || 0)} type="number" />
                <Field label="Old Price ($)" value={p.oldPrice ? String(p.oldPrice) : ""} onChange={v => update(p.id, "oldPrice", v ? Number(v) : undefined)} type="number" />
                <Field label="Tags (comma separated)" value={p.tags.join(", ")} onChange={v => update(p.id, "tags", v.split(",").map(s => s.trim()).filter(Boolean))} />
              </div>
              <TextArea label="Description" value={p.desc} onChange={v => update(p.id, "desc", v)} rows={2} />
              <TextArea label="Fabric" value={p.fabric} onChange={v => update(p.id, "fabric", v)} rows={1} />
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase font-medium">Images (3 URLs)</p>
                {p.img.map((url, i) => (
                  <ImageField key={i} label={`Image ${i + 1}`} value={url} onChange={v => { const imgs = [...p.img]; imgs[i] = v; update(p.id, "img", imgs); }} />
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase font-medium">Colors</p>
                {p.colors.map((c, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="color" value={c.hex} onChange={e => { const cols = [...p.colors]; cols[i] = { ...cols[i], hex: e.target.value }; update(p.id, "colors", cols); }}
                      className="w-10 h-10 border border-neutral-200 cursor-pointer p-0.5" />
                    <input value={c.name} onChange={e => { const cols = [...p.colors]; cols[i] = { ...cols[i], name: e.target.value }; update(p.id, "colors", cols); }}
                      className="flex-1 border border-neutral-200 px-3 py-2 text-[12px] focus:outline-none focus:border-neutral-900 rounded-none" placeholder="Color name" />
                    <button onClick={() => update(p.id, "colors", p.colors.filter((_, j) => j !== i))} className="w-8 h-8 grid place-items-center text-neutral-300 hover:text-red-500"><Trash2 size={11} /></button>
                  </div>
                ))}
                <button onClick={() => update(p.id, "colors", [...p.colors, { name: "New", hex: "#000000" }])} className="flex items-center gap-2 text-[9px] text-neutral-400 hover:text-neutral-900"><Plus size={10} /> ADD COLOR</button>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase font-medium">Sizes</p>
                <Field label="Sizes (comma separated)" value={p.sizes.join(", ")} onChange={v => update(p.id, "sizes", v.split(",").map(s => s.trim()).filter(Boolean))} />
              </div>
              <div className="flex gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-[10px] tracking-wider cursor-pointer">
                  <input type="checkbox" checked={!!p.isNew} onChange={e => update(p.id, "isNew", e.target.checked)} className="accent-neutral-900" /> NEW
                </label>
                <label className="flex items-center gap-2 text-[10px] tracking-wider cursor-pointer">
                  <input type="checkbox" checked={!!p.isSig} onChange={e => update(p.id, "isSig", e.target.checked)} className="accent-neutral-900" /> SIGNATURE
                </label>
                <label className="flex items-center gap-2 text-[10px] tracking-wider cursor-pointer">
                  <input type="checkbox" checked={!!p.isLtd} onChange={e => update(p.id, "isLtd", e.target.checked)} className="accent-neutral-900" /> LIMITED
                </label>
              </div>
              <div className="pt-3 border-t border-neutral-100">
                <Btn variant="danger" small onClick={() => removeProduct(p.id)}><Trash2 size={10} className="inline mr-1" /> DELETE PRODUCT</Btn>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className={`text-neutral-300 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
      <path d="M2 4L6 8L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsEditor() {
  const { content, setField, reset } = useContent();
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "aura-luxe-content.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        setField("settings", data.settings || content.settings);
        if (data.products) setField("products", data.products);
        if (data.categories) setField("categories", data.categories);
        setSaved(true); setTimeout(() => setSaved(false), 2000);
      } catch { alert("Invalid JSON file"); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Section title="Site Settings">
        <Field label="Site Name" value={content.settings.siteName} onChange={v => setField("settings.siteName", v)} />
      </Section>
      <Section title="Data Management">
        <div className="flex flex-wrap gap-3">
          <Btn onClick={exportData}><FileText size={10} className="inline mr-1.5" /> EXPORT JSON</Btn>
          <label className="px-5 py-2.5 text-[10px] tracking-[0.15em] font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer rounded-none">
            <input type="file" accept=".json" onChange={importData} className="hidden" /> IMPORT JSON
          </label>
          {saved && <span className="text-[10px] text-green-600 self-center tracking-wider">Imported!</span>}
        </div>
      </Section>
      <Section title="Reset Content">
        <p className="text-[11px] text-neutral-400 mb-3">This will reset all content to defaults. This cannot be undone.</p>
        {!confirmReset ? (
          <Btn variant="danger" onClick={() => setConfirmReset(true)}><RotateCcw size={10} className="inline mr-1.5" /> RESET ALL</Btn>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-red-500">Are you sure?</span>
            <Btn variant="danger" onClick={() => { reset(); setConfirmReset(false); }}>YES, RESET</Btn>
            <Btn variant="secondary" onClick={() => setConfirmReset(false)}>CANCEL</Btn>
          </div>
        )}
      </Section>
    </div>
  );
}

/* ═══════════════ MEDIA LIBRARY ═══════════════ */
function MediaLibrary() {
  const { content } = useContent();
  const allImages = new Set<string>();
  content.products.forEach(p => p.img.forEach(url => { if (url) allImages.add(url); }));
  content.categories.forEach(c => { if (c.image) allImages.add(c.image); });

  const [selected, setSelected] = useState<string | null>(null);
  const imgs = Array.from(allImages);

  return (
    <div className="space-y-6">
      <Section title={`Media Library — ${imgs.length} images`}>
        <p className="text-[11px] text-neutral-400 mb-4">All images currently used across the website. Edit image URLs in the respective section editors.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {imgs.map((url, i) => (
            <button key={i} onClick={() => setSelected(selected === url ? null : url)}
              className={`aspect-[3/4] overflow-hidden border-2 transition-all ${selected === url ? "border-neutral-900" : "border-transparent hover:border-neutral-200"}`}>
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        {selected && (
          <div className="mt-4 p-4 bg-neutral-50 border border-neutral-100">
            <p className="text-[10px] text-neutral-400 mb-2 tracking-wider break-all">{selected}</p>
            <img src={selected} alt="" className="max-h-48 object-contain" />
          </div>
        )}
      </Section>
    </div>
  );
}

/* ═══════════════ ADMIN APP ═══════════════ */
type Tab = "hero" | "nav" | "newArrivals" | "featured" | "sections" | "editorial" | "house" | "newsletter" | "contact" | "footer" | "products" | "categories" | "media" | "settings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "hero", label: "Hero", icon: <Type size={14} /> },
  { id: "nav", label: "Navigation", icon: <LayoutDashboard size={14} /> },
  { id: "newArrivals", label: "New Arrivals", icon: <Plus size={14} /> },
  { id: "featured", label: "Featured", icon: <Eye size={14} /> },
  { id: "sections", label: "Sections", icon: <Grid3x3 size={14} /> },
  { id: "editorial", label: "Editorial", icon: <BookOpen size={14} /> },
  { id: "house", label: "The House", icon: <Home size={14} /> },
  { id: "newsletter", label: "Newsletter", icon: <Mail size={14} /> },
  { id: "contact", label: "Contact", icon: <MapPin size={14} /> },
  { id: "footer", label: "Footer", icon: <FileText size={14} /> },
  { id: "products", label: "Products", icon: <ShoppingBag size={14} /> },
  { id: "categories", label: "Categories", icon: <Grid3x3 size={14} /> },
  { id: "media", label: "Media", icon: <Image size={14} /> },
  { id: "settings", label: "Settings", icon: <Settings size={14} /> },
];

const EDITORS: Record<Tab, React.FC> = {
  hero: HeroEditor, nav: NavEditor, newArrivals: NewArrivalsEditor, featured: FeaturedEditor,
  sections: SectionsEditor, editorial: EditorialEditor, house: HouseEditor,
  newsletter: NewsletterEditor, contact: ContactEditor, footer: FooterEditor,
  products: ProductsEditor, categories: CategoriesEditor, media: MediaLibrary, settings: SettingsEditor,
};

export default function AdminApp() {
  const [authed, setAuthed] = useState(isAdminAuthed());
  const [tab, setTab] = useState<Tab>("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const Editor = EDITORS[tab];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-neutral-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-[10px] tracking-[0.2em] text-white/40 mb-1">AURA LUXE</p>
          <p className="text-[14px] font-light tracking-wide">Admin CMS</p>
        </div>
        <nav className="flex-1 overflow-auto py-3">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-[11px] tracking-[0.1em] transition-colors ${tab === t.id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="#" className="flex items-center gap-2 text-[10px] text-white/30 hover:text-white/60 transition-colors mb-3">
            <Eye size={12} /> VIEW SITE
          </a>
          <button onClick={() => { setAdminAuth(false); setAuthed(false); }}
            className="flex items-center gap-2 text-[10px] text-white/30 hover:text-red-400 transition-colors">
            <LogOut size={12} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-56">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-100 h-14 flex items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 grid place-items-center hover:bg-neutral-50 rounded">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <h2 className="text-[13px] font-medium tracking-wide">{TABS.find(t => t.id === tab)?.label}</h2>
          </div>
          <a href="#" className="text-[9px] tracking-[0.15em] text-neutral-400 hover:text-neutral-900 transition-colors hidden sm:block">VIEW WEBSITE →</a>
        </header>

        {/* Editor content */}
        <main className="p-5 lg:p-8 max-w-4xl">
          <Editor />
        </main>
      </div>
    </div>
  );
}
