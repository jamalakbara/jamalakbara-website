"use client";

import { useState, useTransition } from "react";
import type {
  CTAContent,
  HeroContent,
  Service,
  SiteConfig,
} from "@/lib/content-types";
import type { NavLink, PagesContent } from "@/lib/content/schemas";
import type { SingletonKey } from "@/lib/admin/singletons";
import { saveSingleton } from "./actions";

const input = "field-input w-full";
const label = "mb-1.5 block text-xs text-[var(--m3)]";

interface SiteEditorProps {
  pages: PagesContent;
  hero: HeroContent;
  siteConfig: SiteConfig;
  navigation: NavLink[];
  json: { key: SingletonKey; label: string; value: unknown }[];
}

function useSave() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const save = (key: SingletonKey, value: unknown) => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveSingleton(key, value);
      setMessage(result.ok ? "Saved." : result.error);
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
        className="btn-solid rounded-full px-6 py-2.5 text-sm disabled:opacity-40"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {message && <span className="text-xs text-[var(--m3)]">{message}</span>}
    </div>
  );
}

function PagesTab({ initial }: { initial: PagesContent }) {
  const [data, setData] = useState(initial);
  const { pending, message, save } = useSave();
  const setPage = <P extends keyof PagesContent>(
    page: P,
    patch: Partial<PagesContent[P]>
  ) => setData((d) => ({ ...d, [page]: { ...d[page], ...patch } }));

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Home</legend>
        <div>
          <label className={label}>Headline</label>
          <input className={input} value={data.home.headline} onChange={(e) => setPage("home", { headline: e.target.value })} />
        </div>
        <div>
          <label className={label}>Intro</label>
          <textarea className={input} rows={2} value={data.home.intro} onChange={(e) => setPage("home", { intro: e.target.value })} />
        </div>
        <div>
          <label className={label}>Availability</label>
          <input className={input} value={data.home.availability} onChange={(e) => setPage("home", { availability: e.target.value })} />
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Work</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Eyebrow</label>
            <input className={input} value={data.work.eyebrow} onChange={(e) => setPage("work", { eyebrow: e.target.value })} />
          </div>
          <div>
            <label className={label}>Heading</label>
            <input className={input} value={data.work.heading} onChange={(e) => setPage("work", { heading: e.target.value })} />
          </div>
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">About</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Eyebrow</label>
            <input className={input} value={data.about.eyebrow} onChange={(e) => setPage("about", { eyebrow: e.target.value })} />
          </div>
          <div>
            <label className={label}>Heading</label>
            <input className={input} value={data.about.heading} onChange={(e) => setPage("about", { heading: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={label}>Footnote</label>
          <textarea className={input} rows={2} value={data.about.footnote} onChange={(e) => setPage("about", { footnote: e.target.value })} />
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Contact</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Eyebrow</label>
            <input className={input} value={data.contact.eyebrow} onChange={(e) => setPage("contact", { eyebrow: e.target.value })} />
          </div>
          <div>
            <label className={label}>Heading</label>
            <input className={input} value={data.contact.heading} onChange={(e) => setPage("contact", { heading: e.target.value })} />
          </div>
        </div>
      </fieldset>
      <SaveRow pending={pending} message={message} onSave={() => save("pages", data)} />
    </div>
  );
}

function HeroTab({ initial }: { initial: HeroContent }) {
  const [data, setData] = useState(initial);
  const { pending, message, save } = useSave();
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Greeting</label>
          <input className={input} value={data.greeting} onChange={(e) => setData({ ...data, greeting: e.target.value })} />
        </div>
        <div>
          <label className={label}>Name</label>
          <input className={input} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={label}>Title</label>
        <input className={input} value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
      </div>
      <div>
        <label className={label}>Subtitle</label>
        <input className={input} value={data.subtitle ?? ""} onChange={(e) => setData({ ...data, subtitle: e.target.value || undefined })} />
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea className={input} rows={3} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["primary", "secondary"] as const).map((kind) => (
          <fieldset key={kind} className="space-y-3">
            <legend className="mb-1 text-sm capitalize text-[var(--m2)]">{kind} CTA</legend>
            <div>
              <label className={label}>Text</label>
              <input
                className={input}
                value={data.cta[kind].text}
                onChange={(e) =>
                  setData({ ...data, cta: { ...data.cta, [kind]: { ...data.cta[kind], text: e.target.value } } })
                }
              />
            </div>
            <div>
              <label className={label}>Action</label>
              <input
                className={input}
                value={data.cta[kind].action}
                onChange={(e) =>
                  setData({ ...data, cta: { ...data.cta, [kind]: { ...data.cta[kind], action: e.target.value } } })
                }
              />
            </div>
          </fieldset>
        ))}
      </div>
      <SaveRow pending={pending} message={message} onSave={() => save("hero", data)} />
    </div>
  );
}

