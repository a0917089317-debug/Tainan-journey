import Image from "next/image";
import { Parallax } from "@/components/parallax";

export function ParallaxHeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Parallax
        speed={0.2}
        range={120}
        className="absolute inset-x-0 -top-[15%] h-[130%]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background" />
    </div>
  );
}
