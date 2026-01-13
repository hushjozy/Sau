import { useEffect, useState, useCallback } from "react";
import { getComments } from "@/services/api/buzzServices";
import { CommentDto } from "@/services/models/commentDto";

export function usePostComments(reference: string) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!reference) {
      setComments([]);
      return;
    }

    setLoading(true);
    try {
      const res = await getComments(reference);
      if (res?.data?.requestSuccessful) {
        setComments(res?.data?.responseData || []);
      }
    } catch (e) {
      console.log("Failed to load comments", e);
    } finally {
      setLoading(false);
    }
  }, [reference]); // Only depends on reference

  // Fetch comments only once when reference changes
  useEffect(() => {
    fetchComments();
  }, [reference]); // Changed from [fetchComments] to [reference]

  // Expose refetch function that can be called manually
  const refetch = useCallback(() => {
    return fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    refetch,
  };
}