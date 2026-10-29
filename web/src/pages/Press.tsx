import { PaperScene } from "../motion/PaperScene";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";
import { Art } from "../components/Art";
import { posts } from "../data/site";
import { longDate } from "../lib/format";

const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

export function PressIndex() {
  const [cat, setCat] = useState("All");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const shown = posts.filter((p) => cat === "All" || p.category === cat);
  const valid = /^\S+@\S+\.\S+$/.test(email);
  return (
    <>
      <PageHead title="KMF Press" lede="News and guides for artists." />
      <div className="wrap section--tight stack--lg">
        <div className="row" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button key={c} type="button" className={`tag${cat === c ? " tag--gold" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)} style={{ minHeight: 44, cursor: "pointer", background: "none" }}>
              {c}
            </button>
          ))}
        </div>
        <div className="posts">
          {shown.map((p, i) => (
            <Link key={p.slug} to={`/press/${p.slug}`} className="post-row post-row--art">
              <Art slot={["svc-press", "work-5", "work-6", "work-7"][i % 4]} className="post-row__art" tag={false} />
              <span className="mono post-row__date">
                {longDate(p.date)}, {p.category}
              </span>
              <h3>{p.title}</h3>
              <p className="muted">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
      <PaperScene className="scene-paper" aria-label="Newsletter">
      <div className="wrap">
        <form
          className="stack press-news"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) setSent(true);
          }}
          noValidate
        >
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>The KMF Press newsletter</h2>
          {sent ? (
            <p role="status">Thanks. This is a preview, so nothing was sent. On the live site you would get a confirmation email.</p>
          ) : (
            <div className="field">
              <label htmlFor="nl">Email address</label>
              <div className="row" style={{ flexWrap: "nowrap" }}>
                <input id="nl" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={email.length > 0 && !valid} />
                <Button disabled={!valid} onClick={() => setSent(true)}>
                  Subscribe
                </Button>
              </div>
              {email.length > 0 && !valid && <small className="field__error">Enter an email like name@example.com.</small>}
            </div>
          )}
        </form>
      </div>
      </PaperScene>
    </>
  );
}

export function Article() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return (
      <>
        <PageHead title="Article not found" lede="That article is not on KMF Press." />
        <div className="wrap section--tight">
          <Button to="/press">Back to KMF Press</Button>
        </div>
      </>
    );
  }
  return (
    <>
      <PageHead title={post.title} lede={`${post.category}. By ${post.author}, ${longDate(post.date)}.${post.sponsored ? " Sponsored feature." : ""}`} />
      <PaperScene className="scene-paper">
      <article className="wrap wrap--read stack--lg">
        {post.body.map((para, i) => (
          <p key={i} style={{ fontSize: "1.1875rem", maxWidth: "62ch" }}>
            {para}
          </p>
        ))}
        <Button to="/press" variant="secondary">
          Back to KMF Press
        </Button>
      </article>
      </PaperScene>
    </>
  );
}
