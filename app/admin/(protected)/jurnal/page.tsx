import { redirect } from "next/navigation";

export default function JurnalRedirect() {
  redirect("/admin/journal?lang=id");
}
