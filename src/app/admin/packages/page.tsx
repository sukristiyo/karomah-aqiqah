"use client";

import React, { useEffect, useState, useRef } from "react";
import { getPackages, createPackage, updatePackage, deletePackage, getPackageTypes } from "../../actions";
import { uploadMedia, getMediaFiles } from "../../actions/media";
import { Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import ImageCropperModal from "@/components/ImageCropperModal";

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Cropper state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: "", 
    isFeatured: false,
    iconType: "masak",
    packageTypeId: "",
    imageUrl: "",
    imagePosition: "center"
  });

  const [packageTypes, setPackageTypes] = useState<any[]>([]);

  const fetchPackages = async () => {
    setLoading(true);
    const data = await getPackages();
    setPackages(data);
    setLoading(false);
  };

  const fetchPackageTypes = async () => {
    const data = await getPackageTypes();
    setPackageTypes(data);
  };

  const fetchMedia = async () => {
    const data = await getMediaFiles();
    setMediaFiles(data);
  };

  useEffect(() => {
    fetchPackages();
    fetchMedia();
    fetchPackageTypes();
  }, []);

  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price || "",
      features: pkg.features.join("\n"),
      isFeatured: pkg.isFeatured,
      iconType: pkg.iconType || "masak",
      packageTypeId: pkg.packageTypeId || "",
      imageUrl: pkg.imageUrl || "",
      imagePosition: pkg.imagePosition || "center"
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus paket ini?")) {
      await deletePackage(id);
      fetchPackages();
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", features: "", isFeatured: false, iconType: "masak", packageTypeId: "", imageUrl: "", imagePosition: "center" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      features: formData.features.split("\n").filter(f => f.trim() !== "")
    };

    if (editingId) {
      await updatePackage(editingId, dataToSave);
    } else {
      await createPackage(dataToSave);
    }
    handleReset();
    fetchPackages();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setCropImageSrc(reader.result?.toString() || null);
    });
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File) => {
    setCropImageSrc(null); // Close cropper modal
    setUploading(true);
    
    const uploadData = new FormData();
    uploadData.append("file", croppedFile);
    
    const result = await uploadMedia(uploadData);
    setUploading(false);

    if (result.success && result.url) {
      setFormData({ ...formData, imageUrl: result.url });
      fetchMedia(); // refresh library
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="font-sans space-y-6 relative">
      {cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="font-semibold text-lg text-gray-800 border-b border-gray-100 pb-3">{editingId ? "Edit Paket" : "Tambah Paket Baru"}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Nama Paket</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Harga (Opsional)</label>
            <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Deskripsi Singkat</label>
            <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Tipe Paket (Ikon)</label>
            <select required value={formData.packageTypeId || ""} onChange={e => setFormData({...formData, packageTypeId: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white">
              <option value="" disabled>Pilih Tipe Paket</option>
              {packageTypes.map(pt => (
                <option key={pt.id} value={pt.id}>{pt.icon} {pt.name}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="block text-sm mb-2 font-medium text-gray-700">Gambar / Foto Paket (Opsional)</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {formData.imageUrl ? (
                <div className="relative group w-32 aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" style={{ objectPosition: formData.imagePosition }} />
                  <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">Hapus</button>
                </div>
              ) : (
                <div className="w-24 aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center text-gray-400 shrink-0">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">1:1 Ratio</span>
                </div>
              )}
              
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50">
                    <Upload className="w-4 h-4" /> {uploading ? "Mengupload..." : "Upload & Potong Foto"}
                  </button>
                  <button type="button" onClick={() => setShowMediaModal(true)} className="bg-white border border-[#144A32] text-[#144A32] px-3 py-1.5 rounded-md text-sm hover:bg-[#EAF5EF] font-medium flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" /> Pilih dari Media
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Posisi Fokus Gambar (Opsional)</label>
                  <select value={formData.imagePosition} onChange={e => setFormData({...formData, imagePosition: e.target.value})} className="w-full sm:w-1/2 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white">
                    <option value="center">Tengah (Center)</option>
                    <option value="top">Atas (Top)</option>
                    <option value="bottom">Bawah (Bottom)</option>
                    <option value="left">Kiri (Left)</option>
                    <option value="right">Kanan (Right)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">Fitur (1 per baris)</label>
          <textarea rows={4} value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" placeholder="Gulai / Sop&#10;Sate 150 Tusuk&#10;Gratis Ongkir" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 text-[#144A32] rounded border-gray-300" />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Jadikan Unggulan (Paling Disorot)</label>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-[#144A32] text-white px-6 py-2 rounded-md hover:bg-[#2D6A4F] transition font-medium shadow-sm">Simpan Paket</button>
          {editingId && <button type="button" onClick={handleReset} className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition">Batal</button>}
        </div>
      </form>

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

      {loading ? (
        <div className="flex justify-center p-8 text-gray-500">Loading data...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Paket</th>
                  <th className="px-4 py-3 font-semibold">Harga</th>
                  <th className="px-4 py-3 font-semibold text-center">Fitur</th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {packages.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        {pkg.imageUrl ? (
                          <img src={pkg.imageUrl} alt={pkg.name} className="rounded-lg object-cover bg-gray-100 shrink-0 shadow-sm" style={{ width: '48px', height: '60px', objectPosition: pkg.imagePosition || "center", minWidth: '48px' }} />
                        ) : (
                          <div className="w-12 aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">📦</div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{pkg.name}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-1">{pkg.description}</div>
                          {pkg.isFeatured && <span className="inline-block mt-2 text-xs font-semibold bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#FDE68A]">🌟 Unggulan</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-gray-700">{pkg.price || "-"}</td>
                    <td className="px-4 py-3 align-top text-center text-gray-600">{pkg.features.length} item</td>
                    <td className="px-4 py-3 align-top text-center">
                      <button onClick={() => handleEdit(pkg)} className="text-[#144A32] font-medium hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(pkg.id)} className="text-red-500 font-medium hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Belum ada paket.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
