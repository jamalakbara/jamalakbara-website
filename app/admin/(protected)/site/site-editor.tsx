"use client";

// Canvas 29 "Site copy": folder tabs per page, grouped fields on the left,
// "Where this shows" + SEO checklist on the right. One save = one commit
// covering every changed file (pages / about / site-config / navigation).

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Plus, Trash2 } from "lucide-react";
import type { AboutContent, SiteConfig } from "@/lib/content-types";
import type { NavLink, PagesContent } from "@/lib/content/schemas";
import type { SingletonKey } from "@/lib/admin/singletons";
import { MediaField } from "@/components/admin/media-field";
import { CountrySelect } from "@/components/admin/country-select";
import { useToast } from "@/components/admin/toast";
import { useUnsaved } from "@/components/admin/unsaved";
import { Field, PageHeader, SeoPanel, useSaveShortcut } from "@/components/admin/ui";
import { seoReport } from "@/lib/admin/seo-checklist";
import { waNumber } from "@/lib/country-codes";
import { saveSiteCopy } from "./actions";
import { SITE_TABS, type SiteTab } from "./site-tabs";

const AVAILABILITY_OPTIONS = ["Open for new work", "Booked — limited slots", "Currently unavailable"] as const;

// Fallback SEO copy the route layouts ship with (shown when a field is blank).
const SEO_FALLBACK: Record<"home" | "work" | "about" | "contact" | "journal", string> = {
  home: "Jamal Akbar Alam — Developer & Designer",
  work: "Work",
  about: "About",
  contact: "Contact",
  journal: "Journal",
};

