"use client";

import { X, HelpCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function UidHelpModal({ isOpen, onClose, gameName, uidDescription, idLabel }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop mobile click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col animate-slide-up sm:animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-brand-red-light/20">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-red" />
            <h3 className="font-bold text-slate-800 text-base">วิธีดู {idLabel} ของ {gameName}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          
          <div className="bg-brand-red-light/10 border-l-4 border-brand-red p-4 rounded-r-xl">
            <p className="font-medium text-brand-red-dark text-xs mb-1">คำแนะนำทีละขั้นตอน</p>
            <p className="text-slate-700 text-[13px]">{uidDescription}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">ตัวอย่างปุ่มระบุตัวตนในเกม</h4>
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center text-center">
              {/* Graphic Mock of UID inside a profile card */}
              <div className="w-full max-w-[280px] bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-sm">
                  AV
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-xs text-slate-800">MyPlayerName</p>
                  <p className="text-[10px] text-slate-400">Level 42 | Platinum IV</p>
                  <div className="flex items-center gap-1.5 mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                    <span className="text-[9px] text-slate-500 font-mono">UID: 58291048</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText("58291048");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-slate-400 hover:text-brand-red active:scale-90 transition-transform"
                      title="คัดลอกรหัสตัวอย่าง"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                *รหัสตัวอย่างจำลอง สามารถคลิกปุ่มไอคอนเพื่อคัดลอกไปลองใช้ในช่องกรอกข้อมูลได้เลย
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm shadow-brand-red/20 text-xs"
            >
              รับทราบ นำไปกรอกข้อมูล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
