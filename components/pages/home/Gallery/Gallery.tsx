"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useVelocity,
} from "framer-motion";
import { FLAVORS } from "@/lib/products";

const TILES = FLAVORS.map((f) => ({ src: f.img, alt: `${f.name} can`, cover: false }));
const BASE_VELOCITY = 100;
const MAX_SCROLL_BOOST = 500;
const SCROLL_SENSITIVITY = 0.12;

export default function Gallery() {
  const shouldReduceMotion = useReducedMotion();
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const secondGroupRef = useRef<HTMLDivElement>(null);
  const period = useRef(0);
  const direction = useRef(-1);
  const scrollBoost = useRef(0);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  useEffect(() => {
    const first = firstGroupRef.current;
    const second = secondGroupRef.current;
    if (!first || !second) return;

    const measure = () => {
      period.current = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(first);
    observer.observe(second);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollVelocity, "change", (velocity) => {
    if (velocity > 1) direction.current = -1;
    else if (velocity < -1) direction.current = 1;
    scrollBoost.current = Math.min(Math.abs(velocity) * SCROLL_SENSITIVITY, MAX_SCROLL_BOOST);
  });

  useAnimationFrame((_time, delta) => {
    if (shouldReduceMotion || period.current === 0) return;

    let next = x.get() + direction.current * (BASE_VELOCITY + scrollBoost.current) * (delta / 1000);
    if (next <= -period.current) next += period.current;
    else if (next > 0) next -= period.current;
    x.set(next);
  });

  const renderGroup = (duplicate: boolean) => (
    <div
      ref={duplicate ? secondGroupRef : firstGroupRef}
      className="flex shrink-0 gap-5"
      aria-hidden={duplicate}
    >
      {TILES.map((t, n) => (
        <motion.div
          key={`${duplicate ? "duplicate-" : ""}${n}`}
          className="relative h-[360px] w-[270px] shrink-0 overflow-hidden rounded-[32px] bg-white/[0.04] sm:h-[440px] sm:w-[330px]"
          initial={shouldReduceMotion ? false : {
            opacity: 0,
            x: n % 4 === 0 ? -56 : n % 4 === 1 ? 56 : 0,
            y: n % 4 === 2 ? -48 : n % 4 === 3 ? 48 : 0,
          }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={t.src}
            alt={duplicate ? "" : t.alt}
            fill
            sizes="330px"
            className={t.cover ? "object-cover grayscale" : "object-contain p-8 drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]"}
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="gallery" className="overflow-hidden py-20 lg:py-28">
      <h2 className="sr-only">Gallery</h2>
      <motion.div style={{ x }} className="flex w-max gap-5 px-2.5">
        {renderGroup(false)}
        {renderGroup(true)}
      </motion.div>
    </section>
  );
}
