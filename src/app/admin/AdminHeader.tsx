"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    if (pathname === "/admin/packages") return "Kelola Pilihan Paket";
    if (pathname === "/admin/features") return "Kelola Alasan Memilih Kami";
    return "Admin Dashboard";
  };

  return (
    <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Cari menu..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm hover:text-green-600 transition-all group">
          <Bell className="w-5 h-5 group-hover:animate-wiggle" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm border border-green-200 shadow-sm">
            S
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">Sukristiyo</p>
            <p className="text-xs text-green-600 font-medium leading-tight">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
