"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { AboutContent, SiteConfig } from "@/lib/content-types";
import type { NavLink, PagesContent } from "@/lib/content/schemas";
import type { SingletonKey } from "@/lib/admin/singletons";
import { DEFAULT_BACKGROUNDS } from "@/lib/backgrounds";
import { MediaField } from "@/components/admin/media-field";
import { CountrySelect } from "@/components/admin/country-select";
import { waNumber } from "@/lib/country-codes";
import { saveSingleton } from "./actions";
import { input, label } from "@/lib/admin/form-styles";

const AVAILABILITY_OPTIONS = [
  "Open for new work",
  "Booked — limited slots",
  "Currently unavailable",
] as const;

interface SiteEditorProps {
  pages: PagesContent;
  about: AboutContent;
  siteConfig: SiteConfig;
  navigation: NavLink[];
}

function useSave() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  // Saves one or more singleton files in sequence; reports the first error.
  const save = (entries: Array<[SingletonKey, unknown]>) => {
    setMessage(null);
    startTransition(async () => {
      for (const [key, value] of entries) {
        const result = await saveSingleton(key, value);
        if (!result.ok) {
          setMessage(result.error);
          return;
        }
      }
      setMessage("Saved.");
    });
  };
  return { pending, message, save };
}

function SaveRow({
  pending,
  message,
  onSave,
}: {
  pending: boolean;
  message: string | null;
  onSave: () => void;
}) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className="btn-solid"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {message && <span className="text-xs text-[var(--m3)]">{message}</span>}
    </div>
  );
}

// Link out to the admin section that manages a page's list items (projects /
// journal posts), which live outside the site-copy editor.
function ManageLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="liquid-glass inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-1.5 text-xs text-[var(--m2)]"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

// Per-route SEO fields (meta title + description). Drives the route's
// <title>, meta description, canonical, and OpenGraph/Twitter tags via the
// page layout's buildPageMetadata(). Blank falls back to the shipped default.
function SeoFields({
  seo,
  onChange,
  appendBrand = true,
}: {
  seo: { title: string; description: string } | undefined;
  onChange: (seo: { title: string; description: string }) => void;
  // Home's title is the full string (also the site-wide default) — no
  // "| Jamal Akbar Alam" template suffix, unlike other routes.
  appendBrand?: boolean;
}) {
  const title = seo?.title ?? "";
  const description = seo?.description ?? "";
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm text-[var(--m2)]">SEO</legend>
      <div>
        <label className={label}>Meta title</label>
        <input
          className={input}
          value={title}
          onChange={(e) => onChange({ title: e.target.value, description })}
        />
        <p className="mt-1 text-xs text-[var(--m4)]">
          {appendBrand
            ? `Shows as “${title || "…"} | Jamal Akbar Alam” in search & tabs.`
            : `Shows as “${title || "…"}” — this is also the site-wide default title.`}
        </p>
      </div>
      <div>
        <label className={label}>Meta description (search snippet — keep under ~160 chars)</label>
        <textarea
          className={input}
          rows={2}
          value={description}
          onChange={(e) => onChange({ title, description: e.target.value })}
        />
      </div>
    </fieldset>
  );
}

