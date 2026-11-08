"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { renderInterfacePreview } from "@/lib/admin/interface-preview-action";

const sectionTargets: Record<string, string> = {
  receipt: ".f-receipt",
  strip: ".f-strip",
  note: ".f-note",
};

const copyElements = "h1,h2,h3,h4,p,a,button,label,summary,span,li,dt,dd,figcaption";
const controlAttributes = ["placeholder", "aria-label", "alt", "title", "data-msg"];
const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

function scrollPreview(target: Element, align: "start" | "center") {
  const scroll = target.closest<HTMLElement>(".f-scroll");
  if (!scroll) return;
  const viewport = scroll.getBoundingClientRect();
  const bounds = target.getBoundingClientRect();
  if (align === "center" && bounds.top >= viewport.top && bounds.bottom <= viewport.bottom) return;
  const offset = align === "center" ? (scroll.clientHeight - bounds.height) / 2 : 0;
  scroll.scrollTo({ top: scroll.scrollTop + bounds.top - viewport.top - offset, behavior: "instant" });
}

function findCopy(root: HTMLElement, value: string) {
  const pattern = normalize(value).split(/(\{name\}|\{n\})/g).map((part) => {
    if (part === "{n}") return "\\d+";
    if (part === "{name}") return ".+?";
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }).join("");
  const exact = new RegExp(`^${pattern}$`);
  const embedded = normalize(value).length >= 4
    ? new RegExp(`(?:^|[^\\p{L}\\p{N}])${pattern}(?:$|[^\\p{L}\\p{N}])`, "u")
    : exact;
  const visible = (element: HTMLElement) =>
    element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility === "visible" &&
    !element.closest('[aria-hidden="true"], .f-sr, svg');
  const deepest = (matches: HTMLElement[]) =>
    matches.filter((element) => !matches.some((other) => other !== element && element.contains(other)));
  const elements = Array.from(root.querySelectorAll<HTMLElement>(copyElements)).filter(visible);
  const direct = deepest(elements.filter((element) => exact.test(normalize(element.innerText))));
  if (direct.length) return { elements: direct, kind: "text" };
  const controls = Array.from(root.querySelectorAll<HTMLElement>(controlAttributes.map((attr) => `[${attr}]`).join(",")))
    .filter((element) => visible(element) && controlAttributes.some((attr) => {
      const text = element.getAttribute(attr);
      return text && embedded.test(normalize(text));
    }));
  if (controls.length) return { elements: controls, kind: "control" };
  return {
    elements: deepest(elements.filter((element) => embedded.test(normalize(element.innerText)))),
    kind: "text",
  };
}

export function InterfacePreviewFrame({ section: initialSection, children }: { section: string; children: ReactNode }) {
  const [preview, setPreview] = useState<{ section: string; view: ReactNode; field?: string; value?: string }>();
  const [error, setError] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const section = preview?.section ?? initialSection;

  useEffect(() => {
    document.documentElement.lang = "id";
    let request = 0;
    let timer: ReturnType<typeof setTimeout>;

    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const { type, section, draft, field, key, value } = event.data ?? {};
      if (type !== "interface-preview" || typeof section !== "string" || !draft || typeof draft !== "object") return;
      const current = ++request;
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const view = await renderInterfacePreview(section, draft, typeof key === "string" ? key : undefined);
          if (current === request) {
            setPreview({
              section,
              view,
              field: typeof field === "string" ? field : undefined,
              value: typeof value === "string" ? value : undefined,
            });
            setError(false);
          }
        } catch {
          if (current === request) setError(true);
        }
      }, 250);
    }

    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "interface-preview-ready" }, window.location.origin);
    return () => {
      window.removeEventListener("message", receive);
      clearTimeout(timer);
      request++;
    };
  }, []);

  useEffect(() => {
    const selector = section && sectionTargets[section];
    if (!selector) return;
    const frame = requestAnimationFrame(() => {
      const target = root.current?.querySelector(selector);
      if (target) scrollPreview(target, "start");
    });
    return () => cancelAnimationFrame(frame);
  }, [section]);

  useEffect(() => {
    const container = root.current;
    const field = preview?.field;
    const value = preview?.value;
    if (!container || !field || !value?.trim()) return;

    let frame = 0;
    let initialMatch = true;
    let highlighted: HTMLElement | undefined;
    let previousMatch: string | undefined;
    function highlight() {
      if (!container || !field || !value) return;
      const jump = initialMatch;
      initialMatch = false;
      highlighted?.removeAttribute("data-interface-preview-highlight");
      const { elements, kind } = findCopy(container, value);
      highlighted = elements.length === 1 ? elements[0] : undefined;
      const match = highlighted ? kind : elements.length ? "multiple" : "missing";
      if (match !== previousMatch) {
        window.parent.postMessage({ type: "interface-preview-match", field, value, match }, window.location.origin);
        previousMatch = match;
      }
      if (!highlighted) return;
      highlighted.setAttribute("data-interface-preview-highlight", "");
      if (jump) scrollPreview(highlighted, "center");
    }
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(highlight);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...controlAttributes, "aria-hidden", "open", "hidden", "data-open"],
    });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      highlighted?.removeAttribute("data-interface-preview-highlight");
    };
  }, [preview]);

  return (
    <div
      ref={root}
      data-interface-preview
      onClickCapture={(event) => {
        const link = (event.target as Element).closest("a[href]");
        if (link && !link.getAttribute("href")?.startsWith("#")) event.preventDefault();
      }}
    >
      {error && <p role="alert" className="f-body">The preview could not load. Edit a field or choose a section to retry.</p>}
      {preview?.view ?? children}
    </div>
  );
}
