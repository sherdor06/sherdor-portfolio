import Reveal from "./Reveal";

type SectionProps = {
  id: string;
  title: string;
  /** Use the alternate slate-50 background for visual rhythm between sections. */
  alt?: boolean;
  children: React.ReactNode;
};

export default function Section({
  id,
  title,
  alt = false,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-16 sm:py-20 ${alt ? "bg-surface-alt" : "bg-surface"}`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <div className="mt-6">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}
