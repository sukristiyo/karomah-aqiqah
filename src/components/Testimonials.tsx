"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X, MessageSquare, Star } from "lucide-react";

export default function Testimonials({ testimonials = [], settings = {} }: { testimonials?: any[], settings?: Record<string, string> }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Split testimonials into types
  const textTestimonials = testimonials.filter((t) => t.type === "text" || !t.type);
  const imageTestimonials = testimonials.filter((t) => t.type === "image");

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 450;
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % imageTestimonials.length);
    }
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + imageTestimonials.length) % imageTestimonials.length);
    }
  };

  return (
    <section className="bg-[#EAF5EF] py-20 px-6 lg:px-12" id="testimoni">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#C9A84C] font-bold text-sm tracking-wider uppercase mb-2 block">Kata Mereka</span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mb-4">{settings.testimonial_title || "Dipercaya Ribuan Keluarga Pekanbaru"}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{settings.testimonial_subtitle || "Kepuasan ayah bunda adalah kebanggaan kami."}</p>
        </div>
        
        {testimonials.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-500 shadow-sm border border-[#E4DDD0]">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-lg font-medium text-[#1B4332]">Belum ada testimoni</p>
            <p className="text-sm mt-2">Data testimoni akan tampil di sini setelah ditambahkan melalui panel Admin.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Text Testimonials Section */}
            {textTestimonials.length > 0 && (
              <div className="relative group flex items-center justify-center w-full">
                <button 
                  onClick={() => scroll('left')}
                  className="absolute left-0 z-20 w-12 h-12 -ml-2 lg:-ml-6 bg-white text-[#1B4332] rounded-full flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:scale-110 hover:bg-[#EAF5EF] transition-all duration-300 focus:outline-none hidden md:flex border border-gray-100"
                  aria-label="Geser ke kiri"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div 
                  ref={scrollRef}
                  className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 px-4 w-full [&::-webkit-scrollbar]:hidden ${textTestimonials.length < 3 ? 'md:justify-center' : ''}`}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {textTestimonials.map((t, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#E4DDD0] flex flex-col snap-center shrink-0 mx-auto md:mx-0 whitespace-normal hover:shadow-lg transition-shadow duration-300 w-[85vw] sm:w-[400px]" 
                      style={{ maxWidth: '450px' }}
                    >
                      <div className="flex mb-4 gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < (t.rating || 5) ? 'text-[#C9A84C]' : 'text-gray-200'}`} 
                            fill="currentColor" 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 italic flex-1 mb-6 break-words whitespace-pre-wrap leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                      <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-4">
                        <div className="w-10 h-10 bg-[#EAF5EF] rounded-full flex items-center justify-center text-[#1B4332] font-bold shrink-0">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-[#1B4332] truncate">{t.name}</p>
                          {t.role && <p className="text-xs text-gray-500 truncate">{t.role}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => scroll('right')}
                  className="absolute right-0 z-20 w-12 h-12 -mr-2 lg:-mr-6 bg-white text-[#1B4332] rounded-full flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:scale-110 hover:bg-[#EAF5EF] transition-all duration-300 focus:outline-none hidden md:flex border border-gray-100"
                  aria-label="Geser ke kanan"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Image Testimonials Section (WhatsApp Screenshots) */}
            {imageTestimonials.length > 0 && (
              <div className="mt-12 w-full">
                <h3 className="text-2xl font-serif text-[#1B4332] text-center mb-8">Bukti Nyata Pelanggan Kami</h3>
                <div className="flex md:flex-wrap md:justify-center gap-6 overflow-x-auto snap-x snap-mandatory pb-6 px-4 w-full [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {imageTestimonials.map((t, idx) => (
                    <div 
                      key={idx} 
                      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all border border-gray-200 shrink-0 bg-white snap-center w-[200px]"
                      onClick={() => openLightbox(idx)}
                    >
                      <img 
                        src={t.imageUrl} 
                        alt={`Testimoni ${t.name}`} 
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <p className="text-white font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          {t.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          {imageTestimonials.length > 1 && (
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-[110]"
              onClick={prevImage}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Next Button */}
          {imageTestimonials.length > 1 && (
            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-[110]"
              onClick={nextImage}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Main Image Container */}
          <div 
            className="relative w-full max-w-4xl h-full max-h-[90vh] flex flex-col items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={imageTestimonials[lightboxIndex].imageUrl} 
              alt={`Testimoni ${imageTestimonials[lightboxIndex].name}`}
              className="max-w-full md:max-w-md lg:max-w-lg max-h-[85vh] object-contain rounded-xl shadow-2xl select-none bg-white"
            />
            
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="inline-block bg-black/60 text-white backdrop-blur-md px-6 py-2 rounded-full font-medium shadow-lg">
                Testimoni dari: {imageTestimonials[lightboxIndex].name}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
