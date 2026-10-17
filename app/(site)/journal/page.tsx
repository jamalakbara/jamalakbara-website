import { getJournalPosts, formatPostDate } from "@/lib/journal";
import { journal } from "@/lib/site-data";
import { JournalIndex, entriesEn } from "@/components/site/journal-index";

// Server component — post rows render as static HTML for crawlers.
export default function JournalPage() {
  const posts = getJournalPosts();
  return (
    <JournalIndex
      posts={posts}
      basePath="/journal"
      formatDate={formatPostDate}
      copy={{
        label: "JOURNAL",
        heading: journal.heading,
        intro: "Thoughts on design, development,\nand the work in between.",
        lang: { href: "/jurnal", label: "Bahasa Indonesia", hrefLang: "id" },
        tab: "ALL ENTRIES",
        entries: entriesEn,
        newest: "Newest first",
        latest: "LATEST ENTRY",
        end: "That’s everything for now.",
        backToTop: "Back to top",
        emptyLabel: "NO ENTRIES YET",
        emptyHeading: "STILL WRITING.",
        emptyBody: "Nothing published yet — first entry is on its way.",
      }}
    />
  );
}
