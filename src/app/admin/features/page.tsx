"use client";

import React, { useEffect, useState } from "react";
import { getFeatures, createFeature, updateFeature, deleteFeature } from "../../actions";

export default function AdminFeatures() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    order: 0
  });

  const fetchFeatures = async () => {
    setLoading(true);
    const data = await getFeatures();
    setFeatures(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleEdit = (ft: any) => {
    setEditingId(ft.id);
    setFormData({
      title: ft.title,
      description: ft.description,
      icon: ft.icon,
      order: ft.order
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus fitur ini?")) {
      await deleteFeature(id);
      fetchFeatures();
    }
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", icon: "", order: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateFeature(editingId, { ...formData, order: Number(formData.order) });
    } else {
      await createFeature({ ...formData, order: Number(formData.order) });
    }
    handleReset();
    fetchFeatures();
  };

  return (
    <div className="font-sans space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
        <h3 className="font-semibold text-lg text-gray-800 border-b border-gray-100 pb-3">{editingId ? "Edit Alasan" : "Tambah Alasan Baru"}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Judul Fitur</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Emoji / Ikon</label>
            <input required type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" placeholder="Contoh: 🐐" />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Urutan (Angka)</label>
            <input required type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">Deskripsi</label>
          <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#144A32] bg-white" />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-[#144A32] text-white px-6 py-2 rounded-md hover:bg-[#2D6A4F] transition font-medium shadow-sm">Simpan Fitur</button>
          {editingId && <button type="button" onClick={handleReset} className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition">Batal</button>}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center p-8 text-gray-500">Loading data...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center w-20">Urutan</th>
                  <th className="px-4 py-3 font-semibold text-center w-20">Ikon</th>
                  <th className="px-4 py-3 font-semibold">Judul & Deskripsi</th>
                  <th className="px-4 py-3 font-semibold text-center w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {features.map(ft => (
                  <tr key={ft.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3 align-top text-center font-medium text-gray-600">{ft.order}</td>
                    <td className="px-4 py-3 align-top text-center text-2xl">{ft.icon}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-gray-900">{ft.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{ft.description}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-center">
                      <button onClick={() => handleEdit(ft)} className="text-[#144A32] font-medium hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(ft.id)} className="text-red-500 font-medium hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))}
                {features.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Belum ada fitur.</td>
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
