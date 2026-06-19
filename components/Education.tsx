import { GraduationCap } from "lucide-react";
import Section from "./Section";
import { education } from "@/lib/content";

export default function Education() {
  return (
    <Section id="education" title="Education">
      <article className="flex gap-4 rounded-xl border border-border-subtle bg-surface-card p-6 shadow-sm">
        <GraduationCap
          className="mt-0.5 h-6 w-6 shrink-0 text-blue-400"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">
            {education.school}
          </h3>
          <p className="mt-1 text-base text-slate-400">{education.program}</p>
          <p className="mt-1 text-sm text-slate-500">{education.period}</p>
        </div>
      </article>
    </Section>
  );
}
