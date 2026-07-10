import { JournalEditor } from "../journal-editor";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "New post" };

export default function NewJournalPostPage() {
  return (
    <main>
      <PageHeading eyebrow="New post" title="Write a post" />
      <PageBody>
        <JournalEditor />
      </PageBody>
    </main>
  );
}
