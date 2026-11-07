import { ContactView } from "@/components/site/contact-view";
import { kontak } from "@/lib/site-data";

// Kontak: canvas 40. Same form as /contact, in Bahasa; the brief opens in WhatsApp.
export default function KontakPage() {
  return (
    <ContactView
      copy={{
        contentLang: "id",
        label: kontak.eyebrow,
        heading: kontak.heading,
        intro: "Ceritain apa yang lagi kalian bangun. Aku bisa bantu desain, development, atau dua-duanya.",
        tab: "KIRIM PESAN",
        formLabel: "BRIEF PROJECT",
        name: "Nama",
        namePlaceholder: "Nama kalian",
        email: "Email",
        emailPlaceholder: "kamu@contoh.com",
        project: "Project",
        projectPlaceholder: "Project-nya soal apa?",
        submit: "Kirim pesan",
        privacyNote: "Email kalian aman, nggak dibagikan.",
        privacyLink: "Kebijakan privasi",
        errorName: "Nama kalian siapa?",
        errorEmail: "Email-nya kayaknya belum bener.",
        errorMessage: "Ceritain sedikit soal project-nya.",
        statusHeading: "Ada yang belum diisi.",
        statusBody: "Cek kolom yang ditandai, terus kirim lagi.",
        sentHeading: "Lagi buka WhatsApp…",
        sentBody: "Tinggal tekan kirim di chat, nanti aku balas dalam sehari atau dua hari.",
        greeting: "Halo Akbar, aku {name}.",
        replyTo: "Balas ke:",
        note: {
          label: "CATATAN BUAT AKBAR",
          mail: "Kirim email",
          copied: "Tersalin",
          failed: "Gagal menyalin, pilih alamatnya manual",
          copyLabel: "Salin alamat email",
        },
        strip: { heading: "Mau baca tulisan aku dulu?", label: "Baca jurnal", href: "/jurnal" },
      }}
    />
  );
}
