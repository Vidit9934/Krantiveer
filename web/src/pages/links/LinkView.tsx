import { useState } from "react";
import type { LinksPage } from "./linksState";
import { Icon } from "../../components/Icon";

interface LinkViewProps {
  page: LinksPage;
  /** Called with the label of whatever the visitor taps, so analytics can log it. */
  onTap?: (label: string) => void;
}

/** The rendered fan-facing page. Used by the builder preview and the public route. */
export function LinkView({ page, onTap }: LinkViewProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <div className={`lv lv--${page.theme}`}>
      <div className="lv__head">
        <div className="lv__avatar" aria-hidden="true" />
        <h2>{page.name}</h2>
        <p>{page.bio}</p>
      </div>
      <div className="lv__blocks">
        {page.blocks.map((b) => {
          if (b.type === "music") {
            return (
              <section key={b.id} className="lv__card" aria-label={b.title}>
                <strong>{b.title}</strong>
                <ul>
                  {(b.platforms ?? []).map((p) => (
                    <li key={p.name}>
                      <a href={p.url} onClick={(e) => { e.preventDefault(); onTap?.(`${b.title}: ${p.name}`); }}>
                        <Icon name="play" size={16} />
                        {p.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          if (b.type === "capture") {
            return (
              <section key={b.id} className="lv__card" aria-label={b.title}>
                <strong>{b.title}</strong>
                {joined ? (
                  <p role="status">Thanks, you are on the list.</p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (/^\S+@\S+\.\S+$/.test(email) && consent) {
                        setJoined(true);
                        onTap?.(`${b.title}: joined`);
                      }
                    }}
                  >
                    <label className="sr-only" htmlFor={`e-${b.id}`}>Email address</label>
                    <input id={`e-${b.id}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
                    <label className="lv__consent">
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                      <span>I agree to receive updates and to my email being stored under India&apos;s DPDP Act, 2023.</span>
                    </label>
                    <button type="submit" disabled={!consent || !/^\S+@\S+\.\S+$/.test(email)}>Join</button>
                  </form>
                )}
              </section>
            );
          }
          if (b.type === "text" || b.type === "tour" || b.type === "social") {
            return (
              <section key={b.id} className="lv__card lv__card--plain">
                <p>{b.title}</p>
              </section>
            );
          }
          return (
            <a key={b.id} className="lv__btn" href={b.url} onClick={(e) => { e.preventDefault(); onTap?.(b.title); }}>
              {b.title}
            </a>
          );
        })}
      </div>
      {page.plan === "free" && <p className="lv__foot">Powered by KMF Media</p>}
    </div>
  );
}
