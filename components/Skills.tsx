import Section from "./Section";
import { skillGroups } from "@/lib/content";

export default function Skills() {
  return (
    <Section id="skills" title="Skills" alt>
      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              {group.label}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border-subtle bg-surface-card px-3 py-1 text-sm font-medium text-slate-300 shadow-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
