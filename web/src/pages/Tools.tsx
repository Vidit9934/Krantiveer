import { PaperScene } from "../motion/PaperScene";
import { useState } from "react";
import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";

type ToolId = "brief" | "bio" | "caption" | "planner";

const tools: { id: ToolId; name: string; hint: string }[] = [
  { id: "brief", name: "Campaign brief", hint: "Song, language, goal" },
  { id: "bio", name: "Bio and EPK", hint: "Your story in a few lines" },
  { id: "caption", name: "Caption and reel hook", hint: "Song and mood" },
  { id: "planner", name: "Release planner", hint: "Release date" },
];

/** Mock output. The live site calls an LLM from the backend only, with usage caps and a human review step. */
function draft(tool: ToolId, text: string, lang: string): string {
  const t = text.trim();
  switch (tool) {
    case "brief":
      return `Campaign brief (${lang})\n\nSong: ${t}\nDeliverable: one reel using the hook, tagged with the artist and the song.\nMust keep: hook timestamp, tags and the song link.\nCreator is free to change: edit style, location and caption voice.\nDeadline: set on submission.`;
    case "bio":
      return `${t}. Based in India and releasing in ${lang}, with a sound built for listeners who stay for the whole song.\n\nReview this draft with a KMF editor before it is sent anywhere.`;
    case "caption":
      return `Hook idea: start on the line that gives you goosebumps, cut on the beat.\nCaption (${lang}): "${t}" is out now. Save it for later.\nTags: use the song name and the artist handle.`;
    case "planner":
      return `Release plan for ${t || "your release date"}\n\nWeek -3: master approved, artwork locked, pre-save live.\nWeek -2: creator briefs sent, KMF Links page published.\nRelease week: premiere, playlist pitches, reels begin.\nWeek +1 to +4: reels wave two, report review, next-release notes.`;
  }
}

export default function Tools() {
  const [tool, setTool] = useState<ToolId>("brief");
  const [lang, setLang] = useState("Hinglish");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [used, setUsed] = useState(0);
  const limit = 5;

  const current = tools.find((t) => t.id === tool)!;

  return (
    <>
      <PageHead title="Free AI tools" lede="Drafts for briefs, bios, captions and plans." />
      <PaperScene className="scene-paper" aria-label="Draft tools">
      <div className="wrap grid grid--sidebar">
        <form
          className="panel form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            if (used >= limit) return;
            setOut(draft(tool, text, lang));
            setUsed(used + 1);
          }}
        >
          <div className="field">
            <label htmlFor="tool">Tool</label>
            <select id="tool" className="select" value={tool} onChange={(e) => { setTool(e.target.value as ToolId); setOut(""); }}>
              {tools.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="lang">Language</label>
            <select id="lang" className="select" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option>English</option>
              <option>Hinglish</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="text">{current.hint}</label>
            <textarea id="text" className="textarea" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="row">
            <Button disabled={used >= limit} icon="wave" onClick={() => document.getElementById("tool-go")?.click()}>
              Draft it
            </Button>
            <button id="tool-go" type="submit" hidden />
            <span className="muted small">
              {used >= limit ? "Daily limit reached. Log in for more drafts." : `${limit - used} free drafts left today`}
            </span>
          </div>
        </form>
        <section className="panel panel--raised stack" aria-live="polite" aria-label="Draft">
          <h2 style={{ fontSize: "1.375rem" }}>Draft</h2>
          {out ? <pre style={{ whiteSpace: "pre-wrap", font: "inherit", margin: 0, overflowWrap: "anywhere" }}>{out}</pre> : <p className="empty">Your draft appears here. Mock output in this preview.</p>}
        </section>
      </div>
      </PaperScene>
    </>
  );
}
