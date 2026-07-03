import React from "react";
import Link from "next/link";

export default function Footer({ settings = {} }: { settings?: Record<string, string> }) {
  return (
    <footer className="bg-[#1B4332] text-white/80 pt-16 pb-8 px-6 lg:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
        <div className="lg:col-span-1">
          <div className="font-serif text-2xl text-[#C9A84C] mb-4">Karomah Aqiqah & Qurban</div>
          <p className="text-sm leading-relaxed mb-6">
            Layanan aqiqah profesional yang praktis, lezat, dan syar'i. Kambing dari peternakan
            sendiri, juru sembelih bersertifikat JULEHA, dan tim masak profesional.
          </p>
          <div className="flex gap-4">
            <Link href={settings.facebook || "https://facebook.com/karomahaqiqah"} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A84C] hover:text-[#1B4332] transition-colors" title="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </Link>
            <Link href={settings.instagram || "https://instagram.com/karomahaqiqah"} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A84C] hover:text-[#1B4332] transition-colors" title="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
              </svg>
            </Link>
            <Link href={`https://wa.me/${settings.whatsapp_number || '628175777008'}`} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C9A84C] hover:text-[#1B4332] transition-colors" title="WhatsApp">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-lg mb-2">Paket</h4>
          <Link href="#paket" className="hover:text-[#C9A84C] transition-colors w-fit">Paket Masak</Link>
          <Link href="#paket" className="hover:text-[#C9A84C] transition-colors w-fit">Nasi Box Ekonomis</Link>
          <Link href="#paket" className="hover:text-[#C9A84C] transition-colors w-fit">Nasi Box Premium</Link>
          <Link href="#paket" className="hover:text-[#C9A84C] transition-colors w-fit">Nasi Box Eksekutif</Link>
          <Link href="#paket" className="hover:text-[#C9A84C] transition-colors w-fit">Paket Prasmanan</Link>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-lg mb-2">Navigasi</h4>
          <Link href="#paket" className="hover:text-[#C9A84C] transition-colors w-fit">Paket</Link>
          <Link href="#tentang" className="hover:text-[#C9A84C] transition-colors w-fit">Tentang Kami</Link>
          <Link href="#galeri" className="hover:text-[#C9A84C] transition-colors w-fit">Galeri</Link>
          <Link href="#cara-pesan" className="hover:text-[#C9A84C] transition-colors w-fit">Cara Pesan</Link>
          <Link href="#testimoni" className="hover:text-[#C9A84C] transition-colors w-fit">Testimoni</Link>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-lg mb-2">Kontak</h4>
          <Link href={`https://wa.me/${settings.whatsapp_number || '628175777008'}`} className="hover:text-[#C9A84C] transition-colors w-fit flex items-center gap-2">
            📞 Hubungi Admin Karomah
          </Link>
          <div className="mt-2 flex items-start gap-2 text-sm leading-relaxed">
            <span>📍</span>
            <span className="whitespace-pre-wrap">{settings.company_address || "Jl. Soekarno Hatta / Arengka I\nSamping Indogrosir\nPekanbaru"}</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
        <span>© {new Date().getFullYear()} Karomah Aqiqah & Qurban · All Rights Reserved</span>
        <a href="#" className="hover:text-white transition-colors">karomahaqiqah.com</a>
      </div>
    </footer>
  );
}
