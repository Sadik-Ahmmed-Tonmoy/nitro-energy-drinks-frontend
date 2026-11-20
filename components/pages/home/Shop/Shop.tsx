"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  animate, motion, transform, useInView, useMotionValue, useMotionValueEvent,
  useReducedMotion, useTransform, type MotionValue,
} from "framer-motion";
import { FLAVORS, type Flavor } from "@/lib/products";
import { setSectionAccent } from "@/lib/accent";

const ORDER = ["gold", "red", "green", "sky", "blue"];
const SCALE = [1, 0.78, 0.66]; // by distance from the centre slot
const LIFT = [0, -28, -28]; // side cans sit a little higher, like the design
const AUTOPLAY = 5; // seconds per flavour
const START = 2; // Nitro Green starts in the middle
const N = ORDER.length;

// intro (first reveal) spring – unchanged from before
const SPRING = { type: "spring", stiffness: 90, damping: 17, mass: 0.9 } as const;
// rotation spring – slightly softer + (almost) critically damped = smooth glide, no wobble
const GLIDE = { type: "spring", stiffness: 85, damping: 19, mass: 1, restDelta: 0.001, restSpeed: 0.01 } as const;

const mod = (v: number) => ((v % N) + N) % N;
/** Shortest signed distance on the ring, in -N/2 .. N/2 (works for fractional positions). */
const wrap = (v: number) => mod(v + N / 2) - N / 2;
/** Whole-slot offset of item n from the active one, -2..2. */
const offsetOf = (n: number, active: number) => ((n - active + 2 + N * 2) % N) - 2;

type SlotProps = {
  f: Flavor; n: number; pos: MotionValue<number>; half: MotionValue<number>;
  shown: boolean; centre: boolean; revealed: boolean; settled: boolean; onPick: (n: number) => void;
};

/** One can. Its position / scale / fade are all derived from the *continuous* carousel position,
 *  so it glides smoothly (and follows your finger while dragging) instead of jumping between steps. */
