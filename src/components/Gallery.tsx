"use client";

import React, { useState } from "react";
import { Gallery as GalleryType } from "@prisma/client";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ galleries = [] }: { galleries?: GalleryType[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleries.length);
    }
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleries.length) % galleries.length);
    }
  };

  return (
    <section className="bg-white py-20 px-6 lg:px-12" id="galeri">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#C9A84C] font-bold text-sm tracking-wider uppercase mb-2 block">Galeri</span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mb-4">Dokumentasi Karomah Aqiqah</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Foto masakan, hewan, dan pesanan pelanggan kami.</p>
        </div>
        
        {galleries.length === 0 ? (
          <div className="bg-[#FAF6EE] rounded-3xl border border-[#E4DDD0] p-12 text-center text-gray-500 shadow-inner">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-lg font-medium text-[#1B4332]">Memuat galeri foto...</p>
            <p className="text-sm mt-2">Data galeri dapat ditambahkan melalui panel Admin.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleries.map((gallery, idx) => (
              <div 
                key={gallery.id} 
                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer bg-gray-100"
                onClick={() => openLightbox(idx)}
              >
                <img 
                  src={gallery.imageUrl} 
                  alt={gallery.altText || "Galeri Dokumentasi"} 
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/90 text-[#1B4332] px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                    Perbesar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all z-[110]"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {galleries.length > 1 && (
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-[110]"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next Button */}
          {galleries.length > 1 && (
            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-[110]"
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Main Image Container */}
          <div 
            className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={galleries[lightboxIndex].imageUrl} 
              alt={galleries[lightboxIndex].altText || "Galeri Zoom"}
              className="max-w-full md:max-w-4xl lg:max-w-5xl max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
            />
            
            {galleries[lightboxIndex].altText && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="inline-block bg-black/60 text-white backdrop-blur-md px-6 py-2 rounded-full font-medium shadow-lg">
                  {galleries[lightboxIndex].altText}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
