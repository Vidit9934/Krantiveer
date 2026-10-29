import { PaperScene } from "../motion/PaperScene";
import { Link, useParams } from "react-router-dom";
import { PageHead } from "../components/PageHead";
import { Button } from "../components/Button";
import { Cover } from "../components/Cover";
import { Art } from "../components/Art";
import { regions, releases } from "../data/site";

export function RegionalHub() {
  return (
    <>
      <PageHead title="Regional music" lede="Five languages, each with its own audience and rhythm." />
      <div className="wrap wrap--index section--tight">
        <div className="regional">
          {regions.map((r, i) => (
            <Link key={r.slug} to={`/regional/${r.slug}`} data-cursor="Open" className="regional__card">
              <Art slot={["work-1", "work-2", "work-4", "work-7", "svc-regional"][i]} className="regional__art" />
              <span className="regional__name">{r.name}</span>
              <p>{r.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export function RegionalPage() {
  const { slug } = useParams();
  const region = regions.find((r) => r.slug === slug);
  if (!region) {
    return (
      <>
        <PageHead title="Language not found" lede="We have no page for that language yet." />
        <div className="wrap section--tight">
          <Button to="/regional">See all languages</Button>
        </div>
      </>
    );
  }
  const related = releases.filter((r) => r.language.toLowerCase().startsWith(region.name.toLowerCase().split(" ")[0]));
  return (
    <>
      <PageHead title={region.name} lede={region.note} />
      <PaperScene className="scene-paper" aria-label={`${region.name} notes`}>
      <div className="wrap wrap--index stack--lg">
        <section className="stack" aria-labelledby="where">
          <h2 id="where" style={{ fontSize: "var(--t-lg)", fontWeight: 650 }}>
            Where listeners are
          </h2>
          <p className="muted">{region.platforms}</p>
        </section>
        <section className="stack" aria-labelledby="cases">
          <h2 id="cases" style={{ fontSize: "var(--t-lg)", fontWeight: 650 }}>
            Releases
          </h2>
          {related.length === 0 ? (
            <p className="empty">Placeholder: approved {region.name} case studies appear here.</p>
          ) : (
            related.map((r) => (
              <div key={r.ref} className="release">
                <Cover seed={r.seed} />
                <div>
                  <span className="release__ref">{r.ref}</span>
                  <h3>{r.title}</h3>
                  <p className="muted">{r.goal}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
      </PaperScene>
      <div className="wrap wrap--index section">
        <div className="row">
          <Button to="/marketplace" iconAfter="arrow" magnetic>
            Find {region.name} creators
          </Button>
          <Button to="/contact" variant="secondary" magnetic>
            Plan a release
          </Button>
        </div>
      </div>
    </>
  );
}
