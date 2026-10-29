import { Component, lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSide } from "../context/SideContext";
import { canMove, setProgress, stage, useMotionOn, useStageReady, useStageTier } from "../motion/stage";
import { Disc } from "./Disc";

/* The 3D chunk is only requested after the gate below has seen WebGL2 and motion allowed. */
const Stage = lazy(() =>
  import("../three/Stage").then((m) => {
    setProgress("chunk", 1);
    return m;
  }),
);

class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    stage.degrade("static");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The fixed 3D stage behind the home scenes (full and light tiers). Renders nothing in the
 * static tier: no WebGL2, reduced motion, context lost, or the visitor chose "Still image".
 * Decorative: aria-hidden; every word on it also exists in the DOM.
 */
export function Scene3D() {
  const tier = useStageTier();
  const ready = useStageReady();
  const { side } = useSide();

  useEffect(() => () => stage.setReady(false), []);

  if (tier === "static") return null;
  return (
    <div className={`stage3d${ready ? " is-ready" : ""}`} aria-hidden="true">
      <StageBoundary>
        <Suspense fallback={null}>
          <Stage tier={tier} side={side} />
        </Suspense>
      </StageBoundary>
      <div className="stage3d__scrim" data-scrim="side" />
      <div className="stage3d__veil" data-scrim="veil" />
    </div>
  );
}

/**
 * The record's place in the hero. Static tier: the CSS/SVG record poster (Disc). 3D tiers: the
 * same poster as the loading state, cross-fading out once the first 3D frame is drawn, then an
 * empty box that keeps the layout (the 3D record is framed into it).
 */
export function HeroObject({ caption }: { caption: string }) {
  const tier = useStageTier();
  const ready = useStageReady();
  const live = tier !== "static" && ready;
  const [faded, setFaded] = useState(false);

  /* Unmount the poster once its cross-fade has finished; it returns if the stage drops to static. */
  useEffect(() => {
    if (!live) return;
    const t = window.setTimeout(() => setFaded(true), 1200);
    return () => window.clearTimeout(t);
  }, [live]);

  if (live && faded) return null;
  return (
    <div className={`hero__poster${live ? " is-leaving" : ""}`}>
      <div className="hero__cone" />
      <div className="hero__spin" data-hero-spin data-enter>
        <Disc caption={caption} />
      </div>
    </div>
  );
}

/** On-page motion switch, beside the system setting. Hidden where the 3D stage cannot run. */
export function MotionToggle() {
  const on = useMotionOn();
  const [able] = useState(canMove);
  if (!able) return null;
  return (
    <button type="button" className="motion-toggle" aria-pressed={!on} onClick={() => stage.setMotion(!on)}>
      {on ? "Still image" : "Moving scene"}
    </button>
  );
}
