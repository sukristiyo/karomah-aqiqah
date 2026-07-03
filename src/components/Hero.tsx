import React from "react";
import Link from "next/link";
import { getSettings } from "@/app/actions";

export default async function Hero() {
  const settings = await getSettings();

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#3a8f68] pt-24 pb-20 px-6 lg:px-12 overflow-hidden">
        {/* Subtle Background Pattern/Icon */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <svg width="600" height="600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-block bg-[#C9A84C]/20 border border-[#C9A84C] text-[#F0D080] rounded-full px-4 py-1 text-sm font-bold mb-6">
              {settings.hero_badge || "👶 Aqiqah Amanah & Berkah"}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
              {settings.hero_title ? (
                <span dangerouslySetInnerHTML={{ __html: settings.hero_title.replace('Terpercaya', '<em class="not-italic text-[#C9A84C]">Terpercaya</em>') }} />
              ) : (
                <>Aqiqah <span className="text-[#C9A84C]">Terpercaya</span> untuk Momen Bahagia Buah Hati Anda</>
              )}
            </h1>
            
            <p className="text-white/80 text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              {settings.hero_sub || "Kambing dari peternakan sendiri, sembelih sesuai syariat, masak profesional — semua beres, Anda tinggal menikmati momen bahagia."}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 text-sm text-white/90 mb-8 backdrop-blur-sm">
              {settings.hero_lokasi || "📍 Jl. Soekarno Hatta / Arengka I · Pekanbaru"}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href={`https://wa.me/${settings.whatsapp_number || '628175777008'}`} target="_blank" className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#F0D080] text-[#1B4332] px-6 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Pesan Sekarang
              </Link>
              <Link href="#paket" className="inline-flex items-center gap-2 bg-transparent border border-white/30 hover:border-white hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                Lihat Paket
              </Link>
            </div>
          </div>
          
          <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <span className="block font-serif text-4xl text-[#C9A84C] mb-1">1000+</span>
                <span className="text-white/70 text-sm">Aqiqah Selesai</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-4xl text-[#C9A84C] mb-1">8+</span>
                <span className="text-white/70 text-sm">Tahun Pengalaman</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-4xl text-[#C9A84C] mb-1">100%</span>
                <span className="text-white/70 text-sm">Sesuai Syariat</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-4xl text-[#C9A84C] mb-1">5⭐</span>
                <span className="text-white/70 text-sm">Rating Pelanggan</span>
              </div>
            </div>
            <hr className="border-white/10 mb-6" />
            <ul className="space-y-3 text-white/90">
              <li className="flex items-center gap-3">
                <span className="text-[#52B788]">✓</span> Kambing dari peternakan sendiri
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#52B788]">✓</span> Juru sembelih bersertifikat JULEHA
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#52B788]">✓</span> Gratis ongkir sampai ruang tamu
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#52B788]">✓</span> Bisa pesan mendadak, fast respon
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20 -mt-10 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          <div className="flex gap-4 items-start">
            <div className="text-4xl bg-[#FFFBEA] p-4 rounded-2xl text-[#C9A84C]">⏰</div>
            <div>
              <h4 className="text-[#1B4332] font-bold text-lg mb-1">OnTime</h4>
              <p className="text-gray-500 text-sm">Diantar tepat waktu sesuai permintaan ayah bunda.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-4xl bg-[#FFFBEA] p-4 rounded-2xl text-[#C9A84C]">🔪</div>
            <div>
              <h4 className="text-[#1B4332] font-bold text-lg mb-1">Sembelih Sendiri</h4>
              <p className="text-gray-500 text-sm">Karomah siap membimbing ayah bunda menyembelih sendiri.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="text-4xl bg-[#FFFBEA] p-4 rounded-2xl text-[#C9A84C]">🚚</div>
            <div>
              <h4 className="text-[#1B4332] font-bold text-lg mb-1">Free Ongkir</h4>
              <p className="text-gray-500 text-sm">Diantar langsung sampai ruang tamu, tanpa biaya tambahan.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
