"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Re-reads the server-verified payment status every few seconds while a
 * webhook is on its way. After `maxSeconds` it stops and shows `fallback`.
 */
export function StatusPoller({ intervalSeconds = 3, maxSeconds = 120, fallback }: { intervalSeconds?: number; maxSeconds?: number; fallback: React.ReactNode }) {
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - started > maxSeconds * 1000) {
        clearInterval(timer);
        setTimedOut(true);
        return;
      }
      router.refresh();
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [router, intervalSeconds, maxSeconds]);

  if (timedOut) return <>{fallback}</>;
  return (
    <p className="mt-5 flex items-center gap-2 text-sm text-muted" aria-live="polite">
      <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-line-strong border-t-accent" />
      Checking with Lemon Squeezy… this page updates automatically.
    </p>
  );
}
