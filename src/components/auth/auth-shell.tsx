import { Container } from "@/components/ui/primitives";

/** Centered dark card used by the login, signup and password pages. */
export function AuthShell({ title, description, children, aside }: { title: React.ReactNode; description?: React.ReactNode; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="theme-dark bg-bg text-fg">
      <section className="hero-glow min-h-[75vh] border-b border-line">
        <Container className="max-w-md py-12 sm:py-20">
          <div className="rounded-[20px] border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
            <h1 className="display text-[2rem] sm:text-[2.4rem]">{title}</h1>
            {description && <div className="mt-2 text-[15px] leading-relaxed text-muted">{description}</div>}
            <div className="mt-6">{children}</div>
          </div>
          {aside && <div className="mt-5 text-center text-sm text-muted">{aside}</div>}
        </Container>
      </section>
    </div>
  );
}

export function AuthUnavailable() {
  return (
    <p className="rounded-lg border border-line bg-subtle px-3 py-2.5 text-sm text-muted">
      Advertiser accounts aren&apos;t switched on yet. If you&apos;ve already paid for a listing, keep your receipt email; its link will let you
      manage your listing once accounts are available.
    </p>
  );
}
