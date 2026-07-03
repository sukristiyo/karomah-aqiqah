import React from "react";
import Link from "next/link";
import { getFeatures } from "@/app/actions";

export default async function HowToOrder({ settings = {} }: { settings?: Record<string, string> }) {
  const features = await getFeatures();

  return (
    <>
      {/* ALASAN */}
      <section className="bg-[#EAF5EF] py-20 px-6 lg:px-12" id="alasan">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] font-bold text-sm tracking-wider uppercase mb-2 block">Mengapa Pilih Kami</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mb-4">Mengapa Memilih Karomah Aqiqah?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kepercayaan ribuan keluarga Pekanbaru selama lebih dari 8 tahun bukan tanpa alasan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.length > 0 ? (
              features.map((ft) => (
                <div key={ft.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
                  <div className="w-16 h-16 mx-auto bg-[#FAF6EE] group-hover:bg-[#FFFBEA] rounded-full flex items-center justify-center text-3xl mb-6 transition-colors">
                    {ft.icon}
                  </div>
                  <h4 className="text-[#1B4332] font-bold text-xl mb-3">{ft.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm">{ft.description}</p>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center col-span-full max-w-md mx-auto w-full">
                <div className="w-16 h-16 mx-auto bg-[#FAF6EE] rounded-full flex items-center justify-center text-3xl mb-6">☪️</div>
                <h4 className="text-[#1B4332] font-bold text-xl mb-3">Sesuai Syariat & Sunnah</h4>
                <p className="text-gray-500 text-sm">Belum ada data alasan, silakan tambahkan di panel Admin.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CARA PESAN */}
      <section className="bg-white py-20 px-6 lg:px-12" id="cara-pesan">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C9A84C] font-bold text-sm tracking-wider uppercase mb-2 block">Panduan</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mb-4">Cara Pesan, Mudah & Cepat</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Cukup 4 langkah, aqiqah ananda sudah beres dan berkah.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF6EE] p-8 rounded-2xl border border-[#E4DDD0] relative overflow-hidden group hover:border-[#C9A84C] transition-colors">
              <div className="text-5xl font-serif text-[#C9A84C]/20 absolute -right-2 -top-4 font-bold">01</div>
              <h4 className="text-[#1B4332] font-bold text-xl mb-3 relative z-10">Pilih Paket</h4>
              <p className="text-gray-600 text-sm relative z-10">Pilih paket yang sesuai jumlah tamu dan anggaran keluarga Anda.</p>
            </div>
            <div className="bg-[#FAF6EE] p-8 rounded-2xl border border-[#E4DDD0] relative overflow-hidden group hover:border-[#C9A84C] transition-colors">
              <div className="text-5xl font-serif text-[#C9A84C]/20 absolute -right-2 -top-4 font-bold">02</div>
              <h4 className="text-[#1B4332] font-bold text-xl mb-3 relative z-10">Hubungi Admin</h4>
              <p className="text-gray-600 text-sm relative z-10">Chat WhatsApp, sampaikan tanggal acara, jumlah porsi & alamat.</p>
            </div>
            <div className="bg-[#FAF6EE] p-8 rounded-2xl border border-[#E4DDD0] relative overflow-hidden group hover:border-[#C9A84C] transition-colors">
              <div className="text-5xl font-serif text-[#C9A84C]/20 absolute -right-2 -top-4 font-bold">03</div>
              <h4 className="text-[#1B4332] font-bold text-xl mb-3 relative z-10">Konfirmasi & DP</h4>
              <p className="text-gray-600 text-sm relative z-10">Setujui penawaran, lakukan DP untuk konfirmasi pemesanan.</p>
            </div>
            <div className="bg-[#FAF6EE] p-8 rounded-2xl border border-[#E4DDD0] relative overflow-hidden group hover:border-[#C9A84C] transition-colors">
              <div className="text-5xl font-serif text-[#C9A84C]/20 absolute -right-2 -top-4 font-bold">04</div>
              <h4 className="text-[#1B4332] font-bold text-xl mb-3 relative z-10">Terima Beres</h4>
              <p className="text-gray-600 text-sm relative z-10">Diantar tepat waktu sampai ruang tamu. Ayah bunda fokus di momen bahagia saja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] py-20 px-6 lg:px-12 text-center" id="cta">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Jangan Tunggu Lama-Lama, Yuk Aqiqah di Karomah!</h2>
          <p className="text-white/80 mb-10 text-lg">Tim kami siap melayani setiap hari. Hubungi admin sekarang untuk konsultasi gratis.</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={`https://wa.me/${settings.whatsapp_number || '628175777008'}?text=Assalamu'alaikum%2C%20saya%20ingin%20konsultasi%20paket%20aqiqah%20Karomah`}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1"
              target="_blank"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi Admin Karomah
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
