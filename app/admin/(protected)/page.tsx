import Link from "next/link";

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
      <p
        className="mb-2 text-sm italic text-[var(--m3)] animate-blur-fade-up"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Dashboard
      </p>
      <h1 className="mb-10 text-4xl font-light tracking-tight animate-blur-fade-up">
        What are we editing today?
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section, i) => (
          <Link
            key={section.href}
            href={section.href}
            className="liquid-glass block rounded-2xl p-6 animate-blur-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <h2 className="mb-1 text-lg font-normal">{section.title}</h2>
            <p className="text-sm text-[var(--m3)]">{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
