"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BottomSheet, usePhone } from "@/components/business/sheet";
import { Icon, type IconProps } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * Share, Save as PDF and Save as PNG for a page. PNG and PDF are a picture of the page's content
 * (the menu, filters and buttons are left out), with a line saying which workspace, page and day
 * it is; the PDF lays that picture out on A4 pages. The libraries load only when they're used.
 * Share uses the device's share sheet where there is one, otherwise it copies the link.
 */
export function PageActions({ title, workspace, tone = "light" }: { title: string; workspace: string; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const { busy, note, share, save } = usePageExport({ title, workspace });
  const menuRef = useRef<HTMLDivElement>(null);
  const phone = usePhone();
  useDismiss(open && !phone, menuRef, () => setOpen(false));

  const pick = (kind: "pdf" | "png") => {
    setOpen(false);
    void save(kind);
  };
  const dark = tone === "dark";
  const btn = dark ? "inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-white/15 bg-white/10 px-2.5 text-[12.5px] font-medium text-fg hover:bg-white/15" : buttonClass("secondary", "sm");
  return (
    <div className="relative flex items-center gap-2" data-export-hide data-page-actions>
      <button type="button" onClick={share} className={btn} data-share>
        <ShareIcon /> Share
      </button>
      <div ref={menuRef} className="relative">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" disabled={busy !== null} className={btn} data-save>
          {busy ? <Icon name="refresh" size={14} className="animate-spin" /> : <Icon name="download" size={14} />}
          {busy === "pdf" ? "Making PDF…" : busy === "png" ? "Making image…" : "Save"}
          {!busy && <Icon name="chevron-down" size={13} className="opacity-60" />}
        </button>
        {open && phone && (
          <BottomSheet open onClose={() => setOpen(false)} title={`Save ${title}`}>
            <div className="space-y-2 px-1 pb-2">
              <SheetRow onClick={() => pick("pdf")} badge="PDF" label="Save as PDF" hint="A4 pages, ready to send or print" data-save-pdf />
              <SheetRow onClick={() => pick("png")} badge="PNG" label="Save as image" hint="One picture of the whole page" data-save-png />
            </div>
          </BottomSheet>
        )}
        {open && !phone && (
          <div role="menu" className={menuPanel}>
            <button type="button" role="menuitem" onClick={() => pick("pdf")} className={menuRow} data-save-pdf>
              <FileBadge label="PDF" /> Save as PDF
            </button>
            <button type="button" role="menuitem" onClick={() => pick("png")} className={menuRow} data-save-png>
              <FileBadge label="PNG" /> Save as image (PNG)
            </button>
          </div>
        )}
      </div>
      <ExportNote note={note} dark={dark} />
    </div>
  );
}

/** A link in a page's More menu. */
export interface MenuLink {
  label: string;
  href: string;
  icon?: IconProps["name"];
  /** A file to download (CSV), not a page. */
  download?: boolean;
}

/**
 * A page's secondary actions behind one More button, so the header shows at most two buttons:
 * links (Export CSV, Import CSV, View software), anything passed as children (an Archive form,
 * which keeps its own confirmation), and Share / Save as PDF / Save as image when the page can be
 * exported. A menu under the button on bigger screens, a bottom sheet on phones.
 */
export function MoreMenu({ links = [], children, exportAs }: { links?: MenuLink[]; children?: ReactNode; exportAs?: { title: string; workspace: string } }) {
  const [open, setOpen] = useState(false);
  const phone = usePhone();
  const ref = useRef<HTMLDivElement>(null);
  const { busy, note, share, save } = usePageExport(exportAs ?? { title: "", workspace: "" });
  useDismiss(open && !phone, ref, () => setOpen(false));
  const close = () => setOpen(false);
  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  const desktop = (
    <div role="menu" className={cn(menuPanel, "w-60")} onSubmitCapture={() => setTimeout(close, 0)}>
      {links.map((l) => (
        <MenuLinkRow key={l.href} link={l} className={menuRow} onClick={close} />
      ))}
      {children && <div className="menu-slot">{children}</div>}
      {exportAs && (
        <>
          {(links.length > 0 || Boolean(children)) && <div role="separator" className="my-1 h-px bg-line" />}
          <button type="button" role="menuitem" onClick={run(share)} className={menuRow} data-share>
            <span className="flex w-8 justify-center text-muted">
              <ShareIcon />
            </span>
            Share link
          </button>
          <button type="button" role="menuitem" onClick={run(() => void save("pdf"))} className={menuRow} data-save-pdf>
            <FileBadge label="PDF" /> Save as PDF
          </button>
          <button type="button" role="menuitem" onClick={run(() => void save("png"))} className={menuRow} data-save-png>
            <FileBadge label="PNG" /> Save as image
          </button>
        </>
      )}
    </div>
  );

  const sheet = (
    <BottomSheet open onClose={close} title="More" data-more-actions-sheet>
      <div className="space-y-2 px-1 pb-2" onSubmitCapture={() => setTimeout(close, 0)}>
        {links.map((l) => (
          <MenuLinkRow key={l.href} link={l} className={sheetRow} onClick={close} />
        ))}
        {children && <div className="menu-slot space-y-2">{children}</div>}
        {exportAs && (
          <>
            <SheetRow onClick={run(share)} icon={<ShareIcon />} label="Share link" hint="People with access to this workspace can open it" data-share />
            <SheetRow onClick={run(() => void save("pdf"))} badge="PDF" label="Save as PDF" hint="A4 pages, ready to send or print" data-save-pdf />
            <SheetRow onClick={run(() => void save("png"))} badge="PNG" label="Save as image" hint="One picture of the whole page" data-save-png />
          </>
        )}
      </div>
    </BottomSheet>
  );

  return (
    <div ref={ref} className="relative" data-export-hide data-page-actions={exportAs ? "" : undefined} data-more-actions>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" disabled={busy !== null} className={buttonClass("secondary", "sm")} data-more-button>
        {busy ? <Icon name="refresh" size={14} className="animate-spin" /> : <Icon name="more" size={16} />}
        {busy === "pdf" ? "Making PDF…" : busy === "png" ? "Making image…" : "More"}
      </button>
      {open && (phone ? sheet : desktop)}
      <ExportNote note={note} />
    </div>
  );
}

function MenuLinkRow({ link, className, onClick }: { link: MenuLink; className: string; onClick: () => void }) {
  const inner = (
    <>
      <span className="flex w-8 shrink-0 justify-center text-muted">{link.icon && <Icon name={link.icon} size={15} />}</span>
      {link.label}
    </>
  );
  return link.download ? (
    <a href={link.href} download role="menuitem" className={className} onClick={onClick}>
      {inner}
    </a>
  ) : (
    <Link href={link.href} role="menuitem" className={className} onClick={onClick}>
      {inner}
    </Link>
  );
}

/** Closes a menu on a click outside it or Escape. */
function useDismiss(active: boolean, ref: React.RefObject<HTMLElement | null>, close: () => void) {
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      // A confirmation dialog opened from the menu counts as inside it.
      if (ref.current?.contains(t) || (t instanceof Element && t.closest("dialog[open]"))) return;
      closeRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) closeRef.current();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, ref]);
}

