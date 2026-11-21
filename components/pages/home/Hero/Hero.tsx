"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, transform, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import { FLAVORS } from "@/lib/products";
import { setSectionAccent } from "@/lib/accent";
import RotatedCan from "@/components/helper/RotatedCan";

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY = 4;

const N = FLAVORS.length;
const STEP = 280; // px between neighbouring cans while gliding
// same glide spring as Shop.tsx – soft, almost critically damped, no wobble
const GLIDE = { type: "spring", stiffness: 85, damping: 19, mass: 1, restDelta: 0.001, restSpeed: 0.01 } as const;
const mod = (v: number) => ((v % N) + N) % N;
const wrap = (v: number) => mod(v + N / 2) - N / 2;

/** One can. Position / rotation / scale / blur / fade are all derived from the continuous carousel position. */
function CanSlot({ f, n, pos }: { f: (typeof FLAVORS)[number]; n: number; pos: MotionValue<number> }) {
  const off = useTransform(pos, (p) => wrap(n - p));
  const x = useTransform(off, (o) => o * STEP);
  const rotate = useTransform(off, (o) => Math.max(-1, Math.min(1, o)) * 16);
  const scale = useTransform(off, (o) => transform(Math.abs(o), [0, 1], [1, 0.7]));
  const opacity = useTransform(off, (o) => transform(Math.abs(o), [0, 1], [1, 0]));
  const filter = useTransform(off, (o) => `blur(${transform(Math.abs(o), [0, 1], [0, 14])}px)`);
  return (
    <motion.div style={{ x, rotate, scale, opacity, filter }} className="pointer-events-none absolute inset-0 select-none will-change-transform">
      <RotatedCan src={f.img} alt={`${f.name} energy drink can`} priority />
    </motion.div>
  );
}