function SiteConfigTab({ initial }: { initial: SiteConfig }) {
  const [data, setData] = useState(initial);
  const { pending, message, save } = useSave();
  const setBrand = (patch: Partial<SiteConfig["brand"]>) =>
    setData((d) => ({ ...d, brand: { ...d.brand, ...patch } }));
  const setContact = (patch: Partial<SiteConfig["contact"]>) =>
    setData((d) => ({ ...d, contact: { ...d.contact, ...patch } }));

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Brand</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Name</label>
            <input className={input} value={data.brand.name} onChange={(e) => setBrand({ name: e.target.value })} />
          </div>
          <div>
            <label className={label}>Short name</label>
            <input className={input} value={data.brand.shortName} onChange={(e) => setBrand({ shortName: e.target.value })} />
          </div>
          <div>
            <label className={label}>Full name</label>
            <input className={input} value={data.brand.fullName ?? ""} onChange={(e) => setBrand({ fullName: e.target.value || undefined })} />
          </div>
          <div>
            <label className={label}>Tagline</label>
            <input className={input} value={data.brand.tagline} onChange={(e) => setBrand({ tagline: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea className={input} rows={2} value={data.brand.description ?? ""} onChange={(e) => setBrand({ description: e.target.value || undefined })} />
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm text-[var(--m2)]">Contact</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className={label}>Email</label>
            <input className={input} type="email" value={data.contact.email} onChange={(e) => setContact({ email: e.target.value })} />
          </div>
          <div>
            <label className={label}>Phone</label>
            <input className={input} value={data.contact.phone ?? ""} onChange={(e) => setContact({ phone: e.target.value || undefined })} />
          </div>
          <div>
            <label className={label}>Location</label>
            <input className={input} value={data.contact.location} onChange={(e) => setContact({ location: e.target.value })} />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm text-[var(--m2)]">Social links</legend>
        <div className="space-y-2">
          {data.social.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={input}
                placeholder="Platform"
                value={s.platform}
                onChange={(e) =>
                  setData((d) => ({ ...d, social: d.social.map((r, j) => (j === i ? { ...r, platform: e.target.value } : r)) }))
                }
              />
              <input
                className={input}
                placeholder="URL"
                value={s.url}
                onChange={(e) =>
                  setData((d) => ({ ...d, social: d.social.map((r, j) => (j === i ? { ...r, url: e.target.value } : r)) }))
                }
              />
              <input
                className={input}
                placeholder="Handle"
                value={s.handle}
                onChange={(e) =>
                  setData((d) => ({ ...d, social: d.social.map((r, j) => (j === i ? { ...r, handle: e.target.value } : r)) }))
                }
              />
              <button
                type="button"
                className="liquid-glass shrink-0 rounded-full px-3 text-xs"
                onClick={() => setData((d) => ({ ...d, social: d.social.filter((_, j) => j !== i) }))}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="liquid-glass rounded-full px-4 py-1.5 text-xs"
            onClick={() => setData((d) => ({ ...d, social: [...d.social, { platform: "", url: "", handle: "" }] }))}
          >
            Add link
          </button>
        </div>
      </fieldset>
      <SaveRow pending={pending} message={message} onSave={() => save("site-config", data)} />
    </div>
  );
}

function NavigationTab({ initial }: { initial: NavLink[] }) {
  const [links, setLinks] = useState(initial);
  const { pending, message, save } = useSave();
  return (
    <div>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={input}
              placeholder="Label"
              value={link.label}
              onChange={(e) => setLinks((l) => l.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
            />
            <input
              className={input}
              placeholder="/path"
              value={link.href}
              onChange={(e) => setLinks((l) => l.map((r, j) => (j === i ? { ...r, href: e.target.value } : r)))}
            />
            <button
              type="button"
              className="liquid-glass shrink-0 rounded-full px-3 text-xs"
              onClick={() => setLinks((l) => l.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="liquid-glass rounded-full px-4 py-1.5 text-xs"
          onClick={() => setLinks((l) => [...l, { label: "", href: "/" }])}
        >
          Add link
        </button>
      </div>
      <p className="mt-3 text-xs text-[var(--m4)]">
        New routes also need code changes (sitemap, background video) — see CLAUDE.md.
      </p>
      <SaveRow pending={pending} message={message} onSave={() => save("navigation", links)} />
    </div>
  );
}

function JsonTab({ tab }: { tab: { key: SingletonKey; label: string; value: unknown } }) {
  const [text, setText] = useState(() => JSON.stringify(tab.value, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const { pending, message, save } = useSave();

  function onSave() {
    try {
      const parsed = JSON.parse(text);
      setParseError(null);
      save(tab.key, parsed);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  return (
    <div>
      <p className="mb-2 text-xs text-[var(--m4)]">
        Structured editor coming later — this edits the raw JSON, validated against the schema on save.
      </p>
      <textarea
        className="field-input w-full font-mono text-xs leading-relaxed"
        rows={24}
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {parseError && <p className="mt-1 text-xs text-red-400">{parseError}</p>}
      <SaveRow pending={pending} message={message} onSave={onSave} />
    </div>
  );
}

export function SiteEditor(props: SiteEditorProps) {
  const tabs = [
    { key: "pages", label: "Pages" },
    { key: "hero", label: "Hero" },
    { key: "site-config", label: "Site config" },
    { key: "navigation", label: "Navigation" },
    ...props.json.map((j) => ({ key: j.key, label: j.label })),
  ];
  const [active, setActive] = useState<string>("pages");

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
        {active === "pages" && <PagesTab initial={props.pages} />}
        {active === "hero" && <HeroTab initial={props.hero} />}
        {active === "site-config" && <SiteConfigTab initial={props.siteConfig} />}
        {active === "navigation" && <NavigationTab initial={props.navigation} />}
        {props.json.map(
          (tab) => active === tab.key && <JsonTab key={tab.key} tab={tab} />
        )}
      </div>
    </div>
  );
}
