"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, RefreshCw, Smartphone, Wallet as WalletIcon, CheckCircle, Info } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { games } from "@/data/games";
import { useAuth } from "@/context/AuthContext";

function PaymentClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user, addTransaction } = useAuth();

  const gameId = searchParams.get("gameId");
  const packageId = searchParams.get("packageId");
  const uid = searchParams.get("uid");
  const zoneId = searchParams.get("zoneId");
  const paymentMethod = searchParams.get("paymentMethod") || "PromptPay";

  const game = games.find((g) => g.id === gameId);
  const pkg = game?.packages.find((p) => p.id === packageId);

  // Countdown timer (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  
  // Simulation states
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!game || !pkg) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 justify-between">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p className="text-slate-500 text-sm font-medium">ไม่พบรายละเอียดการชำระเงินที่ต้องการ</p>
          <Link href="/" className="bg-brand-red text-white px-4 py-2 rounded-xl text-xs font-bold">
            กลับหน้าหลัก
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Simulate verification
  const handleVerifyPayment = () => {
    if (isExpired) {
      alert("ไม่สามารถชำระเงินได้เนื่องจากหมดเวลาทำรายการ กรุณากลับไปเริ่มใหม่");
      return;
    }

    setLoading(true);
    setLoadingText("กำลังตรวจสอบยอดเงินชำระในเครือข่าย...");

    // Stage 1 loader
    setTimeout(() => {
      setLoadingText("จับคู่ยอดชำระเงินกับหมายเลขอ้างอิง...");
      
      // Stage 2 loader
      setTimeout(() => {
        setLoadingText("รับเงินชำระสำเร็จ! กำลังจัดส่งสินค้า...");
        
        // Stage 3 loader & save
        setTimeout(() => {
          const tx = addTransaction({
            gameName: game.name,
            gameId: game.id,
            uid: uid,
            zoneId: zoneId || "",
            packageName: pkg.name,
            amount: pkg.price,
            paymentMethod: paymentMethod,
          });
          
          setLoading(false);
          // Redirect to success screen with transaction ID
          router.push(`/success?txId=${tx.id}`);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  // TrueMoney OTP submit
  const handleTrueMoneySubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setShowOtpScreen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex flex-col items-center justify-center text-white p-6">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-red rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="font-extrabold text-sm text-center tracking-wide">{loadingText}</p>
          <p className="text-[10px] text-white/55 mt-2">กรุณาอย่าปิดหรือรีเฟรชหน้าจอนี้</p>
        </div>
      )}

      {/* Header bar */}
      <div className="sticky top-0 z-45 bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold">ย้อนกลับ</span>
        </button>
        <h2 className="font-extrabold text-sm text-slate-800 absolute left-1/2 -translate-x-1/2">
          ชำระเงิน
        </h2>
        <div className="w-5"></div>
      </div>

      <main className="px-4 py-4 space-y-4">
        
        {/* Timer Box */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isExpired ? "text-red-500" : "text-brand-red animate-pulse"}`} />
            <span className="text-xs font-bold text-slate-600">กรุณาชำระเงินภายใน</span>
          </div>
          <span className={`font-mono text-sm font-extrabold px-3 py-1 rounded-lg ${
            isExpired ? "bg-red-100 text-red-600" : "bg-brand-red-light text-brand-red-dark"
          }`}>
            {isExpired ? "หมดเวลา" : formatTime(timeLeft)}
          </span>
        </div>

        {/* Order Details Brief */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3.5">
          <h3 className="font-extrabold text-xs text-slate-855 border-b border-slate-50 pb-2">สรุปรายการสั่งซื้อ</h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">เกม</span>
              <span className="font-extrabold text-slate-800">{game.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">{game.idLabel}</span>
              <span className="font-mono font-extrabold text-slate-800">{uid} {zoneId && `(${zoneId})`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">แพ็กเกจ</span>
              <span className="font-extrabold text-brand-red">{pkg.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">ช่องทางชำระเงิน</span>
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                {paymentMethod === "PromptPay" ? "QR PromptPay" : paymentMethod === "Wallet" ? "InBlack Wallet" : "TrueMoney"}
              </span>
            </div>
            <div className="border-t border-slate-50 pt-2 flex justify-between items-baseline">
              <span className="text-slate-450 font-bold">ยอดเงินสุทธิ</span>
              <span className="text-base font-black text-brand-red">฿{pkg.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Conditional Payment Methods Render */}

        {/* 1. PromptPay QR Design */}
        {paymentMethod === "PromptPay" && (
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col items-center space-y-4">
            
            {/* PromptPay Banner Header */}
            <div className="w-full bg-[#102d5e] rounded-xl py-2 px-4 flex items-center justify-between text-white">
              <div className="flex flex-col">
                <span className="text-[14px] font-black tracking-wider leading-none">พร้อมเพย์</span>
                <span className="text-[7px] font-bold text-sky-200/90 tracking-wide">Prompt Pay</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] block font-bold text-white/70 leading-none">E-Wallet & Bank</span>
                <span className="text-[10px] font-black text-white leading-none">QR Code</span>
              </div>
            </div>

            {/* Simulated QR Code container */}
            <div className="relative border-4 border-slate-100 p-4 rounded-2xl bg-white shadow-xs flex flex-col items-center">
              
              {/* QR Code Grid simulated in SVG */}
              <svg className="w-48 h-48 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                {/* Simulated corners */}
                <rect x="0" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="5" y="5" width="15" height="15" />
                <rect x="75" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="80" y="5" width="15" height="15" />
                <rect x="0" y="75" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="5" y="80" width="15" height="15" />

                {/* Simulated dots pattern inside */}
                <rect x="35" y="5" width="6" height="6" />
                <rect x="45" y="15" width="6" height="12" />
                <rect x="55" y="8" width="10" height="6" />
                
                <rect x="10" y="35" width="12" height="6" />
                <rect x="25" y="45" width="8" height="8" />
                <rect x="40" y="35" width="18" height="6" />
                
                <rect x="70" y="35" width="6" height="12" />
                <rect x="85" y="40" width="10" height="6" />
                <rect x="75" y="55" width="18" height="8" />

                <rect x="35" y="75" width="6" height="12" />
                <rect x="48" y="82" width="12" height="6" />
                <rect x="65" y="70" width="8" height="18" />

                {/* Center Logo Placeholder */}
                <rect x="40" y="40" width="20" height="20" rx="4" fill="white" stroke="#102d5e" strokeWidth="2" />
                <text x="50" y="52" fill="#102d5e" fontSize="7" fontWeight="bold" textAnchor="middle">PP</text>
              </svg>

              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center flex-col p-4 text-center rounded-2xl opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[10px] font-bold text-slate-700">คลิกขยายเพื่อดูรหัสเต็ม</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-slate-800">ยอดเติมเงิน: <span className="text-brand-red text-sm font-extrabold">฿{pkg.price}</span></p>
              <p className="text-[10px] text-slate-400">บันทึกรูปภาพหน้าจอนี้ จากนั้นไปที่แอปธนาคารของคุณ เลือกเมนู "สแกนจ่าย" เพื่อชำระเงิน</p>
            </div>

            <div className="w-full pt-2">
              <button
                type="button"
                onClick={handleVerifyPayment}
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm shadow-brand-red/30 cursor-pointer active:scale-98"
              >
                ตรวจสอบยอดชำระเงิน (คลิกเพื่อทดสอบ)
              </button>
            </div>
          </div>
        )}

        {/* 2. Wallet Payment Design */}
        {paymentMethod === "Wallet" && isLoggedIn && user && (
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4">
            
            <div className="bg-brand-red-light/30 border border-brand-red/10 p-4 rounded-xl flex items-center gap-3">
              <WalletIcon className="w-8 h-8 text-brand-red" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">ยืนยันการจ่ายด้วย InBlack Wallet</h4>
                <p className="text-[10px] text-slate-450 font-medium">หักเงินทันที ไม่มีค่าธรรมเนียม สินค้าเข้าเกมไวที่สุด</p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl p-3.5 space-y-2 bg-slate-50 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>ยอดเงินปัจจุบันของคุณ</span>
                <span className="font-bold">฿{user.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-550">
                <span>ยอดที่ต้องหักชำระ</span>
                <span className="font-bold text-brand-red">-฿{pkg.price.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-800 font-extrabold">
                <span>คงเหลือหลังจ่าย</span>
                <span className="text-emerald-600">฿{(user.balance - pkg.price).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleVerifyPayment}
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm shadow-brand-red/30 cursor-pointer active:scale-98"
              >
                ยืนยันการหักเงินในกระเป๋า
              </button>
            </div>
          </div>
        )}

        {/* 3. TrueMoney Wallet Form Design */}
        {paymentMethod === "TrueMoney" && (
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4">
            
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                TM
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">ชำระผ่าน TrueMoney Wallet</h4>
                <p className="text-[9px] text-slate-400">กรอกเบอร์มือถือที่เชื่อมต่อเพื่อรับ OTP</p>
              </div>
            </div>

            {!showOtpScreen ? (
              <form onSubmit={handleTrueMoneySubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">เบอร์โทรศัพท์ TrueMoney</label>
                  <input
                    type="tel"
                    required
                    placeholder="เช่น 0891234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-brand-red/30 cursor-pointer"
                >
                  ขอรหัส OTP ชำระเงิน
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex gap-2">
                  <Info className="w-4 h-4 text-orange-600 shrink-0" />
                  <p className="text-[10px] text-orange-800 leading-normal">
                    รหัส OTP จำลองการทดสอบ ถูกส่งไปยังเบอร์ {phoneNumber} แล้ว กรุณากรอกรหัส <span className="font-bold">123456</span> เพื่ออนุมัติชำระเงิน
                  </p>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">กรอกรหัส OTP (6 หลัก)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="กรอก 123456 เพื่อทดสอบ"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-center tracking-widest font-bold focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (otp === "123456") {
                        handleVerifyPayment();
                      } else {
                        alert("รหัส OTP ไม่ถูกต้อง กรุณากรอกรหัส 123456 เพื่อชำระเงินจำลอง");
                      }
                    }}
                    className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm shadow-brand-red/30"
                  >
                    ยืนยันรหัส OTP
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security / Quality Check banner */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-slate-500 text-[10px] space-y-1">
          <p className="font-extrabold text-slate-700">ข้อควรทราบสำหรับการเติมเงิน:</p>
          <ul className="list-disc pl-4 space-y-0.5 leading-relaxed font-medium">
            <li>โปรดตรวจสอบความถูกต้องของ UID และตัวละครทุกครั้งก่อนดำเนินการชำระเงิน</li>
            <li>ระบบชำระเงินเข้ารหัส SSL ปลอดภัยสูงสุด ป้องกันการดักจับข้อมูลบัตรและธุรกรรม</li>
            <li>หากมีข้อสงสัยหรือยอดเงินไม่เข้าตามเวลา ติดต่อฝ่ายสนับสนุนทีมงานได้ทางไลน์บริการตลอด 24 ชั่วโมง</li>
          </ul>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-red" />
        <p className="text-xs font-bold">กำลังดาวน์โหลดข้อมูลชำระเงิน...</p>
      </div>
    }>
      <PaymentClientPage />
    </Suspense>
  );
}
