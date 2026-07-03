import React from "react";
import Link from "next/link";
import { getPackages, getSettings } from "@/app/actions";

function getIconEmoji(type: string) {
  if (type === "masak") return "🍲";
  if (type === "ekonomis") return "🍱";
  if (type === "premium") return "⭐";
  if (type === "eksekutif") return "👑";
  if (type === "prasmanan") return "🍽️";
  return "📦";
}

function getPackageIcon(pkg: any) {
  const icon = pkg.packageType?.icon || getIconEmoji(pkg.iconType || "masak");
  return (
    <div className="w-20 h-20 mx-auto rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center justify-center text-4xl mb-6 shadow-sm">
      {icon}
    </div>
  );
}

export default async function Packages() {
  const packages = await getPackages();
  const settings = await getSettings();

  return (
    <section className="bg-[#FAF6EE] pt-8 pb-24 px-6 lg:px-12" id="paket">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#C9A84C] font-bold text-sm tracking-wider uppercase mb-2 block">Pilihan Paket</span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mb-4">Paket Aqiqah Karomah</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilihan paket fleksibel dari yang praktis hingga premium, lengkap dengan hewan qurban pilihan.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center" style={{ gap: '2rem' }}>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div 
                key={pkg.id} 
                style={{ flex: '1 1 300px', maxWidth: '380px' }}
                className={`bg-white rounded-2xl p-8 flex flex-col relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border ${pkg.isFeatured ? 'border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10' : 'border-[#E4DDD0] shadow-sm'}`}
              >
                {pkg.isFeatured && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#C9A84C] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-md z-10">
                    TERLARIS
                  </div>
                )}
                
                {pkg.imageUrl ? (
                  <div className="relative mb-6 mx-auto" style={{ width: '100%', maxWidth: '320px', aspectRatio: '1 / 1' }}>
                    <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover rounded-xl shadow-md border border-gray-100" style={{ objectPosition: pkg.imagePosition || "center" }} />
                  </div>
                ) : (
                  getPackageIcon(pkg)
                )}
                
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl text-[#1B4332] mb-2">{pkg.name}</h3>
                  {pkg.price && <div className="text-[#2D6A4F] font-bold text-xl">{pkg.price}</div>}
                  {pkg.description && <div className="text-gray-500 text-sm mt-2 leading-relaxed">{pkg.description}</div>}
                </div>
                
                <hr className="border-[#E4DDD0] mb-6" />
                
                <div className="flex-grow mb-8">
                  <ul className="space-y-3">
                    {pkg.features.map((ft: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm">
                        <span className="text-[#52B788] mt-0.5">✓</span>
                        <span>{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link
                  href={`https://wa.me/${settings.whatsapp_number || '628175777008'}?text=Assalamu'alaikum%2C%20saya%20ingin%20pesan%20${pkg.name}`}
                  target="_blank"
                  className={`w-full py-3 rounded-xl font-bold text-center transition-colors ${pkg.isFeatured ? 'bg-[#C9A84C] hover:bg-[#F0D080] text-[#1B4332]' : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white'}`}
                >
                  Tanya Harga & Pesan
                </Link>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center col-span-full max-w-md mx-auto w-full shadow-sm border border-[#E4DDD0]">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-4xl mb-6">📦</div>
              <h3 className="font-serif text-2xl text-[#1B4332] mb-4">Belum ada paket</h3>
              <p className="text-gray-500">Silakan tambahkan paket di panel Admin.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
