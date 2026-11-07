import { getJurnalPosts, formatJurnalDate } from "@/lib/jurnal";
import { BAHASA_STRIP, jurnal } from "@/lib/site-data";
import { JournalIndex, entriesId } from "@/components/site/journal-index";

// Server component — post rows render as static HTML for crawlers.
export default function JurnalPage() {
  const posts = getJurnalPosts();
  return (
    <JournalIndex
      posts={posts}
      basePath="/jurnal"
      contentLang="id"
      strip={BAHASA_STRIP}
      formatDate={formatJurnalDate}
      copy={{
        label: jurnal.eyebrow,
        heading: jurnal.heading,
        intro: "Catatan soal desain, development,\ndan kerjaan.",
        lang: { href: "/journal", label: "English", hrefLang: "en" },
        tab: "SEMUA TULISAN",
        entries: entriesId,
        newest: "Terbaru dulu",
        latest: "PALING BARU",
        end: "Segitu dulu untuk sekarang.",
        backToTop: "Kembali ke atas",
        emptyLabel: "BELUM ADA TULISAN",
        emptyHeading: "MASIH DITULIS.",
        emptyBody: "Belum ada tulisan — segera hadir.",
      }}
    />
  );
}
