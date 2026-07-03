"use client";

import React, { useState } from "react";
import { loginAdmin } from "../actions/auth";
import { useRouter } from "next/navigation";
import { Lock, Mail, KeyRound, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await loginAdmin(null, formData);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-[#25D366]/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-t from-[#1B4332]/5 to-transparent blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden z-10">
        <div className="pt-10 pb-6 px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1B4332] to-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Selamat Datang</h1>
          <p className="text-gray-500 text-sm mt-2">Masuk ke dashboard panel admin Karomah Aqiqah.</p>
        </div>

        <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-start gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 block">Email Admin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@karomah.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 block">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-800"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1B4332] to-[#25D366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
