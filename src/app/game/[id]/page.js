"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, HelpCircle, ShieldCheck, Check, CreditCard, Wallet as WalletIcon, QrCode, Lock } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import UidHelpModal from "@/components/UidHelpModal";
import { games } from "@/data/games";
import { useAuth } from "@/context/AuthContext";

export default function GamePage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { isLoggedIn, user } = useAuth();
  
  const game = games.find((g) => g.id === id);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 justify-between">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5">
          <div className="w-16 h-16 bg-brand-red-light rounded-full flex items-center justify-center text-brand-red shadow-sm shadow-brand-red-light/50">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-[280px]">
            <h3 className="font-extrabold text-slate-800 text-sm">จำเป็นต้องเข้าสู่ระบบ</h3>
            <p className="text-[11px] text-slate-550 leading-relaxed font-bold">
              กรุณาเข้าสู่ระบบบัญชีผู้ใช้ หรือสมัครสมาชิกใหม่ ก่อนทำรายการเติมเกมออนไลน์เพื่อความปลอดภัยของตัวละครคุณ
            </p>
          </div>
          
          <div className="w-full max-w-[240px] space-y-2 pt-2">
            <Link
              href="/login"
              className="block w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl shadow-xs active:scale-95 transition-all text-center"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="block w-full bg-white hover:bg-slate-50 text-slate-650 border border-slate-200 text-xs font-bold py-3 rounded-xl active:scale-95 transition-all text-center"
            >
              สมัครสมาชิกใหม่
            </Link>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Form State
  const [uid, setUid] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("PromptPay");
  
  // Modals & UI feedback
  const [showUidHelp, setShowUidHelp] = useState(false);
  const [errors, setErrors] = useState({});

  if (!game) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 justify-between">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <p className="text-slate-500 text-sm font-medium">ไม่พบข้อมูลเกมที่คุณต้องการ</p>
          <Link href="/" className="bg-brand-red text-white px-4 py-2 rounded-xl text-xs font-bold">
            กลับหน้าหลัก
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Handle Order submit
  const handleProceedToPay = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!uid.trim()) {
      newErrors.uid = `กรุณากรอก ${game.idLabel}`;
    }
    
    if (game.hasZone && !zoneId) {
      newErrors.zoneId = "กรุณาเลือกเซิร์ฟเวอร์ (Zone)";
    }

    if (!selectedPackage) {
      newErrors.package = "กรุณาเลือกแพ็กเกจที่ต้องการเติม";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-scroll to top error
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    // Set error to empty
    setErrors({});

    // If payment is Wallet, check balance
    if (selectedPayment === "Wallet") {
      if (!isLoggedIn) {
        alert("กรุณาเข้าสู่ระบบก่อนชำระเงินด้วยกระเป๋าเงิน");
        router.push("/login");
        return;
      }
      if (user.balance < selectedPackage.price) {
        alert("ยอดเงินในกระเป๋าไม่เพียงพอ กรุณาเติมเงิน หรือเลือกช่องทางอื่น");
        return;
      }
    }

    // Build URL query parameters to pass details to payment page
    const queryParams = new URLSearchParams({
      gameId: game.id,
      packageId: selectedPackage.id,
      uid: uid,
      zoneId: zoneId || "",
      paymentMethod: selectedPayment,
    });

    router.push(`/payment?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-28">
      {/* Header back bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold">กลับ</span>
        </Link>
        <h2 className="font-extrabold text-sm text-slate-850 absolute left-1/2 -translate-x-1/2">
          {game.name}
        </h2>
        <div className="w-5"></div> {/* spacer */}
      </div>

      <main className="px-4 py-4 space-y-5">
        
        {/* Game Banner Header */}
        <div className={`w-full bg-gradient-to-br ${game.color} rounded-2xl p-5 text-white relative overflow-hidden shadow-sm`}>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="relative z-10 space-y-1">
            <span className="bg-white/20 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              {game.category}
            </span>
            <h1 className="text-lg font-extrabold tracking-wide">{game.name}</h1>
            <p className="text-[10px] text-white/90 font-medium">{game.tagline}</p>
          </div>
        </div>

        {/* Step 1: Input Game ID */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <h3 className="font-extrabold text-xs text-slate-800">ระบุข้อมูลผู้ใช้</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowUidHelp(true)}
              className="text-[10px] text-brand-red font-bold flex items-center gap-1 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>วิธีดูไอดี?</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* UID Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5">{game.idLabel} <span className="text-brand-red">*</span></label>
              <input
                type="text"
                placeholder={game.idPlaceholder}
                value={uid}
                onChange={(e) => {
                  setUid(e.target.value);
                  if (errors.uid) setErrors({ ...errors, uid: "" });
                }}
                className={`w-full bg-slate-50 border ${
                  errors.uid ? "border-brand-red focus:ring-brand-red" : "border-slate-200 focus:border-brand-red focus:ring-brand-red"
                } rounded-xl py-2.5 px-3.5 text-xs focus:outline-hidden focus:ring-1 transition-all`}
              />
              {errors.uid && <p className="text-[10px] text-brand-red font-bold mt-1">{errors.uid}</p>}
            </div>

            {/* Zone ID Field (if applicable) */}
            {game.hasZone && (
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5">เซิร์ฟเวอร์ (Server) <span className="text-brand-red">*</span></label>
                <select
                  value={zoneId}
                  onChange={(e) => {
                    setZoneId(e.target.value);
                    if (errors.zoneId) setErrors({ ...errors, zoneId: "" });
                  }}
                  className={`w-full bg-slate-50 border ${
                    errors.zoneId ? "border-brand-red focus:ring-brand-red" : "border-slate-200 focus:border-brand-red"
                  } rounded-xl py-2.5 px-3.5 text-xs focus:outline-hidden focus:ring-1 transition-all`}
                >
                  <option value="">-- เลือกเซิร์ฟเวอร์ --</option>
                  {game.zoneOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.zoneId && <p className="text-[10px] text-brand-red font-bold mt-1">{errors.zoneId}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Select Package */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] font-bold">2</span>
            <h3 className="font-extrabold text-xs text-slate-800">เลือกแพ็กเกจที่ต้องการ</h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {game.packages.map((pkg) => {
              const isSelected = selectedPackage?.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    if (errors.package) setErrors({ ...errors, package: "" });
                  }}
                  className={`text-left rounded-2xl p-3.5 border relative overflow-hidden transition-all duration-200 flex flex-col justify-between h-24 ${
                    isSelected
                      ? "border-brand-red bg-brand-red-light/35 scale-[1.02] shadow-xs active-border-pulse"
                      : "border-slate-150 bg-white hover:border-slate-350 hover:bg-slate-50"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 bg-brand-red text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg tracking-wide">
                      คุ้มสุด!
                    </div>
                  )}

                  <div>
                    <h4 className="font-extrabold text-[12px] text-slate-800 leading-tight">
                      {pkg.name}
                    </h4>
                    {pkg.bonus && (
                      <span className="inline-block text-[8px] font-bold text-brand-red bg-brand-red-light px-1.5 py-0.5 rounded-full mt-1.5">
                        โบนัส {pkg.bonus}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-xs font-black text-slate-900">฿{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-[9px] text-slate-400 line-through font-medium">฿{pkg.originalPrice}</span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="absolute bottom-2 right-2 bg-brand-red text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[4]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {errors.package && <p className="text-[10px] text-brand-red font-bold mt-1 text-center">{errors.package}</p>}
        </div>

        {/* Step 3: Select Payment Method */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] font-bold">3</span>
            <h3 className="font-extrabold text-xs text-slate-800">เลือกช่องทางการชำระเงิน</h3>
          </div>

          <div className="space-y-2">
            {/* PromptPay QR */}
            <button
              type="button"
              onClick={() => setSelectedPayment("PromptPay")}
              className={`w-full text-left rounded-xl p-3 border flex items-center justify-between transition-colors ${
                selectedPayment === "PromptPay"
                  ? "border-brand-red bg-brand-red-light/30 font-bold"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-800">PromptPay QR (สแกนจ่ายทันที)</h4>
                  <p className="text-[9px] text-slate-400 font-medium">สแกนผ่านแอปธนาคารทุกประเภท ไม่มีค่าธรรมเนียม</p>
                </div>
              </div>
              <span className="text-[9px] bg-sky-600 text-white font-bold px-1.5 py-0.5 rounded-md">
                แนะนำ
              </span>
            </button>

            {/* Wallet */}
            {isLoggedIn && user && (
              <button
                type="button"
                onClick={() => setSelectedPayment("Wallet")}
                className={`w-full text-left rounded-xl p-3 border flex items-center justify-between transition-colors ${
                  selectedPayment === "Wallet"
                    ? "border-brand-red bg-brand-red-light/30 font-bold"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-brand-red">
                    <WalletIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-800">ชำระด้วยกระเป๋าเงิน (InBlack Wallet)</h4>
                    <p className="text-[9px] text-slate-400 font-medium">ยอดเงินคงเหลือ: ฿{user.balance.toLocaleString()} (ตัดจ่ายทันที)</p>
                  </div>
                </div>
                {selectedPackage && user.balance < selectedPackage.price ? (
                  <span className="text-[8px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-md">
                    ยอดไม่พอ
                  </span>
                ) : (
                  <span className="text-[8px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-md">
                    พร้อมใช้งาน
                  </span>
                )}
              </button>
            )}

            {/* TrueMoney Wallet */}
            <button
              type="button"
              onClick={() => setSelectedPayment("TrueMoney")}
              className={`w-full text-left rounded-xl p-3 border flex items-center justify-between transition-colors ${
                selectedPayment === "TrueMoney"
                  ? "border-brand-red bg-brand-red-light/30 font-bold"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                  TM
                </div>
                <div>
                  <h4 className="text-xs text-slate-800">TrueMoney Wallet</h4>
                  <p className="text-[9px] text-slate-400 font-medium">ชำระผ่านเบอร์มือถือเชื่อมต่อวอลเล็ท</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Info text */}
        <div className="flex items-center justify-center gap-2 py-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] text-slate-400 font-bold">ข้อมูลการเติมเงินของคุณจะได้รับการเข้ารหัส ปลอดภัย 100%</span>
        </div>

      </main>

      {/* Sticky Bottom Actions checkout bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
        <div>
          <span className="text-[9px] text-slate-450 font-bold block uppercase tracking-wide">ยอดรวมทั้งหมด</span>
          {selectedPackage ? (
            <span className="text-base font-black text-brand-red">฿{selectedPackage.price.toLocaleString()}</span>
          ) : (
            <span className="text-xs text-slate-400 font-semibold">เลือกแพ็กเกจด้านบน</span>
          )}
        </div>

        <button
          onClick={handleProceedToPay}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all active:scale-95 ${
            selectedPackage 
              ? "bg-brand-red hover:bg-brand-red-dark shadow-brand-red/30 cursor-pointer" 
              : "bg-slate-350 shadow-none cursor-not-allowed"
          }`}
          disabled={!selectedPackage}
        >
          ดำเนินการชำระเงิน
        </button>
      </div>

      {/* Unique Helper Modal */}
      <UidHelpModal
        isOpen={showUidHelp}
        onClose={() => setShowUidHelp(false)}
        gameName={game.name}
        uidDescription={game.uidDescription}
        idLabel={game.idLabel}
      />
    </div>
  );
}
