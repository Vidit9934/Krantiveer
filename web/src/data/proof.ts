/**
 * Every claim on the home page that is not a KMF fact comes from this file.
 * Items start with `confirmed: false`, which makes the UI tag them as placeholders.
 * When KMF supplies approved artists, figures and quotes, replace the item and set `confirmed: true`.
 */
export interface Proof {
  confirmed: boolean;
}

export interface RosterArtist extends Proof {
  name: string;
  detail: string;
}
export interface Stat extends Proof {
  value: string;
  label: string;
  /** Axis titles and the plotted points. Decorative until the figure is confirmed. */
  xLabel: string;
  yLabel: string;
  series: { x: string; y: number }[];
}
export interface Quote extends Proof {
  text: string;
  who: string;
  role: string;
}
export interface Faq {
  q: string;
  a: string;
}

export const roster: RosterArtist[] = [
  { name: "Artist name", detail: "Punjabi, 1.2M monthly listeners", confirmed: false },
  { name: "Artist name", detail: "Haryanvi, 640K monthly listeners", confirmed: false },
  { name: "Artist name", detail: "Hindi pop, 2.1M monthly listeners", confirmed: false },
  { name: "Artist name", detail: "Bhojpuri, 480K monthly listeners", confirmed: false },
  { name: "Artist name", detail: "Devotional, 910K monthly listeners", confirmed: false },
  { name: "Artist name", detail: "Rap, 330K monthly listeners", confirmed: false },
  { name: "Artist name", detail: "Indie, 150K monthly listeners", confirmed: false },
];

export const platforms = ["Spotify", "YouTube", "Instagram", "JioSaavn", "Apple Music"] as const;

export const press: { name: string; confirmed: boolean }[] = [
  { name: "Press outlet", confirmed: false },
  { name: "Press outlet", confirmed: false },
  { name: "Press outlet", confirmed: false },
];

const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const campaigns = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"];
const points = (xs: string[], ys: number[]) => xs.map((x, i) => ({ x, y: ys[i] }));

export const stats: Stat[] = [
  {
    value: "12M",
    label: "streams moved in one placeholder campaign",
    xLabel: "Weeks since release",
    yLabel: "Streams (millions)",
    series: points(weeks, [0.4, 0.9, 1.6, 2.8, 4.7, 7.1, 9.6, 12]),
    confirmed: false,
  },
  {
    value: "340",
    label: "vetted creators on the placeholder roster",
    xLabel: "Month",
    yLabel: "Approved creators",
    series: points(months, [40, 75, 120, 160, 210, 260, 300, 340]),
    confirmed: false,
  },
  {
    value: "6 days",
    label: "placeholder median time to go live",
    xLabel: "Campaign",
    yLabel: "Days to go live",
    series: points(campaigns, [9, 8, 8, 7, 7, 6, 6, 6]),
    confirmed: false,
  },
];

export const story = {
  title: "From 8,000 to 140,000 monthly listeners",
  body: "A placeholder release. A clear plan, creators matched to the language, a report at the end.",
  confirmed: false,
};

export const quotes: Quote[] = [
  { text: "They told me exactly where my song would go and then it went there.", who: "Artist name", role: "Independent artist", confirmed: false },
  { text: "I finally saw who was promoting my track and what they charged.", who: "Label name", role: "Label manager", confirmed: false },
  { text: "My regional release found people in cities I had never played.", who: "Artist name", role: "Folk singer", confirmed: false },
];

export const faqs: Faq[] = [
  { q: "Is this bots or fake streams?", a: "No. Every creator is approved by a KMF manager after reviewing audience screenshots. We never sell plays." },
  { q: "How do I start?", a: "Join KMF with your link. A manager replies on WhatsApp with a plan for your release." },
  { q: "What does it cost?", a: "Plans start at a fixed price per release. Use the estimator above, or ask for a quote." },
  { q: "Which languages do you cover?", a: "Hindi, Punjabi, Haryanvi, Bhojpuri and devotional, with regional creators for each." },
  { q: "How are creators chosen?", a: "By language, audience match and past work. You can see who is approved before money moves." },
  { q: "When are creators paid?", a: "Fifteen days after the campaign ends. A dispute freezes the payout until it is settled." },
];
