import Image from "next/image";
import Link from "next/link";

type PostCoverImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  linkProps: React.ComponentProps<typeof Link>;
};

export function PostCoverImage({ imageProps, linkProps }: PostCoverImageProps) {
  const hasSource = typeof imageProps.src === "string" && imageProps.src.trim() !== "";

  return (
    <Link {...linkProps} className={`w-full h-full overflow-hidden ${linkProps.className}`}>
      {hasSource ? (
        <Image
          {...imageProps}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition ${imageProps.className}`}
          alt={imageProps.alt}
        />
      ) : (
        <div
          aria-label={imageProps.alt || "Post cover unavailable"}
          className={`h-full w-full bg-(--card-background) ${imageProps.className}`}
          role="img"
        />
      )}
    </Link>
  );
}