const menuPanel = "absolute right-0 top-full z-40 mt-1.5 w-52 rounded-xl border border-line bg-surface p-1 text-fg shadow-[0_16px_40px_-16px_rgb(0_0_0/0.35)]";
const menuRow = "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-subtle";
const sheetRow = "flex min-h-14 w-full items-center gap-3 rounded-2xl border border-line px-3.5 text-left text-[15px] font-medium active:bg-subtle";

function SheetRow({ onClick, badge, icon, label, hint, ...rest }: { onClick: () => void; badge?: string; icon?: ReactNode; label: string; hint: string } & { [data: `data-${string}`]: boolean | string | undefined }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-line px-3.5 text-left text-[15px] active:bg-subtle" {...rest}>
      {badge ? <FileBadge label={badge} /> : <span className="flex w-8 shrink-0 justify-center text-muted">{icon}</span>}
      <span className="flex-1 py-2">
        <span className="block font-medium">{label}</span>
        <span className="block text-[12.5px] text-faint">{hint}</span>
      </span>
    </button>
  );
}

/** Share, and Save as PDF or image, for a page: what the Share and Save buttons and the More menu run. */
function usePageExport({ title, workspace }: { title: string; workspace: string }) {
  const [busy, setBusy] = useState<null | "pdf" | "png">(null);
  const [note, setNote] = useState<string | null>(null);
  const flash = (text: string) => {
    setNote(text);
    window.setTimeout(() => setNote(null), 3500);
  };
  const share = async () => {
    const url = window.location.href;
    const data = { title: `${title} · ${workspace} — Saver Option Business`, url };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      flash("Link copied. It opens for people with access to this workspace.");
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      window.prompt("Copy this link", url);
    }
  };
  const save = async (kind: "pdf" | "png") => {
    setBusy(kind);
    try {
      const { canvas, breaks, ratio } = await capture({ title, workspace });
      const name = fileName(workspace, title, kind);
      if (kind === "png") {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("no image");
        download(blob, name);
      } else {
        const { jsPDF } = await import("jspdf");
        // Wide pages (a laptop screen) go on landscape A4, phone-width ones on portrait.
        const landscape = canvas.width / ratio > 900;
        const pdf = new jsPDF({ orientation: landscape ? "landscape" : "portrait", unit: "pt", format: "a4", compress: true });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 24;
        const imgW = pageW - margin * 2;
        const scale = imgW / canvas.width; // points per canvas pixel
        const perPage = Math.floor((pageH - margin * 2 - 10) / scale);
        let page = 0;
        for (let y = 0; y < canvas.height; page++) {
          let end = Math.min(canvas.height, y + perPage);
          // End the page between rows and cards, not through them, when there's a break in its last 40%.
          if (end < canvas.height) {
            const fit = breaks.filter((b) => b > y + perPage * 0.6 && b <= end);
            if (fit.length) end = Math.max(...fit);
          }
          const slice = document.createElement("canvas");
          slice.width = canvas.width;
          slice.height = end - y;
          const g = slice.getContext("2d");
          if (!g) throw new Error("no canvas");
          g.drawImage(canvas, 0, y, canvas.width, end - y, 0, 0, canvas.width, end - y);
          if (page > 0) pdf.addPage();
          pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, imgW, (end - y) * scale, undefined, "FAST");
          pdf.setFontSize(8);
          pdf.setTextColor(150);
          pdf.text(`${page + 1}`, pageW - margin, pageH - 10, { align: "right" });
          y = end;
        }
        download(pdf.output("blob"), name);
      }
      flash(kind === "pdf" ? "PDF saved." : "Image saved.");
    } catch (err) {
      console.error("[page-actions] export failed:", err instanceof Error ? err.message : err);
      flash("That didn't work. Please try again.");
    } finally {
      setBusy(null);
    }
  };
  return { busy, note, share, save };
}

