"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, ShieldCheck, Gamepad2 } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        login(email, password);
        router.push("/");
      } catch (err) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 justify-between pb-20">
      <Header />

      <main className="flex-1 px-4 py-8 flex flex-col justify-center max-w-sm mx-auto w-full space-y-6">
        
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-brand-red/35">
            I
          </div>
          <h2 className="font-black text-xl text-slate-800 tracking-tight">เข้าสู่ระบบ InBlack</h2>
          <p className="text-xs text-slate-450 font-bold">เพื่อความสะดวกรวดเร็วในการสะสมแต้มและกระเป๋าเงินวอลเล็ท</p>
        </div>

        {/* Login Card Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-650 text-xs font-bold p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500">อีเมล หรือ เบอร์โทรศัพท์</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="email@example.com หรือ 089xxxxxxx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-bold text-slate-500">รหัสผ่าน</label>
                <Link href="#" className="text-[10px] text-brand-red font-bold hover:underline">
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="ระบุรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl shadow-sm shadow-brand-red/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังลงชื่อเข้าใช้...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase">
              <span className="bg-white px-3 text-slate-400">หรือใช้บัญชีโซเชียล</span>
            </div>
          </div>

          {/* Social actions grid */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                login("somsak.dev@gmail.com", "password");
                router.push("/");
              }}
              className="border border-slate-200 hover:bg-slate-50 py-2 rounded-xl text-[10px] font-bold text-slate-650 transition-colors flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="text-red-500 font-extrabold text-xs">G</span>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                login("somsak.dev@gmail.com", "password");
                router.push("/");
              }}
              className="border border-slate-200 hover:bg-slate-50 py-2 rounded-xl text-[10px] font-bold text-slate-650 transition-colors flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="text-emerald-500 font-extrabold text-xs">L</span>
              <span>Line</span>
            </button>
            <button
              type="button"
              onClick={() => {
                login("somsak.dev@gmail.com", "password");
                router.push("/");
              }}
              className="border border-slate-200 hover:bg-slate-50 py-2 rounded-xl text-[10px] font-bold text-slate-650 transition-colors flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="text-slate-800 font-extrabold text-xs"></span>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Redirect sign-up link */}
        <p className="text-xs text-slate-500 text-center font-medium">
          ยังไม่มีบัญชีใช่หรือไม่?{" "}
          <Link href="/register" className="text-brand-red font-bold hover:underline">
            สมัครสมาชิกที่นี่
          </Link>
        </p>

        {/* Secure marker */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ข้อมูลรหัสผ่านจะถูกจัดเก็บแบบแฮช ปลอดภัยระดับสากล</span>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
