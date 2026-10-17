import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { Icon } from "@/components/ui/icon";

export function NewsletterSection() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
        <div>
          <span className="inline-flex size-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-ink">
            <Icon name="mail" size={20} />
          </span>
          <h2 id="newsletter-heading" className="display mt-4 text-[2.25rem] sm:text-[2.75rem]">
            New deals, <em>in your inbox.</em>
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            A short, occasional email from {siteConfig.name} with newly added offers, ending-soon reminders and any
            exclusive offers we arrange. No spam, and you can unsubscribe in one click.
          </p>
        </div>
        <div>
          <NewsletterForm />
          <p className="mt-3 text-xs text-faint">We only use your email to send the newsletter.</p>
        </div>
      </div>
    </section>
  );
}
