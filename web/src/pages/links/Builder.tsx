import { PaperScene } from "../../motion/PaperScene";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../../components/PageHead";
import { Button } from "../../components/Button";
import { LinkView } from "./LinkView";
import { loadPage, platformNames, savePage, themes } from "./linksState";
import type { Block, BlockType, LinksPage, ThemeId } from "./linksState";

const blockLabels: Record<BlockType, string> = {
  link: "Link button",
  music: "Music smart link",
  social: "Social icons",
  text: "Text",
  capture: "Email capture",
  tour: "Tour dates",
};

let nextId = 100;

export default function Builder() {
  const [page, setPage] = useState<LinksPage>(loadPage);
  const [selected, setSelected] = useState<string | null>(page.blocks[0]?.id ?? null);
  const [saved, setSaved] = useState(false);
  const [songUrl, setSongUrl] = useState("");
  const [detected, setDetected] = useState("");

  useEffect(() => {
    setSaved(false);
  }, [page]);

  const current = page.blocks.find((b) => b.id === selected) ?? null;

  const update = (patch: Partial<LinksPage>) => setPage({ ...page, ...patch });
  const updateBlock = (id: string, patch: Partial<Block>) => update({ blocks: page.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) });

  function add(type: BlockType) {
    const id = `n${nextId++}`;
    const block: Block = {
      id,
      type,
      title: type === "music" ? "New song" : type === "capture" ? "Join the list" : type === "tour" ? "Show: city and date" : blockLabels[type],
      url: type === "link" ? "https://" : undefined,
      platforms: type === "music" ? platformNames.slice(0, 2).map((n) => ({ name: n, url: "https://" })) : undefined,
    };
    update({ blocks: [...page.blocks, block] });
    setSelected(id);
  }

  function move(id: string, dir: -1 | 1) {
    const i = page.blocks.findIndex((b) => b.id === id);
    const j = i + dir;
    if (j < 0 || j >= page.blocks.length) return;
    const next = [...page.blocks];
    [next[i], next[j]] = [next[j], next[i]];
    update({ blocks: next });
  }

  function remove(id: string) {
    update({ blocks: page.blocks.filter((b) => b.id !== id) });
    setSelected(null);
  }

  function detect() {
    if (!/^https?:\/\/\S+/.test(songUrl)) {
      setDetected("Paste a full song link that starts with https.");
      return;
    }
    if (!current || current.type !== "music") {
      setDetected("Select a music smart link block first.");
      return;
    }
    // Live site: a link-matching service fills this in. Manual entry stays as the backup.
    updateBlock(current.id, { platforms: platformNames.map((n) => ({ name: n, url: songUrl })) });
    setDetected("Preview only: every platform now points at the pasted link. In production a matching service finds each platform's own link, and you can edit any of them by hand.");
  }

  function publish() {
    savePage(page);
    setSaved(true);
  }

  return (
    <>
      <PageHead
        title="Page builder"
        lede="Add blocks and watch the page change."
        aside={
          <div className="row">
            <Button onClick={publish} icon="check">
              Save and publish
            </Button>
            <Button to="/l/artist-name" variant="secondary" icon="external">
              View public page
            </Button>
          </div>
        }
      />
      <PaperScene className="scene-paper" aria-label="Builder">
      <div className="wrap wrap--wide builder">
        <div className="stack--lg">
          {saved && (
            <p className="notice" role="status">
              Saved in this browser. The public page at <Link to="/l/artist-name">kmf.link/artist-name</Link> now shows it.
            </p>
          )}

          <section className="panel form-grid" aria-labelledby="pg">
            <h2 id="pg" style={{ fontSize: "1.25rem" }}>Page</h2>
            <div className="form-grid form-grid--2">
              <div className="field">
                <label htmlFor="pg-name">Name</label>
                <input id="pg-name" className="input" value={page.name} onChange={(e) => update({ name: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="pg-handle">Page address</label>
                <input id="pg-handle" className="input" value={page.handle} onChange={(e) => update({ handle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
                <small>kmf.link/{page.handle || "your-name"} <span className="ph">domain to be confirmed</span></small>
              </div>
            </div>
            <div className="field">
              <label htmlFor="pg-bio">Bio</label>
              <textarea id="pg-bio" className="textarea" style={{ minHeight: 70 }} value={page.bio} onChange={(e) => update({ bio: e.target.value })} />
            </div>
            <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend>Theme</legend>
              <div className="row">
                {themes.map((t) => (
                  <label key={t.id} className="check">
                    <input type="radio" name="theme" checked={page.theme === t.id} onChange={() => update({ theme: t.id as ThemeId })} />
                    <span>
                      {t.name} <span className="muted small">{t.note}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="check">
              <input type="checkbox" checked={page.plan === "pro"} onChange={(e) => update({ plan: e.target.checked ? "pro" : "free" })} />
              <span>
                Links Pro <span className="muted small">custom domain, no KMF footer, pixels, QR code. Included in paid plans.</span>
              </span>
            </label>
          </section>

          <section className="panel stack" aria-labelledby="bl">
            <h2 id="bl" style={{ fontSize: "1.25rem" }}>Blocks</h2>
            {page.blocks.length === 0 ? (
              <p className="empty">No blocks yet. Add a link or a song below.</p>
            ) : (
              <ul className="blocklist">
                {page.blocks.map((b, i) => (
                  <li key={b.id} className={b.id === selected ? "is-on" : ""}>
                    <button type="button" className="blocklist__main" onClick={() => setSelected(b.id)} aria-pressed={b.id === selected}>
                      <span>{b.title}</span>
                      <span className="muted small">{blockLabels[b.type]}</span>
                    </button>
                    <div className="row" style={{ gap: 4, flexWrap: "nowrap" }}>
                      <button type="button" className="icon-btn" aria-label={`Move ${b.title} up`} disabled={i === 0} onClick={() => move(b.id, -1)}>
                        Up
                      </button>
                      <button type="button" className="icon-btn" aria-label={`Move ${b.title} down`} disabled={i === page.blocks.length - 1} onClick={() => move(b.id, 1)}>
                        Down
                      </button>
                      <button type="button" className="icon-btn" aria-label={`Delete ${b.title}`} onClick={() => remove(b.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="row" role="group" aria-label="Add a block">
              {(Object.keys(blockLabels) as BlockType[]).map((t) => (
                <Button key={t} variant="secondary" icon="plus" onClick={() => add(t)}>
                  {blockLabels[t]}
                </Button>
              ))}
            </div>
          </section>

          {current && (
            <section className="panel form-grid" aria-labelledby="ed">
              <h2 id="ed" style={{ fontSize: "1.25rem" }}>Edit: {blockLabels[current.type]}</h2>
              <div className="field">
                <label htmlFor="ed-title">Title</label>
                <input id="ed-title" className="input" value={current.title} onChange={(e) => updateBlock(current.id, { title: e.target.value })} />
              </div>
              {current.type === "link" && (
                <div className="field">
                  <label htmlFor="ed-url">Link</label>
                  <input id="ed-url" className="input" value={current.url ?? ""} onChange={(e) => updateBlock(current.id, { url: e.target.value })} />
                </div>
              )}
              {current.type === "music" && (
                <>
                  <div className="field">
                    <label htmlFor="song">Paste one song link</label>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      <input id="song" className="input" value={songUrl} onChange={(e) => setSongUrl(e.target.value)} />
                      <Button variant="secondary" onClick={detect}>
                        Find every platform
                      </Button>
                    </div>
                    {detected && <small role="status">{detected}</small>}
                  </div>
                  {(current.platforms ?? []).map((p, idx) => (
                    <div className="field" key={p.name}>
                      <label htmlFor={`pl-${idx}`}>{p.name} link</label>
                      <input
                        id={`pl-${idx}`}
                        className="input"
                        value={p.url}
                        onChange={(e) => updateBlock(current.id, { platforms: (current.platforms ?? []).map((q, k) => (k === idx ? { ...q, url: e.target.value } : q)) })}
                      />
                    </div>
                  ))}
                  <p className="small muted">Pre-save for Spotify and Apple Music needs approved developer accounts on each platform, so it ships after they approve.</p>
                </>
              )}
            </section>
          )}
        </div>

        <aside className="builder__preview" aria-label="Live mobile preview">
          <div className="phone-frame">
            <LinkView page={page} />
          </div>
        </aside>
      </div>
      </PaperScene>
    </>
  );
}
