"use client";

import { useState } from "react";
import Link from "next/link";
import { History, ArrowRight, Gamepad2, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";

export default function HistoryPage() {
  const { isLoggedIn, transactions } = useAuth();
  
  const [filter, setFilter] = useState("ทั้งหมด");
  const [expandedTxId, setExpandedTxId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "ทั้งหมด") return true;
    if (filter === "สำเร็จ") return tx.status === "Success";
    if (filter === "รอดำเนินการ") return tx.status === "Pending";
    if (filter === "ล้มเหลว") return tx.status === "Failed";
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedTxId(expandedTxId === id ? null : id);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 justify-between pb-20">
      <Header />

      <main className="flex-1 px-4 py-4 space-y-4">
        
        {/* Header Title */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <History className="w-5 h-5 text-brand-red" />
          <h2 className="font-extrabold text-sm text-slate-800">ประวัติการเติมเงินของคุณ</h2>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1 text-[11px] font-bold text-slate-500">
          {["ทั้งหมด", "สำเร็จ", "รอดำเนินการ"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-2 rounded-lg text-center transition-all ${
                filter === tab
                  ? "bg-white text-slate-800 shadow-xs"
                  : "hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {!isLoggedIn ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-3 shadow-xs">
            <p className="text-xs text-slate-500 font-medium">กรุณาเข้าสู่ระบบเพื่อตรวจสอบประวัติการเติมเงินย้อนหลัง</p>
            <Link
              href="/login"
              className="inline-block bg-brand-red text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-brand-red/20 active:scale-95 transition-transform"
            >
              เข้าสู่ระบบเลย
            </Link>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => {
              const isExpanded = expandedTxId === tx.id;
              
              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:border-slate-200 transition-all"
                >
                  {/* Summary Card Header */}
                  <div
                    onClick={() => toggleExpand(tx.id)}
                    className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-red-light text-brand-red flex items-center justify-center">
                        <Gamepad2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-850">{tx.gameName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{tx.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-brand-red">฿{tx.amount}</p>
                        <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                          tx.status === "Success"
                            ? "bg-emerald-100 text-emerald-700"
                            : tx.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}>
                          {tx.status === "Success" ? "สำเร็จ" : "รอดำเนินการ"}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Receipt Details Accordion */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-50 bg-slate-50/40 space-y-3 text-xs leading-normal">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">หมายเลขอ้างอิง (TXID)</span>
                          <span className="font-mono font-extrabold text-slate-800 flex items-center gap-1.5">
                            {tx.id}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(tx.id, tx.id);
                              }}
                              className="text-slate-400 hover:text-brand-red active:scale-90 transition-transform"
                            >
                              {copiedId === tx.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">วันและเวลา</span>
                          <span className="font-bold text-slate-700">{tx.date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">ชื่อแพ็กเกจ</span>
                          <span className="font-bold text-slate-700 text-[11px]">{tx.packageName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">ไอดีตัวละคร (UID)</span>
                          <span className="font-mono font-bold text-slate-700">
                            {tx.uid} {tx.zoneId && `(${tx.zoneId})`}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">ช่องทางการชำระ</span>
                          <span className="font-bold text-slate-700">
                            {tx.paymentMethod === "PromptPay" ? "QR PromptPay" : tx.paymentMethod === "Wallet" ? "InBlack Wallet" : "TrueMoney"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">สถานะสินค้า</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            เติมเข้าเรียบร้อย
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-450 font-bold">*หากยอดไม่เข้ากรุณาแคปหน้าจอนี้ติดต่อแอดมิน</span>
                        <Link
                          href={`/success?txId=${tx.id}`}
                          className="text-[10px] text-brand-red font-bold underline flex items-center gap-0.5 hover:text-brand-red-dark"
                        >
                          เปิดใบเสร็จฉบับเต็ม
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 text-sm">ไม่พบประวัติการทำรายการ</h4>
              <p className="text-[11px] text-slate-450 font-medium">คุณยังไม่ได้ทำรายการเติมเงินในระบบในช่องทางตัวกรองนี้</p>
            </div>
            <Link
              href="/"
              className="inline-block bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-brand-red/20 active:scale-95 transition-all"
            >
              เริ่มต้นเติมเงินครั้งแรก
            </Link>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
}
