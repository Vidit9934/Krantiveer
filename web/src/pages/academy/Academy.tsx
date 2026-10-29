import { PaperScene } from "../../motion/PaperScene";
import { Link } from "react-router-dom";
import { PageHead } from "../../components/PageHead";
import { Cover } from "../../components/Cover";
import { courses } from "../../data/site";
import { inr } from "../../lib/format";

export default function Academy() {
  return (
    <>
      <PageHead
        title="Video Academy"
        lede="Free previews, paid courses, certificates."
      />
      <PaperScene className="scene-paper" aria-label="Courses">
      <div className="wrap">
        <div className="posts">
          {courses.map((c) => (
            <Link key={c.slug} to={`/academy/${c.slug}`} className="release" style={{ gridTemplateColumns: "var(--thumb) minmax(0, 1fr) auto" }}>
              <Cover seed={c.seed} label="Cover" />
              <div>
                <h2 style={{ fontSize: "var(--t-lg)", fontWeight: 650, letterSpacing: "-0.03em" }}>{c.title}</h2>
                <p className="muted">{c.summary}</p>
                <p className="mono muted" style={{ marginTop: 6 }}>
                  {c.level}, {c.lessons} lessons, {Math.round(c.minutes / 60 * 10) / 10} hours
                </p>
              </div>
              <span className={`tag ${c.priceInr ? "tag--gold" : ""}`}>{c.priceInr ? inr(c.priceInr) : "Free"}</span>
            </Link>
          ))}
        </div>
      </div>
      </PaperScene>
    </>
  );
}
