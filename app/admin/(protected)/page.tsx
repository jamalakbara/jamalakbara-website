import Link from "next/link";
import { BODY_DELAY_MS, PageHeading } from "@/components/page-heading";

const SECTIONS = [
  {
    href: "/admin/projects",
    title: "Projects",
    description: "Add, edit, reorder and feature work items.",
  },
  {
    href: "/admin/journal",
    title: "Journal",
    description: "Write and publish posts, manage drafts.",
  },
  {
    href: "/admin/site",
    title: "Site copy",
    description: "Hero, about, services, CTA and navigation.",
  },
  {
    href: "/admin/media",
    title: "Media",
    description: "Browse and upload Cloudinary images & video.",
  },
  {
    href: "/admin/branding",
    title: "Branding",
    description: "Logo, favicon and app icons.",
  },
];

export default function AdminDashboardPage() {
  return (
    <main>
      <PageHeading eyebrow="Dashboard" title="What are we editing today?" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className="group liquid-glass admin-card flex-col justify-between gap-6 rounded-2xl p-6 min-h-[9.5rem] animate-blur-fade-up"
            style={{ animationDelay: `${BODY_DELAY_MS + i * 80}ms` }}
          >
            <div>
              <h2 className="mb-1.5 text-lg font-normal tracking-tight">{section.title}</h2>
              <p className="text-sm leading-relaxed text-[var(--m3)]">{section.description}</p>
            </div>
            <span
              aria-hidden
              className="text-lg text-[var(--m4)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent-hi)]"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
