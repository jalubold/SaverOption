import type { ReactNode } from "react";
import { SoftwareLogo } from "@/components/business/software-logo";

/** A page title with the software's logo in front (for PageHeader). */
export function LogoTitle({ name, src, children, size = 44 }: { name: string; src: string | null; children: ReactNode; size?: number }) {
  return (
    <span className="flex items-center gap-3">
      <SoftwareLogo name={name} src={src} size={size} />
      <span className="min-w-0">{children}</span>
    </span>
  );
}
