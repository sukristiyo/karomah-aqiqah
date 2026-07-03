"use client";

import React from "react";
import Link from "next/link";

export default function Navbar({ settings = {} }: { settings?: Record<string, string> }) {
  return (
    <div className="sticky top-0 z-50">
      {/* Topbar */}
      <div className="bg-[#C9A84C] text-[#1B4332] text-xs md:text-sm font-bold text-center py-2 px-4 whitespace-nowrap overflow-hidden text-ellipsis">
        {settings.topbar_text || "🌙 Aqiqah Syar'i · Praktis · Lezat · Free Ongkir se-Pekanbaru · Juru Sembelih Bersertifikat JULEHA"}
      </div>

      {/* Main Nav */}
      <nav className="bg-[#1B4332] shadow-lg h-[72px] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 ml-2 md:ml-6">
          <div className="w-[72px] h-[72px] shrink-0 flex items-center justify-center p-1">
            <img src="/logo.png" alt="Karomah Aqiqah" className="w-full h-full object-contain" onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.getElementById('nav-fallback');
                if(fallback) fallback.style.display = 'flex';
              }} 
            />
          </div>
          <div id="nav-fallback" className="hidden items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#E86326] text-white flex items-center justify-center font-serif font-bold text-sm">KRM</div>
             <div className="flex flex-col">
               <strong className="text-[#E86326] tracking-widest leading-none mb-1">KAROMAH</strong>
               <span className="text-[#C9A84C] text-[10px] leading-none">Aqiqah & Qurban</span>
             </div>
          </div>
        </Link>
        
        <ul className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
          <li><Link href="#paket" className="hover:text-[#C9A84C] transition-colors">Paket</Link></li>
          <li><Link href="#tentang" className="hover:text-[#C9A84C] transition-colors">Tentang Kami</Link></li>
          <li><Link href="#galeri" className="hover:text-[#C9A84C] transition-colors">Galeri</Link></li>
          <li><Link href="#cara-pesan" className="hover:text-[#C9A84C] transition-colors">Cara Pesan</Link></li>
          <li><Link href="#testimoni" className="hover:text-[#C9A84C] transition-colors">Testimoni</Link></li>
        </ul>
        
        <button
          className="bg-[#C9A84C] hover:bg-[#F0D080] text-[#1B4332] px-5 py-2.5 rounded-lg font-bold text-sm transition-all transform hover:-translate-y-0.5"
          onClick={() => {
            const waNumber = settings.whatsapp_number || "628175777008";
            window.open(`https://wa.me/${waNumber}`, '_blank');
          }}
        >
          Hubungi Admin
        </button>
        </div>
      </nav>
    </div>
  );
}