/* ---- Home ------------------------------------------------------------- */
function HomeTab({
  pages,
  setPages,
  siteConfig,
  setSiteConfig,
}: {
  pages: PagesContent;
  setPages: React.Dispatch<React.SetStateAction<PagesContent>>;
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
}) {
  const { pending, message, save } = useSave();
  const set = (patch: Partial<PagesContent["home"]>) =>
    setPages((d) => ({ ...d, home: { ...d.home, ...patch } }));
  return (
    <div className="space-y-3">
      <div>
        <label className={label}>Headline</label>
        <input className={input} value={pages.home.headline} onChange={(e) => set({ headline: e.target.value })} />
      </div>
      <div>
        <label className={label}>Intro</label>
        <textarea className={input} rows={2} value={pages.home.intro} onChange={(e) => set({ intro: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Tagline (role)</label>
          <input
            className={input}
            value={siteConfig.brand.tagline}
            onChange={(e) => setSiteConfig((d) => ({ ...d, brand: { ...d.brand, tagline: e.target.value } }))}
          />
        </div>
        <div>
          <label className={label}>Location</label>
          <input
            className={input}
            value={siteConfig.contact.location}
            onChange={(e) => setSiteConfig((d) => ({ ...d, contact: { ...d.contact, location: e.target.value } }))}
          />
        </div>
      </div>
      <div>
        <label className={label}>Availability</label>
        <select className={input} value={pages.home.availability} onChange={(e) => set({ availability: e.target.value })}>
          {AVAILABILITY_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <MediaField label="Background video" accept="video/*" value={pages.home.backgroundVideo ?? ""} onChange={(v) => set({ backgroundVideo: v || undefined })} />
      <SeoFields seo={pages.home.seo} onChange={(seo) => set({ seo })} appendBrand={false} />
      <SaveRow pending={pending} message={message} onSave={() => save([["pages", pages], ["site-config", siteConfig]])} />
    </div>
  );
}

/* ---- Work ------------------------------------------------------------- */
function WorkTab({
  pages,
  setPages,
}: {
  pages: PagesContent;
  setPages: React.Dispatch<React.SetStateAction<PagesContent>>;
}) {
  const { pending, message, save } = useSave();
  const set = (patch: Partial<PagesContent["work"]>) =>
    setPages((d) => ({ ...d, work: { ...d.work, ...patch } }));
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Eyebrow</label>
          <input className={input} value={pages.work.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} />
        </div>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={pages.work.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
      </div>
      <MediaField label="Background video" accept="video/*" value={pages.work.backgroundVideo ?? ""} onChange={(v) => set({ backgroundVideo: v || undefined })} />
      <SeoFields seo={pages.work.seo} onChange={(seo) => set({ seo })} />
      <div className="pt-1">
        <ManageLink href="/admin/projects">Manage work items</ManageLink>
      </div>
      <SaveRow pending={pending} message={message} onSave={() => save([["pages", pages]])} />
    </div>
  );
}

/* ---- About ------------------------------------------------------------ */
function AboutTab({
  pages,
  setPages,
  about,
  setAbout,
}: {
  pages: PagesContent;
  setPages: React.Dispatch<React.SetStateAction<PagesContent>>;
  about: AboutContent;
  setAbout: React.Dispatch<React.SetStateAction<AboutContent>>;
}) {
  const { pending, message, save } = useSave();
  const setPage = (patch: Partial<PagesContent["about"]>) =>
    setPages((d) => ({ ...d, about: { ...d.about, ...patch } }));
  const setPara = (i: number, value: string) =>
    setAbout((d) => ({ ...d, description: d.description.map((p, j) => (j === i ? value : p)) }));
  const setAreaName = (i: number, value: string) =>
    setAbout((d) => ({
      ...d,
      expertise: {
        ...d.expertise,
        areas: d.expertise.areas.map((a, j) => (j === i ? { ...a, name: value } : a)),
      },
    }));

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Section copy</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Eyebrow</label>
            <input className={input} value={pages.about.eyebrow} onChange={(e) => setPage({ eyebrow: e.target.value })} />
          </div>
          <div>
            <label className={label}>Heading</label>
            <input className={input} value={pages.about.heading} onChange={(e) => setPage({ heading: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={label}>Footnote</label>
          <textarea className={input} rows={2} value={pages.about.footnote} onChange={(e) => setPage({ footnote: e.target.value })} />
        </div>
        <MediaField label="Background video" accept="video/*" value={pages.about.backgroundVideo ?? ""} onChange={(v) => setPage({ backgroundVideo: v || undefined })} />
      </fieldset>
      <SeoFields seo={pages.about.seo} onChange={(seo) => setPage({ seo })} />
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Bio</legend>
        <MediaField
          label="Portrait image"
          accept="image/*"
          placeholder="/profile-image.png"
          value={about.profileImage ?? ""}
          onChange={(v) => setAbout((d) => ({ ...d, profileImage: v || undefined }))}
        />
        <div>
          <label className={label}>Paragraphs</label>
          <div className="space-y-2">
            {about.description.map((para, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  className={input}
                  rows={3}
                  placeholder={`Paragraph ${i + 1}`}
                  value={para}
                  onChange={(e) => setPara(i, e.target.value)}
                />
                <button
                  type="button"
                  className="liquid-glass btn-icon self-start"
                  onClick={() => setAbout((d) => ({ ...d, description: d.description.filter((_, j) => j !== i) }))}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="liquid-glass rounded-full px-4 py-1.5 text-xs"
              onClick={() => setAbout((d) => ({ ...d, description: [...d.description, ""] }))}
            >
              Add paragraph
            </button>
          </div>
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Expertise chips</legend>
        <div className="space-y-2">
          {about.expertise.areas.map((a, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={input}
                placeholder="Area name"
                value={a.name}
                onChange={(e) => setAreaName(i, e.target.value)}
              />
              <button
                type="button"
                className="liquid-glass btn-icon"
                onClick={() =>
                  setAbout((d) => ({
                    ...d,
                    expertise: { ...d.expertise, areas: d.expertise.areas.filter((_, j) => j !== i) },
                  }))
                }
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="liquid-glass rounded-full px-4 py-1.5 text-xs"
            onClick={() =>
              setAbout((d) => ({
                ...d,
                expertise: {
                  ...d.expertise,
                  areas: [...d.expertise.areas, { name: "", technologies: [], description: "" }],
                },
              }))
            }
          >
            Add chip
          </button>
        </div>
      </fieldset>
      <SaveRow
        pending={pending}
        message={message}
        onSave={() => save([["pages", pages], ["about", about]])}
      />
    </div>
  );
}

/* ---- Contact ---------------------------------------------------------- */
function ContactTab({
  pages,
  setPages,
  siteConfig,
  setSiteConfig,
}: {
  pages: PagesContent;
  setPages: React.Dispatch<React.SetStateAction<PagesContent>>;
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
}) {
  const { pending, message, save } = useSave();
  const set = (patch: Partial<PagesContent["contact"]>) =>
    setPages((d) => ({ ...d, contact: { ...d.contact, ...patch } }));
  const setContact = (patch: Partial<SiteConfig["contact"]>) =>
    setSiteConfig((d) => ({ ...d, contact: { ...d.contact, ...patch } }));
  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Section copy</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Eyebrow</label>
            <input className={input} value={pages.contact.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} />
          </div>
          <div>
            <label className={label}>Heading</label>
            <input className={input} value={pages.contact.heading} onChange={(e) => set({ heading: e.target.value })} />
          </div>
        </div>
        <MediaField label="Background video" accept="video/*" value={pages.contact.backgroundVideo ?? ""} onChange={(v) => set({ backgroundVideo: v || undefined })} />
      </fieldset>
      <SeoFields seo={pages.contact.seo} onChange={(seo) => set({ seo })} />
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Contact details</legend>
        <div>
          <label className={label}>Email</label>
          <input className={input} type="email" value={siteConfig.contact.email} onChange={(e) => setContact({ email: e.target.value })} />
        </div>
        <div>
          <label className={label}>WhatsApp</label>
          <div className="flex items-start gap-2">
            <CountrySelect
              value={siteConfig.contact.whatsappCountry ?? "62"}
              onChange={(dial) => setContact({ whatsappCountry: dial })}
            />
            <input
              className={`${input} flex-1`}
              placeholder="813 2176 6565"
              value={siteConfig.contact.whatsappNumber ?? ""}
              onChange={(e) => setContact({ whatsappNumber: e.target.value || undefined })}
            />
          </div>
          <p className="mt-1 text-xs text-[var(--m4)]">
            Type the number any way you like. Send opens{" "}
            wa.me/{waNumber(siteConfig.contact.whatsappCountry, siteConfig.contact.whatsappNumber) || "…"}.
          </p>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm text-[var(--m2)]">Social links</legend>
        <div className="space-y-2">
          {siteConfig.social.map((s, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-40 shrink-0">
                <input
                  className={input}
                  placeholder="Platform"
                  value={s.platform}
                  onChange={(e) =>
                    setSiteConfig((d) => ({ ...d, social: d.social.map((r, j) => (j === i ? { ...r, platform: e.target.value } : r)) }))
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <input
                  className={input}
                  placeholder="URL"
                  value={s.url}
                  onChange={(e) =>
                    setSiteConfig((d) => ({ ...d, social: d.social.map((r, j) => (j === i ? { ...r, url: e.target.value } : r)) }))
                  }
                />
              </div>
              <button
                type="button"
                className="liquid-glass btn-icon"
                onClick={() => setSiteConfig((d) => ({ ...d, social: d.social.filter((_, j) => j !== i) }))}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="liquid-glass rounded-full px-4 py-1.5 text-xs"
            onClick={() => setSiteConfig((d) => ({ ...d, social: [...d.social, { platform: "", url: "" }] }))}
          >
            Add link
          </button>
        </div>
      </fieldset>
      <SaveRow
        pending={pending}
        message={message}
        onSave={() => save([["pages", pages], ["site-config", siteConfig]])}
      />
    </div>
  );
}

/* ---- Journal ---------------------------------------------------------- */
function JournalTab({
  pages,
  setPages,
}: {
  pages: PagesContent;
  setPages: React.Dispatch<React.SetStateAction<PagesContent>>;
}) {
  const { pending, message, save } = useSave();
  const set = (patch: Partial<PagesContent["journal"]>) =>
    setPages((d) => ({ ...d, journal: { ...d.journal, ...patch } }));
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Eyebrow</label>
          <input className={input} value={pages.journal.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} />
        </div>
        <div>
          <label className={label}>Heading</label>
          <input className={input} value={pages.journal.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
      </div>
      <MediaField label="Background video" accept="video/*" value={pages.journal.backgroundVideo ?? ""} onChange={(v) => set({ backgroundVideo: v || undefined })} />
      <SeoFields seo={pages.journal.seo} onChange={(seo) => set({ seo })} />
      <div className="pt-1">
        <ManageLink href="/admin/journal">Manage posts</ManageLink>
      </div>
      <SaveRow pending={pending} message={message} onSave={() => save([["pages", pages]])} />
    </div>
  );
}

/* ---- Global ----------------------------------------------------------- */
function GlobalTab({
  navigation,
  setNavigation,
}: {
  navigation: NavLink[];
  setNavigation: React.Dispatch<React.SetStateAction<NavLink[]>>;
}) {
  const { pending, message, save } = useSave();

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-sm text-[var(--m2)]">Navigation</legend>
        <div className="space-y-2">
          {navigation.map((link, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={input}
                placeholder="Label"
                value={link.label}
                onChange={(e) => setNavigation((l) => l.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
              />
              <input
                className={input}
                placeholder="/path"
                value={link.href}
                onChange={(e) => setNavigation((l) => l.map((r, j) => (j === i ? { ...r, href: e.target.value } : r)))}
              />
              <button
                type="button"
                className="liquid-glass btn-icon"
                onClick={() => setNavigation((l) => l.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="liquid-glass rounded-full px-4 py-1.5 text-xs"
            onClick={() => setNavigation((l) => [...l, { label: "", href: "/" }])}
          >
            Add link
          </button>
        </div>
        <p className="mt-3 text-xs text-[var(--m4)]">
          New routes also need code changes (sitemap, background video) — see CLAUDE.md.
        </p>
      </fieldset>
      <SaveRow
        pending={pending}
        message={message}
        onSave={() => save([["navigation", navigation]])}
      />
    </div>
  );
}

// Fill each page's backgroundVideo with its shipped default when unset, so the
// editor shows the real value instead of an empty field.
function seedBackgrounds(p: PagesContent): PagesContent {
  return {
    ...p,
    home: { ...p.home, backgroundVideo: p.home.backgroundVideo || DEFAULT_BACKGROUNDS.home },
    work: { ...p.work, backgroundVideo: p.work.backgroundVideo || DEFAULT_BACKGROUNDS.work },
    about: { ...p.about, backgroundVideo: p.about.backgroundVideo || DEFAULT_BACKGROUNDS.about },
    contact: { ...p.contact, backgroundVideo: p.contact.backgroundVideo || DEFAULT_BACKGROUNDS.contact },
    journal: { ...p.journal, backgroundVideo: p.journal.backgroundVideo || DEFAULT_BACKGROUNDS.journal },
  };
}

export function SiteEditor(props: SiteEditorProps) {
  const [pages, setPages] = useState(() => seedBackgrounds(props.pages));
  const [about, setAbout] = useState(props.about);
  const [siteConfig, setSiteConfig] = useState(props.siteConfig);
  const [navigation, setNavigation] = useState(props.navigation);
  const [active, setActive] = useState<string>("home");

  const tabs = [
    { key: "home", label: "Home" },
    { key: "work", label: "Work" },
    { key: "about", label: "About" },
    { key: "contact", label: "Contact" },
    { key: "journal", label: "Journal" },
    { key: "global", label: "Navigation" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className="liquid-glass rounded-full px-4 py-1.5 text-xs"
            style={active === tab.key ? { color: "var(--accent)", borderColor: "rgba(224,135,90,0.35)" } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="liquid-glass cursor-default rounded-2xl p-6">
        {active === "home" && (
          <HomeTab pages={pages} setPages={setPages} siteConfig={siteConfig} setSiteConfig={setSiteConfig} />
        )}
        {active === "work" && <WorkTab pages={pages} setPages={setPages} />}
        {active === "about" && (
          <AboutTab pages={pages} setPages={setPages} about={about} setAbout={setAbout} />
        )}
        {active === "contact" && (
          <ContactTab
            pages={pages}
            setPages={setPages}
            siteConfig={siteConfig}
            setSiteConfig={setSiteConfig}
          />
        )}
        {active === "journal" && <JournalTab pages={pages} setPages={setPages} />}
        {active === "global" && (
          <GlobalTab navigation={navigation} setNavigation={setNavigation} />
        )}
      </div>
    </div>
  );
}
