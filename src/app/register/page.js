"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, User, Mail, Lock, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!acceptTerms) {
      setError("กรุณากดยอมรับข้อกำหนดและเงื่อนไขการใช้บริการ");
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        register(email, password, name);
        router.push("/");
      } catch (err) {
        setError("ไม่สามารถลงทะเบียนได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 justify-between pb-20">
      <Header />

      <main className="flex-1 px-4 py-8 flex flex-col justify-center max-w-sm mx-auto w-full space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-brand-red/35">
            R
          </div>
          <h2 className="font-black text-xl text-slate-800 tracking-tight">สมัครสมาชิก InBlack</h2>
          <p className="text-xs text-slate-455 font-bold">ร่วมเป็นครอบครัวเดียวกับเราเพื่อรับสิทธิประโยชน์สูงสุด</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-650 text-xs font-bold p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500">ชื่อผู้ใช้งาน (หรือชื่อเล่น)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="เช่น สมศักดิ์ นามสมมุติ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500">อีเมล หรือ เบอร์มือถือ</label>
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
              <label className="block text-[11px] font-bold text-slate-500">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="ตั้งรหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500">ยืนยันรหัสผ่านอีกครั้ง</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="กรอกรหัสผ่านตรงกับช่องด้านบน"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-brand-red cursor-pointer rounded border-slate-350"
              />
              <span className="text-[10px] text-slate-500 leading-normal font-medium">
                ฉันยอมรับ <Link href="#" className="text-brand-red font-bold hover:underline">ข้อตกลงการใช้บริการ</Link> และ <Link href="#" className="text-brand-red font-bold hover:underline">นโยบายความเป็นส่วนตัว</Link> ของแพลตฟอร์ม InBlack
              </span>
            </label>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl shadow-sm shadow-brand-red/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังลงทะเบียนสมาชิก...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>สมัครสมาชิกใหม่</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Redirect login link */}
        <p className="text-xs text-slate-500 text-center font-medium">
          มีบัญชีสมาชิกอยู่แล้วใช่หรือไม่?{" "}
          <Link href="/login" className="text-brand-red font-bold hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>

        {/* Protection disclaimer */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ข้อมูลส่วนบุคคลของคุณได้รับการคุ้มครองความปลอดภัยตาม พ.ร.บ. PDPA</span>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