const socials = [
  { l: "Facebook", I: FaFacebookF }, { l: "Instagram", I: FaInstagram },
  { l: "X", I: FaXTwitter }, { l: "LinkedIn", I: FaLinkedinIn },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const pos = useMotionValue(reduce ? 0 : -1); // continuous carousel position; glides to 0 on first load
  const target = useRef(0);
  const anim = useRef<ReturnType<typeof animate> | undefined>(undefined);
  const startPos = useRef(0);
  const dragging = useRef(false);
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0); // restarts the autoplay bar
  const [grabbing, setGrabbing] = useState(false);
  const f = FLAVORS[i];

  useMotionValueEvent(pos, "change", (p) => { const r = mod(Math.round(p)); setI((prev) => (prev === r ? prev : r)); });

  /** Glide to an (unwrapped) slot; `velocity` (slots/s) carries a flick's momentum into the spring. */
  const goTo = useCallback((t: number, velocity = 0) => {
    target.current = t;
    setTick((v) => v + 1);
    anim.current?.stop();
    if (reduce) { pos.set(t); return; }
    anim.current = animate(pos, t, { ...GLIDE, velocity });
  }, [pos, reduce]);
  const jump = useCallback((n: number) => goTo(target.current + Math.round(wrap(n - target.current))), [goTo]);

  useEffect(() => { if (!reduce) anim.current = animate(pos, 0, GLIDE); return () => anim.current?.stop(); }, [pos, reduce]);

  // Theme the whole page with the active flavour (animated via @property --accent)
  useEffect(() => { document.documentElement.style.setProperty("--accent", f.accent); setSectionAccent("home", f.accent); }, [f.accent]);

  // Drag: the can follows the pointer 1:1, on release the swipe speed decides how far we glide
  const onPanStart = () => { anim.current?.stop(); startPos.current = pos.get(); dragging.current = true; setGrabbing(true); };
  const onPan = (_: unknown, info: { offset: { x: number } }) => { pos.set(startPos.current - info.offset.x / STEP); };
  const onPanEnd = (_: unknown, info: { velocity: { x: number } }) => {
    const v = -info.velocity.x / STEP;
    const here = pos.get();
    const base = Math.round(here);
    let t = Math.round(here + v * 0.18);
    if (t === base && Math.abs(v) > 1.2) t = base + Math.sign(v);
    t = Math.max(base - (N - 1), Math.min(base + (N - 1), t));
    setGrabbing(false);
    goTo(t, v);
    setTimeout(() => { dragging.current = false; }, 80);
  };

  // Pointer parallax
  const mx = useMotionValue(0), my = useMotionValue(0);
  const spring = { stiffness: 60, damping: 18 };
  const canX = useSpring(useTransform(mx, [-0.5, 0.5], [-26, 26]), spring);
  const canY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), spring);
  const txtX = useSpring(useTransform(mx, [-0.5, 0.5], [14, -14]), spring);

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5);
      }}>
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,#1b1b1b_0%,#050505_75%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(50% 45% at 50% 50%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)" }} />

      {/* stage */}
      <motion.div onPanStart={onPanStart} onPan={onPan} onPanEnd={onPanEnd}
        className={`relative z-10 mt-[72px] min-h-[190px] flex-1 touch-pan-y lg:mt-[80px] ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}>
        <motion.h1 aria-label="Nitro" style={{ x: txtX }}
          initial={{ opacity: 0, scale: 0.94, y: 40, letterSpacing: "0.06em" }}
          animate={{ opacity: 1, scale: 1, y: 0, letterSpacing: "-0.03em" }}
          transition={{ duration: 1.4, ease: EASE }}
          className="display accent-text absolute inset-0 grid select-none place-items-center text-center leading-none"
        >
          <span aria-hidden className="block text-[min(30vw,560px)]">Nitro</span>
        </motion.h1>

        <motion.div style={{ x: canX, y: canY }}
          className="absolute left-1/2 top-1/2 z-10 w-[min(88vw,780px)] -translate-x-1/2 -translate-y-1/2 lg:w-[min(54vw,780px)]">
          <motion.div className="relative" animate={reduce ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <div className="relative aspect-[1400/529] w-full">
              {FLAVORS.map((x, n) => <CanSlot key={x.id} f={x} n={n} pos={pos} />)}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* flavour switcher */}
      <div className="relative z-20 flex flex-col items-center gap-4 px-5 pb-6">
        <div className="h-9 overflow-hidden text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={f.id} initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -28, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }} className="display text-2xl leading-9">
              {f.name} <span className="font-sans not-italic text-base font-extrabold text-white/70">{f.price} $</span>
            </motion.p>
          </AnimatePresence>
        </div>
        <div role="tablist" aria-label="Choose a flavour" className="flex items-center gap-2 sm:gap-3">
          {FLAVORS.map((x, n) => {
            const on = n === i;
            return (
              <button key={x.id} role="tab" aria-selected={on} aria-label={x.name} onClick={() => jump(n)}
                className="relative grid h-11 w-11 cursor-pointer place-items-center">
                <span className="block size-5 rounded-full transition-transform duration-500"
                  style={{ background: x.accent, transform: on ? "scale(1.25)" : "scale(0.85)", boxShadow: on ? `0 0 0 3px #050505, 0 0 0 4.5px ${x.accent}` : "none" }} />
              </button>
            );
          })}
        </div>
        {!reduce && (
          <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <motion.div key={`${i}-${tick}`} className="h-full origin-left bg-[var(--accent)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: AUTOPLAY, ease: "linear" }} onAnimationComplete={() => { if (!dragging.current) goTo(target.current + 1); }} />
          </div>
        )}
      </div>

      {/* bottom bar */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.7 }}
        className="relative z-20 mx-auto grid w-full max-w-[1600px] items-center gap-6 px-5 pb-8 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-16 lg:pb-12">
        <p className="max-w-[460px] text-sm uppercase leading-[150%] text-white/90 sm:text-base">
          Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac.
        </p>
        <div className="flex gap-4 lg:justify-self-center">
          <a href="#shop" className="btn flex-1 bg-white text-black sm:flex-none">Buy Now</a>
          <a href="#about" className="btn flex-1 border border-white text-white hover:bg-white hover:text-black sm:flex-none">More info</a>
        </div>
        <ul className="flex gap-4 lg:justify-self-end">
          {socials.map(({ l, I }) => (
            <li key={l}>
              <a href="#contact" aria-label={l} className="grid size-10 place-items-center rounded-full border border-[var(--accent)] text-[var(--accent)] transition-all duration-300 hover:bg-[var(--accent)] hover:text-black">
                <I size={16} />
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
