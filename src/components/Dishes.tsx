"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dish } from "@prisma/client";

export default function Dishes({ dishes }: { dishes: Dish[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!dishes || dishes.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Amount to scroll each click
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="bg-white relative overflow-hidden" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1B4332] mb-4">Berbagai Olahan Masakan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ragam pilihan masakan lezat yang dimasak oleh chef berpengalaman kami.
          </p>
        </div>

        <div className="relative group w-full flex items-center">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 z-20 w-10 h-10 -ml-5 bg-[#16A34A] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#15803D] transition-colors focus:outline-none hidden md:flex"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div 
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth w-full hide-scrollbar ${dishes.length <= 5 ? 'md:justify-center' : ''}`}
            style={{ padding: '1rem 2.5rem' }}
          >
            {dishes.map((dish) => (
              <div 
                key={dish.id} 
                className="snap-center shrink-0 flex flex-col items-center"
                style={{ width: '200px' }}
              >
                <div 
                  className="rounded-full overflow-hidden shadow-md mb-4 border-4 border-white bg-gray-50"
                  style={{ width: '200px', height: '200px', flexShrink: 0 }}
                >
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-center font-bold text-gray-700 text-lg">{dish.name}</h3>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 z-20 w-10 h-10 -mr-5 bg-[#16A34A] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#15803D] transition-colors focus:outline-none hidden md:flex"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
