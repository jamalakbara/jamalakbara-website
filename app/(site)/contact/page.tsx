import { ContactView } from "@/components/site/contact-view";
import { contact } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <ContactView
      copy={{
        label: "CONTACT / SAY HELLO",
        heading: contact.heading,
        intro: "Tell me what you’re building. I can help with the design, the development, or both.",
        tab: "SEND A MESSAGE",
        formLabel: "PROJECT BRIEF",
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@example.com",
        project: "Project",
        projectPlaceholder: "What's the project?",
        submit: "Send message",
        privacyNote: "Your email stays private.",
        privacyLink: "Privacy policy",
        errorName: "What's your name?",
        errorEmail: "That email doesn't look right.",
        errorMessage: "Tell me a bit about it.",
        statusHeading: "A few details are missing.",
        statusBody: "Check the highlighted fields below, then send your message.",
        sentHeading: "Opening WhatsApp…",
        sentBody: "Just hit send in the chat and I'll get back to you within a day or two.",
        greeting: "Hi Akbar, I'm {name}.",
        replyTo: "Reply to:",
        strip: { heading: "Curious what I’ve built?", label: "See the work", href: "/work" },
      }}
    />
  );
}
