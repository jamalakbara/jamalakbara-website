"use client";

// Canvas 36 "Search data": the values behind the site's JSON-LD, stored in
// content/site/seo.json. One save = one commit, same as Site copy.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { SeoSettings } from "@/lib/content/schemas";
import { Field, PageHeader, TagInput, Toggle, useSaveShortcut } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";
import { useUnsaved } from "@/components/admin/unsaved";
import { saveSiteCopy } from "../site/actions";
import { Group } from "../site/site-editor";

const TABS = [
  { key: "person", label: "Person" },
  { key: "business", label: "Business" },
  { key: "website", label: "Website" },
] as const;
type Tab = (typeof TABS)[number]["key"];

const WHERE = [
  ["Home", "WebSite, Person"],
  ["About", "Person"],
  ["Contact", "LocalBusiness"],
  ["Service pages", "LocalBusiness, FAQ"],
  ["Case studies", "Project"],
] as const;

export function SeoEditor({ initial }: { initial: SeoSettings }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [base, setBase] = useState(initial);
  const [form, setForm] = useState(initial);
  const [tab, setTab] = useState<Tab>("person");
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(base);
  useUnsaved(dirty);

  const setIdentity = (patch: Partial<SeoSettings["identity"]>) => setForm((f) => ({ ...f, identity: { ...f.identity, ...patch } }));
  const setBusiness = (patch: Partial<SeoSettings["business"]>) => setForm((f) => ({ ...f, business: { ...f.business, ...patch } }));
  const setWebsite = (patch: Partial<SeoSettings["website"]>) => setForm((f) => ({ ...f, website: { ...f.website, ...patch } }));

  function save() {
    if (!dirty || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await saveSiteCopy([["seo", form]], "seo");
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setBase(form);
      toast.saved(result, "Search data");
      router.refresh();
    });
  }
  useSaveShortcut(save, dirty);

  const { identity, business, website } = form;

  return (
    <>
      <PageHeader
        eyebrow="Settings / SEO"
        index="07"
        title="Search data"
        subtitle={dirty ? "Unsaved changes · one save = one commit" : "What Google reads about you. Used in the structured data on the site."}
        actions={
          <button type="button" className="a-btn a-btn--primary" onClick={save} disabled={!dirty || pending}>
            <Check size={16} />
            {pending ? "Saving…" : "Save & publish"}
          </button>
        }
      />
      {error && <p className="a-banner">Save failed — {error}</p>}

      <div>
        <div className="a-tabs" role="tablist" aria-label="Search data">
          {TABS.map((t, i) => (
            <button key={t.key} type="button" role="tab" className="a-tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}>
              <span className="a-eyebrow">{t.label}</span>
              <span className="a-meta">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="a-tabpanel" role="tabpanel">
          <div className="a-grid a-grid--rail" style={{ padding: 24, gap: 24 }}>
            <div className="a-stack" style={{ gap: 32 }}>
              {tab === "person" && (
                <Group title="Person" note="Who the site is about. Shown on home and /about.">
                  <div className="a-row2">
                    <Field label="Name">
                      <input className="a-input" value={identity.name} onChange={(e) => setIdentity({ name: e.target.value })} />
                    </Field>
                    <Field label="Alumni of">
                      <input className="a-input" value={identity.alumniOf} onChange={(e) => setIdentity({ alumniOf: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Description" count={identity.description.length}>
                    <textarea className="a-input" rows={4} value={identity.description} onChange={(e) => setIdentity({ description: e.target.value })} />
                  </Field>
                  <Field label="Image URL" help="Full URL or a root-relative path.">
                    <input className="a-input" value={identity.image} onChange={(e) => setIdentity({ image: e.target.value })} />
                  </Field>
                  <Field label="Other names">
                    <TagInput value={identity.alternateNames} onChange={(v) => setIdentity({ alternateNames: v })} />
                  </Field>
                  <Field label="Job titles">
                    <TagInput value={identity.jobTitles} onChange={(v) => setIdentity({ jobTitles: v })} />
                  </Field>
                  <Field label="Profile links" help="Full URLs of profiles that are really yours.">
                    <TagInput value={identity.sameAs} onChange={(v) => setIdentity({ sameAs: v })} placeholder="https://…" />
                  </Field>
                  <Field label="Knows about">
                    <TagInput value={identity.knowsAbout} onChange={(v) => setIdentity({ knowsAbout: v })} />
                  </Field>
                  <Field label="Certifications">
                    <TagInput value={identity.awards} onChange={(v) => setIdentity({ awards: v })} />
                  </Field>
                </Group>
              )}

              {tab === "business" && (
                <Group title="Business" note="Shown on /contact and service pages. Only publish what you are happy to have public.">
                  <Toggle checked={business.enabled} onChange={(v) => setBusiness({ enabled: v })}>
                    Publish business data
                  </Toggle>
                  <div className="a-row2">
                    <Field label="Business name">
                      <input className="a-input" value={business.name} onChange={(e) => setBusiness({ name: e.target.value })} />
                    </Field>
                    <Field label="Other name">
                      <input className="a-input" value={business.alternateName} onChange={(e) => setBusiness({ alternateName: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Phone" help="Leave blank to hide it.">
                    <input className="a-input" value={business.phone} onChange={(e) => setBusiness({ phone: e.target.value })} />
                  </Field>
                  <div className="a-row2">
                    <Field label="City">
                      <input className="a-input" value={business.city} onChange={(e) => setBusiness({ city: e.target.value })} />
                    </Field>
                    <Field label="Region">
                      <input className="a-input" value={business.region} onChange={(e) => setBusiness({ region: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Country code" help="Two letters, for example ID.">
                    <input className="a-input" value={business.country} onChange={(e) => setBusiness({ country: e.target.value })} />
                  </Field>
                  <Field label="Description" count={business.description.length}>
                    <textarea className="a-input" rows={3} value={business.description} onChange={(e) => setBusiness({ description: e.target.value })} />
                  </Field>
                  <Field label="Services">
                    <TagInput value={business.services} onChange={(v) => setBusiness({ services: v })} />
                  </Field>
                  <Field label="Areas served">
                    <TagInput value={business.areaServed} onChange={(v) => setBusiness({ areaServed: v })} />
                  </Field>
                </Group>
              )}

              {tab === "website" && (
                <Group title="Website" note="How the site names itself. Shown on home.">
                  <div className="a-row2">
                    <Field label="Site name">
                      <input className="a-input" value={website.name} onChange={(e) => setWebsite({ name: e.target.value })} />
                    </Field>
                    <Field label="Other name">
                      <input className="a-input" value={website.alternateName} onChange={(e) => setWebsite({ alternateName: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Description" count={website.description.length}>
                    <textarea className="a-input" rows={3} value={website.description} onChange={(e) => setWebsite({ description: e.target.value })} />
                  </Field>
                </Group>
              )}
            </div>

            <aside className="a-stack a-sticky">
              <section className="a-panel">
                <div className="a-panel__head">
                  <h2 className="a-title">Where this shows</h2>
                </div>
                <div className="a-panel__body">
                  {WHERE.map(([page, types]) => (
                    <p key={page} className="a-small" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <span>{page}</span>
                      <span className="a-muted">{types}</span>
                    </p>
                  ))}
                  <p className="a-meta a-muted">Changes publish on the next build, about 1 to 2 minutes.</p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
