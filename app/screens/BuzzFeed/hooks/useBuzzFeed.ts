import { useState } from "react";
import { dummyPosts } from "../data/dummyPosts";

export function useBuzzFeed() {
  const [posts, setPosts] = useState(dummyPosts);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);

  const tabs = ["All", "Posts", "Recognitions"];

  const loadMore = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      setPosts((prev) => [...prev, ...dummyPosts]);
      setLoading(false);
    }, 1000);
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
