import { sb } from '../lib/supabase';
import { STORAGE_BUCKET, MAX_IMAGE_SIZE } from '../config/constants';

export const storageService = {
  async uploadProductImage(file) {
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('حجم الصورة كبير (الحد الأقصى 5MB)');
    }
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadErr } = await sb.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, { upsert: false });
    if (uploadErr) throw uploadErr;
    const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  },
};
