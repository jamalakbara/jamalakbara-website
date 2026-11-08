import { notFound } from "next/navigation";

// Catches unknown URLs so they get the 404 in the right language.
export default function Missing() {
  notFound();
}
