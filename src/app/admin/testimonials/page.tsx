"use client";

import React, { useState, useEffect, useRef } from "react";
import { getTestimonials, createTestimonial, deleteTestimonial } from "./actions";
import { getMediaFiles, uploadMedia } from "@/app/actions/media";
import { getSettings, saveMultipleSettings } from "@/app/actions";
import { Testimonial } from "@prisma/client";
import { Image as ImageIcon, CheckCircle2, MessageSquare, Trash2, Star, Upload } from "lucide-react";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings Form State
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    testimonial_title: "",
    testimonial_subtitle: ""
  });
  
  // Form State
  const [formData, setFormData] = useState({
    type: "image",
    name: "",
    content: "",
    imageUrl: "",
    rating: 5
  });

  useEffect(() => {
    fetchTestimonials();
    fetchMedia();
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const data = await getSettings();
    setSettingsForm({
      testimonial_title: data.testimonial_title || "Dipercaya Ribuan Keluarga Pekanbaru",
      testimonial_subtitle: data.testimonial_subtitle || "Kepuasan ayah bunda adalah kebanggaan kami."
    });
  }

  async function fetchTestimonials() {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  }

  async function fetchMedia() {
    const data = await getMediaFiles();
    setMediaFiles(data);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileInputRef.current) fileInputRef.current.value = "";

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    
    const result = await uploadMedia(uploadData);
    setUploading(false);

    if (result.success && result.url) {
      setFormData({ ...formData, imageUrl: result.url });
      fetchMedia(); 
    } else {
      alert(result.message || "Gagal mengupload gambar.");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    await createTestimonial(formData);
    
    // Reset form
    handleReset();
    await fetchTestimonials();
  }

  async function handleDelete(id: string) {
    if (confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      setLoading(true);
      await deleteTestimonial(id);
      await fetchTestimonials();
    }
  }

  function handleReset() {
    setFormData({ type: "image", name: "", content: "", imageUrl: "", rating: 5 });
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsLoading(true);
    await saveMultipleSettings(settingsForm);
    setSettingsLoading(false);
    alert("Pengaturan teks testimoni berhasil disimpan!");
  }

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kelola Testimoni</h1>
        <p className="text-gray-500 mt-2">Atur judul teks dan tambah ulasan pelanggan baik berupa teks maupun screenshot gambar.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">Pengaturan Teks Judul</h2>
        
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700">Judul Utama Seksi Testimoni</label>
              <input 
                type="text" 
                required
                value={settingsForm.testimonial_title}
                onChange={(e) => setSettingsForm({...settingsForm, testimonial_title: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                placeholder="Contoh: Dipercaya Ribuan Keluarga Pekanbaru"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700">Sub-judul / Deskripsi Pendek</label>
              <input 
                type="text" 
                required
                value={settingsForm.testimonial_subtitle}
                onChange={(e) => setSettingsForm({...settingsForm, testimonial_subtitle: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                placeholder="Contoh: Kepuasan ayah bunda adalah kebanggaan kami."
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={settingsLoading}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {settingsLoading ? "Menyimpan..." : "Simpan Teks Judul"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">Tambah Testimoni Baru</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "image" })}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-semibold ${
                formData.type === "image" ? "border-[#144A32] bg-[#EAF5EF] text-[#144A32]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <ImageIcon className="w-5 h-5" /> Testimoni Gambar
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "text" })}
              className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-semibold ${
                formData.type === "text" ? "border-[#144A32] bg-[#EAF5EF] text-[#144A32]" : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-5 h-5" /> Testimoni Teks
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 font-medium text-gray-700">Nama Pelanggan</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                placeholder="Contoh: Bpk. Budi (Pekanbaru)"
              />
            </div>

            {formData.type === "image" ? (
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <label className="block text-sm mb-2 font-medium text-gray-700">Screenshot Testimoni (Wajib)</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {formData.imageUrl ? (
                    <div className="relative group w-32 h-40 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                      <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">Hapus</button>
                    </div>
                  ) : (
                    <div className="w-32 h-40 rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-gray-400 shrink-0">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[10px]">Gambar</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white border border-[#144A32] text-[#144A32] px-4 py-2 rounded-xl text-sm hover:bg-[#EAF5EF] font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
                      <Upload className="w-4 h-4" /> {uploading ? "Mengupload..." : "Upload Screenshot"}
                    </button>
                    <button type="button" onClick={() => setShowMediaModal(true)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors">
                      <ImageIcon className="w-4 h-4" /> Pilih dari Galeri
                    </button>
                    <p className="text-xs text-gray-500 w-full mt-2">
                      * Anda bisa mengupload langsung atau memilih gambar yang sudah ada di Media Library.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">Isi Testimoni (Wajib)</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                    placeholder="Ketik ulasan pelanggan di sini..."
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium text-gray-700">Bintang Penilaian</label>
                  <select 
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full md:w-1/3 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                    <option value="3">⭐⭐⭐ (3 Bintang)</option>
                    <option value="2">⭐⭐ (2 Bintang)</option>
                    <option value="1">⭐ (1 Bintang)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading || (formData.type === 'image' && !formData.imageUrl) || (formData.type === 'text' && !formData.content)}
              className="px-8 py-3 bg-[#144A32] text-white rounded-xl font-medium hover:bg-[#0f3624] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Tambah Testimoni
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Daftar Testimoni</h2>
        </div>
        
        {loading && testimonials.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Memuat data...</div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">💬</div>
            Belum ada testimoni. Silakan tambahkan di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold w-24">Tipe / Media</th>
                  <th className="px-6 py-4 font-semibold">Nama Pelanggan</th>
                  <th className="px-6 py-4 font-semibold w-1/2">Isi Testimoni</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {t.type === "image" && t.imageUrl ? (
                        <img src={t.imageUrl} alt="Testimonial" className="w-12 h-16 rounded object-cover border border-gray-100 shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-[#EAF5EF] text-[#144A32] flex items-center justify-center rounded-xl">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4">
                      {t.type === "image" ? (
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Testimoni Gambar</span>
                      ) : (
                        <p className="line-clamp-2">{t.content}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-xs inline-flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
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
                <div className="col-span-full py-12 text-center text-gray-500">Belum ada media. Silakan upload terlebih dahulu melalui menu Media Library.</div>
              ) : (
                mediaFiles.map((url, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setFormData({...formData, imageUrl: url}); setShowMediaModal(false); }}
                    className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[3/4] cursor-pointer border-2 hover:border-[#144A32] group transition-all"
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
