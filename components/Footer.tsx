import { Mail, Phone } from "lucide-react";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-20 border-t border-border-subtle bg-surface-alt py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Contact
        </h2>
        <p className="mt-4 text-base text-secondary">
          Feel free to reach out — I&apos;m open to new opportunities.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-8">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 text-base font-medium text-secondary transition-colors hover:text-accent"
          >
            <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 text-base font-medium text-secondary transition-colors hover:text-accent"
          >
            <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
            {site.phone}
          </a>
        </div>

        <p className="mt-12 text-sm text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
