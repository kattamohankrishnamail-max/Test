import Image from "next/image";
import type { Image as ImageT } from "@/lib/content/schemas";
import Placeholder from "./Placeholder";

/** Renders a content image with next/image, or a neutral placeholder for "placeholder:" sources. */
export default function ContentImage({
  image,
  ratio = "4/3",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className = "",
}: {
  image: ImageT;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (image.src.startsWith("placeholder:")) {
    return <Placeholder label={image.src.slice("placeholder:".length)} ratio={ratio} className={className} />;
  }
  return (
    <div className={`relative w-full overflow-hidden bg-limestone-deep ${className}`} style={{ aspectRatio: ratio }}>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
