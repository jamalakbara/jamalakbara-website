"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LayoutGroup, animate, motion } from "framer-motion";
import { Stamp } from "@/components/site/stamp";

// First-load intro (once per session): the identity name types out letter by
// letter, the stamp slams onto the middle of it, then glides into its slot
// between JAMAL and AKBAR (the hero lockup). On home the lockup then morphs
// onto the real hero name; elsewhere the overlay lifts away.
// Gated before paint by the inline script in app/(site)/layout.tsx:
// html[data-splash] = "run" | "off" | "done" (site.css hides it unless "run").

// Text runs exactly as the hero splits them: "JAMAL" | stamp | "AKBAR ALAM".
// Each run stays ONE text node so Comico shapes it identically to the hero
// (its contextual alternates read across the space in "AKBAR ALAM").
const RUNS = ["JAMAL", "AKBAR ALAM"] as const;
const START = [0, 5]; // global letter index where each run starts
const BREAKS = [5, 10]; // letters after which a word ends (typing breathes)
const TOTAL = 14;
const letters = (t: string) => t.replace(/ /g, "").length;
// char offset in `t` after `k` letters (spaces ride along with the next letter)
const offset = (t: string, k: number) => {
  let i = 0;
  for (let n = 0; i < t.length && n < k; i++) if (t[i] !== " ") n++;
  return i;
};

type Phase = "typing" | "settled";

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const ease = [0.65, 0, 0.2, 1] as const;

