"use client";

import { useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";

const users = [
  { name: "Beby Jovancy", img: "https://i.pravatar.cc/150?img=32" },
  { name: "Aisyah Zidni", img: "https://i.pravatar.cc/150?img=47" },
  { name: "Nirmala Azalea", img: "https://i.pravatar.cc/150?img=5" },
  { name: "Bena Kane", img: "https://i.pravatar.cc/150?img=12" },
  { name: "Firmino Kudo", img: "https://i.pravatar.cc/150?img=8" },
  { name: "Extra User", img: "https://i.pravatar.cc/150?img=20" },
];

export default function UserRow() {
  const router = useRouter();

  const handleSelectUser = (user: { name: string; img: string }) => {
    // store selected cashier details (dummy session)
    sessionStorage.setItem("cashier", JSON.stringify(user));

    router.push("/pinentry");
  };

  return (
    <div className="relative mx-auto max-w-5xl bg-transparent">
      <div
        onWheel={(e) => {
          const el = e.currentTarget;
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
          }
        }}
        className="
          flex gap-12 px-6 py-3
          overflow-x-auto
          snap-x snap-mandatory
          scroll-smooth
          scrollbar-hide
          bg-transparent
          cursor-pointer
        "
      >
        {users.map((user) => (
          <div
            key={user.name}
            onClick={() => handleSelectUser(user)}
            className="shrink-0 snap-center bg-transparent"
            style={{ width: "calc((100% - 192px) / 5)" }}
          >
            <UserAvatar {...user} />
          </div>
        ))}
      </div>
    </div>
  );
}
