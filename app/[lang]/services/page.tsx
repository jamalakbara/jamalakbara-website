import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/site/icons";
import { Stickers } from "@/components/site/sticker";
import { getSite } from "@/lib/i18n";
import { alternatesFor } from "@/lib/seo";

const title = "Services";
const description = "Aku bantu kalian bikin website, toko online, dan aplikasi mobile, dari desain sampai live.";

const summaries: Record<string, { label: string; description: string; price: string }> = {
  "jasa-website-bandung": {
    label: "Website Custom",
    description: "Buat kalian yang butuh website dan pengen ngobrol dulu soal fitur dan bentuknya.",
    price: "Mulai dari Rp3 juta",
  },
  "jasa-pembuatan-website-company-profile": {
    label: "Company Profile",
    description: "Buat bisnis yang mau ngenalin tim, layanan, dan cara calon klien bisa menghubungi kalian.",
    price: "Mulai dari Rp6 juta",
  },
  "jasa-pembuatan-landing-page": {
    label: "Landing Page",
    description: "Satu halaman buat promosi produk, campaign, atau pendaftaran event.",
    price: "Mulai dari Rp3 juta",
  },
  "jasa-pembuatan-website-toko-online": {
    label: "Toko Online",
    description: "Buat kalian yang mau jualan lewat toko sendiri, pakai WooCommerce atau Shopify.",
    price: "Mulai dari Rp10 juta",
  },
  "jasa-pembuatan-aplikasi-mobile": {
    label: "Aplikasi Mobile",
    description: "Aplikasi Android dan iOS buat bisnis atau produk yang kalian kembangin.",
    price: "Mulai dari Rp25 juta",
  },
};

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  if ((await params).lang !== "id" || !getSite("id").services.length) return {};
  const alternates = alternatesFor("id", "/services", null);
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical, locale: "id_ID" },
    twitter: { title, description },
  };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const site = getSite("id");
  if ((await params).lang !== "id" || !site.services.length) notFound();

  return (
    <div className="f-services">
      <header className="f-panel f-services-hero">
        <p className="f-meta f-muted">Design &amp; Development / Bandung</p>
        <div className="f-services-intro">
          <h1 className="f-display f-display--caps">{title}</h1>
          <p className="f-body">{description}</p>
        </div>
        <Stickers
          className="f-stickers f-services-stickers"
          spots={[
            { name: "dev-laptop", x: 0, y: 43, w: 104, h: 94.4, r: -10 },
            { name: "build-with-care", x: 85, y: 65, w: 92, h: 75.7, r: 9 },
          ]}
        />
        <Stickers
          className="f-stickers f-services-stickers--compact"
          spots={[{ name: "dev-laptop", x: 0, y: 25, w: 72, h: 65.4, r: -10 }]}
        />
      </header>
      <section className="f-panel f-services-index" aria-labelledby="service-index-heading">
        <div className="f-services-index__head">
          <h2 id="service-index-heading" className="f-tabtext">Daftar Layanan</h2>
          <span className="f-meta f-muted">{String(site.services.length).padStart(2, "0")} Layanan</span>
        </div>
        <ol className="f-services-list" role="list">
          {site.services.map((page, index) => {
            const summary = summaries[page.slug];
            return (
              <li key={page.slug}>
                <Link href={site.path(`/services/${page.slug}`)} className="f-services-row">
                  <span className="f-meta f-services-row__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="f-services-row__info">
                    <h3 className="f-title">{summary?.label ?? page.title}</h3>
                    <p className="f-body">{summary?.description ?? page.intro}</p>
                    <span className="f-action">{summary?.price ?? "Lihat detail"}</span>
                  </div>
                  <ArrowRight size={20} />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="f-panel f-services-contact">
        <h2 className="f-display f-display--caps">Udah ada ide project?</h2>
        <Link href={site.path("/contact")} className="f-btn f-btn--primary">
          Ceritain project kalian
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
