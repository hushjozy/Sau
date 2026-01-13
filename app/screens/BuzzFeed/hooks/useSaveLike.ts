// File: @/services/hooks/useSaveLike.ts

import { saveLike, unlike, getLikes } from "@/services/api/buzzServices";
import { LikeDto } from "@/services/models/likeDto";
import { SaveLikeVm } from "@/services/models/requests/saveLikeVm";
import { useState } from "react";

interface UseSaveLikeResult {
  toggleLike: (payload: SaveLikeVm, currentLikeId?: number) => Promise<LikeDto | null>;
  fetchLikes: (reference: string) => Promise<LikeDto[]>;
  loading: boolean;
  error: string | null;
}

export const useSaveLike = (): UseSaveLikeResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = async (
    payload: SaveLikeVm,
    currentLikeId?: number
  ): Promise<LikeDto | null> => {
    setLoading(true);
    setError(null);

    try {
      // If already liked, unlike it
      if (currentLikeId) {
        console.log("Unliking post:", currentLikeId);
        await unlike(currentLikeId, payload.isOnPost);
        return null; // Return null to indicate unlike
      }

      // Otherwise, like it
      console.log("Liking post:", payload);
      const like = await saveLike(payload);
      return like;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to toggle like";
      setError(errorMessage);
      console.error("useSaveLike Error:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async (reference: string): Promise<LikeDto[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getLikes(reference);
      if (response?.data?.requestSuccessful) {
        return response.data.responseData || [];
      }
      return [];
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch likes";
      setError(errorMessage);
      console.error("fetchLikes Error:", errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { toggleLike, fetchLikes, loading, error };
};