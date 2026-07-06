"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Wallet, LogOut, ChevronRight, HelpCircle, ShieldAlert, KeyRound, Sparkles, PlusCircle, Check, Edit3, Camera, Save } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, addBalance, updateProfile } = useAuth();
  
  // Profile Editor States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatar, setEditAvatar] = useState("🧙‍♂️");

  // Sync state with Context user when loaded
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditAvatar(user.avatar || "🧙‍♂️");
    }
  }, [user]);

  // Wallet Top-up Simulator states
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const avatarPresets = ["🧙‍♂️", "🤖", "🥷", "🧑‍🎤", "🧑‍🚀", "🦁", "🐉", "👑", "🦊", "👾", "🐼", "🦄"];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    updateProfile({
      name: editName,
      email: editEmail,
      avatar: editAvatar,
    });
    setIsEditing(false);
  };

  const handleWalletTopupSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(topupAmount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("กรุณากรอกจำนวนเงินชำระที่ถูกต้อง");
      return;
    }

    setLoading(true);

    // Simulate Payment network processing
    setTimeout(() => {
      addBalance(amountNum);
      setLoading(false);
      setShowSuccess(true);
      
      // Close success panel after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setShowTopupModal(false);
        setTopupAmount("");
      }, 1800);
    }, 1500);
  };

  const selectPresetAmount = (val) => {
    setTopupAmount(val.toString());
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 justify-between pb-20">
      <Header />

      <main className="flex-1 px-4 py-4 space-y-4">
        
        {!isLoggedIn ? (
          /* Profile placeholder if logged out */
          <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 max-w-sm mx-auto w-full space-y-5 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-800 text-sm">เข้าถึงบัญชี InBlack ของคุณ</h3>
              <p className="text-[11px] text-slate-455 font-medium leading-relaxed">
                เข้าสู่ระบบเพื่อเช็คยอดคงเหลือ เติมเงินเข้ากระเป๋าวอลเล็ท และสิทธิพิเศษในการจัดการข้อมูลสมาชิกส่วนตัว
              </p>
            </div>
            
            <div className="w-full space-y-2 pt-2">
              <Link
                href="/login"
                className="block w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl shadow-sm shadow-brand-red/20 transition-all active:scale-98 text-center"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="block w-full bg-white hover:bg-slate-50 text-slate-655 border border-slate-200 text-xs font-bold py-3 rounded-xl transition-all active:scale-98 text-center"
              >
                สมัครสมาชิกใหม่
              </Link>
            </div>
          </div>
        ) : (
          /* Main Logged In Profile UI */
          <div className="space-y-4 animate-fade-in">
            
            {/* User Info Header Block */}
            {!isEditing ? (
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-3xl shadow-xs">
                    {user.avatar || "🧙‍♂️"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-slate-800 truncate">{user.name}</h3>
                    <p className="text-[10px] text-slate-450 font-bold truncate mt-0.5">{user.email}</p>
                    <span className="inline-block bg-slate-100 text-slate-500 font-mono text-[9px] font-bold px-2 py-0.5 rounded mt-1.5">
                      ID: {user.uid}
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>แก้ไขข้อมูล</span>
                </button>
              </div>
            ) : (
              /* User Info Editor Block */
              <form onSubmit={handleProfileSave} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-brand-red" />
                    แก้ไขข้อมูลโปรไฟล์ผู้ใช้งาน
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user.name);
                      setEditEmail(user.email);
                      setEditAvatar(user.avatar || "🧙‍♂️");
                      setIsEditing(false);
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                </div>

                {/* Avatar Presets Selection Grid */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500">เลือกรูปโปรไฟล์รูปเกมเมอร์</label>
                  <div className="grid grid-cols-6 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {avatarPresets.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditAvatar(emoji)}
                        className={`text-2xl py-1 rounded-lg border transition-all active:scale-90 cursor-pointer ${
                          editAvatar === emoji
                            ? "bg-white border-brand-red shadow-xs scale-105"
                            : "border-transparent hover:bg-slate-200"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">ชื่อผู้ใช้งาน</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">อีเมลผู้ติดต่อ</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user.name);
                      setEditEmail(user.email);
                      setEditAvatar(user.avatar || "🧙‍♂️");
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-colors active:scale-95 cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs shadow-brand-red/20 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>บันทึกการแก้ไข</span>
                  </button>
                </div>
              </form>
            )}

            {/* Wallet Cash Balance Box */}
            <div className="bg-gradient-to-br from-brand-red via-brand-red to-brand-red-dark rounded-2xl p-5 text-white shadow-sm shadow-brand-red/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 opacity-90" />
                  <span className="text-[10px] font-bold tracking-wide text-white/90">กระเป๋าเงินวอลเล็ท (InBlack Wallet)</span>
                </div>
                <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  ระบบอัตโนมัติ
                </span>
              </div>

              <div>
                <p className="text-[10px] text-white/70">ยอดเงินคงเหลือในปัจจุบัน</p>
                <h2 className="text-2xl font-black tracking-wide mt-0.5">฿{user.balance.toLocaleString()}</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowTopupModal(true)}
                className="w-full bg-white text-brand-red hover:bg-slate-50 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>เติมเงินเข้าวอลเล็ท (สแกนจ่ายจำลอง)</span>
              </button>
            </div>

            {/* Account Settings List */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
              
              <Link href="/history" className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 text-slate-700">
                  <Wallet className="w-4.5 h-4.5 text-slate-400" />
                  <span className="text-xs font-bold">ประวัติการทำรายการเติมเงิน</span>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </Link>

              <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-left">
                <div className="flex items-center gap-3 text-slate-700">
                  <KeyRound className="w-4.5 h-4.5 text-slate-400" />
                  <span className="text-xs font-bold">ความปลอดภัยและรหัสผ่าน</span>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-left">
                <div className="flex items-center gap-3 text-slate-700">
                  <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
                  <span className="text-xs font-bold">ศูนย์ช่วยเหลือลูกค้า / ติดต่อสอบถาม</span>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors text-left">
                <div className="flex items-center gap-3 text-slate-700">
                  <ShieldAlert className="w-4.5 h-4.5 text-slate-400" />
                  <span className="text-xs font-bold">ข้อกำหนดนโยบายการให้บริการ</span>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
              </button>

            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบบัญชีผู้ใช้</span>
            </button>

          </div>
        )}

        {/* Top-up Simulator Modal Drawer (Overlay bottom sheet style) */}
        {showTopupModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0" onClick={() => !loading && setShowTopupModal(false)}></div>
            
            <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl z-10 animate-slide-up p-5 space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-brand-red" />
                  เติมเงินเข้ากระเป๋า (จำลองการชำระเงิน)
                </h3>
                {!loading && (
                  <button 
                    onClick={() => setShowTopupModal(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-650"
                  >
                    ปิด
                  </button>
                )}
              </div>

              {showSuccess ? (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-800">เติมเงินเข้ากระเป๋าสำเร็จ!</h4>
                  <p className="text-[10px] text-slate-400 font-bold">ระบบได้รับยอดเงินจำลองแล้วและปรับสมดุลทันที</p>
                </div>
              ) : (
                <form onSubmit={handleWalletTopupSubmit} className="space-y-4">
                  {/* Presets Grid */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500">เลือกจำนวนเงินด่วน</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 300, 500].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => selectPresetAmount(val)}
                          className={`py-2 border text-center font-bold text-xs rounded-xl transition-all ${
                            topupAmount === val.toString()
                              ? "bg-brand-red text-white border-brand-red shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          ฿{val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input amount */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500">หรือระบุจำนวนเงินที่ต้องการ (บาท)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={10000}
                      placeholder="ระบุยอดเงิน (เช่น 150)"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-850 focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>

                  {/* Submit topup */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm shadow-brand-red/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>กำลังยืนยันรายการ (จำลอง QR)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>ชำระผ่าน PromptPay (จำลองจ่าย)</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
}
