
import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, bucketParam: string = 'public'): Promise<string> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Try to upload to the "public" bucket or the specific bucket
        // Ideally, ensure this bucket exists in Supabase Storage policies
        const { data, error } = await supabase.storage
            .from(bucketParam)
            .upload(filePath, file);

        if (error) {
            // If bucket doesn't exist or permission denied
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucketParam)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error: any) {
        console.error("Upload error:", error);
        throw new Error(error.message || "Failed to upload image");
    }
};
