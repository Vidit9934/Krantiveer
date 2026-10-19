export type BlockType = "link" | "music" | "social" | "text" | "capture" | "tour";

export interface Platform {
  name: string;
  url: string;
}

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  url?: string;
  platforms?: Platform[];
}

export type ThemeId = "lacquer" | "sleeve" | "gold";

export interface LinksPage {
  handle: string;
  name: string;
  bio: string;
  theme: ThemeId;
  plan: "free" | "pro";
  blocks: Block[];
}

export const platformNames = ["Spotify", "Apple Music", "YouTube Music", "JioSaavn"];

export const themes: { id: ThemeId; name: string; note: string }[] = [
  { id: "lacquer", name: "Lacquer", note: "Black with gold, like the KMF site" },
  { id: "sleeve", name: "Sleeve", note: "Printed paper with black ink" },
  { id: "gold", name: "Gold record", note: "Gold ground with black type" },
];

export const defaultPage: LinksPage = {
  handle: "artist-name",
  name: "Artist name (placeholder)",
  bio: "Short bio goes here. Independent artist releasing in Hindi and Punjabi.",
  theme: "lacquer",
  plan: "free",
  blocks: [
    {
      id: "b1",
      type: "music",
      title: "New single (placeholder)",
      platforms: [
        { name: "Spotify", url: "https://open.spotify.com/" },
        { name: "YouTube Music", url: "https://music.youtube.com/" },
        { name: "JioSaavn", url: "https://www.jiosaavn.com/" },
      ],
    },
    { id: "b2", type: "link", title: "Watch the video", url: "https://youtube.com/" },
    { id: "b3", type: "capture", title: "Get release news on WhatsApp" },
    { id: "b4", type: "tour", title: "Next show: dates to be announced" },
  ],
};

const KEY = "kmf-links-demo";

export function loadPage(): LinksPage {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultPage, ...(JSON.parse(raw) as Partial<LinksPage>) };
  } catch {
    /* fall through to the default page */
  }
  return defaultPage;
}

export function savePage(page: LinksPage) {
  try {
    localStorage.setItem(KEY, JSON.stringify(page));
  } catch {
    /* storage unavailable: the builder still works for this session */
  }
}
