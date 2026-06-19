import Section from "./Section";
import { languages } from "@/lib/content";

export default function Languages() {
  return (
    <Section id="languages" title="Languages" alt>
      <ul className="flex flex-wrap gap-4">
        {languages.map((language) => (
          <li
            key={language.name}
            className="glass-card rounded-xl px-5 py-3 shadow-sm"
          >
            <span className="text-base font-semibold text-primary">
              {language.name}
            </span>
            <span className="ml-2 text-sm text-secondary">
              {language.level}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
