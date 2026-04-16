import { supabase } from "@/utils/supabase";

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Subir la imagen al bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    // Obtener URL de acceso público
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Actualizar el metadata del usuario para guardar el avatar_url globalmente
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    });

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error("Error al subir el avatar:", error);
    throw error;
  }
};
