"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { Button, buttonClass, Container } from "@/components/ui/primitives";
import { isLoadError, recoverWithFullLoad } from "@/lib/load-recovery";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // The page's code couldn't be downloaded (patchy connection, older deployment): open it in full
  // once instead; the message only fades in if that doesn't happen.
  const loadError = isLoadError(error);
  useEffect(() => {
    console.error(error);
    if (isLoadError(error)) recoverWithFullLoad();
  }, [error]);

  return (
    <Container className="py-24">
      <div role="alert" className="mx-auto max-w-lg text-center" style={loadError ? { opacity: 0, animation: "so-fade 300ms ease-out 2s forwards" } : undefined}>
        <span className="mx-auto inline-flex size-11 items-center justify-center rounded-full bg-warn-soft text-warn">
          <Icon name="alert" size={20} />
        </span>
        <h1 className="display mt-5 text-[2.5rem] sm:text-[3rem]">
          Something <em>went wrong.</em>
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          We couldn&apos;t load this page. It&apos;s usually temporary — try again in a moment.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className={buttonClass("secondary")}>
            Go home
          </Link>
        </div>
        {error.digest && <p className="mt-6 font-mono text-xs text-faint">Reference: {error.digest}</p>}
      </div>
    </Container>
  );
}
