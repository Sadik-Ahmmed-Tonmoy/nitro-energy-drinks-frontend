"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import RotatedCan from "@/components/helper/RotatedCan";


const EASE = [0.22, 1, 0.36, 1] as const;
const LINES = ["Since", "2002", "Producing"];
const LINES_LG = ["Since", "2002", "Prod", "ucing"]; // desktop design breaks the word in two

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  const canX = useTransform(scrollYProgress, [0, 0.5], reduce ? [0, 0] : [120, 0]);
  const canRot = useTransform(scrollYProgress, [0, 0.5], reduce ? [0, 0] : [8, 0]);

  return (
    <section ref={ref} id="about" className="relative overflow-hidden">
      {/* ── Desktop (lg+): pixel-matched to the About design. Everything is placed in % / cqw of a 1549×886 artboard ── */}
      <div className="hidden lg:block">
        <div className="@container relative mx-auto aspect-[1549/886] w-full max-w-[1920px]">
          <motion.div initial={{ clipPath: "inset(12% 12% 12% 12% round 40px)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 40px)", opacity: 1 }}
            viewport={{ once: false, margin: "-15%" }} transition={{ duration: 1.3, ease: EASE }}
            className="absolute left-[3.034%] top-[11.061%] h-[74.424%] w-[36.417%] overflow-hidden rounded-[40px]">
            <motion.div style={{ y: imgY }} className="absolute -inset-[8%]">
              <Image src="/images/player.webp" alt="Footballer dribbling in the dark with smoke trailing behind" fill sizes="46vw" className="object-cover grayscale" />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </motion.div>
          <motion.div style={{ x: canX, rotate: canRot }} className="absolute left-[11.297%] top-[27.201%] z-10 w-[76.695%]">
            <RotatedCan src="/images/green-can.webp" alt="Nitro Green can" />
          </motion.div>
 {/* super-light dark overlay behind the right-side text for readability */}
          <div aria-hidden className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[42%]"
            style={{ background: "linear-gradient(to right, transparent 0%, rgba(0,0,0,5.18) 35%, rgba(0,0,0,0.32) 100%)" }} />
          <h2 className="display absolute left-[66%] top-[15.41%] z-20 font-normal text-[#E0E600]"
            style={{ fontSize: "9cqw", lineHeight: "0.757em", letterSpacing: "-0.03em" }}>
            {LINES_LG.map((l, n) => (
              <span key={l} className="-my-[0.25em] block overflow-hidden py-[0.25em] pr-[0.15em]" style={{ height: "calc(0.757em + 0.5em)" }}>
                <motion.span className="block" initial={{ y: "30%" }} whileInView={{ y: 0 }} viewport={{ once: false, margin: "-20%" }}
                  transition={{ duration: 1.1, ease: EASE, delay: n * 0.12 }}>{l}</motion.span>
              </span>
            ))}
          </h2>
        </div>        
      </div>

      {/* ── Mobile / tablet: unchanged ── */}
      <div className="px-5 py-24 sm:px-8 lg:hidden">
        <div className="mx-auto grid max-w-[1600px] items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          <div className="relative">
            <motion.div initial={{ clipPath: "inset(12% 12% 12% 12% round 40px)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 40px)", opacity: 1 }}
              viewport={{ once: true, margin: "-15%" }} transition={{ duration: 1.3, ease: EASE }}
              className="relative aspect-[1400/1457] w-[88%] overflow-hidden rounded-[40px]">
              <motion.div style={{ y: imgY }} className="absolute -inset-[8%]">
                <Image src="/images/player.webp" alt="Footballer dribbling in the dark with smoke trailing behind" fill sizes="(min-width:1024px) 45vw, 90vw" className="object-cover grayscale" />
              </motion.div>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </motion.div>
            <motion.div style={{ x: canX, rotate: canRot }} className="absolute right-0 top-1/2 z-10 w-[88%] -translate-y-1/2 sm:w-[82%]">
              <RotatedCan src="/images/can-green.webp" alt="Nitro Green can" />
            </motion.div>
          </div>


          <h2 className="display absolute left-[66%] bottom-[1.41%] z-20 font-normal text-[#E0E600]"
            style={{ fontSize: "9cqw", lineHeight: "0.757em", letterSpacing: "-0.03em", textShadow: "0 0 40px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.4)" }}>
            {LINES_LG.map((l, n) => (
              <span key={l} className="-my-[0.25em] block overflow-hidden py-[0.25em] pr-[0.15em]" style={{ height: "calc(0.757em + 0.5em)" }}>
                <motion.span className="block" initial={{ y: "30%" }} whileInView={{ y: 0 }} viewport={{ once: false, margin: "-20%" }}
                  transition={{ duration: 1.1, ease: EASE, delay: n * 0.12 }}>{l}</motion.span>
              </span>
            ))}
          </h2>

        </div>
      </div>
    </section>
  );
}
