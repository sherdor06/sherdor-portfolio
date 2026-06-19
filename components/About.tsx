import Section from "./Section";
import { site } from "@/lib/content";

export default function About() {
  return (
    <Section id="about" title="About" alt>
      <p className="max-w-3xl text-base leading-relaxed text-slate-400">
        {site.about}
      </p>
    </Section>
  );
}
