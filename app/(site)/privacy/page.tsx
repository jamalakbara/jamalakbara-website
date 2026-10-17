import Link from "next/link";
import { contact } from "@/lib/site-data";
import { Folder } from "@/components/site/folder";
import { ContactStrip } from "@/components/site/contact-strip";
import { ArrowDown, ArrowLeft, ArrowUp } from "@/components/site/icons";

// Privacy policy — server component in the article layout (head panel + one
// folder with an in-page index). Update UPDATED when the policy changes.

const UPDATED = "2026-10-18";

const SECTIONS = [
  { id: "what-this-covers", label: "What this covers" },
  { id: "what-i-collect", label: "What I collect" },
  { id: "cookies-and-storage", label: "Cookies and storage" },
  { id: "third-parties", label: "Third parties" },
  { id: "your-choices", label: "Your choices" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  const date = new Date(`${UPDATED}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="f-panel f-art-head">
        <div>
          <Link href="/" className="f-act">
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
        <div className="f-art-id">
          <div className="f-art-sig">
            <span className="f-tabtext">LEGAL / PRIVACY</span>
          </div>
          <div className="f-art-titlecol">
            <span className="f-meta f-muted">
              Last updated <time dateTime={UPDATED}>{date}</time>
            </span>
            <h1 className="f-display f-display--caps">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <Folder tab="THE FINE PRINT" n="01" bodyClassName="f-art-surface">
        <nav className="f-art-toc" aria-label="On this page">
          <div className="f-art-toc__list">
            <span className="f-tabtext">ON THIS PAGE</span>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="f-act">
                {s.label}
                <ArrowDown size={16} />
              </a>
            ))}
          </div>
        </nav>
        <div className="f-art-col">
          <div className="f-prose">
            <h2 id="what-this-covers">What this covers</h2>
            <p>
              This policy covers jamalakbara.com, the portfolio of Jamal Akbar Alam, a developer and
              designer based in Bandung, Indonesia. It explains what the site collects when you visit,
              why, and what you can do about it. The short version: very little, and nothing is sold.
            </p>

            <h2 id="what-i-collect">What I collect</h2>
            <ul>
              <li>
                <strong>Analytics, only with your consent.</strong> If you accept analytics cookies, Google
                Analytics records how the site is used: pages viewed, time on page, scroll depth, referrer,
                approximate location, and device, browser and screen details. I use it to see which work
                people read and what to improve.
              </li>
              <li>
                <strong>Messages you choose to send.</strong> The contact form doesn’t store anything on this
                site. It opens WhatsApp with your message pre-filled, and nothing is sent until you press send
                there. If you email me, I receive whatever you write. I use it only to reply to you.
              </li>
              <li>
                <strong>Server logs.</strong> Like any website, the hosting provider keeps standard request logs
                (IP address, browser, requested page) for security and reliability.
              </li>
            </ul>
            <p>There are no accounts, newsletters, payments or advertising on this site.</p>

            <h2 id="cookies-and-storage">Cookies and storage</h2>
            <ul>
              <li>
                <strong>Essential:</strong> your cookie choice is saved in your browser’s local storage
                (<code>cookie-consent</code>) so the banner doesn’t ask again, and a session flag
                (<code>f-splash</code>) makes the intro animation play once per visit. Neither leaves your
                browser.
              </li>
              <li>
                <strong>Analytics:</strong> Google Analytics cookies (<code>_ga</code>, <code>_ga_*</code>) are
                set only after you accept analytics. Decline and they’re never set.
              </li>
            </ul>
            <p>The site runs no ads, so no marketing or advertising cookies are set, whatever you pick in the banner.</p>

            <h2 id="third-parties">Third parties</h2>
            <p>The site relies on a few services, each with its own privacy policy:</p>
            <ul>
              <li>
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Google Analytics
                </a>{" "}
                — usage statistics, only with consent.
              </li>
              <li>
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Vercel
                </a>{" "}
                — hosting and request logs.
              </li>
              <li>
                <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer">
                  Cloudinary
                </a>{" "}
                — delivers the project images.
              </li>
              <li>
                <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>{" "}
                — only if you use the contact form.
              </li>
            </ul>
            <p>Fonts are served from this site, not from a third party.</p>

            <h2 id="your-choices">Your choices</h2>
            <ul>
              <li>
                To change your cookie choice, clear this site’s data in your browser and the banner will ask
                again.
              </li>
              <li>
                You can block cookies entirely, or use Google’s{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  Analytics opt-out add-on
                </a>
                .
              </li>
              <li>
                You can ask me to see or delete any messages you’ve sent me.
              </li>
            </ul>

            <h2 id="contact">Contact</h2>
            <p>
              Questions about this policy or your data? Email{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>. If the policy changes, the date at the
              top of this page changes with it.
            </p>
          </div>
          <div className="f-art-end">
            <Link href="/" className="f-act">
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <a href="#main" className="f-act">
              Back to top
              <ArrowUp size={16} />
            </a>
          </div>
        </div>
      </Folder>

      <ContactStrip />
    </>
  );
}
