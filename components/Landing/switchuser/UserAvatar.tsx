import Image from "next/image";

type Props = {
  name: string;
  img: string;
};

export default function UserAvatar({ name, img }: Props) {
  return (
    <div className="group flex flex-col items-center">
      {/* Avatar */}
      <div
        className="
          relative h-20 w-20 rounded-full
          transition-transform duration-200 ease-out
          group-hover:scale-120
        "
      >
        {/* ring */}
        <div
          className="
            absolute inset-0 rounded-full ring-2 ring-white/30
            transition-all duration-200
            group-hover:ring-white/80
          "
        />

        {/* image */}
        <div className="absolute inset-[6px] overflow-hidden rounded-full">
          <Image src={img} alt={name} fill className="object-cover" />
        </div>

        {/* glow */}
        <div className="absolute -inset-4 rounded-full bg-white/0 blur-xl transition-all duration-200 group-hover:bg-white/5" />
      </div>

      {/* Name */}
      <div
        className="
          mt-3 text-xs text-white/60
          transition-all duration-200 ease-out
          group-hover:text-white
          group-hover:scale-110
          group-hover:translate-y-1.5
          origin-top
        "
      >
        {name}
      </div>
    </div>
  );
}
