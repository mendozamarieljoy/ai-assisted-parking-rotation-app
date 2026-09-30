import { adminMenuItems } from "@/lib/constants";
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div
      className="sticky top-0 flex-1 flex flex-col space-y-4 bg-slate-800 text-white p-4 max-h-screen"
      style={{ maxWidth: "260px", height: "100vh" }}
    >
      <p className="text-lg uppercase text-white font-bold font-mono text-center">
        Parking Rotation System
      </p>
      <div className="flex flex-col space-y-2 h-full flex-1">
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-2 transition-all hover:bg-slate-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
