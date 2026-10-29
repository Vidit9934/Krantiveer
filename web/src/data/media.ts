/**
 * Media manifest. Every image or video slot on the site is named here.
 *
 * Until a real file exists a slot renders generated placeholder art (components/Art.tsx), tagged
 * "Placeholder". To use a real file, drop it in web/public/media/ and set `src` (and `poster` / `video`).
 * Components never change. Nothing here may name a real artist, client or number that KMF has not confirmed.
 */
export interface MediaSlot {
  /** Stable key, used by components. */
  id: string;
  /** Short caption shown with the art (a placeholder title until KMF approves real work). */
  title: string;
  /** Still image, for example "/media/work-1.jpg". */
  src?: string;
  /** Poster frame for a video. */
  poster?: string;
  /** Looping muted video, for example "/media/work-1.mp4". */
  video?: string;
  /** Alt text for a real image. Placeholders get a generated label. */
  alt?: string;
  /** Drives the generated art so each slot looks different but stays the same between renders. */
  seed: number;
  /** Which tonal treatment the generated art uses: gold ground, black ground or paper ground. */
  tone: "gold" | "black" | "paper";
}

export const media: Record<string, MediaSlot> = {
  "work-1": { id: "work-1", title: "Placeholder release A", seed: 14, tone: "gold" },
  "work-2": { id: "work-2", title: "Placeholder release B", seed: 11, tone: "black" },
  "work-3": { id: "work-3", title: "Placeholder release C", seed: 9, tone: "paper" },
  "work-4": { id: "work-4", title: "Placeholder release D", seed: 6, tone: "black" },
  "work-5": { id: "work-5", title: "Placeholder release E", seed: 31, tone: "gold" },
  "work-6": { id: "work-6", title: "Placeholder release F", seed: 32, tone: "paper" },
  "work-7": { id: "work-7", title: "Placeholder release G", seed: 33, tone: "black" },
  "svc-spotify": { id: "svc-spotify", title: "Spotify growth", seed: 41, tone: "black" },
  "svc-youtube": { id: "svc-youtube", title: "YouTube growth", seed: 42, tone: "gold" },
  "svc-reels": { id: "svc-reels", title: "Creator reels campaigns", seed: 43, tone: "paper" },
  "svc-press": { id: "svc-press", title: "Press and EPK", seed: 44, tone: "black" },
  "svc-plan": { id: "svc-plan", title: "Release planning", seed: 45, tone: "gold" },
  "svc-regional": { id: "svc-regional", title: "Regional and devotional campaigns", seed: 46, tone: "paper" },
  reel: { id: "reel", title: "Showreel", seed: 51, tone: "black" },
  depth: { id: "depth", title: "Release sleeve", seed: 52, tone: "gold" },
};

/** The seven slots used by the hero fan, in arc order (left to right). */
export const fanSlots = ["work-5", "work-1", "work-2", "work-7", "work-3", "work-6", "work-4"] as const;
