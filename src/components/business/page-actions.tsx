"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cn } from "@/components/ui/primitives";

/**
 * Share, Save as PDF and Save as PNG for a page. PNG and PDF are a picture of the page's content
 * (the menu, filters and buttons are left out), with a line saying which workspace, page and day
 * it is; the PDF lays that picture out on A4 pages. The libraries load only when they're used.
 * Share uses the device's share sheet where there is one, otherwise it copies the link.
 */
export function PageActions({ title, workspace, tone = "light" }: { title: string; workspace: string; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<null | "pdf" | "png">(null);
  const [note, setNote] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
    setOpen(false);
    setBusy(kind);
    try {
      const canvas = await capture({ title, workspace });
      const name = fileName(workspace, title, kind);
      if (kind === "png") {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("no image");
        download(blob, name);
      } else {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4", compress: true });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 24;
        const imgW = pageW - margin * 2;
        const imgH = (canvas.height * imgW) / canvas.width;
        const usable = pageH - margin * 2;
        const image = canvas.toDataURL("image/jpeg", 0.92);
        // One tall picture, shown a page-height at a time.
        for (let y = 0, page = 0; y < imgH; y += usable, page++) {
          if (page > 0) pdf.addPage();
          pdf.addImage(image, "JPEG", margin, margin - y, imgW, imgH, undefined, "FAST");
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pageW, margin, "F");
          pdf.rect(0, pageH - margin, pageW, margin, "F");
          pdf.setFontSize(8);
          pdf.setTextColor(150);
          pdf.text(`${page + 1}`, pageW - margin, pageH - 10, { align: "right" });
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
        {open && (
          <div role="menu" className="absolute right-0 top-full z-40 mt-1.5 w-52 rounded-xl border border-line bg-surface p-1 text-fg shadow-[0_16px_40px_-16px_rgb(0_0_0/0.35)]">
            <button type="button" role="menuitem" onClick={() => save("pdf")} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-subtle" data-save-pdf>
              <FileBadge label="PDF" /> Save as PDF
            </button>
            <button type="button" role="menuitem" onClick={() => save("png")} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-subtle" data-save-png>
              <FileBadge label="PNG" /> Save as image (PNG)
            </button>
          </div>
        )}
      </div>
      {note && (
        <p role="status" className={cn("absolute right-0 top-full z-40 mt-1.5 w-64 rounded-xl border px-3 py-2 text-[12.5px] shadow-lg", dark ? "border-white/15 bg-[#1a1530] text-fg" : "border-line bg-surface text-muted")} data-page-actions-note>
          {note}
        </p>
      )}
    </div>
  );
}

/** A picture of the page's content (#main without what's marked data-export-hide), with a header line. */
async function capture({ title, workspace }: { title: string; workspace: string }): Promise<HTMLCanvasElement> {
  const node = document.getElementById("main");
  if (!node) throw new Error("no main");
  const { toCanvas } = await import("html-to-image");
  const bg = getComputedStyle(document.body).backgroundColor || "#ffffff";
  // Large pages get a lower resolution so the picture stays within what browsers can draw.
  const ratio = Math.max(1, Math.min(2, 14000 / Math.max(1, node.scrollHeight)));
  const shot = await toCanvas(node, {
    pixelRatio: ratio,
    backgroundColor: bg,
    cacheBust: true,
    filter: (n) => !(n instanceof HTMLElement && (n.dataset.exportHide !== undefined || n.tagName === "DIALOG")),
  });
  const head = Math.round(44 * ratio);
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
  return out;
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
  return <span className="flex h-6 w-8 items-center justify-center rounded-md bg-subtle text-[9.5px] font-bold tracking-wide text-muted">{label}</span>;
}
