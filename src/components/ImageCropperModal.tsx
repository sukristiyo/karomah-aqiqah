import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropperModal({ imageSrc, onCropComplete, onCancel }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, "cropped-image.jpg");
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
      alert("Gagal memotong gambar.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .reactEasyCrop_Container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; user-select: none; touch-action: none; cursor: move; }
        .reactEasyCrop_Image, .reactEasyCrop_Video { max-width: 100%; max-height: 100%; margin: auto; position: absolute; top: 0; bottom: 0; left: 0; right: 0; will-change: transform; }
        .reactEasyCrop_Contain { max-width: 100%; max-height: 100%; margin: auto; position: absolute; top: 0; bottom: 0; left: 0; right: 0; }
        .reactEasyCrop_Cover { width: 100%; height: 100%; object-fit: cover; }
        .reactEasyCrop_CropArea { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 1px solid rgba(255, 255, 255, 0.8); box-sizing: border-box; box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.6); overflow: hidden; }
      `}} />
      
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
      
      <div style={{ backgroundColor: '#fff', padding: '16px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', zIndex: 100000, borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px', minWidth: '200px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1B4332' }}>Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#1B4332' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', flex: '1 1 auto', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{ padding: '10px 18px', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#4b5563', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1, maxWidth: '120px' }}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            style={{ padding: '10px 18px', backgroundColor: '#1B4332', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', flex: 1, maxWidth: '180px', opacity: isProcessing ? 0.7 : 1 }}
          >
            {isProcessing ? "Memproses..." : "Potong & Simpan"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
