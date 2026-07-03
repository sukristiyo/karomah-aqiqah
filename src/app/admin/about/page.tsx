"use client";

import React, { useEffect, useState, useRef } from "react";
import { getSettings, saveMultipleSettings } from "@/app/actions";
import { uploadMedia, getMediaFiles } from "@/app/actions/media";
import { Upload, Image as ImageIcon, CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import ImageCropperModal from "@/components/ImageCropperModal";
import EmojiPicker from "emoji-picker-react";

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPickerFor, setShowPickerFor] = useState<number | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "Karomah Aqiqah & Qurban",
    subtitle: "TENTANG KAMI",
    description: "Layanan aqiqah profesional yang praktis, lezat, dan syar'i. Dengan kambing dari peternakan sendiri, juru sembelih bersertifikat JULEHA, dan tim masak profesional, kami menyajikan paket lengkap mulai dari gulai & sate, nasi box, camilan, hingga buah.",
    experience: "8+",
    imageUrl: "/about-image.jpg"
  });

  const [points, setPoints] = useState([
    { icon: "🐐", title: "Peternakan Sendiri", description: "Kambing/domba dipilih langsung, sehat & cukup umur sesuai syarat sah aqiqah." },
    { icon: "📜", title: "Juru Sembelih JULEHA", description: "Bersertifikat resmi, penyembelihan sesuai syariat & sunnah." },
    { icon: "⚡", title: "Bisa Pesan Mendadak", description: "Fast respon admin, proses cepat, kualitas tetap terjaga." },
    { icon: "📍", title: "Jl. Soekarno Hatta / Arengka I", description: "Depan Pergudangan Eco Green, Pekanbaru." }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const settings = await getSettings();
    const media = await getMediaFiles();
    
    setMediaFiles(media);
    
    if (settings.about_title || settings.about_description) {
      setFormData({
        title: settings.about_title || "Karomah Aqiqah & Qurban",
        subtitle: settings.about_subtitle || "TENTANG KAMI",
        description: settings.about_description || "",
        experience: settings.about_experience || "8+",
        imageUrl: settings.about_image || "/about-image.jpg"
      });
      
      if (settings.about_points) {
        try {
          setPoints(JSON.parse(settings.about_points));
        } catch (e) {
          console.error("Failed to parse points", e);
        }
      }
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    await saveMultipleSettings({
      about_title: formData.title,
      about_subtitle: formData.subtitle,
      about_description: formData.description,
      about_experience: formData.experience,
      about_image: formData.imageUrl,
      about_points: JSON.stringify(points)
    });
    
    setSaving(false);
    setShowSuccessModal(true);
  };

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
      const media = await getMediaFiles();
      setMediaFiles(media);
    } else {
      alert(result.message);
    }
  };

  const addPoint = () => {
    setPoints([...points, { icon: "✨", title: "Poin Baru", description: "Deskripsi poin baru." }]);
  };

  const removePoint = (index: number) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    setPoints(newPoints);
  };

  const updatePoint = (index: number, field: string, value: string) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading data...</div>;

  return (
    <div className="space-y-6 relative pb-20">
      {cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}

      {/* Media Selection Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="font-bold text-gray-900">Pilih Gambar</h3>
              <button onClick={() => setShowMediaModal(false)} className="text-gray-400 hover:text-gray-900 text-xl font-bold px-2">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {mediaFiles.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-500">Belum ada media. Silakan upload terlebih dahulu.</div>
              ) : (
                mediaFiles.map((url, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setFormData({...formData, imageUrl: url}); setShowMediaModal(false); }}
                    className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer border-2 hover:border-[#144A32] group"
                    style={{ borderColor: formData.imageUrl === url ? "#144A32" : "transparent" }}
                  >
                    <img src={url} alt="Media" className="w-full h-full object-cover" />
                    {formData.imageUrl === url && (
                      <div className="absolute top-1 right-1 bg-white rounded-full">
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pengaturan "Tentang Kami"</h2>
            <p className="text-sm text-gray-500 mt-1">Sesuaikan informasi profil perusahaan yang tampil di halaman utama.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bagian Teks Utama */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">Sub Judul (Kecil)</label>
                <input 
                  type="text" 
                  required
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                  placeholder="Contoh: TENTANG KAMI"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">Judul Utama</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors font-serif text-lg"
                  placeholder="Contoh: Karomah Aqiqah & Qurban"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">Deskripsi Singkat</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                  placeholder="Tuliskan deskripsi layanan..."
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-gray-700">Teks Tahun Pengalaman (Lencana)</label>
                <input 
                  type="text" 
                  required
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full sm:w-1/2 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors font-bold text-xl"
                  placeholder="Contoh: 8+"
                />
                <p className="text-xs text-gray-500 mt-1">Hanya angka pendek (misal: 8+ atau 10)</p>
              </div>
            </div>

            {/* Bagian Gambar */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center space-y-4 relative">
              <label className="block text-sm font-medium text-gray-700 w-full text-left mb-2">Foto / Ilustrasi Utama (Rasio Bebas/4:3 disarankan)</label>
              
              <div className="w-full max-w-sm aspect-[4/3] bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden relative">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                
                {/* Simulated Badge for visual context */}
                <div className="absolute -bottom-2 -right-2 bg-[#C9A84C] text-white p-3 rounded-xl shadow-md z-20 flex flex-col items-center justify-center transform rotate-3 scale-75 origin-bottom-right">
                  <span className="font-serif text-xl font-bold leading-none">{formData.experience}</span>
                  <span className="text-[9px] uppercase tracking-wider text-center font-bold mt-1 leading-tight">Tahun<br/>Pengalaman</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full mt-4 justify-center">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 font-medium flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm">
                  <Upload className="w-4 h-4" /> {uploading ? "Mengupload..." : "Upload Foto Baru"}
                </button>
                <button type="button" onClick={() => setShowMediaModal(true)} className="bg-white border border-[#144A32] text-[#144A32] px-4 py-2 rounded-xl text-sm hover:bg-[#EAF5EF] font-medium flex items-center gap-2 transition-colors shadow-sm">
                  <ImageIcon className="w-4 h-4" /> Pilih dari Galeri
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Poin Alasan */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Poin Informasi Tambahan</h2>
              <p className="text-sm text-gray-500 mt-1">Daftar poin-poin alasan atau keunggulan di sebelah kanan layar.</p>
            </div>
            <button 
              type="button" 
              onClick={addPoint}
              className="bg-[#144A32] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#2D6A4F] transition flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" /> Tambah Poin
            </button>
          </div>

          <div className="space-y-4">
            {points.map((point, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 items-start">
                <div className="w-20 shrink-0 relative">
                  <label className="block text-xs text-gray-500 mb-1">Emoji / Ikon</label>
                  <button 
                    type="button"
                    onClick={() => setShowPickerFor(showPickerFor === idx ? null : idx)}
                    className="w-full h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-xl hover:bg-gray-50 focus:ring-2 focus:ring-[#144A32] transition"
                  >
                    {point.icon || "..."}
                  </button>
                  
                  {showPickerFor === idx && (
                    <div className="absolute top-16 left-0 z-50">
                      <div className="fixed inset-0" onClick={() => setShowPickerFor(null)}></div>
                      <div className="relative shadow-2xl rounded-xl overflow-hidden bg-white">
                        <EmojiPicker 
                          onEmojiClick={(emojiData) => {
                            updatePoint(idx, "icon", emojiData.emoji);
                            setShowPickerFor(null);
                          }}
                          width={280}
                          height={400}
                          searchDisabled
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Judul Poin</label>
                    <input 
                      type="text" 
                      value={point.title}
                      onChange={e => updatePoint(idx, "title", e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg font-bold text-[#144A32] focus:ring-2 focus:ring-[#144A32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Keterangan Pendek</label>
                    <input 
                      type="text" 
                      value={point.description}
                      onChange={e => updatePoint(idx, "description", e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#144A32]"
                    />
                  </div>
                </div>

                <div className="sm:pt-5 self-end sm:self-auto">
                  <button 
                    type="button"
                    onClick={() => removePoint(idx)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Hapus Poin Ini"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            
            {points.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                Belum ada poin informasi. Silakan tambah baru.
              </div>
            )}
          </div>
        </div>

        {/* Sticky Submit Button */}
        <div className="fixed bottom-0 left-0 sm:left-[280px] right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40 flex justify-end px-6 lg:px-8">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#1B4332] text-white px-8 py-3 rounded-xl hover:bg-[#2D6A4F] transition font-bold shadow-lg shadow-[#1B4332]/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center text-center transform transition-all scale-100 opacity-100">
            <div className="w-16 h-16 bg-[#EAF5EF] rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#144A32]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil Tersimpan!</h3>
            <p className="text-gray-500 mb-6">Pengaturan Tentang Kami telah berhasil diperbarui.</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#1B4332] text-white px-4 py-3 rounded-xl hover:bg-[#2D6A4F] font-bold transition-colors"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
