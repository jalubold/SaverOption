import Image from "next/image";
import { cn } from "@/components/ui/primitives";
import type { Product } from "@/lib/types";

const sizes = { sm: 36, md: 44, lg: 56 } as const;

/** Product logo image, or a generated monogram tile when no logo is available. */
export function ProductLogo({ product, size = "md", className }: { product: Product; size?: keyof typeof sizes; className?: string }) {
  const px = sizes[size];
  const radius = size === "lg" ? "rounded-xl" : "rounded-lg";

  if (product.logo) {
    return (
      <Image
        src={product.logo.src}
        alt={product.logo.alt ?? `${product.name} logo`}
        width={px}
        height={px}
        className={cn("shrink-0 border border-line bg-surface object-contain", radius, className)}
      />
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
      style={{ width: px, height: px, backgroundColor: product.brandColor ?? "var(--fg)" }}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center font-semibold tracking-tight text-white",
        radius,
        size === "lg" ? "text-lg" : size === "md" ? "text-[15px]" : "text-[13px]",
        className,
      )}
    >
      {initials}
    </span>
  );
}
