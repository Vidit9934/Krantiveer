/** The six services, shared by the Services page, the home services list and the mega-menu. */
export interface Service {
  /** Matches a slot id in data/media.ts, for the hover preview and menu card. */
  slot: string;
  name: string;
  gets: string;
  wont: string;
  /** One short line for lists and menus. */
  line: string;
}

export const services: Service[] = [
  {
    slot: "svc-spotify",
    line: "Playlists, pre-saves, release week",
    name: "Spotify growth",
    gets: "Playlist pitching, editorial submission support, pre-save setup and a release-week checklist.",
    wont: "Buy plays, use botted playlists or promise follower counts.",
  },
  {
    slot: "svc-youtube",
    line: "Premieres, thumbnails, Shorts",
    name: "YouTube growth",
    gets: "Premiere planning, thumbnail and title testing, Shorts cut-downs and creator cross-promotion.",
    wont: "Sell views or subscribers.",
  },
  {
    slot: "svc-reels",
    line: "Vetted creators, one GST invoice",
    name: "Creator reels campaigns",
    gets: "Vetted Instagram creators matched to your language and niche, booked through the KMF marketplace with one GST invoice.",
    wont: "Reveal your budget to creators or creator rates to you.",
  },
  {
    slot: "svc-press",
    line: "Bio, EPK, labelled feature article",
    name: "Press and EPK",
    gets: "A bio and EPK, plus a feature article on KMF Press with a clearly labelled byline.",
    wont: "Publish unlabelled sponsored content.",
  },
  {
    slot: "svc-plan",
    line: "Master to week four, dated",
    name: "Release planning",
    gets: "A dated plan from master to week four: content calendar, platform tasks and the KMF Links page for the song.",
    wont: "Hand you a template that ignores your genre or language.",
  },
  {
    slot: "svc-regional",
    line: "Festival and language calendars",
    name: "Regional and devotional campaigns",
    gets: "Calendars built around festivals and regional release rhythms, with creators who speak the language of the song.",
    wont: "Treat every language as Hindi with a different caption.",
  },
];
