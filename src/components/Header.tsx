"use client";
import React, { useMemo, useState } from "react";
import AvatarIcon from "@/assets/SVGComponent/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnClickOutside } from "@/hooks/hooks";
import {
  accountMenuItems,
  userMenusItems,
  notLoggedInMenuItems,
} from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const isAdmin = false;

  const menuList = useMemo(() => {
    const defaultMenu = userMenusItems;
    if (!isLoggedIn) {
      return [...defaultMenu, ...notLoggedInMenuItems];
    }
    return defaultMenu;
  }, [isLoggedIn]);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="sticky top-0 w-full p-4 flex flex-col md:flex-row justify-between items-center gap-x-4 bg-slate-800 text-white shadow z-50">
      {!isAdmin && (
        <p className="text-lg uppercase text-white font-bold font-mono">
          Parking Rotation System
        </p>
      )}
      <div className="flex items-center gap-x-4 mt-4 md:mt-0 ml-auto">
        {menuList.map((menu) => (
          <Link
            href={menu.href}
            key={menu.href}
            className={`text-xs md:text-sm uppercase text-center font-mono ${isActive(menu.href) ? "border-b font-black text-slate-100" : "hover:border-b"}`}
          >
            {menu.label}
          </Link>
        ))}
        {isLoggedIn && (
          <div className="relative" ref={dropdownRef}>
            <button
              className="rounded-full bg-white p-1 hover:bg-slate-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <AvatarIcon size={26} />
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 py-2 rounded shadow-lg ${isDropdownOpen ? "block" : "hidden"}`}
            >
              {accountMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
