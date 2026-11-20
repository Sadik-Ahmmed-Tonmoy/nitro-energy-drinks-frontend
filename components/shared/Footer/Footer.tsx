import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { NAV } from "@/lib/products";

const socials = [{ l: "Facebook", I: FaFacebookF }, { l: "Instagram", I: FaInstagram }, { l: "X", I: FaXTwitter }, { l: "LinkedIn", I: FaLinkedinIn }];

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden px-5 pb-8 pt-20 sm:px-8 lg:px-16 lg:pt-28">
      <div aria-hidden className="display accent-text pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none text-[min(34vw,520px)] leading-none opacity-[0.07]">Nitro</div>
      <div className="relative mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[1.2fr_1fr_auto]">
        <div>
          <Image src="/images/logo.png" alt="Nitro" width={288} height={66} className="h-7 w-auto" />
          <h2 className="mt-6 max-w-md text-2xl font-medium leading-[130%]">Questions about an order or becoming a stockist?</h2>
          <a href="mailto:hello@nitro.example" className="mt-4 inline-block text-lg text-[var(--accent)] underline-offset-4 hover:underline">hello@nitro.example</a>
        </div>
        <nav aria-label="Footer"><ul className="flex flex-wrap gap-x-8 gap-y-3 lg:flex-col">
          {NAV.map((n) => <li key={n.href}><a href={n.href} className="text-white/70 transition-colors hover:text-[var(--accent)]">{n.label}</a></li>)}
        </ul></nav>
        <ul className="flex gap-4 lg:items-start">
          {socials.map(({ l, I }) => (
            <li key={l}><a href="#contact" aria-label={l} className="grid size-10 place-items-center rounded-full border border-[var(--accent)] text-[var(--accent)] transition-all duration-300 hover:bg-[var(--accent)] hover:text-black"><I size={16} /></a></li>
          ))}
        </ul>
      </div>
      <p className="relative mx-auto mt-16 max-w-[1600px] text-sm text-white/50">© 2026 Nitro Energy Drink. All rights reserved.</p>
    </footer>
  );
}
