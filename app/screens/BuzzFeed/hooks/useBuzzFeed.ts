import { useEffect, useState, useCallback, useMemo } from "react";
import { getPosts } from "@/services/api/buzzServices";
import { PostDto } from "@/services/models/postDto";
import { useUser } from "@/provider/UserProvider";

export function useBuzzFeed() {
  const { user } = useUser();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [activeTab, setActiveTab] = useState("Corporate Buzz");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 20;
  const tabs = ["Corporate Buzz", "Team Buzz", "My Buzz"];

  // Get user info for filtering
  const userEmail = user?.email;
  const userFunction = user?.functionName || user?.functionName;

  useEffect(() => {
    resetAndFetch();
  }, [activeTab]);

  const fetchPosts = useCallback(async (pageNumber: number, replace = false) => {
    if (loading || (!replace && !hasMore)) return;

    setLoading(true);

    try {
      // Fetch all posts without filtering (let client filter)
      const res = await getPosts(
        "", // Empty search to get all posts
        pageNumber,
        pageSize
      );

      setPosts((prev) =>
        replace ? res.responseData : [...prev, ...res.responseData]
      );

      setHasMore(pageNumber < res?.data?.totalCount / pageSize);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, pageSize]);

  const resetAndFetch = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    await fetchPosts(1, true);
  }, [fetchPosts]);

  /* 🔹 Filter posts based on active tab (like web version) */
  const filteredPosts = useMemo(() => {
    if (activeTab === "Corporate Buzz") {
      const filtered = posts.filter(p => p.viewType === "Global");
      return filtered;
    }

    if (activeTab === "Team Buzz") {
      const filtered = posts.filter(
        p => p.senderFunction === userFunction && p.viewType !== "Individual"
      );
      return filtered;
    }

    if (activeTab === "My Buzz") {
      const filtered = posts.filter(p => p.createdBy === userEmail);
      return filtered;
    }

    return posts;
  }, [posts, activeTab, userEmail, userFunction]);

  /* 🔹 Pagination (FlatList onEndReached) */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  }, [loading, hasMore, page, fetchPosts]);

  /* 🔹 Refetch function - SILENT refresh without clearing posts */
  const refetch = useCallback(async () => {
    if (loading) return;
    
    
    setLoading(true);
    try {
      const res = await getPosts(
        "",
        1,
        page * pageSize // Get all currently loaded posts
      );

      // Update posts without blanking the screen
      setPosts(res.responseData);
    } catch (error) {
      console.error("❌ Failed to refresh posts", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  /* 🔹 Update single post's comment count */
  const updatePostCommentCount = useCallback((postReference: string, increment: number = 1) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.reference === postReference
          ? { ...post, commentCount: (post.commentCount || 0) + increment }
          : post
      )
    );
  }, []);

  return {
    posts: filteredPosts, // Return filtered posts instead of all posts
    allPosts: posts, // Keep all posts available if needed
    tabs,
    activeTab,
    setActiveTab,
    loadMore,
    loading,
    refetch,
    updatePostCommentCount,
  };
}