"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Sparkles, Gamepad2, ArrowRight, ShieldCheck, Flame, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { games } from "@/data/games";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [activeSlide, setActiveSlide] = useState(0);

  const banners = [
    {
      title: "ฉลองเปิดร้านใหม่ ลดพิเศษ!",
      desc: "เติมคูปอง RoV วันนี้รับคูปองโบนัสเพิ่มสูงสุด +180 คูปอง ทันที!",
      bgColor: "bg-gradient-to-r from-rose-600 via-rose-500 to-red-500",
      accent: "RoV Bonus",
    },
    {
      title: "ชำระเงินสะดวก ไร้กังวล",
      desc: "สแกนจ่าย QR PromptPay ฟรีค่าธรรมเนียม เติมเข้าทันทีภายใน 1 นาที",
      bgColor: "bg-gradient-to-r from-red-700 to-slate-900",
      accent: "PromptPay 0%",
    },
    {
      title: "เกนชินราคาพิเศษ ถูกกว่าเติมเอง",
      desc: "เติม Genshin Crystals ใช้เพียง UID เท่านั้น ปลอดภัย ไม่ต้องใช้รหัสผ่าน",
      bgColor: "bg-gradient-to-r from-slate-900 to-red-600",
      accent: "Genshin Crystals",
    },
  ];

  // Auto rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = ["ทั้งหมด", "MOBA", "Battle Royale", "Action RPG", "FPS", "Sandbox"];

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ทั้งหมด" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 flex flex-col px-4 py-4 space-y-5 pb-20">
        
        {/* User Quick Info Dashboard */}
        {isLoggedIn && user && (
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-red-light text-brand-red flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">ยินดีต้อนรับกลับมา</p>
                <h4 className="font-bold text-slate-800 text-sm leading-tight">{user.name}</h4>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium">ยอดเงินในกระเป๋า</p>
              <p className="font-extrabold text-brand-red text-base">฿{user.balance.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Banners Carousel */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-sm">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 p-5 flex flex-col justify-center text-white transition-opacity duration-500 ease-in-out ${
                index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              } ${banner.bgColor}`}
            >
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase text-white/90">
                {banner.accent}
              </div>
              <h2 className="text-base font-extrabold tracking-wide mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                {banner.title}
              </h2>
              <p className="text-[11px] text-white/90 leading-normal max-w-[280px]">
                {banner.desc}
              </p>
              
              <div className="mt-3 flex items-center text-[10px] font-bold text-yellow-300 gap-1 hover:underline cursor-pointer">
                <span>เติมเลยตอนนี้</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === activeSlide ? "bg-white w-4" : "bg-white/40"
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาเกมที่คุณต้องการเติม..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs shadow-xs focus:outline-hidden focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Trust Badge Grid */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-xs">
            <ShieldCheck className="w-5 h-5 text-brand-red mb-1" />
            <span className="text-[9px] font-bold text-slate-700">ปลอดภัย 100%</span>
            <span className="text-[8px] text-slate-400">ระบบคีย์ตรงผู้ให้บริการ</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-xs">
            <Flame className="w-5 h-5 text-orange-500 mb-1" />
            <span className="text-[9px] font-bold text-slate-700">เติมไวทันใจ</span>
            <span className="text-[8px] text-slate-400">ระบบอัตโนมัติ 1 นาที</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-[9px] font-bold text-slate-700">ไม่มีค่าธรรมเนียม</span>
            <span className="text-[8px] text-slate-400">สแกน QR ฟรีทุกธนาคาร</span>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-brand-red" />
            รายชื่อเกมทั้งหมด
          </h3>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors active:scale-95 ${
                  selectedCategory === cat
                    ? "bg-brand-red text-white shadow-xs"
                    : "bg-white text-slate-500 border border-slate-150 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md hover:border-brand-red/35 active:scale-98 transition-all flex flex-col h-full"
              >
                {/* Simulated game image cover using Tailwind color gradient */}
                <div className={`w-full h-24 bg-gradient-to-br ${game.color} flex flex-col items-center justify-center p-3 relative text-white text-center`}>
                  <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white/90">
                    {game.category}
                  </div>
                  <Gamepad2 className="w-8 h-8 opacity-75 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="font-extrabold text-xs tracking-wide leading-tight group-hover:underline">
                    {game.name}
                  </p>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                    {game.tagline}
                  </p>
                  
                  <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-brand-red">
                    <span>เติมเลยตอนนี้</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-2 shadow-xs">
            <p className="text-xs text-slate-400">ไม่พบเกมที่คุณต้องการค้นหา</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("ทั้งหมด"); }}
              className="text-xs text-brand-red font-bold underline"
            >
              ล้างตัวกรองค้นหา
            </button>
          </div>
        )}

        {/* Beginner Guide Banner */}
        <div className="bg-brand-red-light/30 border border-brand-red/10 rounded-2xl p-4 space-y-2.5">
          <h4 className="font-extrabold text-[13px] text-brand-red-dark flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            คู่มือสำหรับผู้เล่นใหม่: เติมเกมใน 3 ขั้นตอนง่ายๆ
          </h4>
          <ol className="text-[11px] text-slate-700 space-y-1.5 list-decimal pl-4 leading-relaxed font-medium">
            <li>เลือกเกมที่คุณต้องการเติมจากเมนูด้านบน</li>
            <li>กรอกไอดีเกม (มีหน้าต่างสาธิตช่วยหาไอดี) จากนั้นเลือกแพ็กเกจเพชร/คูปอง</li>
            <li>สแกนคิวอาร์โค้ดชำระเงิน ระบบจะส่งไอเทมเข้าตัวละครโดยอัตโนมัติ!</li>
          </ol>
        </div>

      </main>

      {/* Sticky Bottom Nav */}
      <BottomNav />
    </div>
  );
}
