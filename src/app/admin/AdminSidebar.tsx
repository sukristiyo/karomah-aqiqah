"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Star, Globe, Settings, LogOut, ChevronRight, Image as ImageIcon, Tags, ChefHat, Info, MessageSquare } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard / Hero", href: "/admin", icon: Home },
    { name: "Pilihan Paket", href: "/admin/packages", icon: Package },
    { name: "Tipe Paket", href: "/admin/package-types", icon: Tags },
    { name: "Olahan Masakan", href: "/admin/dishes", icon: ChefHat },
    { name: "Tentang Kami", href: "/admin/about", icon: Info },
    { name: "Mengapa Pilih Kami", href: "/admin/features", icon: Star },
    { name: "Testimoni", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  ];

  return (
    <aside className="w-[280px] shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="h-[72px] flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B4332] to-[#25D366] flex items-center justify-center mr-3 shadow-sm text-white font-bold text-sm font-serif">
            K
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Karomah<span className="text-[#25D366]">Admin</span>
          </h2>
        </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5 custom-scrollbar">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">Menu Utama</div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm relative overflow-hidden ${
                isActive 
                  ? "bg-[#F0FDF4] text-[#15803D]" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#16A34A] rounded-r-full" />
              )}
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-[#16A34A]" : "text-gray-400 group-hover:text-gray-600"}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={isActive ? "font-semibold" : ""}>{link.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
            </Link>
          );
        })}

        <div className="mt-8 mb-3 px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Lainnya</div>
        <Link
          href="/"
          target="_blank"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Globe className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={2} />
          Lihat Website
        </Link>
        <Link
          href="#"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={2} />
          Pengaturan
        </Link>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={async () => {
            const { logoutAdmin } = await import("../actions/auth");
            await logoutAdmin();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all cursor-pointer group text-left"
        >
          <div className="w-10 h-10 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-sm shadow-inner relative overflow-hidden shrink-0">
            A
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">Administrator</p>
            <p className="text-[11px] text-gray-500 truncate">admin@karomah.com</p>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors shrink-0" />
        </button>
      </div>
    </aside>
  );
}
