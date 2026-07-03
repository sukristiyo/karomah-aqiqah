"use client";

import React, { useEffect, useState } from "react";
import { getSettings, saveSetting } from "../actions";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const showNotification = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const heroSettings = {
      hero_badge: settings.hero_badge,
      hero_title: settings.hero_title,
      hero_sub: settings.hero_sub,
      hero_lokasi: settings.hero_lokasi,
    };
    for (const key in heroSettings) {
      if (heroSettings[key as keyof typeof heroSettings] !== undefined) {
        await saveSetting(key, heroSettings[key as keyof typeof heroSettings]);
      }
    }
    setSaving(false);
    showNotification("Perubahan Hero berhasil disimpan!");
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    const generalSettings = {
      topbar_text: settings.topbar_text,
      whatsapp_number: settings.whatsapp_number,
      company_address: settings.company_address,
      facebook: settings.facebook,
      instagram: settings.instagram,
    };
    for (const key in generalSettings) {
      if (generalSettings[key as keyof typeof generalSettings] !== undefined) {
        await saveSetting(key, generalSettings[key as keyof typeof generalSettings]);
      }
    }
    setSavingGeneral(false);
    showNotification("Pengaturan Umum berhasil disimpan!");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setSavingPassword(true);
    await saveSetting("admin_password", newPassword);
    setNewPassword("");
    setSavingPassword(false);
    showNotification("Password berhasil diubah!");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="font-sans max-w-3xl relative">
      {/* Toast Notification */}
      <div 
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-100 shadow-[0_10px_40px_-10px_rgba(34,197,94,0.3)] px-6 py-4 rounded-2xl transform transition-all duration-300 ${
          toast.show ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="font-semibold text-gray-800">{toast.message}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pengaturan Halaman Depan</h2>
        <p className="text-gray-500 text-sm mt-1">Ubah teks yang muncul pada bagian paling atas (Hero Section) website Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Edit Teks Hero Section</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Badge (Label Atas)</label>
            <input
              type="text"
              name="hero_badge"
              value={settings.hero_badge || "👶 Aqiqah Amanah & Berkah"}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
            />
            <p className="text-xs text-gray-400 mt-1.5">Teks kecil yang muncul di atas judul utama.</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Utama</label>
            <input
              type="text"
              name="hero_title"
              value={settings.hero_title || "Aqiqah Terpercaya untuk Momen Paling Bahagia Buah Hati Anda"}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800 font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sub-Judul (Deskripsi)</label>
            <textarea
              name="hero_sub"
              rows={3}
              value={settings.hero_sub || "Kambing dari peternakan sendiri, sembelih sesuai syariat, masak profesional — semua beres, Anda tinggal menikmati momen bahagia."}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800 resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lokasi</label>
            <input
              type="text"
              name="hero_lokasi"
              value={settings.hero_lokasi || "📍 Jl. Soekarno Hatta / Arengka I · Pekanbaru"}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#1B4332] to-[#25D366] text-white px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Save className="w-5 h-5" />
              {saving ? "Menyimpan Data..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mt-8">
        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Pengaturan Umum & Kontak</h3>
        </div>
        
        <form onSubmit={handleGeneralSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teks Topbar (Paling Atas)</label>
            <input
              type="text"
              name="topbar_text"
              value={settings.topbar_text || "🌙 Aqiqah Syar'i · Praktis · Lezat · Free Ongkir se-Pekanbaru · Juru Sembelih Bersertifikat JULEHA"}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor WhatsApp Admin</label>
            <input
              type="text"
              name="whatsapp_number"
              value={settings.whatsapp_number || "628175777008"}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
              placeholder="Contoh: 628175777008 (Gunakan 62, tanpa + atau 0)"
            />
            <p className="text-xs text-gray-400 mt-1.5">Nomor ini akan digunakan untuk semua tombol pesan, hubungi admin, dll.</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat Lengkap</label>
            <textarea
              name="company_address"
              rows={3}
              value={settings.company_address || "Jl. Soekarno Hatta / Arengka I\nSamping Indogrosir\nPekanbaru"}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800 resize-none"
              placeholder="Masukkan alamat lengkap usaha..."
            />
            <p className="text-xs text-gray-400 mt-1.5">Akan ditampilkan di bagian bawah website (Footer).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Facebook</label>
              <input
                type="text"
                name="facebook"
                value={settings.facebook || "https://facebook.com/karomahaqiqah"}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
                placeholder="Contoh: https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Instagram</label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram || "https://instagram.com/karomahaqiqah"}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
                placeholder="Contoh: https://instagram.com/..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingGeneral}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#1B4332] to-[#25D366] text-white px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Save className="w-5 h-5" />
              {savingGeneral ? "Menyimpan Data..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mt-8 mb-12">
        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-gray-800">Ubah Password Admin</h3>
        </div>
        
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
            <input
              type="password"
              name="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
              placeholder="Masukkan password baru..."
              required
            />
            <p className="text-xs text-gray-400 mt-1.5">Gunakan password ini untuk login ke panel admin berikutnya.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword || !newPassword}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-800 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:bg-gray-900 transition-all duration-200 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {savingPassword ? "Menyimpan..." : "Ubah Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
