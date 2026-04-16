"use client";

import React, { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { uploadAvatar } from "@/lib/supabase/storage";
import { useAppStore } from "@/store/useAppStore";

interface AvatarUploadProps {
  defaultImage?: string;
}

export default function AvatarUpload({ defaultImage }: AvatarUploadProps) {
  const { user, setUser } = useAppStore();
  
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.avatar_url || defaultImage || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecciona una imagen válida.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // Límite de 2MB
      toast.error("La imagen debe pesar menos de 2MB.");
      return;
    }

    try {
      setIsUploading(true);
      
      // Mostrar feedback visual inmediato con objectURL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Proceder con la subida a Supabase
      const publicUrl = await uploadAvatar(file, user.id);
      
      // Actualizar estado global y limpiar URL temporal
      setUser({ ...user, avatar_url: publicUrl });
      URL.revokeObjectURL(objectUrl);
      toast.success("¡Avatar actualizado con éxito!");
      
    } catch (error) {
      toast.error("Ocurrió un error al subir la imagen.");
      setPreviewUrl(user?.avatar_url || defaultImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group w-32 h-32">
      <div className="w-full h-full rounded-full overflow-hidden glass border-2 border-brand-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center bg-brand-background/40 relative">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <Camera className="w-10 h-10 text-white/50" />
        )}
        
        {/* Overlay Glassmorphism al hacer hover */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
          ) : (
            <span className="text-white text-xs font-semibold flex flex-col items-center gap-1">
              <Camera className="w-6 h-6" />
              Cambiar
            </span>
          )}
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