export function Splash() {
  const [gone, setGone] = useState(false);
  const [typed, setTyped] = useState(0);
  const [caret, setCaret] = useState(true);
  const [phase, setPhase] = useState<Phase>("typing");
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const stampRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stopped = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.splash !== "run") return void setGone(true);
    stopped.current = false;
    try {
      sessionStorage.setItem("f-splash", "1");
    } catch {}

    const root = rootRef.current!;
    const name = nameRef.current!;

    const finish = () => {
      html.dataset.splash = "done";
      setGone(true);
    };

    const fade = async (ms: number) => {
      await Promise.all([
        animate(name, { y: -24, opacity: 0 }, { duration: ms / 1000, ease }),
        animate(root, { opacity: 0 }, { duration: ms / 1000, ease }),
      ]);
      finish();
    };

    // Land the splash lockup on the hero lockup: scale by the stamp ratio
    // (text and stamp share breakpoints) and align the stamp centers.
    const morph = async () => {
      const hero = Array.from(
        document.querySelectorAll<HTMLElement>(".f-hero__name .f-stamp"),
      ).find((el) => el.getBoundingClientRect().width > 0);
      const own = name.querySelector<HTMLElement>(".f-stamp");
      const to = hero?.getBoundingClientRect();
      if (!to || !own || to.bottom < 0 || to.top > window.innerHeight) return fade(500);
      const from = own.getBoundingClientRect();
      const box = name.getBoundingClientRect();
      const ox = from.left + from.width / 2 - box.left;
      const oy = from.top + from.height / 2 - box.top;
      name.style.transformOrigin = `${ox}px ${oy}px`;
      await Promise.all([
        animate(
          name,
          {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
          },
          { duration: 0.75, ease },
        ),
        animate(root, { backgroundColor: "rgba(248, 246, 240, 0)" }, { duration: 0.6, ease }),
      ]);
      finish();
    };

    (async () => {
      await Promise.race([document.fonts?.ready, wait(1000)]);
      await wait(250);
      for (let i = 1; i <= TOTAL; i++) {
        if (stopped.current) return;
        setTyped(i);
        // word breaks breathe a little; jitter reads as hand-typed
        await wait(55 + Math.random() * 35 + (BREAKS.includes(i) ? 110 : 0));
      }
      await wait(300);
      if (stopped.current) return;
      setCaret(false);
      // One stamp element for the whole intro (mounted hidden from the start,
      // so the artwork is decoded and never swapped): slam big over the middle…
      const stamp = stampRef.current!;
      // Stamp and letters start in the same frame on one clock: the stamp
      // makes contact at 240ms (end of its drop) and the letters take the hit
      // in that same instant — no separate timer to drift.
      const SLAM = 0.5;
      const HIT = 0.24 / SLAM;
      animate(
        stamp,
        { opacity: [0, 1, 1, 1], scale: [1.7, 0.92, 1.02, 1], rotate: [-9, 1, -0.3, 0] },
        { duration: SLAM, times: [0, HIT, HIT + 0.2, 1], ease: ["easeIn", "easeOut", "easeInOut"] },
      );
      animate(
        name,
        { y: [0, 0, 5, -1, 0], scale: [1, 1, 0.99, 1.002, 1] },
        { duration: SLAM, times: [0, HIT, HIT + 0.08, HIT + 0.3, 1], ease: ["linear", "easeOut", "easeInOut", "easeOut"] },
      );
      await wait(SLAM * 1000 + 450);
      if (stopped.current) return;
      // …then the slot opens (words glide apart via layout) and the stamp
      // shrinks + flies into it.
      setPhase("settled");
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (stopped.current) return;
      const from = stamp.getBoundingClientRect();
      const to = slotRef.current!.getBoundingClientRect();
      animate(
        stamp,
        {
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: to.width / from.width,
        },
        { duration: 0.7, ease },
      );
      await wait(1000);
      if (stopped.current) return;
      morph();
    })();

    return () => {
      stopped.current = true;
    };
  }, []);

  // Typing reveal. Each word stays ONE text run (exactly like the hero) so
  // Comico's kerning + contextual alternates shape it identically; letters are
  // revealed by clipping at the shaped glyph boundary (Range measurement)
  // instead of per-letter spans, which would break shaping.
  useLayoutEffect(() => {
    const name = nameRef.current;
    if (gone || !name) return;
    const box = name.getBoundingClientRect();
    let caretAt: DOMRect | null = null;
    RUNS.forEach((text, w) => {
      const el = wordRefs.current[w];
      const node = el?.firstChild;
      if (!el || !node) return;
      const n = letters(text);
      const k = Math.min(Math.max(typed - START[w], 0), n);
      const range = document.createRange();
      range.setStart(node, 0);
      range.setEnd(node, offset(text, k));
      const full = el.getBoundingClientRect();
      const shown = k ? range.getBoundingClientRect() : null;
      el.style.visibility = k ? "visible" : "hidden";
      el.style.clipPath =
        k && k < n ? `inset(-0.3em ${full.right - shown!.right}px -0.3em -0.3em)` : "";
      if (typed === 0 && w === 0) caretAt = new DOMRect(full.left, full.top, 0, full.height);
      else if (k > 0 && typed <= START[w] + n)
        caretAt = new DOMRect(shown!.right, full.top, 0, full.height); // line box, not glyph box
    });
    const c = caretRef.current;
    if (c && caretAt) {
      const at = caretAt as DOMRect;
      c.style.transform = `translate(${at.right - box.left}px, ${at.top - box.top}px)`;
      c.style.height = `${at.height}px`;
    }
  }, [typed, gone]);

  if (gone) return null;

  // reveal styles live on this plain span: framer rewrites the motion span's
  // style attribute during the layout move
  const run = (w: number) => (
    <span
      ref={(el) => {
        wordRefs.current[w] = el;
      }}
      className="f-splash__text"
    >
      {RUNS[w]}
    </span>
  );

  return (
    <div ref={rootRef} className="f-splash" aria-hidden="true">
      <LayoutGroup>
        <p ref={nameRef} className="f-identity f-splash__name">
          <span className="f-splash__line">
            <motion.span layout="position" className="f-splash__word" transition={{ duration: 0.7, ease }}>
              {run(0)}
            </motion.span>
            <span ref={slotRef} className={phase === "settled" ? "f-splash__slot f-splash__slot--open" : "f-splash__slot"} />
          </span>
          <motion.span layout="position" className="f-splash__line" transition={{ duration: 0.7, ease }}>
            {run(1)}
          </motion.span>
          {caret && <span ref={caretRef} className="f-splash__caret" />}
          <span className="f-splash__drop">
            <span ref={stampRef} className="f-splash__stamp" style={{ opacity: 0 }}>
              <Stamp size={108} />
            </span>
          </span>
        </p>
      </LayoutGroup>
    </div>
  );
}
