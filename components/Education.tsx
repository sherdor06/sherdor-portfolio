import { GraduationCap } from "lucide-react";
import Section from "./Section";
import { education } from "@/lib/content";

export default function Education() {
  return (
    <Section id="education" title="Education">
      <article className="glass-card flex gap-4 rounded-xl p-6 shadow-sm">
        <GraduationCap
          className="mt-0.5 h-6 w-6 shrink-0 text-accent"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-lg font-semibold text-primary">
            {education.school}
          </h3>
          <p className="mt-1 text-base text-secondary">{education.program}</p>
          <p className="mt-1 text-sm text-muted">{education.period}</p>
        </div>
      </article>
    </Section>
  );
}
