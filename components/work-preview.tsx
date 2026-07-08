"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import type { WorkRow } from "@/lib/site-data";

/**
 * Floating media preview that trails the cursor on the work list.
 * Reuses the site's cinematic-glass language: blur-fade-up reveal,
 * cubic-bezier overshoot, warm film-grade overlay. Shows each project's
 * image, swapping to a muted-loop video on hover where one exists.
 */
export default function WorkPreview({ active }: { active: WorkRow | null }) {
  const reduce = useReducedMotion();
  const [hasHover, setHasHover] = useState(false);
  const [vidReady, setVidReady] = useState(false);

  // cursor target (raw) -> springed follow (laggy trail)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // velocity-driven tilt (awwwards flourish)
  const velX = useVelocity(springX);
  const tilt = useTransform(velX, [-1500, 1500], [-5, 5], { clamp: true });
  const tiltSpring = useSpring(tilt, { stiffness: 300, damping: 20 });

  // inner-media parallax: image drifts opposite the cursor's travel
  const parallax = useTransform(velX, [-1500, 1500], [8, -8], { clamp: true });
  const parallaxSpring = useSpring(parallax, { stiffness: 200, damping: 25 });

  const followX = reduce ? mouseX : springX;
  const followY = reduce ? mouseY : springY;
  const rotate = reduce ? 0 : tiltSpring;
  const mediaShift = reduce ? 0 : parallaxSpring;

  // only enable on devices with a real pointer that can hover
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // track cursor (even before hover, so the panel reveals already at the cursor)
  useEffect(() => {
    if (!hasHover) return;
    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [hasHover, mouseX, mouseY]);

  // reset video fade whenever the hovered project changes
  useEffect(() => {
    setVidReady(false);
  }, [active?.id]);

  if (!hasHover) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: followX,
        y: followY,
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.85, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 0.9,
              filter: "blur(12px)",
              transition: { duration: 0.3, ease: "easeIn" },
            }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              x: "-50%",
              // cursor rides near the bottom edge so the hovered row stays readable
              y: "-70%",
              rotate,
              width: "clamp(280px, 26vw, 420px)",
              borderRadius: "1rem",
              overflow: "hidden",
              position: "relative",
              padding: "0.375rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              background: "rgba(20,15,12,0.55)",
              backdropFilter: "blur(20px) saturate(1.2)",
              WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              border: "1px solid rgba(246,243,240,0.12)",
              boxShadow:
                "inset 0 1px 0 0 rgba(246,243,240,0.1), 0 24px 80px 0 rgba(1,0,8,0.3), 0 12px 40px 0 rgba(1,0,8,0.35), 0 4px 12px 0 rgba(1,0,8,0.4)",
            }}
          >
            {/* media well */}
            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 9",
                borderRadius: "0.65rem",
                overflow: "hidden",
                background: "rgba(12,9,8,0.4)",
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  x: mediaShift,
                  scale: 1.06,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "saturate(0.9) brightness(0.85)",
                  }}
                />

                {active.video && (
                  <video
                    key={active.id}
                    src={active.video}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="none"
                    onCanPlay={() => setVidReady(true)}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "saturate(0.9) brightness(0.85)",
                      opacity: vidReady ? 1 : 0,
                      transition: "opacity 0.4s ease",
                    }}
                  />
                )}
              </motion.div>

              {/* warm film-grade overlay — keeps preview on-brand */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(224,135,91,0.28) 0%, rgba(60,28,40,0.18) 55%, rgba(28,40,64,0.22) 100%)",
                  mixBlendMode: "soft-light",
                  pointerEvents: "none",
                }}
              />
              {/* subtle vignette for depth */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(120% 120% at 50% 0%, transparent 55%, rgba(12,9,8,0.45) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* caption strip — remounts per project for a quick swap fade */}
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "0.75rem",
                padding: "0.35rem 0.55rem 0.3rem",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.5rem",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    color: "var(--m4)",
                  }}
                >
                  {active.num}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "0.9rem",
                    color: "var(--ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {active.title}
                </span>
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.06em",
                  color: "var(--m3)",
                  whiteSpace: "nowrap",
                }}
              >
                {active.category} — {active.year}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
