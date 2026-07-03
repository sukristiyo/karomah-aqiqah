"use client";

import React, { useState, useEffect } from "react";
import { getPackageTypes, createPackageType, updatePackageType, deletePackageType } from "@/app/actions";
import { PackageType } from "@prisma/client";

const EMOJI_OPTIONS = [
  "🍲", "🍱", "⭐", "👑", "🍽️", "📦", "🎁", "🎉", 
  "🍖", "🥩", "🐑", "🐐", "🐄", "🔥", "💎", "✨", 
  "💯", "✅", "💰", "🏆", "🌟", "👨‍🍳", "🥘", "🍚"
];

export default function PackageTypesPage() {
  const [types, setTypes] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    icon: EMOJI_OPTIONS[0]
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  async function fetchTypes() {
    setLoading(true);
    const data = await getPackageTypes();
    setTypes(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    if (isEditing) {
      await updatePackageType(currentId, formData);
    } else {
      await createPackageType(formData);
    }
    
    // Reset form
    setFormData({ name: "", icon: EMOJI_OPTIONS[0] });
    setIsEditing(false);
    setCurrentId("");
    
    await fetchTypes();
  }

  function handleEdit(type: PackageType) {
    setFormData({
      name: type.name,
      icon: type.icon
    });
    setCurrentId(type.id);
    setIsEditing(true);
  }

  async function handleDelete(id: string) {
    if (confirm("Apakah Anda yakin ingin menghapus tipe paket ini?")) {
      setLoading(true);
      await deletePackageType(id);
      await fetchTypes();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kelola Tipe Paket</h1>
        <p className="text-gray-500 mt-2">Tambah, edit, atau hapus tipe paket dan sesuaikan ikonnya.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">
          {isEditing ? "Edit Tipe Paket" : "Tambah Tipe Paket Baru"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700">Nama Tipe Paket</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#144A32] focus:border-[#144A32] transition-colors"
                placeholder="Contoh: Paket Sultan"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700">Pilih Ikon Emoji</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({...formData, icon: emoji})}
                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all ${
                      formData.icon === emoji 
                        ? "bg-[#144A32] text-white shadow-md scale-110" 
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Pilih salah satu ikon di atas yang paling sesuai untuk tipe paket ini.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {isEditing && (
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: "", icon: "" });
                }}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-[#144A32] text-white rounded-xl font-medium hover:bg-[#0f3624] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isEditing ? "Simpan Perubahan" : "Tambah Tipe"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Daftar Tipe Paket</h2>
        </div>
        
        {loading && types.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Memuat data...</div>
        ) : types.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📦</div>
            Belum ada tipe paket. Silakan tambahkan di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Ikon</th>
                  <th className="px-6 py-4 font-semibold">Nama Tipe</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => (
                  <tr key={type.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-[#EAF5EF] text-[#2D6A4F] flex items-center justify-center text-xl shadow-sm">
                        {type.icon}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{type.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(type)}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(type.id)}
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
    </div>
  );
}
