"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "./Utility/Avatar";

export default function Header() {
  const pathname = usePathname();

  const menus = [
    { label: "Rules & Guidelines", href: "/parking/guidelines" },
    { label: "Schedule Today", href: "/parking/today" },
    { label: "Calendar", href: "/parking" },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="sticky top-0 w-full p-4 bg-slate-800 text-white shadow z-50 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto] items-center gap-x-4">
      <p className="text-lg uppercase text-white font-bold font-mono">
        Parking Rotation System
      </p>
      <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto flex items-center justify-center md:justify-end gap-x-4 mt-4 md:mt-0">
        {menus.map((menu) => (
          <Link
            href={menu.href}
            key={menu.href}
            className={`text-xs md:text-sm uppercase text-center font-mono ${isActive(menu.href) ? "border-b font-black text-slate-100" : "hover:border-b"}`}
          >
            {menu.label}
          </Link>
        ))}
      </div>
      <div className="row-start-1 col-start-2 md:row-start-1 md:col-start-3">
        <Avatar />
      </div>
    </div>
  );
}