function Slot({ f, n, pos, half, shown, centre, revealed, settled, onPick }: SlotProps) {
  const off = useTransform(pos, (p) => wrap(n - p));
  const x = useTransform(off, (o) => `${o * 100}%`);
  const y = useTransform(off, (o) => transform(Math.abs(o), [0, 1, 2], LIFT));
  const scale = useTransform(off, (o) => transform(Math.abs(o), [0, 1, 2], SCALE));
  // fully visible inside the slots, fades out over the last half-slot → the wrap-around is invisible
  const opacity = useTransform([off, half], ([o, h]: number[]) => Math.max(0, Math.min(1, (h + 0.5 - Math.abs(o)) / 0.5)));
  const glow = useTransform(off, (o) => transform(Math.abs(o), [0, 1], [0.9, 0.4]));
  const delay = settled ? 0 : Math.abs(n - START) * 0.12;

  return (
    <motion.li aria-hidden={!shown || undefined}
      style={{ x, y, opacity, "--c": f.accent, left: "calc(50% - var(--w) / 2)", width: "var(--w)" } as unknown as CSSProperties}
      className={`group absolute bottom-0 select-none ${shown ? "" : "pointer-events-none"}`}>
      {/* the whole product (can + name + price) is the click target */}
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={revealed ? { y: 0, opacity: 1 } : undefined}
        transition={{ y: { ...SPRING, delay }, opacity: { duration: 0.6, delay } }}
        onClick={() => onPick(n)}
        className="flex w-full cursor-[inherit] flex-col items-center">
        <motion.div style={{ scale, transformOrigin: "50% 100%" }} className="w-full">
          <motion.button type="button" tabIndex={centre || !shown ? -1 : 0}
            aria-label={centre ? `${f.name} (selected)` : `Show ${f.name}`}
            whileHover={{ y: centre ? 0 : -14 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative block h-[380px] w-full cursor-[inherit] lg:h-[min(38vw,560px)]">
            <Image src={f.img} alt={`${f.name} can`} fill draggable={false}
              sizes="(min-width:1024px) 20vw, 40vw"
              className="pointer-events-none object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.7)]" />
          </motion.button>
        </motion.div>
        <div className="-mt-3 w-[70%] transition duration-500 group-hover:scale-110 group-hover:brightness-150">
          <motion.div aria-hidden className="h-4 w-full rounded-[50%] blur-md" style={{ background: "var(--c)", opacity: glow }} />
        </div>
        <h3 className="display mt-5 text-center text-xl leading-[150%] lg:text-2xl">{f.name}</h3>
        <p className="text-base leading-[150%] text-white/70 lg:text-[17px]">{f.tag}</p>
        <p className="text-xl font-extrabold leading-[150%] lg:text-2xl">{f.price} $</p>
      </motion.div>
    </motion.li>
  );
}

export default function Shop() {
  const items = ORDER.map((id) => FLAVORS.find((f) => f.id === id)!);
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const visible = useInView(stage, { margin: "-15% 0px -15% 0px" });

  const pos = useMotionValue(START); // continuous carousel position (unbounded, wraps visually)
  const half = useMotionValue(2); // (slots - 1) / 2
  const target = useRef(START); // integer slot we are heading to
  const anim = useRef<ReturnType<typeof animate> | undefined>(undefined);
  const startPos = useRef(0);
  const dragged = useRef(false);

  const [i, setI] = useState(START); // active flavour (rounded position)
  const [tick, setTick] = useState(0); // restarts the autoplay bar
  const [slots, setSlots] = useState(5); // 5 cans on desktop, 3 on small screens
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  useMotionValueEvent(pos, "change", (p) => {
    const r = mod(Math.round(p));
    setI((prev) => (prev === r ? prev : r));
  });

  /** Glide to an (unwrapped) slot. `velocity` is in slots/second so a flick carries its momentum into the spring. */
  const goTo = useCallback((t: number, velocity = 0) => {
    target.current = t;
    setTick((v) => v + 1);
    anim.current?.stop();
    if (reduce) { pos.set(t); return; }
    anim.current = animate(pos, t, { ...GLIDE, velocity });
  }, [pos, reduce]);

  /** Take the shortest way round the ring to flavour n. */
  const jump = useCallback((n: number) => goTo(target.current + Math.round(wrap(n - target.current))), [goTo]);
  /** Click on a product – ignored if the click is just the end of a drag. */
  const pick = useCallback((n: number) => { if (!dragged.current) jump(n); }, [jump]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setSlots(mq.matches ? 5 : 3);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => { half.set((slots - 1) / 2); }, [slots, half]);

  // first reveal (staggered from the centre), then hand over to autoplay
  useEffect(() => { if (visible) setRevealed(true); }, [visible]);
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setSettled(true), 1500);
    return () => clearTimeout(t);
  }, [revealed]);

  useEffect(() => () => anim.current?.stop(), []);

  // let the navbar follow the selected can while Shop is on screen
  useEffect(() => { setSectionAccent("shop", items[i].accent); }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const slotWidth = () => (track.current?.offsetWidth ?? 1) / slots;

  // drag: the row follows the pointer 1:1, on release the swipe *speed* decides how many cans we travel
  const onPanStart = () => {
    anim.current?.stop();
    startPos.current = pos.get();
    dragged.current = true;
    setGrabbing(true);
  };
  const onPan = (_: unknown, info: { offset: { x: number } }) => {
    pos.set(startPos.current - info.offset.x / slotWidth());
  };
  const onPanEnd = (_: unknown, info: { velocity: { x: number } }) => {
    const v = -info.velocity.x / slotWidth(); // slots per second
    const here = pos.get();
    const base = Math.round(here);
    let t = Math.round(here + v * 0.18); // where the momentum would carry us
    if (t === base && Math.abs(v) > 1.2) t = base + Math.sign(v); // a quick flick always moves at least one
    t = Math.max(base - (N - 1), Math.min(base + (N - 1), t)); // never lap the whole row
    goTo(t, v);
    setGrabbing(false);
    setTimeout(() => { dragged.current = false; }, 80); // let the trailing click event pass first
  };

  return (
    <section id="shop" className="relative overflow-hidden py-24 lg:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,#171717_0%,#050505_80%)]" />
      <h2 className="sr-only">Shop Nitro flavours</h2>

      <motion.div ref={stage} onPanStart={onPanStart} onPan={onPan} onPanEnd={onPanEnd}
        className={`relative mx-auto h-[600px] max-w-[1600px] touch-pan-y px-4 lg:h-[calc(min(38vw,560px)+210px)] lg:px-16 ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}>
        <ul ref={track} className="relative h-full" style={{ "--w": `${100 / slots}%` } as CSSProperties}>
          {items.map((f, n) => {
            const d = Math.abs(offsetOf(n, i));
            const shown = revealed && d <= (slots - 1) / 2;
            return (
              <Slot key={f.id} f={f} n={n} pos={pos} half={half}
                shown={shown} centre={d === 0} revealed={revealed} settled={settled} onPick={pick} />
            );
          })}
        </ul>
      </motion.div>

      <div role="tablist" aria-label="Choose a flavour" className="relative mt-4 flex items-center justify-center gap-2 sm:gap-3">
        {items.map((x, n) => {
          const on = n === i;
          return (
            <button key={x.id} role="tab" aria-selected={on} aria-label={x.name} onClick={() => jump(n)}
              className="relative grid h-11 w-11 cursor-pointer place-items-center">
              <span className="block size-4 rounded-full transition-transform duration-500"
                style={{ background: x.accent, transform: on ? "scale(1.25)" : "scale(0.85)", boxShadow: on ? `0 0 0 3px #050505, 0 0 0 4.5px ${x.accent}` : "none" }} />
            </button>
          );
        })}
      </div>

      {!reduce && (
        <div className="relative mx-auto mt-2 h-0.5 w-40 overflow-hidden rounded-full bg-white/10" aria-hidden>
          <motion.div key={`${i}-${tick}`} className="h-full origin-left" style={{ background: items[i].accent }}
            initial={{ scaleX: 0 }} animate={{ scaleX: settled ? 1 : 0 }}
            transition={{ duration: AUTOPLAY, ease: "linear" }}
            onAnimationComplete={() => { if (settled && !dragged.current) goTo(target.current + 1); }} />
        </div>
      )}
    </section>
  );
}