interface Props {
  pages: PagesContent;
  about: AboutContent;
  siteConfig: SiteConfig;
  navigation: NavLink[];
  initialTab: SiteTab;
}

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="a-stack" style={{ gap: 20 }}>
      <div style={{ paddingBottom: 12, borderBottom: "1px solid var(--f-line)" }}>
        <h2 className="a-title">{title}</h2>
        {note && <p className="a-meta a-muted">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function ListEditor<T>({
  items,
  onChange,
  blank,
  addLabel,
  render,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  blank: T;
  addLabel: string;
  render: (item: T, set: (v: T) => void, i: number) => ReactNode;
}) {
  return (
    <div className="a-stack" style={{ gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", gap: 8 }}>
            {render(item, (v) => onChange(items.map((x, j) => (j === i ? v : x))), i)}
          </div>
          <button type="button" className="a-iconbtn a-iconbtn--danger" style={{ marginTop: 8 }} aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" className="a-link a-small" style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }} onClick={() => onChange([...items, blank])}>
        <Plus size={14} />
        {addLabel}
      </button>
    </div>
  );
}

export function SiteEditor(props: Props) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [base, setBase] = useState({ pages: props.pages, about: props.about, siteConfig: props.siteConfig, navigation: props.navigation });
  const [pages, setPages] = useState(props.pages);
  const [about, setAbout] = useState(props.about);
  const [siteConfig, setSiteConfig] = useState(props.siteConfig);
  const [navigation, setNavigation] = useState(props.navigation);
  const [tab, setTab] = useState<SiteTab>(props.initialTab);
  const [error, setError] = useState<string | null>(null);

  const changed = useMemo(() => {
    const list: Array<[SingletonKey, unknown]> = [];
    if (JSON.stringify(pages) !== JSON.stringify(base.pages)) list.push(["pages", pages]);
    if (JSON.stringify(about) !== JSON.stringify(base.about)) list.push(["about", about]);
    if (JSON.stringify(siteConfig) !== JSON.stringify(base.siteConfig)) list.push(["site-config", siteConfig]);
    if (JSON.stringify(navigation) !== JSON.stringify(base.navigation)) list.push(["navigation", navigation]);
    return list;
  }, [pages, about, siteConfig, navigation, base]);
  const dirty = changed.length > 0;
  useUnsaved(dirty);

  function save() {
    if (!dirty || pending) return;
    setError(null);
    const label = changed.map(([k]) => k).join(", ");
    startTransition(async () => {
      const result = await saveSiteCopy(changed, label);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setBase({ pages, about, siteConfig, navigation });
      toast.saved(result, `Site copy: ${label}`);
      router.refresh();
    });
  }
  useSaveShortcut(save, dirty);

  const setPage = <K extends keyof PagesContent>(key: K, patch: Partial<PagesContent[K]>) =>
    setPages((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
  const setContact = (patch: Partial<SiteConfig["contact"]>) => setSiteConfig((d) => ({ ...d, contact: { ...d.contact, ...patch } }));

  const current = SITE_TABS.find((t) => t.key === tab)!;
  const pageKey = tab === "navigation" ? null : tab;
  const seo = pageKey ? pages[pageKey].seo : undefined;
  const report = pageKey
    ? seoReport({
        path: current.path,
        title: seo?.title?.trim() || SEO_FALLBACK[pageKey],
        description: seo?.description ?? "",
        appendBrand: pageKey !== "home",
      })
    : null;

  const seoGroup = pageKey && (
    <Group
      title="SEO"
      note={
        pageKey === "home"
          ? "Title and description Google shows for the homepage. Home title is the full title — no “| Jamal Akbar Alam” suffix."
          : `Shows as “${seo?.title || SEO_FALLBACK[pageKey]} | Jamal Akbar Alam” in search and tabs. Blank uses the shipped default.`
      }
    >
      <Field label="SEO title" count={(seo?.title ?? "").length} max={pageKey === "home" ? 60 : 40}>
        <input
          className="a-input"
          placeholder={SEO_FALLBACK[pageKey]}
          value={seo?.title ?? ""}
          onChange={(e) => setPage(pageKey, { seo: { title: e.target.value, description: seo?.description ?? "" } })}
        />
      </Field>
      <Field label="SEO description" count={(seo?.description ?? "").length} max={160} min={120}>
        <textarea
          className="a-input"
          rows={3}
          value={seo?.description ?? ""}
          onChange={(e) => setPage(pageKey, { seo: { title: seo?.title ?? "", description: e.target.value } })}
        />
      </Field>
    </Group>
  );

  const eyebrowHeading = (key: "work" | "about" | "contact" | "journal") => (
    <div className="a-row2">
      <Field label="Eyebrow" help="Small label on the folder tab.">
        <input className="a-input" value={pages[key].eyebrow} onChange={(e) => setPage(key, { eyebrow: e.target.value })} />
      </Field>
      <Field label="Heading" count={pages[key].heading.length}>
        <input className="a-input" value={pages[key].heading} onChange={(e) => setPage(key, { heading: e.target.value })} />
      </Field>
    </div>
  );

  return (
    <>
      <PageHeader
        eyebrow="Settings / Site copy"
        index="05"
        title="Site copy"
        subtitle={dirty ? `Unsaved: ${changed.map(([k]) => k).join(", ")} · one save = one commit` : "Words and SEO for every public page. One save = one commit."}
        actions={
          <>
            <a className="a-btn a-btn--secondary" href={current.path} target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} />
              Open {current.key === "home" || current.key === "navigation" ? "home" : current.path}
            </a>
            <button type="button" className="a-btn a-btn--primary" onClick={save} disabled={!dirty || pending}>
              <Check size={16} />
              {pending ? "Saving…" : "Save & publish"}
            </button>
          </>
        }
      />
      {error && <p className="a-banner">Save failed — {error}</p>}

      <div>
        <div className="a-tabs" role="tablist" aria-label="Page">
          {SITE_TABS.map((t, i) => (
            <button key={t.key} type="button" role="tab" className="a-tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}>
              <span className="a-eyebrow">{t.label}</span>
              <span className="a-meta">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="a-tabpanel" role="tabpanel">
          <div className="a-grid a-grid--rail" style={{ padding: 24, gap: 24 }}>
            <div className="a-stack" style={{ gap: 32 }}>
              {tab === "home" && (
                <>
                  <Group title="Hero" note="The first panel on / — name, stamp and opening line.">
                    <Field label="Headline" count={pages.home.headline.length}>
                      <input className="a-input" value={pages.home.headline} onChange={(e) => setPage("home", { headline: e.target.value })} />
                    </Field>
                    <Field label="Intro" count={pages.home.intro.length}>
                      <textarea className="a-input" rows={3} value={pages.home.intro} onChange={(e) => setPage("home", { intro: e.target.value })} />
                    </Field>
                    <div className="a-row2">
                      <Field label="Role line" count={siteConfig.brand.tagline.length} max={60}>
                        <input className="a-input" value={siteConfig.brand.tagline} onChange={(e) => setSiteConfig((d) => ({ ...d, brand: { ...d.brand, tagline: e.target.value } }))} />
                      </Field>
                      <Field label="Location">
                        <input className="a-input" value={siteConfig.contact.location} onChange={(e) => setContact({ location: e.target.value })} />
                      </Field>
                    </div>
                    <Field label="Availability">
                      <select className="a-input" value={pages.home.availability} onChange={(e) => setPage("home", { availability: e.target.value })}>
                        {[...new Set([pages.home.availability, ...AVAILABILITY_OPTIONS])].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                  </Group>
                  {seoGroup}
                </>
              )}

              {tab === "work" && (
                <>
                  <Group title="Index" note="Title panel on /work. Projects themselves live under Work.">{eyebrowHeading("work")}</Group>
                  {seoGroup}
                </>
              )}

              {tab === "about" && (
                <>
                  <Group title="Section" note="Title panel and footnote on /about.">
                    {eyebrowHeading("about")}
                    <Field label="Footnote" count={pages.about.footnote.length}>
                      <textarea className="a-input" rows={2} value={pages.about.footnote} onChange={(e) => setPage("about", { footnote: e.target.value })} />
                    </Field>
                  </Group>
                  <Group title="Bio">
                    <MediaField label="Portrait" hint="Shown beside the bio" value={about.profileImage ?? ""} onChange={(v) => setAbout((d) => ({ ...d, profileImage: v || undefined }))} />
                    <div className="a-field">
                      <span className="a-field__top">Paragraphs</span>
                      <ListEditor
                        items={about.description}
                        onChange={(v) => setAbout((d) => ({ ...d, description: v }))}
                        blank=""
                        addLabel="Add paragraph"
                        render={(p, set, i) => (
                          <textarea className="a-input" rows={3} aria-label={`Paragraph ${i + 1}`} value={p} onChange={(e) => set(e.target.value)} />
                        )}
                      />
                    </div>
                    <div className="a-field">
                      <span className="a-field__top">Expertise chips</span>
                      <ListEditor
                        items={about.expertise.areas}
                        onChange={(v) => setAbout((d) => ({ ...d, expertise: { ...d.expertise, areas: v } }))}
                        blank={{ name: "", technologies: [], description: "" }}
                        addLabel="Add chip"
                        render={(a, set, i) => (
                          <input className="a-input" aria-label={`Chip ${i + 1}`} value={a.name} onChange={(e) => set({ ...a, name: e.target.value })} />
                        )}
                      />
                    </div>
                  </Group>
                  {seoGroup}
                </>
              )}

              {tab === "contact" && (
                <>
                  <Group title="Section" note="Title panel on /contact.">{eyebrowHeading("contact")}</Group>
                  <Group title="Contact details" note="Used by the contact note, footer strip and JSON-LD.">
                    <Field label="Email">
                      <input className="a-input" type="email" value={siteConfig.contact.email} onChange={(e) => setContact({ email: e.target.value })} />
                    </Field>
                    <Field
                      label="WhatsApp"
                      help={`Type the number any way you like. Send opens wa.me/${waNumber(siteConfig.contact.whatsappCountry, siteConfig.contact.whatsappNumber) || "…"}.`}
                    >
                      <div style={{ display: "flex", gap: 8 }}>
                        <CountrySelect value={siteConfig.contact.whatsappCountry ?? "62"} onChange={(dial) => setContact({ whatsappCountry: dial })} />
                        <input className="a-input" placeholder="813 2176 6565" value={siteConfig.contact.whatsappNumber ?? ""} onChange={(e) => setContact({ whatsappNumber: e.target.value || undefined })} />
                      </div>
                    </Field>
                    <div className="a-field">
                      <span className="a-field__top">Social links</span>
                      <ListEditor
                        items={siteConfig.social}
                        onChange={(v) => setSiteConfig((d) => ({ ...d, social: v }))}
                        blank={{ platform: "", url: "" }}
                        addLabel="Add link"
                        render={(s, set) => (
                          <>
                            <input className="a-input" style={{ width: 160, flex: "none" }} placeholder="Platform" value={s.platform} onChange={(e) => set({ ...s, platform: e.target.value })} />
                            <input className="a-input" placeholder="https://" value={s.url} onChange={(e) => set({ ...s, url: e.target.value })} />
                          </>
                        )}
                      />
                    </div>
                  </Group>
                  {seoGroup}
                </>
              )}

              {tab === "journal" && (
                <>
                  <Group title="Index" note="Title panel on /journal. Posts live under Journal and Jurnal.">{eyebrowHeading("journal")}</Group>
                  {seoGroup}
                </>
              )}

              {tab === "navigation" && (
                <Group title="Navigation" note="The folder nav on every public page, in this order.">
                  <ListEditor
                    items={navigation}
                    onChange={setNavigation}
                    blank={{ label: "", href: "/" }}
                    addLabel="Add link"
                    render={(l, set) => (
                      <>
                        <input className="a-input" placeholder="Label" value={l.label} onChange={(e) => set({ ...l, label: e.target.value })} />
                        <input className="a-input" placeholder="/path" value={l.href} onChange={(e) => set({ ...l, href: e.target.value })} />
                      </>
                    )}
                  />
                  <p className="a-meta a-muted">A brand-new route also needs code (page, metadata layout, sitemap) — see CLAUDE.md.</p>
                </Group>
              )}
            </div>

            <aside className="a-stack a-sticky" style={{ top: 12 }}>
              <div className="a-field">
                <span className="a-field__top">Where this shows</span>
                <a className="a-media" href={current.path} target="_blank" rel="noreferrer">
                  <span className="a-media__text">
                    <span className="a-label">jamalakbara.com{current.path === "/" ? "" : current.path}</span>
                    <span className="a-meta a-muted">
                      {tab === "navigation" ? "Folder nav on every page" : tab === "home" ? "Hero panel + homepage search result" : "Title panel + search result"}
                    </span>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
              {report && <SeoPanel report={report} />}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
