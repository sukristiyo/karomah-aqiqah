"use client";

import React, { useEffect, useState, useRef } from "react";
import { getMediaFiles, uploadMedia, deleteMedia } from "../../actions/media";
import { Upload, Trash2, Image as ImageIcon, CheckSquare, Square, Check, X } from "lucide-react";
import ImageCropperModal from "@/components/ImageCropperModal";

export default function AdminMedia() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Selection state
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    const data = await getMediaFiles();
    setFiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const formData = new FormData();
    formData.append("file", croppedFile);

    const result = await uploadMedia(formData);
    setUploading(false);

    if (result.success) {
      fetchFiles();
    } else {
      alert(result.message);
    }
  };

  const handleDeleteSingle = async (fileUrl: string) => {
    if (confirm("Yakin ingin menghapus gambar ini? Gambar mungkin sedang digunakan.")) {
      setIsDeleting(true);
      const result = await deleteMedia(fileUrl);
      if (result.success) {
        setSelectedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileUrl);
          return newSet;
        });
        await fetchFiles();
      } else {
        alert(result.message);
      }
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (confirm(`Yakin ingin menghapus ${selectedFiles.size} gambar sekaligus?`)) {
      setIsDeleting(true);
      
      const urlsToDelete = Array.from(selectedFiles);
      for (const url of urlsToDelete) {
        await deleteMedia(url);
      }
      
      setSelectedFiles(new Set());
      await fetchFiles();
      setIsDeleting(false);
    }
  };

  const toggleSelection = (url: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedFiles(new Set(files));
  };

  const deselectAll = () => {
    setSelectedFiles(new Set());
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

      {/* Header & Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Media Library</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola semua gambar yang diunggah ke website Anda.</p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <button 
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#144A32] text-white px-6 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Mengupload..." : "Upload Gambar Baru"}
        </button>
      </div>

      {/* Bulk Actions Bar */}
      {files.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {selectedFiles.size === files.length ? (
              <button onClick={deselectAll} className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 bg-white border border-gray-300 px-4 py-2 rounded-lg transition-colors">
                <CheckSquare className="w-5 h-5 text-[#144A32]" />
                Batalkan Pilihan Semua
              </button>
            ) : (
              <button onClick={selectAll} className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 bg-white border border-gray-300 px-4 py-2 rounded-lg transition-colors">
                <Square className="w-5 h-5 text-gray-400" />
                Pilih Semua
              </button>
            )}
            
            <span className="text-sm font-bold text-[#144A32] bg-[#EAF5EF] px-3 py-1 rounded-full">
              {selectedFiles.size} gambar terpilih
            </span>
          </div>

          {selectedFiles.size > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition font-medium shadow-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Menghapus..." : "Hapus Terpilih"}
            </button>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-500">Memuat gambar...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-bold text-gray-700">Belum ada gambar</p>
            <p className="text-sm mt-1">Upload gambar pertama Anda untuk melihatnya di sini.</p>
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
              gap: '1rem' 
            }}
          >
            {files.map((url, idx) => {
              const isSelected = selectedFiles.has(url);
              
              return (
                <div 
                  key={idx} 
                  onClick={() => toggleSelection(url)}
                  className={`group relative rounded-xl border-2 overflow-hidden aspect-square cursor-pointer transition-all duration-200 ${
                    isSelected ? 'border-[#144A32] shadow-md transform scale-[0.98]' : 'border-gray-200 hover:border-[#144A32]/50'
                  }`}
                >
                  <img 
                    src={url} 
                    alt="Media file" 
                    className="w-full h-full object-cover bg-gray-50" 
                  />
                  
                  {/* Selection Checkmark */}
                  <div className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#144A32] border-[#144A32] text-white' : 'bg-white/80 border-gray-400 text-transparent group-hover:border-gray-600'
                  }`}>
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>

                  {/* Permanent Actions Overlay (only if not selected) */}
                  {!isSelected && (
                    <>
                      {/* Top: Filename (Gradient) */}
                      <div className="absolute top-0 inset-x-0 bg-black/50 pt-1.5 pb-1.5 px-2 pointer-events-none">
                        <p className="text-white text-[10px] font-mono truncate text-center drop-shadow-sm" title={url.split('/').pop()}>
                          {url.split('/').pop()}
                        </p>
                      </div>
                      
                      {/* Bottom: Actions */}
                      <div className="absolute bottom-0 inset-x-0 flex w-full" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            alert("URL disalin ke clipboard!");
                          }}
                          className="flex-1 h-8 bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 flex justify-center items-center border-t border-r border-gray-200"
                        >
                          Salin
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteSingle(url)}
                          className="w-10 h-8 shrink-0 bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
