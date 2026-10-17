import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-heading" className="mx-auto max-w-2xl text-center">
      <h2 id="newsletter-heading" className="display text-[2.5rem] sm:text-[3.5rem]">
        New deals, <em>in your inbox.</em>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
        A short, occasional email from {siteConfig.name} with newly added offers, ending-soon reminders and any exclusive
        offers we arrange. Unsubscribe in one click.
      </p>
      <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-line bg-surface p-3 text-left shadow-[var(--shadow-card)]">
        <NewsletterForm />
      </div>
      <p className="mt-3 text-xs text-faint">We only use your email to send the newsletter.</p>
    </section>
  );
}
