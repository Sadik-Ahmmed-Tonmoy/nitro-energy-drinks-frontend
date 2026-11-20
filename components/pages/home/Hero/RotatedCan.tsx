import Image from "next/image";

/** Lays a vertical can PNG on its side (lid to the right), as in the hero design. */
export default function RotatedCan({ src, alt = "", priority = false }: { src: string; alt?: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[1400/529] w-full">
      <div className="absolute left-1/2 top-1/2 h-[264.6%] w-[37.8%] -translate-x-1/2 -translate-y-1/2 rotate-90">
        <Image src={src} alt={alt} fill priority={priority} sizes="540px"
          className="object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.65)]" />
      </div>
    </div>
  );
}
