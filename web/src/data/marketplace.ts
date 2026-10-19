export interface Creator {
  id: string;
  handle: string;
  niche: string;
  languages: string[];
  city: string;
  followers: number;
  audienceMatch: number;
  /** Locked rate in INR. Labels must never see this. Only KMF and the creator do. */
  rateInr: number;
  seed: number;
}

export const creators: Creator[] = [
  { id: "c1", handle: "creator_placeholder_01", niche: "Music reels", languages: ["Hindi", "Punjabi"], city: "Delhi", followers: 184000, audienceMatch: 91, rateInr: 12000, seed: 31 },
  { id: "c2", handle: "creator_placeholder_02", niche: "Dance", languages: ["Haryanvi", "Hindi"], city: "Rohtak", followers: 96000, audienceMatch: 88, rateInr: 7000, seed: 32 },
  { id: "c3", handle: "creator_placeholder_03", niche: "Lifestyle", languages: ["Hindi"], city: "Mumbai", followers: 231000, audienceMatch: 74, rateInr: 15000, seed: 33 },
  { id: "c4", handle: "creator_placeholder_04", niche: "Devotional", languages: ["Hindi", "Bhojpuri"], city: "Varanasi", followers: 58000, audienceMatch: 93, rateInr: 4500, seed: 34 },
  { id: "c5", handle: "creator_placeholder_05", niche: "Comedy", languages: ["Punjabi", "Hindi"], city: "Ludhiana", followers: 142000, audienceMatch: 81, rateInr: 9000, seed: 35 },
  { id: "c6", handle: "creator_placeholder_06", niche: "Music reels", languages: ["Bhojpuri"], city: "Patna", followers: 77000, audienceMatch: 90, rateInr: 5500, seed: 36 },
];

export interface Campaign {
  id: string;
  title: string;
  label: string;
  language: string;
  platform: string;
  deliverable: string;
  deadline: string;
  slots: number;
  status: "live" | "in review" | "closed";
}

export const campaigns: Campaign[] = [
  { id: "k1", title: "Placeholder single launch", label: "Label name (placeholder)", language: "Hindi", platform: "Instagram Reels", deliverable: "1 reel with hook", deadline: "2026-11-08", slots: 12, status: "live" },
  { id: "k2", title: "Festival bhajan push", label: "Label name (placeholder)", language: "Devotional", platform: "Instagram Reels", deliverable: "1 reel + 1 story", deadline: "2026-11-15", slots: 8, status: "live" },
  { id: "k3", title: "Punjabi video premiere", label: "Artist team (placeholder)", language: "Punjabi", platform: "Instagram Reels", deliverable: "1 reel", deadline: "2026-11-21", slots: 15, status: "live" },
  { id: "k4", title: "Haryanvi dance challenge", label: "Label name (placeholder)", language: "Haryanvi", platform: "Instagram Reels", deliverable: "1 reel", deadline: "2026-11-02", slots: 10, status: "in review" },
];

export const bookingSteps = [
  "Label posts the campaign",
  "Creators apply",
  "Label picks creators within budget",
  "Label pays at checkout",
  "Creators confirm within 48 hours",
  "Drafts, approvals and live links",
  "Campaign closes, payout 15 days later",
];
