"use client";

import React, { useState, useEffect, useRef } from "react";
import { getGalleries, createGallery, deleteGallery } from "@/app/actions";
import { uploadMedia } from "@/app/actions/media";
import { Gallery } from "@prisma/client";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import ImageCropperModal from "@/components/ImageCropperModal";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [altText, setAltText] = useState("");

  // Cropper state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  async function fetchGalleries() {
    setLoading(true);
    const data = await getGalleries();
    setGalleries(data);
    setLoading(false);
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setCropImageSrc(reader.result?.toString() || null);
    });
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File) => {
    setCropImageSrc(null);
    setUploading(true);
    
    const uploadData = new FormData();
    uploadData.append("file", croppedFile);
    
    const result = await uploadMedia(uploadData);

    if (result.success && result.url) {
      await createGallery({ imageUrl: result.url, altText: altText || "Dokumentasi Karomah Aqiqah" });
      setAltText("");
      await fetchGalleries();
    } else {
      alert(result.message);
    }
    setUploading(false);
  };

  async function handleDelete(id: string) {
    if (confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri?")) {
      setLoading(true);
      await deleteGallery(id);
      await fetchGalleries();
    }
  }

  return (
    <div className="space-y-8 relative">
      {cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kelola Galeri Foto</h1>
        <p className="text-gray-500 mt-2">Tambah foto dokumentasi, hewan, atau pesanan pelanggan yang akan tampil di halaman utama.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">
          Upload Foto Baru
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm mb-2 font-medium text-gray-700">Teks Alternatif (Opsional, untuk SEO)</label>
            <input 
              type="text" 
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
              placeholder="Contoh: Foto penyembelihan domba aqiqah"
            />
          </div>
          
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="block text-sm mb-2 font-medium text-gray-700">Pilih Foto</label>
            <div className="flex gap-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 hover:border-[#144A32] transition-colors group cursor-pointer disabled:opacity-50"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-[#144A32]" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-700">{uploading ? "Sedang Mengupload..." : "Klik untuk memilih foto"}</p>
                  <p className="text-xs text-gray-500 mt-1">Format JPG, PNG (Max 5MB)</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <span>Daftar Foto Galeri</span>
          <span className="bg-[#EAF5EF] text-[#144A32] text-sm py-1 px-3 rounded-full">{galleries.length} Foto</span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#144A32]"></div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada foto galeri</p>
            <p className="text-gray-400 text-sm mt-1">Upload foto pertama Anda melalui form di atas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleries.map((gallery) => (
              <div key={gallery.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                <img 
                  src={gallery.imageUrl} 
                  alt={gallery.altText || "Gallery Image"} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
