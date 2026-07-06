"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Home, Receipt, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";

function SuccessClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { transactions } = useAuth();
  
  const txId = searchParams.get("txId");
  const transaction = transactions.find((t) => t.id === txId);

  if (!transaction) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 justify-between">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
          <h3 className="font-extrabold text-slate-800">ทำรายการชำระเงินสำเร็จ</h3>
          <p className="text-slate-500 text-xs font-medium">กำลังดำเนินการอัพเดทยอดจัดส่งภายในระบบ...</p>
          <Link href="/" className="bg-brand-red text-white px-4 py-2 rounded-xl text-xs font-bold">
            กลับหน้าหลัก
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="px-4 py-6 space-y-5 flex-1 flex flex-col justify-center">
        
        {/* Animated Checkmark Celebration Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-100/50 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-black text-slate-850 text-base tracking-wide mt-2">ชำระเงินสำเร็จ!</h2>
          <p className="text-[11px] text-slate-450 font-bold">ระบบได้รับเงินชำระเรียบร้อยและกำลังจัดส่งไอเทม</p>
        </div>

        {/* Receipt Paper Card */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs relative overflow-hidden">
          {/* Top red header stripe */}
          <div className="h-1.5 w-full bg-brand-red"></div>

          {/* Receipt Info Body */}
          <div className="p-5 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-slate-400" />
                ใบเสร็จคำสั่งซื้อ
              </span>
              <span className="font-mono text-slate-500 font-extrabold">{transaction.id}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">วันและเวลาที่ทำรายการ</span>
                <span className="text-slate-850 font-extrabold">{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">เกม</span>
                <span className="text-slate-850 font-extrabold">{transaction.gameName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">ไอดีเกม (UID)</span>
                <span className="font-mono text-slate-850 font-extrabold">{transaction.uid} {transaction.zoneId && `(${transaction.zoneId})`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">แพ็กเกจสินค้า</span>
                <span className="text-brand-red font-extrabold">{transaction.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">ช่องทางการจ่ายเงิน</span>
                <span className="text-slate-700 font-bold">{transaction.paymentMethod === "PromptPay" ? "QR PromptPay" : transaction.paymentMethod === "Wallet" ? "InBlack Wallet" : "TrueMoney"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">สถานะรายการ</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  เสร็จสิ้น (จัดส่งแล้ว)
                </span>
              </div>
            </div>

            {/* Dotted Divider line */}
            <div className="border-t border-dashed border-slate-200 my-4 pt-4 flex justify-between items-baseline">
              <span className="text-slate-700 font-extrabold">ยอดเงินชำระแล้ว</span>
              <span className="text-base font-black text-brand-red">฿{transaction.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery guidelines */}
        <div className="bg-emerald-50/50 border border-emerald-150 rounded-2xl p-4 space-y-1.5 text-[10px] text-slate-600">
          <p className="font-bold text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            ข้อมูลจัดส่งสินค้า:
          </p>
          <ul className="list-disc pl-4 space-y-0.5 leading-relaxed font-medium">
            <li>ไอเทมคูปอง/เพชรจะถูกเติมส่งตรงเข้าตัวละครของคุณโดยตรง (ใช้ระบบ API)</li>
            <li>โดยส่วนใหญ่จะเข้าทันที หรือใช้เวลา 1-3 นาทีขึ้นอยู่กับความหนาแน่นของผู้ใช้งาน</li>
            <li>โปรดทำการเข้าตัวเกมใหม่อีกครั้ง หรือเช็คกล่องจดหมายในเกมหากยอดเงินยังไม่ปรับขึ้น</li>
          </ul>
        </div>

        {/* Action buttons stack */}
        <div className="space-y-2 pt-2">
          <Link
            href="/history"
            className="w-full bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-brand-red/20 active:scale-98"
          >
            <Receipt className="w-4 h-4" />
            <span>ดูประวัติการเติมเงิน</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin"></div>
        <p className="text-xs font-bold">กำลังประมวลผลใบสั่งซื้อ...</p>
      </div>
    }>
      <SuccessClientPage />
    </Suspense>
  );
}
