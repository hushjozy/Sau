import { saveComment } from "@/services/api/buzzServices";
import { CommentDto } from "@/services/models/commentDto";
import { SaveCommentVm } from "@/services/models/requests/saveCommentVm";
import { useState } from "react";

interface UseSaveCommentResult {
  save: (payload: SaveCommentVm) => Promise<CommentDto>;
  loading: boolean;
  error: string | null;
}

export const useSaveComment = (): UseSaveCommentResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (payload: SaveCommentVm): Promise<CommentDto> => {
    setLoading(true);
    setError(null);

    try {
      // Pass payload directly to the API, matching web app behavior
      const comment = await saveComment(payload);


      return comment;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to save comment";
      setError(errorMessage);
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { save, loading, error };
};