/** The note after Share or Save ("Link copied", "PDF saved"): under the buttons, or a toast above the tab bar on phones. */
function ExportNote({ note, dark }: { note: string | null; dark?: boolean }) {
  if (!note) return null;
  return (
    <p
      role="status"
      className={cn(
        "absolute right-0 top-full z-40 mt-1.5 w-64 rounded-xl border px-3 py-2 text-[12.5px] shadow-lg max-sm:fixed max-sm:inset-x-4 max-sm:bottom-[calc(var(--tabbar,0px)+12px)] max-sm:top-auto max-sm:z-[95] max-sm:w-auto max-sm:rounded-2xl max-sm:px-4 max-sm:py-3 max-sm:text-[14px]",
        dark ? "border-white/15 bg-[#1a1530] text-fg" : "border-line bg-surface text-muted",
      )}
      data-page-actions-note
    >
      {note}
    </p>
  );
}

/**
 * A picture of the page's content (#main without what's marked data-export-hide), with a header line.
 * For the picture the page is laid out in full: anything that scrolls (a wide table, a long list) is
 * opened up, and the page is widened by what a table hid sideways, so nothing is cut off. A cover
 * hides that change while it happens. Also returns where rows and cards end, so a PDF page can end
 * between them.
 */
async function capture({ title, workspace }: { title: string; workspace: string }): Promise<{ canvas: HTMLCanvasElement; breaks: number[]; ratio: number }> {
  const node = document.getElementById("main");
  if (!node) throw new Error("no main");
  const { toCanvas } = await import("html-to-image");
  const cover = document.createElement("div");
  cover.setAttribute("aria-hidden", "true");
  cover.style.cssText = "position:fixed;inset:0;z-index:2147483646;background:var(--bg,#fafaf7);display:flex;align-items:center;justify-content:center;font:500 14px system-ui,sans-serif;color:#6b6b76";
  cover.textContent = "Preparing your file…";
  document.body.appendChild(cover);
  const undo: (() => void)[] = [];
  const set = (el: HTMLElement, prop: "overflow" | "maxHeight" | "width" | "maxWidth", value: string) => {
    const before = el.style[prop];
    el.style[prop] = value;
    undo.push(() => {
      el.style[prop] = before;
    });
  };
  try {
    let hidden = 0;
    for (const el of node.querySelectorAll<HTMLElement>("*")) {
      if (el.closest("[data-export-hide]")) continue;
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(`${cs.overflowX} ${cs.overflowY}`)) continue;
      hidden = Math.max(hidden, el.scrollWidth - el.clientWidth);
      set(el, "overflow", "visible");
      if (cs.maxHeight !== "none") set(el, "maxHeight", "none");
    }
    if (hidden > 0) {
      set(node, "width", `${Math.ceil(node.getBoundingClientRect().width + hidden)}px`);
      set(node, "maxWidth", "none");
    }
    // Let charts and tables settle into the new width.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 120));

    const box = node.getBoundingClientRect();
    const width = Math.ceil(node.scrollWidth);
    const height = Math.ceil(node.scrollHeight);
    const bg = getComputedStyle(document.body).backgroundColor || "#ffffff";
    // Large pages get a lower resolution so the picture stays within what browsers can draw.
    const ratio = Math.max(1, Math.min(2, 14000 / Math.max(1, height), 16000 / Math.max(1, width)));
    const options = {
      width,
      height,
      pixelRatio: ratio,
      backgroundColor: bg,
      cacheBust: true,
      // An image that can't be read is left blank instead of failing the whole file.
      imagePlaceholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      // The copy sits at the picture's left edge (its centring margins would push it out of frame).
      style: { margin: "0", maxWidth: "none" },
      filter: (n: Node) => !(n instanceof HTMLElement && (n.dataset.exportHide !== undefined || n.tagName === "DIALOG")),
    };
    // Safari draws web fonts and images only from the second pass.
    if (/^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)) await toCanvas(node, options);
    const shot = await toCanvas(node, options);

    const head = Math.round(44 * ratio);
    // Where a PDF page may end: under a row, card or section, or just above a card (so it moves whole).
    const blocks = [...node.querySelectorAll<HTMLElement>(":scope > *, .biz-card, tr, li, [data-summary-strip], section")].filter((el) => !el.closest("[data-export-hide]"));
    const breaks = blocks
      .flatMap((el) => {
        const r = el.getBoundingClientRect();
        return el.classList.contains("biz-card") ? [r.bottom, r.top - 8] : [r.bottom];
      })
      .map((y) => Math.round((y - box.top) * ratio) + head)
      .filter((b) => b > head)
      .sort((a, b) => a - b);

    const out = document.createElement("canvas");
    out.width = shot.width;
    out.height = shot.height + head;
    const g = out.getContext("2d");
    if (!g) throw new Error("no canvas");
    g.fillStyle = bg;
    g.fillRect(0, 0, out.width, out.height);
    g.fillStyle = "#6d28d9";
    g.font = `600 ${Math.round(13 * ratio)}px system-ui, -apple-system, Segoe UI, sans-serif`;
    const pad = Math.round(24 * ratio);
    g.fillText("Saver Option Business", pad, Math.round(28 * ratio));
    const brandW = g.measureText("Saver Option Business").width;
    g.fillStyle = "#6b6b76";
    g.font = `400 ${Math.round(13 * ratio)}px system-ui, -apple-system, Segoe UI, sans-serif`;
    const when = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    g.fillText(`  ·  ${workspace}  ·  ${title}  ·  ${when}`, pad + brandW, Math.round(28 * ratio));
    g.drawImage(shot, 0, head);
    return { canvas: out, breaks, ratio };
  } finally {
    for (const fn of undo.reverse()) fn();
    cover.remove();
  }
}

function fileName(workspace: string, title: string, ext: string): string {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug(workspace) || "workspace"}-${slug(title)}-${new Date().toISOString().slice(0, 10)}.${ext}`;
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </svg>
  );
}

function FileBadge({ label }: { label: string }) {
  return <span className="flex h-6 w-8 shrink-0 items-center justify-center rounded-md bg-subtle text-[9.5px] font-bold tracking-wide text-muted">{label}</span>;
}
