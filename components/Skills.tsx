import Section from "./Section";
import { skillGroups } from "@/lib/content";

export default function Skills() {
  return (
    <Section id="skills" title="Skills" alt>
      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">
              {group.label}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="glass-card rounded-full px-3 py-1 text-sm font-medium text-secondary shadow-sm"
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
