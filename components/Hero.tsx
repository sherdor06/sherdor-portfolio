import { Mail, MapPin } from "lucide-react";
import GithubIcon from "./GithubIcon";
import { site } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="scroll-mt-20 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {site.title}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">{site.tagline}</p>

        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {site.location}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email me
          </a>
          <a
            href={site.github}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
