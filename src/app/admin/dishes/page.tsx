"use client";

import React, { useState, useEffect, useRef } from "react";
import { getDishes, createDish, updateDish, deleteDish } from "@/app/actions";
import { uploadMedia, getMediaFiles } from "@/app/actions/media";
import { Dish } from "@prisma/client";
import { Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import ImageCropperModal from "@/components/ImageCropperModal";

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: ""
  });

  // Cropper state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDishes();
    fetchMedia();
  }, []);

  async function fetchDishes() {
    setLoading(true);
    const data = await getDishes();
    setDishes(data);
    setLoading(false);
  }

  async function fetchMedia() {
    const data = await getMediaFiles();
    setMediaFiles(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    if (isEditing) {
      await updateDish(currentId, formData);
    } else {
      await createDish(formData);
    }
    
    // Reset form
    handleReset();
    await fetchDishes();
  }

  function handleEdit(dish: Dish) {
    setFormData({
      name: dish.name,
      imageUrl: dish.imageUrl
    });
    setCurrentId(dish.id);
    setIsEditing(true);
  }

  async function handleDelete(id: string) {
    if (confirm("Apakah Anda yakin ingin menghapus masakan ini?")) {
      setLoading(true);
      await deleteDish(id);
      await fetchDishes();
    }
  }

  function handleReset() {
    setFormData({ name: "", imageUrl: "" });
    setIsEditing(false);
    setCurrentId("");
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
    setUploading(false);

    if (result.success && result.url) {
      setFormData({ ...formData, imageUrl: result.url });
      fetchMedia(); 
    } else {
      alert(result.message);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kelola Olahan Masakan</h1>
        <p className="text-gray-500 mt-2">Tambah menu masakan yang akan tampil di Slider Halaman Depan.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">
          {isEditing ? "Edit Masakan" : "Tambah Masakan Baru"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 font-medium text-gray-700">Nama Masakan</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                placeholder="Contoh: Tongseng Kambing"
              />
            </div>
            
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-sm mb-2 font-medium text-gray-700">Foto Masakan (Wajib)</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {formData.imageUrl ? (
                  <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">Hapus</button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-gray-400 shrink-0">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-[10px]">1:1 Ratio</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                    <Upload className="w-4 h-4" /> {uploading ? "Mengupload..." : "Upload & Potong"}
                  </button>
                  <button type="button" onClick={() => setShowMediaModal(true)} className="bg-white border border-[#144A32] text-[#144A32] px-4 py-2 rounded-xl text-sm hover:bg-[#EAF5EF] font-medium flex items-center gap-2 transition-colors">
                    <ImageIcon className="w-4 h-4" /> Pilih dari Galeri
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {isEditing && (
              <button 
                type="button" 
                onClick={handleReset}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            )}
            <button 
              type="submit" 
              disabled={loading || !formData.imageUrl}
              className="px-8 py-3 bg-[#144A32] text-white rounded-xl font-medium hover:bg-[#0f3624] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isEditing ? "Simpan Perubahan" : "Tambah Masakan"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Daftar Olahan Masakan</h2>
        </div>
        
        {loading && dishes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Memuat data...</div>
        ) : dishes.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">🍲</div>
            Belum ada olahan masakan. Silakan tambahkan di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold w-24">Foto</th>
                  <th className="px-6 py-4 font-semibold">Nama Masakan</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{dish.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(dish)}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(dish.id)}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Media Selection Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-gray-900 text-lg">Pilih Gambar dari Media Library</h3>
              <button onClick={() => setShowMediaModal(false)} className="text-gray-400 hover:text-gray-900 text-2xl font-bold px-2 transition-colors">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {mediaFiles.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">Belum ada media. Silakan upload terlebih dahulu.</div>
              ) : (
                mediaFiles.map((url, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setFormData({...formData, imageUrl: url}); setShowMediaModal(false); }}
                    className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square cursor-pointer border-2 hover:border-[#144A32] group transition-all"
                    style={{ borderColor: formData.imageUrl === url ? "#144A32" : "transparent" }}
                  >
                    <img src={url} alt="Media" className="w-full h-full object-cover" />
                    {formData.imageUrl === url && (
                      <div className="absolute top-2 right-2 bg-white rounded-full shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#144A32]" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
