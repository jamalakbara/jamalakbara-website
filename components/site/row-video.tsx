"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/site/button";
import { Pause, Play } from "@/components/site/icons";
import { useSite } from "@/lib/i18n/context";

// Wraps a project row whose first media slot is a looping video. Plays only
// the visible strip's video (desktop and mobile strips are both in the DOM)
// while the row is on screen. Reduced motion starts paused; the pause control
// (canvas "Quiet motion": continuous animation needs one) sits outside the
// row link, since a button can't live inside an <a>.
export function RowVideo({ children }: { children: React.ReactNode }) {
  const { ui } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const [layout, setLayout] = useState(0);
  const [corner, setCorner] = useState<{ left: number; top: number } | null>(null);
  const playing = choice ? choice === "play" : !reduced;

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const strip = matchMedia("(max-width: 1023px)");
    const onMotion = () => setReduced(motion.matches);
    const onStrip = () => setLayout((n) => n + 1);
    onMotion();
    motion.addEventListener("change", onMotion);
    strip.addEventListener("change", onStrip);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px 0px" });
    // Pin the control to the bottom-left of whichever slot holds the visible video.
    const ro = new ResizeObserver(() => {
      const wrap = ref.current;
      const slot = [...(wrap?.querySelectorAll("video") ?? [])].find((v) => v.offsetParent !== null)?.parentElement;
      if (!wrap || !slot) return setCorner(null);
      const w = wrap.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      setCorner({ left: r.left - w.left + 12, top: r.bottom - w.top - 12 - 48 });
    });
    if (ref.current) {
      io.observe(ref.current);
      ro.observe(ref.current);
    }
    return () => {
      motion.removeEventListener("change", onMotion);
      strip.removeEventListener("change", onStrip);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    ref.current?.querySelectorAll("video").forEach((v) => {
      if (playing && inView && v.offsetParent !== null) v.play().catch(() => {});
      else v.pause();
    });
  }, [playing, inView, layout]);

  return (
    <div ref={ref} className="f-rowvid">
      {children}
      <IconButton
        className="f-rowvid__btn"
        style={corner ?? undefined}
        aria-label={playing ? ui.work.videoPause : ui.work.videoPlay}
        onClick={() => setChoice(playing ? "pause" : "play")}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </IconButton>
    </div>
  );
}
