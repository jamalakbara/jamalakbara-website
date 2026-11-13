# Off-site profiles: bios and checklist

Goal: make "Jamal Akbar Alam" and "jamalakbara" mean one person on Google. The site already says so (full name everywhere, Person schema with `sameAs`). These five profiles must say the same thing and link back to https://jamalakbara.com.

Written 13 Nov 2026. Platform character limits are from memory, so if a field refuses a bio, trim it.

## Rules for every profile

1. **Name field:** `Jamal Akbar Alam`. Not "Akbar", not "Chairil Akbar".
2. **Username:** `jamalakbara` (already the same on all five).
3. **Photo:** the same portrait as the site (`public/profile-image.png`), square crop.
4. **Location:** Bandung, West Java, Indonesia.
5. **Link:** `https://jamalakbara.com`, plain, no tracking parameters.
6. **Role words:** "developer & designer" on GitHub, Instagram, X and Facebook. LinkedIn is the one exception and keeps its own headline (see below). Same name, username, photo and link still tie it to the others.
7. **No numbers you can't back up** (years of experience, client counts). The site says "5+ years" in one place only, so leave it out of bios.

## The one-line bio (source for everything below)

- **EN:** Developer & designer in Bandung. I build fast, clean websites, web apps and Shopify stores, from design to code.
- **ID:** Developer & desainer di Bandung. Bikin website, aplikasi web, dan toko online yang cepat dan gampang dipake, dari desain sampai kode.

Use ID on Instagram and Facebook (mostly Indonesian audience) and EN on GitHub and X.

---

## LinkedIn (`linkedin.com/in/jamalakbara`)

**Decision (13 Nov 2026): leave the LinkedIn profile as it is.** Its headline, "Backend & Frontend Developer | Python, FastAPI, Next.js | AI-Augmented Engineering", stays. It is a different angle from the site (developer and designer, websites, Shopify), and that is accepted.

What still matters, with no rewrite needed:

- **Name field:** must read `Jamal Akbar Alam`.
- **Custom URL:** `linkedin.com/in/jamalakbara`.
- **Website link** in Contact info: `https://jamalakbara.com`. Without this link LinkedIn does not point back to the site at all.
- **Location:** Bandung, West Java, Indonesia.

Optional, only if you change your mind later: a headline that matches the site, such as `Developer & Designer in Bandung | Websites, web apps & Shopify stores | jamalakbara.com`.

---

## GitHub (`github.com/jamalakbara`)

- **Name:** Jamal Akbar Alam
- **Bio** (113 of 160): `Developer & designer in Bandung. I build fast, clean websites, web apps and Shopify stores. Open to new projects.`
- **Website:** `https://jamalakbara.com`
- **Location:** Bandung, Indonesia
- **Profile README:** create a public repo named exactly `jamalakbara`, with a `README.md`:

  ```md
  # Hi, I'm Jamal Akbar Alam

  Developer & designer in Bandung, Indonesia. I build fast, clean websites,
  web apps and Shopify stores, from design to code.

  - Portfolio and journal: [jamalakbara.com](https://jamalakbara.com)
  - Work with me: [jamalakbara.com/contact](https://jamalakbara.com/contact)
  ```

- **Pinned repos:** pin 4 to 6 you are happy to be judged by. Give each a one-line description and a homepage link. A search for `jamalakbara` currently surfaces demo repos (a furniture-store project and its GitHub Pages site), so either pin and describe them properly or make weak ones private or archive them.
- **Repo owner on public commits:** make sure the commit email is attached to this account so contributions show up.

## Instagram (`instagram.com/jamalakbara`)

- **Name field** (searchable, 39 of 64): `Jamal Akbar Alam | Developer & Designer`
- **Bio** (89 of 150):

  ```
  Developer & desainer di Bandung
  Bikin website, aplikasi web & toko online
  jamalakbara.com
  ```

- **Link:** `https://jamalakbara.com`
- **Category** (needs a professional account, your call): Web Designer.
- **Highlights:** optional, one "Work" and one "Process". Same portrait as the site.

## X (`x.com/jamalakbara`)

- **Name:** Jamal Akbar Alam
- **Bio** (112 of 160): `Developer & designer in Bandung. I build fast, clean websites, web apps and Shopify stores, from design to code.`
- **Location:** Bandung, Indonesia
- **Website:** `https://jamalakbara.com`
- **Pinned post:** one post that links to the portfolio or a journal post. Replace it when you publish something better.

## Facebook (`facebook.com/jamalakbara`)

- **Name:** Jamal Akbar Alam
- **Intro** (71 of 101): `Developer & desainer di Bandung. Website & toko online. jamalakbara.com`
- **Details:** Work = Developer & Designer at jamalakbara. Lives in Bandung.
- **Website link:** `https://jamalakbara.com` under Contact and basic info.
- **Username:** `facebook.com/jamalakbara` (Settings, Profile and tagging, Username).
- **Optional:** a Page named `jamalakbara.` for the business, if you want one place that is not tied to a personal profile. Skip it if you will not keep it up.

---

## Order of work

1. GitHub, including the profile README.
2. Instagram, X, Facebook.
3. LinkedIn: only confirm the name, URL and website link.
4. Open each profile in a private window and check that the name, photo, and link match.

## Then verify (2 to 4 weeks later)

- Search `jamalakbara` and `jamal akbar alam developer bandung` in a private window. Look for: the home page (not the privacy page) for your name, plus your profiles on page one.
- Search Console: watch impressions for the queries `jamalakbara` and `jamal akbar alam`.
- Re-run the brand SERP check in OpenSEO after about 8 weeks.

## Known loose ends

- **Pinterest:** a profile titled "Chairil Akbar (jamalakbara)" appears for your handle. You did not list it, so it is optional. If it is yours, rename it to Jamal Akbar Alam or leave it. Do not link it from the site.
- **`sameAs` on the site** (`content/site/seo.json`) lists `twitter.com/jamalakbara`. It redirects to X and is fine. Switch it to `x.com/jamalakbara` if you want it exact.
- **Contra, Dribbble, Behance:** not needed. Add them to `sameAs` only if you later create real profiles.
