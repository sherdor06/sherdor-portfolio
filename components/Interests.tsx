import Section from "./Section";
import { interests } from "@/lib/content";

export default function Interests() {
  return (
    <Section id="interests" title="Interests">
      <ul className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <li
            key={interest}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm"
          >
            {interest}
          </li>
        ))}
      </ul>
    </Section>
  );
}
