import { useEffect } from "react";
import type { ReactNode } from "react";
import { SplitLines } from "../motion/SplitLines";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title === "KMF Media" ? "KMF Media | Real listeners for Indian music" : `${title} | KMF Media`;
  }, [title]);
}

interface PageHeadProps {
  title: string;
  /** One short line, at most 14 words. */
  lede?: string;
  aside?: ReactNode;
}

/** Shared opener for every inner route: a giant light title, one line, then the page. */
export function PageHead({ title, lede, aside }: PageHeadProps) {
  usePageTitle(title);
  return (
    <header className="page-head">
      <div className="page-head__text">
        <h1 aria-label={title}>
          <SplitLines text={title} mode="load" />
        </h1>
        {lede && <p className="lede">{lede}</p>}
      </div>
      {aside && <div className="page-head__aside">{aside}</div>}
    </header>
  );
}
