import { CheckCircle2 } from "lucide-react";
import Section from "./Section";
import { experience } from "@/lib/content";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <article className="rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="text-lg font-semibold text-white">
            {experience.role}{" "}
            <span className="text-blue-400">· {experience.company}</span>
          </h3>
          <span className="text-sm text-slate-500">{experience.period}</span>
        </div>

        <ul className="mt-5 space-y-3">
          {experience.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-400"
                aria-hidden="true"
              />
              <span className="text-base leading-relaxed text-slate-400">
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </Section>
  );
}
