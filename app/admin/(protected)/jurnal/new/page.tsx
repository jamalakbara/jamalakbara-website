import { redirect } from "next/navigation";

export default function NewJurnalRedirect() {
  redirect("/admin/journal/new?lang=id");
}
