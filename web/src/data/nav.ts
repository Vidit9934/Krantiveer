export interface NavItem {
  to: string;
  label: string;
  note?: string;
}

export type NavKind = "services" | "list" | "work" | "regional" | "link";

export interface NavGroup {
  id: string;
  label: string;
  kind: NavKind;
  /** Small-caps heading inside the panel. */
  eyebrow?: string;
  /** Route prefixes that make this group the active one. */
  match: string[];
  /** Direct link for kind "link", and the group's own landing page for panels. */
  to?: string;
  items?: NavItem[];
}

/** Grouped destinations. Services, Work and Regional also read their cards and rows from data/. */
export const navGroups: NavGroup[] = [
  { id: "services", label: "Services", kind: "services", eyebrow: "Browse by service", match: ["/services"], to: "/services" },
  {
    id: "platform",
    label: "Platform",
    kind: "list",
    eyebrow: "The KMF platform",
    match: ["/marketplace", "/academy", "/links", "/tools"],
    items: [
      { to: "/marketplace", label: "Marketplace", note: "Book vetted creators for a release" },
      { to: "/academy", label: "Academy", note: "Short courses for independent artists" },
      { to: "/links", label: "KMF Links", note: "One link page for every platform" },
      { to: "/tools", label: "Free tools", note: "Brief, bio, caption and release drafts" },
    ],
  },
  { id: "plans", label: "Plans", kind: "link", match: ["/plans"], to: "/plans" },
  { id: "work", label: "Work", kind: "work", eyebrow: "Featured work", match: ["/work"], to: "/work" },
  { id: "regional", label: "Regional", kind: "regional", eyebrow: "Browse by language", match: ["/regional"], to: "/regional" },
  {
    id: "company",
    label: "Company",
    kind: "list",
    eyebrow: "KMF Media",
    match: ["/founder", "/press", "/policy", "/contact"],
    items: [
      { to: "/founder", label: "Founder", note: "Who started KMF and why" },
      { to: "/press", label: "Press", note: "Articles from the KMF Press desk" },
      { to: "/policy", label: "No-bot policy", note: "How we keep every campaign clean" },
      { to: "/contact", label: "Contact", note: "Talk to the KMF team" },
    ],
  },
];

/** Flat list of every destination (footer, sheet fallbacks). */
export const allNav: NavItem[] = [
  { to: "/services", label: "Services" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/academy", label: "Academy" },
  { to: "/links", label: "KMF Links" },
  { to: "/tools", label: "Free tools" },
  { to: "/plans", label: "Plans" },
  { to: "/work", label: "Work" },
  { to: "/regional", label: "Regional" },
  { to: "/press", label: "Press" },
  { to: "/founder", label: "Founder" },
  { to: "/policy", label: "No-bot policy" },
  { to: "/contact", label: "Contact" },
];
