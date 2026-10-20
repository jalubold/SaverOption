import Image from "next/image";
import { cn } from "@/components/ui/primitives";
import type { Product } from "@/lib/types";

const sizes = { xs: 28, sm: 36, md: 44, lg: 56 } as const;

/**
 * Product logo on a white tile (so dark marks stay visible on dark sections),
 * or a generated monogram when no logo file is available.
 */
export function ProductLogo({ product, size = "md", className }: { product: Product; size?: keyof typeof sizes; className?: string }) {
  const px = sizes[size];
  const radius = size === "lg" ? "rounded-xl" : "rounded-lg";

  if (product.logo) {
    const pad = Math.round(px * 0.18);
    return (
      <span
        style={{ width: px, height: px, padding: pad }}
        className={cn("inline-flex shrink-0 items-center justify-center bg-white ring-1 ring-black/5", radius, className)}
      >
        <Image
          src={product.logo.src}
          alt={product.logo.alt ?? `${product.name} logo`}
          width={px - pad * 2}
          height={px - pad * 2}
          unoptimized
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  const initials = product.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      style={{ width: px, height: px, backgroundColor: product.brandColor ?? "#4b5563" }}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center font-semibold tracking-tight text-white",
        radius,
        size === "lg" ? "text-lg" : size === "md" ? "text-[15px]" : size === "sm" ? "text-[13px]" : "text-[11px]",
        className,
      )}
    >
      {initials}
    </span>
  );
}
