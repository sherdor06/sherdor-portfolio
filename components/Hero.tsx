import { Mail, MapPin } from "lucide-react";
import GithubIcon from "./GithubIcon";
import PhoneMockup from "./PhoneMockup";
import { site } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="scroll-mt-20 bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-12 sm:flex-row">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              {site.title}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-secondary">{site.tagline}</p>

        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {site.location}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email me
              </a>
              <a
                href={site.github}
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-card px-5 py-2.5 text-sm font-semibold text-secondary shadow-sm transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="hidden shrink-0 sm:block">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
