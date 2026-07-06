"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Wallet, User, Bell, LogIn } from "lucide-react";

export default function Header() {
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1.5 active:scale-95 transition-transform">
        <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-brand-red/40">
          I
        </div>
        <span className="font-extrabold text-xl tracking-tight">
          <span className="text-brand-red">In</span>
          <span className="text-slate-800">Black</span>
        </span>
      </Link>

      {/* Action / User Stats */}
      <div className="flex items-center gap-3">
        {isLoggedIn && user ? (
          <>
            {/* Wallet Info */}
            <Link 
              href="/profile" 
              className="flex items-center gap-1 bg-brand-red-light text-brand-red-dark px-2.5 py-1 rounded-full text-xs font-bold border border-brand-red/10 active:scale-95 transition-transform"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>฿{user.balance.toLocaleString()}</span>
            </Link>

            {/* Profile Avatar Trigger */}
            <Link 
              href="/profile" 
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-650 border border-slate-200 hover:border-brand-red active:scale-95 transition-transform text-sm"
            >
              {user.avatar || <User className="w-4 h-4" />}
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1 bg-brand-red hover:bg-brand-red-dark text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm shadow-brand-red/30"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </Link>
        )}
      </div>
    </header>
  );
}
