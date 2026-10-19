export const site = {
  name: "KMF Media",
  whatsappDisplay: "+91 9220545506",
  whatsappLink: "https://wa.me/919220545506",
  email: "hello@kmfmedia.example",
  /** From the design mockup. Not confirmed by KMF, so the UI labels it. */
  artistCount: "2,000+",
  artistCountConfirmed: false,
} as const;

export interface RegionalHub {
  slug: string;
  name: string;
  native: string;
  note: string;
  platforms: string;
}

export const regions: RegionalHub[] = [
  { slug: "hindi", name: "Hindi", native: "हिन्दी", note: "Pop, indie and film-adjacent releases with the widest reach.", platforms: "Spotify, YouTube, Instagram Reels" },
  { slug: "punjabi", name: "Punjabi", native: "ਪੰਜਾਬੀ", note: "A fast-moving scene where creators and artists release in tight cycles.", platforms: "YouTube, Instagram Reels, Spotify" },
  { slug: "haryanvi", name: "Haryanvi", native: "हरियाणवी", note: "Strong YouTube and reels culture with loyal regional listeners.", platforms: "YouTube, Instagram Reels" },
  { slug: "bhojpuri", name: "Bhojpuri", native: "भोजपुरी", note: "A huge, under-marketed audience that responds to local creators.", platforms: "YouTube, Instagram Reels, Facebook" },
  { slug: "devotional", name: "Bhajan and devotional", native: "भक्ति", note: "Festival-driven listening with a steady, loyal audience all year.", platforms: "YouTube, Spotify, JioSaavn" },
];

export interface Release {
  ref: string;
  title: string;
  artist: string;
  language: string;
  goal: string;
  result: string;
  seed: number;
}

/** Placeholder case studies. Replace with approved KMF work. */
export const releases: Release[] = [
  { ref: "KMF-014", title: "Placeholder release A", artist: "Artist name (placeholder)", language: "Hindi", goal: "Spotify debut push", result: "Result to be supplied by KMF", seed: 14 },
  { ref: "KMF-011", title: "Placeholder release B", artist: "Artist name (placeholder)", language: "Punjabi", goal: "YouTube premiere", result: "Result to be supplied by KMF", seed: 11 },
  { ref: "KMF-009", title: "Placeholder release C", artist: "Artist name (placeholder)", language: "Devotional", goal: "Festival campaign", result: "Result to be supplied by KMF", seed: 9 },
  { ref: "KMF-006", title: "Placeholder release D", artist: "Label name (placeholder)", language: "Haryanvi", goal: "Reels creator campaign", result: "Result to be supplied by KMF", seed: 6 },
];

export interface Plan {
  id: string;
  name: string;
  priceInr: number | null;
  unit: string;
  summary: string;
  includes: string[];
  benefits: { articleCredit: boolean; linksPro: boolean; course: boolean };
}

/** Placeholder pricing. The proposal names "Release Growth" as including a course. */
export const plans: Plan[] = [
  {
    id: "starter",
    name: "Release Starter",
    priceInr: 14999,
    unit: "per release",
    summary: "A clean release on the right platforms, with a plan you can follow.",
    includes: ["Release planner and checklist", "Playlist pitching brief", "Bio and EPK review", "KMF Links page, free tier"],
    benefits: { articleCredit: false, linksPro: false, course: false },
  },
  {
    id: "growth",
    name: "Release Growth",
    priceInr: 49999,
    unit: "per release",
    summary: "Creator reels, playlist outreach and reporting for a release that should travel.",
    includes: ["Everything in Release Starter", "Vetted creator reels campaign", "One KMF Press feature article", "KMF Links Pro", "One Video Academy course", "Campaign report as PDF"],
    benefits: { articleCredit: true, linksPro: true, course: true },
  },
  {
    id: "label",
    name: "Label retainer",
    priceInr: null,
    unit: "custom quote",
    summary: "A monthly programme for labels and agencies with several artists.",
    includes: ["Dedicated KMF manager", "Marketplace campaigns with GST invoicing", "Regional and devotional release calendars", "Bulk article credits", "Quarterly strategy review"],
    benefits: { articleCredit: true, linksPro: true, course: true },
  },
];

export const addOns = [
  { name: "Extra creator reel", priceInr: 2500 },
  { name: "Additional press article", priceInr: 5999 },
  { name: "Bio and EPK rewrite", priceInr: 1999 },
  { name: "Regional landing page", priceInr: 7999 },
];

export interface Post {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  excerpt: string;
  sponsored: boolean;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "why-fake-streams-cost-more-than-they-save",
    title: "Why fake streams cost an artist more than they save",
    category: "Policy",
    author: "KMF Press desk",
    date: "2026-10-02",
    excerpt: "Platforms flag unusual listening. What gets flagged, and what real growth looks like instead.",
    sponsored: false,
    body: [
      "Streaming platforms watch listening patterns, not just totals. A track that gains thousands of plays from a few accounts in a day looks very different from one that grows through playlists and creators.",
      "Flagged plays can be removed, and repeated flags can hurt an artist's standing with the platform. That is the main reason KMF runs every campaign on creators it has vetted.",
      "Real growth is slower to start and cheaper to keep. It shows up as saves, repeat listeners and followers who come back for the next release.",
    ],
  },
  {
    slug: "release-calendar-for-devotional-music",
    title: "A release calendar for devotional music",
    category: "Regional",
    author: "KMF Press desk",
    date: "2026-09-18",
    excerpt: "Devotional listening follows festivals. Plan around them and a single bhajan can keep working for months.",
    sponsored: false,
    body: [
      "Devotional audiences listen in waves around festivals, and a steady baseline in between. The best-performing releases land two to three weeks before a festival so playlists and creators have time to pick them up.",
      "Plan the artwork, the lyric video and the short vertical clips together, so every platform gets something native to it.",
    ],
  },
  {
    slug: "reels-briefs-that-creators-actually-follow",
    title: "Reels briefs that creators actually follow",
    category: "Creators",
    author: "KMF Press desk",
    date: "2026-08-27",
    excerpt: "A good brief is short, shows the hook, and says what the creator is free to change.",
    sponsored: false,
    body: [
      "Creators say yes faster to a brief with the song link, the hook timestamp, one example and a clear deadline. They say no to long documents with unclear deliverables.",
      "State what must stay the same, such as the hook and tags, and leave the rest to the creator. Their audience trusts their voice, not yours.",
    ],
  },
];

export interface Course {
  slug: string;
  title: string;
  level: string;
  lessons: number;
  minutes: number;
  priceInr: number | null;
  summary: string;
  seed: number;
}

export const courses: Course[] = [
  { slug: "release-roadmap", title: "The release roadmap", level: "Beginner", lessons: 12, minutes: 96, priceInr: null, summary: "Plan a release from master to week four, with a free preview of the first three lessons.", seed: 21 },
  { slug: "spotify-for-artists", title: "Spotify for Artists, properly", level: "Beginner", lessons: 9, minutes: 74, priceInr: 1499, summary: "Read your own data, pitch editors and avoid the habits that get plays flagged.", seed: 22 },
  { slug: "reels-for-music", title: "Reels that move a song", level: "Intermediate", lessons: 14, minutes: 118, priceInr: 2499, summary: "Hooks, edits and creator partnerships for short-form music promotion.", seed: 23 },
  { slug: "regional-release-playbook", title: "Regional release playbook", level: "Intermediate", lessons: 10, minutes: 88, priceInr: 1999, summary: "Calendars, language-specific tactics and audience differences across Hindi, Punjabi, Haryanvi, Bhojpuri and devotional music.", seed: 24 },
];
