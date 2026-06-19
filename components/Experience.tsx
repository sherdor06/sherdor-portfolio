import { CheckCircle2 } from "lucide-react";
import Section from "./Section";
import CountUp from "./CountUp";
import { experience, stats } from "@/lib/content";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <article className="glass-card rounded-xl p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-lg font-semibold text-primary">
            {experience.role}{" "}
            <span className="text-accent">· {experience.company}</span>
          </h3>
          <span className="text-sm text-muted">{experience.period}</span>
        </div>

        <ul className="mt-5 space-y-3">
          {experience.bullets.map((bullet) => (
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

        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border-subtle pt-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl font-bold text-accent sm:text-3xl">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </dd>
              <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </dl>
      </article>
    </Section>
  );
}
