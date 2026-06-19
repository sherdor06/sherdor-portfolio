// Centralized site content — single source of truth for copy used across components.

export const site = {
  name: "Sherdor Ergashov",
  title: "Flutter Developer",
  tagline:
    "Flutter developer with production experience, focused on great mobile UX.",
  location: "Tashkent, Uzbekistan",
  email: "sherdor0605@gmail.com",
  phone: "+998 94 681 15 25",
  phoneHref: "tel:+998946811525",
  github: "https://github.com/sherdor06",
  about:
    "Tashkent-based Flutter Developer with production experience at Scoreup.uz, currently a part-time IT student. Strong in UI layout optimization, REST API integration, and multimedia components. Uses modern AI-assisted workflows to ship clean mobile features at an accelerated pace.",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const experience = {
  role: "Flutter Developer",
  company: "Scoreup.uz",
  period: "03/2026 – Present",
  bullets: [
    "Built 3 study tools (Writing Samples, Typing, Podcasts) shipped to 20,000+ users; upgraded existing CEFR and IELTS test modules.",
    "Developed a Live Chat feature, platform-specific deep-linking, custom animations, and an iOS Liquid Glass navigation bar.",
    "Resolved 15+ production bugs (RenderFlex overflows, state persistence, iOS keyboard conflicts) across CEFR and IELTS modules.",
  ],
} as const;

export const stats = [
  { value: 20000, suffix: "+", label: "Users reached" },
  { value: 15, suffix: "+", label: "Bugs resolved" },
  { value: 3, suffix: "", label: "Study tools shipped" },
] as const;

export const skillGroups = [
  { label: "Mobile", items: ["Flutter", "Dart", "Cross-Platform Development"] },
  { label: "State Management", items: ["GetX", "Provider"] },
  { label: "Integration", items: ["REST API", "JSON", "Firebase"] },
  { label: "Platform", items: ["iOS & Android Platform APIs"] },
  { label: "Tools", items: ["Git & GitHub", "AI-assisted development"] },
] as const;

export const education = {
  school: "Tashkent University of Information Technologies",
  program: "Electronic Commerce",
  period: "2023 – 2028 (expected)",
} as const;

export const languages = [
  { name: "Uzbek", level: "Native" },
  { name: "English", level: "B2" },
] as const;

export const interests = ["Mobile development", "Table tennis", "Football"] as const;
