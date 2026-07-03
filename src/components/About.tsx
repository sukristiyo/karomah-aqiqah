"use client";

import React from "react";

export default function About({ settings }: { settings?: Record<string, string> }) {
  // Default values
  const title = settings?.about_title || "Karomah Aqiqah & Qurban";
  const subtitle = settings?.about_subtitle || "TENTANG KAMI";
  const description = settings?.about_description || "Layanan aqiqah profesional yang praktis, lezat, dan syar'i. Dengan kambing dari peternakan sendiri, juru sembelih bersertifikat JULEHA, dan tim masak profesional, kami menyajikan paket lengkap mulai dari gulai & sate, nasi box, camilan, hingga buah.";
  const experience = settings?.about_experience || "8+";
  const imageUrl = settings?.about_image || "/about-image.jpg";

  let points = [
    { icon: "🐐", title: "Peternakan Sendiri", description: "Kambing/domba dipilih langsung, sehat & cukup umur sesuai syarat sah aqiqah." },
    { icon: "📜", title: "Juru Sembelih JULEHA", description: "Bersertifikat resmi, penyembelihan sesuai syariat & sunnah." },
    { icon: "⚡", title: "Bisa Pesan Mendadak", description: "Fast respon admin, proses cepat, kualitas tetap terjaga." },
    { icon: "📍", title: "Jl. Soekarno Hatta / Arengka I", description: "Depan Pergudangan Eco Green, Pekanbaru." }
  ];

  if (settings?.about_points) {
    try {
      points = JSON.parse(settings.about_points);
    } catch (e) {
      console.error("Failed to parse about points", e);
    }
  }

  return (
    <section className="bg-white py-24 px-6 lg:px-12" id="tentang">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Illustration Side */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative max-w-md mx-auto">
            <div className="aspect-[4/3] bg-[#EAF5EF] rounded-3xl overflow-hidden flex items-center justify-center border-8 border-white shadow-xl relative z-10">
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 md:right-0 bg-[#C9A84C] text-white p-4 rounded-2xl shadow-xl z-20 flex flex-col items-center justify-center transform rotate-3">
              <span className="font-serif text-3xl font-bold">{experience}</span>
              <span className="text-xs uppercase tracking-wider text-center font-bold">Tahun<br/>Pengalaman</span>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full lg:w-1/2">
          <span className="text-[#C9A84C] font-bold text-sm tracking-wider uppercase mb-2 block">{subtitle}</span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mb-6">{title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
            {description}
          </p>
          
          <ul className="space-y-6">
            {points.map((point, index) => (
              <li key={index} className="flex items-start gap-4 bg-[#FAF6EE] p-4 rounded-xl border border-[#E4DDD0] hover:border-[#C9A84C] transition-colors">
                <div className="text-3xl">{point.icon}</div>
                <div>
                  <strong className="text-[#1B4332] block mb-1">{point.title}</strong>
                  <span className="text-gray-500 text-sm">{point.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
