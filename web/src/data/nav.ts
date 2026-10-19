export interface NavItem {
  to: string;
  label: string;
  note?: string;
}

/** Every destination in the bar itself, so nothing hides behind a menu button. */
export const mainNav: NavItem[] = [
  { to: "/services", label: "Services" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/academy", label: "Academy" },
  { to: "/links", label: "KMF Links" },
  { to: "/plans", label: "Plans" },
  { to: "/work", label: "Work" },
  { to: "/regional", label: "Regional" },
  { to: "/press", label: "Press" },
];

/** The rest sit in one dropdown with a line of explanation each. */
export const moreNav: NavItem[] = [
  { to: "/tools", label: "Free tools", note: "Brief, bio, caption and release drafts" },
  { to: "/founder", label: "Founder", note: "Who started KMF and why" },
  { to: "/policy", label: "No-bot policy", note: "How we keep every campaign clean" },
  { to: "/contact", label: "Contact", note: "Talk to the KMF team" },
];

export const allNav: NavItem[] = [...mainNav, ...moreNav];
