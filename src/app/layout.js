import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InBlack | เติมเกมออนไลน์ สะดวก รวดเร็ว ปลอดภัย",
  description: "แพลตฟอร์มเติมเกมยอดนิยมของไทย โทนสีขาวแดง ใช้งานง่าย เหมาะสำหรับทุกคน",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-900 md:bg-gradient-to-br md:from-rose-950 md:via-slate-900 md:to-slate-950 flex items-center justify-center text-slate-800 p-0 md:py-6">
        <AuthProvider>
          {/* Main App Container simulating a Mobile Screen on Desktop */}
          <div className="w-full max-w-md min-h-screen md:min-h-[820px] md:max-h-[850px] md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] md:border-[10px] md:border-slate-800 bg-slate-50 flex flex-col relative overflow-x-hidden overflow-y-auto">
            
            {/* Mock Speaker/Camera bezel on top of phone layout for desktop */}
            <div className="hidden md:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-full z-50 items-center justify-center">
              <div className="w-10 h-1 bg-slate-700 rounded-full mr-2"></div>
              <div className="w-2 h-2 bg-slate-950 border border-slate-700 rounded-full"></div>
            </div>

            {/* Inner App Content */}
            <div className="flex-1 flex flex-col w-full md:pt-6">
              {children}
            </div>

          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
