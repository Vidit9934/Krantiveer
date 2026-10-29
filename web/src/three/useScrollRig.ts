import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../motion/gsap";
import { hasFinePointer } from "../motion/env";
import type { Side } from "../context/SideContext";
import { BEATS, invalidate, layoutFor, pointer, posesFor, rig } from "./rig";
import type { Pose } from "./rig";

/**
 * One master timeline for the whole home page.
 *
 * The timeline is paused and laid out in "beat time": pose i sits at time i. One ScrollTrigger
 * (start 0, end max) maps scroll position to beat time through the [data-beat] anchors, so each
 * pose holds while its scenes are on screen and the camera moves only between them. A single
 * quickTo damps that time (scrub), which seeks the timeline; the timeline writes into `rig` and
 * flags a frame. Everything runs on the GSAP ticker that Lenis already uses.
 */
export function useScrollRig(onQuietChange: (quiet: boolean) => void) {
  useEffect(() => {
    let layout = layoutFor(window.innerWidth, window.innerHeight);
    let tl = build(layout);
    const proxy = { t: 0 };
    let quiet = false;

    /* Anchors: for beat i (1..5), the camera travels while scroll goes from a[i] to b[i]. */
    const a = new Float64Array(BEATS);
    const b = new Float64Array(BEATS);
    const measure = () => {
      const vh = window.innerHeight;
      for (let i = 1; i < BEATS; i++) {
        const el = document.querySelector<HTMLElement>(`[data-beat="${i + 1}"]`);
        if (!el) {
          a[i] = b[i] = Number.MAX_VALUE;
          continue;
        }
        const host = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
        const top = host.getBoundingClientRect().top + window.scrollY;
        a[i] = Math.max(i > 1 ? b[i - 1] : 0, top - vh * 0.95);
        b[i] = Math.max(a[i] + 1, top - vh * 0.12);
      }
    };
    const beatTime = (y: number) => {
      let t = 0;
      for (let i = 1; i < BEATS; i++) {
        if (a[i] === Number.MAX_VALUE) return t; // this beat has no scene on the page
        if (y >= b[i]) t = i;
        else if (y > a[i]) return i - 1 + (y - a[i]) / (b[i] - a[i]);
        else return t;
      }
      return t;
    };

    const seek = gsap.quickTo(proxy, "t", {
      duration: 1.1,
      ease: "power3.out",
      onUpdate: () => {
        tl.time(proxy.t);
        rig.beat = proxy.t;
        invalidate();
        const q = (proxy.t > 1.55 && proxy.t < 2.45) || (proxy.t > 3.55 && proxy.t < 4.45);
        if (q !== quiet) {
          quiet = q;
          onQuietChange(q);
        }
      },
    });

    /* Dense full-width scenes ask for more veil (data-veil="0..1") while they hold the middle of the screen. */
    let veils: { top: number; bottom: number; v: number }[] = [];
    const measureVeils = () => {
      veils = [...document.querySelectorAll<HTMLElement>("[data-veil]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, v: Number(el.dataset.veil) || 0 };
      });
    };
    const veilAt = (y: number) => {
      const mid = y + window.innerHeight * 0.5;
      for (const s of veils) if (mid >= s.top && mid <= s.bottom) return s.v;
      return 0;
    };
    const boost = gsap.quickTo(rig, "veilBoost", { duration: 0.9, ease: "power2.out", onUpdate: () => invalidate() });

    /* The footer: the stage fades out as it rises past the middle of the screen. */
    let footerTop = Number.MAX_VALUE;
    const measureFooter = () => {
      const f = document.querySelector<HTMLElement>(".footer");
      footerTop = f ? f.getBoundingClientRect().top + window.scrollY : Number.MAX_VALUE;
    };
    const fadeAt = (y: number) => {
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (y + vh * 0.55 - footerTop) / (vh * 0.3)));
    };
    const fade = gsap.quickTo(rig, "fade", { duration: 0.6, ease: "power2.out", onUpdate: () => invalidate() });

    const onScroll = (y: number) => {
      seek(beatTime(y));
      boost(veilAt(y));
      fade(fadeAt(y));
    };

    measure();
    measureVeils();
    measureFooter();
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => onScroll(self.scroll()),
      onRefresh: (self) => {
        measure();
        measureVeils();
        measureFooter();
        onScroll(self.scroll());
      },
    });
    // Land on the right pose straight away (deep link, reload mid-page).
    proxy.t = beatTime(window.scrollY);
    tl.time(proxy.t);
    rig.beat = proxy.t;

    const onResize = () => {
      const next = layoutFor(window.innerWidth, window.innerHeight);
      if (next !== layout) {
        layout = next;
        tl.kill();
        tl = build(layout);
        tl.time(proxy.t);
      }
      invalidate(2);
    };
    window.addEventListener("resize", onResize);

    /* Pointer tilt target (the frame loop damps toward it). Fine pointers only. */
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    const fine = hasFinePointer();
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      st.kill();
      tl.kill();
      window.removeEventListener("resize", onResize);
      if (fine) window.removeEventListener("pointermove", onMove);
    };
  }, [onQuietChange]);
}

function build(layout: ReturnType<typeof layoutFor>) {
  const poses = posesFor(layout);
  // Seed the rig with this layout's first pose: at time 0 no tween has rendered yet.
  Object.assign(rig, poses[0]);
  const tl = gsap.timeline({ paused: true });
  for (let i = 1; i < poses.length; i++) {
    tl.fromTo(rig, { ...poses[i - 1] } as Pose, { ...poses[i], duration: 1, ease: "sine.inOut", immediateRender: false }, i - 1);
  }
  return tl;
}

/** Side A / Side B: the record lifts, turns over about its diameter and settles. */
export function useSideFlip(side: Side) {
  const first = useRef(true);
  useEffect(() => {
    const to = side === "b" ? Math.PI : 0;
    if (first.current) {
      // The record starts on the side the visitor chose last time; no flip on arrival.
      first.current = false;
      rig.flip = to;
      invalidate();
      return;
    }
    if (Math.abs(rig.flip - to) < 1e-3) return;
    const tw = gsap.to(rig, { flip: to, duration: 1.6, ease: "expo.inOut", onUpdate: () => invalidate() });
    return () => {
      tw.kill();
    };
  }, [side]);
}
