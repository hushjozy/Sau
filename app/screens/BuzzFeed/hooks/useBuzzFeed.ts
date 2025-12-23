import { useEffect, useState } from "react";
import { getPosts } from "@/services/api/buzzServices";
import { PostDto } from "@/services/models/postDto";

export function useBuzzFeed() {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 20;

  const tabs = ["All", "Posts", "Recognitions"];

   useEffect(() => {
    resetAndFetch();
  }, [activeTab]);

  const resetAndFetch = async () => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    await fetchPosts(1, true);
  };

  const fetchPosts = async (pageNumber: number, replace = false) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await getPosts(
        activeTab === "All" ? "" : activeTab,
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
  };

  /* 🔹 Pagination (FlatList onEndReached) */
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  return {
    posts,
    tabs,
    activeTab,
    setActiveTab,
    loadMore,
    loading,
  };
}
