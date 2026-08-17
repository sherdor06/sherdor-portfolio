import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Section from "./Section";
import CountUp from "./CountUp";
import { experiences } from "@/lib/content";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="relative space-y-6 sm:space-y-8">
        {experiences.map((job) => (
          <li key={`${job.company}-${job.period}`}>
            <article className="glass-card rounded-xl p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="text-lg font-semibold text-primary">
                  {job.role}{" "}
                  {job.companyUrl ? (
                    <>
                      ·{" "}
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {job.company}
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    </>
                  ) : (
                    <span className="text-accent">· {job.company}</span>
                  )}
                </h3>
                <span className="shrink-0 text-sm text-muted">
                  {job.period}
                </span>
              </div>

              {job.companyNote && (
                <p className="mt-1 text-sm text-muted">{job.companyNote}</p>
              )}

              {job.summary && (
                <p className="mt-4 text-base leading-relaxed text-secondary">
                  {job.summary}
                </p>
              )}

              {job.bullets && job.bullets.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <span className="text-base leading-relaxed text-secondary">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {job.stats && job.stats.length > 0 && (
                <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border-subtle pt-6">
                  {job.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="text-2xl font-bold text-accent sm:text-3xl">
                        <CountUp end={stat.value} suffix={stat.suffix} />
                      </dd>
                      <p className="mt-1 text-xs text-muted sm:text-sm">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
