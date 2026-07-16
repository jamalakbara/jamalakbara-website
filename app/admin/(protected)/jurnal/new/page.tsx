import { PostEditor } from "@/components/admin/post-editor";
import { saveJurnalPost, deleteJurnalPost } from "../actions";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "New post" };

export default function NewJurnalPostPage() {
  return (
    <main>
      <PageHeading
        eyebrow="New post"
        title="Write a post"
        back={{ href: "/admin/jurnal", label: "Jurnal" }}
      />
      <PageBody>
        <PostEditor
          save={saveJurnalPost}
          remove={deleteJurnalPost}
          listHref="/admin/jurnal"
        />
      </PageBody>
    </main>
  );
}
