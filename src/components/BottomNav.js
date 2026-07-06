"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "หน้าหลัก",
      icon: Home,
      path: "/",
    },
    {
      label: "ประวัติการเติม",
      icon: History,
      path: "/history",
    },
    {
      label: "บัญชีผู้ใช้",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-around py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
              isActive
                ? "text-brand-red font-medium"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className={`p-1 rounded-lg transition-colors ${isActive ? "bg-brand-red-light" : ""}`}>
              <Icon className="w-5.5 h-5.5 transition-transform duration-200" />
            </div>
            <span className="text-[10px] mt-1 tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
