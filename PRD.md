# Product Requirements Document (PRD)

**Project Name:** Jamalakbara Portfolio Revamp (v2.0)
**Date:** December 24, 2025
**Goal:** To transform the existing portfolio into an immersive, high-end "Creative Developer" experience that showcases technical mastery and design sensibility, aiming for Awwwards recognition.

---

## 1. Project Overview & Objectives

* **Primary Objective:** Create a portfolio that feels "alive" through advanced motion, smooth physics, and micro-interactions, rather than just displaying static content.
* **Target Audience:** High-ticket clients, tech recruiters, and the design community (Awwwards/CSSDA judges).
* **Key Success Metrics:**
* Lighthouse Performance Score > 90 (despite heavy animations).
* "Site of the Day" (SOTD) or "Honorable Mention" recognition potential.
* User retention time > 2 minutes.



---

## 2. Technical Stack

* **Framework:** **Next.js 15 (App Router)** – *For SEO, image optimization, and routing.*
* **Styling:** **Tailwind CSS** – *For rapid layout and utility-first styling.*
* **Animation Engine:** **GSAP (GreenSock)** – *Core requirement for timelines, ScrollTrigger, and text splits.*
* **Scroll Physics:** **Lenis** – *Non-negotiable for that "premium" smooth scroll feel.*
* **3D/WebGL (Optional):** **React Three Fiber (R3F)** or **OGL** – *For image distortions and hover effects.*
* **State Management:** **Zustand** – *Lightweight global state (e.g., for loading states or menu toggles).*
* **Deployment:** **Vercel** – *For edge network performance.*

---

## 3. Design Principles (The "Vibe")

* **Typography-Driven:** Use massive, oversized sans-serif fonts (6vw+) for headers to create impact.
* **Physics-Based:** Elements should have weight and inertia. Nothing stops instantly; everything settles.
* **Texture:** A subtle grain/noise overlay to remove the "digital coldness."
* **Dark Mode First:** A deep charcoal or black background (`#0a0a0a`) with off-white text for contrast and elegance.

---

## 4. Functional Requirements & Features

### 4.1. Global Features

| Feature | Description | Tech/Tool |
| --- | --- | --- |
| **Preloader** | A minimal, typography-based counter (0-100%) that masks asset loading. Upon completion, the screen "curtains" up to reveal the Hero. | GSAP, React Context |
| **Smooth Scroll** | Inertia-based scrolling that normalizes behavior across mouse/trackpad. | Lenis |
| **Noise Overlay** | A fixed `div` with SVG noise pattern and `mix-blend-mode: overlay` to add texture. | CSS |
| **Custom Cursor** | A small dot that expands or magnetically snaps when hovering over clickable elements. | Framer Motion / GSAP |

### 4.2. Navigation (Header)

* **Behavior:** "Smart Hide." The navbar disappears when scrolling down (to focus on content) and reappears immediately when scrolling up.
* **Style:** Minimal. Just "Jamal" (Logo) on the left and a "Menu" button or simple links on the right.
* **Micro-interaction:** Links should have a "staggered text" hover effect (the letters slide up and are replaced by identical letters from below).

### 4.3. Hero Section (Above the Fold)

* **Content:** Large title: "CREATIVE DEVELOPER" or "ENGINEERING EXPERIENCE."
* **Animation:** Text enters via `SplitText` (lines stagger up from opacity 0).
* **Interaction:** A "Scroll Down" indicator that disappears on first scroll.

### 4.4. Selected Works (The Core)

* **Layout:** **Bento Grid** style. Asymmetrical grid boxes showcasing projects.
* **Content:** Project Name, Tech Stack tags, Large Thumbnail/Video.
* **Hover Effect:**
* **Desktop:** The cursor acts as a flashlight or the image distorts (liquid effect) using WebGL.
* **Text:** Project title follows the mouse slightly (parallax).


* **Transition:** Clicking a project uses the **View Transitions API** or GSAP Flip to expand the thumbnail into the full Case Study header seamlessly.

### 4.5. About / Expertise Section

* **Layout:** Two-column layout. Left: "About Me" text. Right: Skills list.
* **Features:**
* **Marquee:** A running ticker of skills (React • Next.js • Node • Python) that changes direction based on scroll direction.
* **Image Reveal:** Hovering over a specific keyword (e.g., "Minimalist") reveals a relevant image floating near the cursor.



### 4.6. Footer

* **Effect:** **Sticky Curtain Reveal.** The footer sits at `z-index: 0` behind the main content (`z-index: 1`). As the user scrolls to the bottom, the main content slides *up* to reveal the static footer underneath.
* **Call to Action:** Massive "Let's Talk" email link with a magnetic button effect.

---

## 5. Non-Functional Requirements

* **Performance:** All images must use `next/image` with WebP/AVIF formats. WebGL effects must pause when not in the viewport to save battery.
* **Responsiveness:** The "Bento Grid" must collapse gracefully into a single-column stack on mobile. Complex WebGL hover effects should be disabled on touch devices.
* **SEO:** Dynamic `sitemap.xml` and structured data (JSON-LD) for "Person" and "WebSite."

---

## 6. Development Phases

### Phase 1: The Skeleton (Days 1-3)

* Setup Next.js 15 project structure.
* Configure Tailwind and Fonts.
* Implement **Lenis** smooth scrolling (verify it works on all browsers).
* Build the static layout for Hero and Grid.

### Phase 2: The Motion (Days 4-7)

* Implement **GSAP** timelines.
* Build the Preloader.
* Add scroll-triggered animations (text reveals).
* Implement the Sticky Footer.

### Phase 3: The "Juice" (Days 8-10)

* Add the **WebGL** distortion on project images.
* Add the Noise overlay.
* Implement magnetic buttons and custom cursor.
* Final polish and performance auditing.