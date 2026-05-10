import Image from "next/image";

type Props = {
  name: string;
  img: string;
};

export default function UserAvatar({ name, img }: Props) {
  const hasImage = img && img.trim() !== "";
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="group flex w-[110px] flex-col items-center text-center">
      <div
        className="
          relative h-20 w-20 rounded-full
          transition-transform duration-200 ease-out
          group-hover:scale-110
        "
      >
        <div
          className="
            absolute inset-0 rounded-full ring-2 ring-white/30
            transition-all duration-200
            group-hover:ring-white/80
          "
        />

        <div className="absolute inset-[6px] overflow-hidden rounded-full bg-white/10 flex items-center justify-center">
          {hasImage ? (
            <Image
              src={img}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="text-white text-2xl font-semibold select-none">
              {initial}
            </span>
          )}
        </div>

        <div className="absolute -inset-4 rounded-full bg-white/0 blur-xl transition-all duration-200 group-hover:bg-white/5" />
      </div>

      <div
        className="
          mt-3 w-full text-xs text-white/70
          transition-all duration-200 ease-out
          group-hover:text-white
          group-hover:scale-105
          group-hover:translate-y-1
          origin-top
          text-center break-words
        "
      >
        {name}
      </div>
    </div>
  );
}