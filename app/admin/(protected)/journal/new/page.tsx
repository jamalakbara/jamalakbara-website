import { JournalEditor } from "../journal-editor";

export const metadata = { title: "New post" };

export default function NewJournalPostPage() {
  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — New post
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">Write a post</h1>
      <JournalEditor />
    </main>
  );
}
