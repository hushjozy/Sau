import { savePost } from "@/services/api/buzzServices";
import { PostDto } from "@/services/models/postDto";
import { useState } from "react";

interface UseSavePostResult {
  save: (formData: FormData) => Promise<PostDto>;
  loading: boolean;
  error: string | null;
}

export const useSavePost = (): UseSavePostResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (formData: FormData): Promise<PostDto> => {
    setLoading(true);
    setError(null);

    try {
      const post = await savePost(formData);
      
      
      return post;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to save post";
      setError(errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { save, loading, error };
};