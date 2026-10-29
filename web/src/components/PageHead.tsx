import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SplitLines } from "../motion/SplitLines";
import { VelocityType } from "../motion/VelocityType";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title === "KMF Media" ? "KMF Media | Real listeners for Indian music" : `${title} | KMF Media`;
  }, [title]);
}

/**
 * One stable catalogue code per route family, printed like a record-label number.
 * The longest matching prefix wins, so child routes share their parent's code.
 */
const catalogue: [prefix: string, code: string, shelf: string][] = [
  ["/services", "KMF-010", "Services"],
  ["/plans", "KMF-020", "Plans"],
  ["/work", "KMF-030", "Work"],
  ["/founder", "KMF-040", "Founder"],
  ["/press", "KMF-050", "Press"],
  ["/regional", "KMF-060", "Regional"],
  ["/contact", "KMF-070", "Contact"],
  ["/tools", "KMF-080", "Tools"],
  ["/policy", "KMF-090", "Policy"],
  ["/marketplace/creators", "KMF-110", "Creators"],
  ["/marketplace/campaigns", "KMF-120", "Campaigns"],
  ["/marketplace", "KMF-100", "Marketplace"],
  ["/academy", "KMF-130", "Academy"],
  ["/links/builder", "KMF-150", "Links builder"],
  ["/links", "KMF-140", "Links"],
];

function catalogueFor(path: string): { code: string; shelf: string } {
  const hit = catalogue
    .filter(([p]) => path === p || path.startsWith(`${p}/`))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return hit ? { code: hit[1], shelf: hit[2] } : { code: "KMF-404", shelf: "Off the record" };
}

interface PageHeadProps {
  title: string;
  /** One short line, at most 14 words. */
  lede?: string;
  aside?: ReactNode;
  /** Overrides the catalogue line, for example a track number inside a route. */
  code?: string;
}

/** Shared opener for every inner route: a DM Mono catalogue line, a giant velocity title, one line, then the page. */
export function PageHead({ title, lede, aside, code }: PageHeadProps) {
  usePageTitle(title);
  const { pathname } = useLocation();
  const cat = catalogueFor(pathname);
  return (
    <header className="page-head">
      <div className="page-head__text">
        <p className="mono page-head__cat">
          <span>{code ?? cat.code}</span>
          <span aria-hidden="true">·</span>
          <span>{cat.shelf}</span>
          <span className="page-head__rpm" aria-hidden="true">
            33 1/3
          </span>
        </p>
        <h1 aria-label={title}>
          <VelocityType className="page-head__title">
            <SplitLines text={title} mode="load" />
          </VelocityType>
        </h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {aside && <div className="page-head__aside">{aside}</div>}
    </header>
  );
}
