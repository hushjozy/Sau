import { View, Text, FlatList, StyleSheet, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "./components/tabs";
import { CreatePostBox } from "./components/createPostBox";
import { PostCard } from "./components/postCard";
import { useBuzzFeed } from "./hooks/useBuzzFeed";
import SideDrawer from "../../../components/SideDrawer";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

export default function BuzzFeedScreen() {
  const {
    posts,
    tabs,
    activeTab,
    setActiveTab,
    loadMore,
    loading,
    refetch,
  } = useBuzzFeed();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

   // Called after creating a new post
  const handlePostCreated = useCallback(async () => {
    await refetch();
  }, [refetch]);
  
  return (
    <SafeAreaView style={styles.container}>
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setIsDrawerOpen(true)}
          style={styles.menuButton}
          android_ripple={{ color: "#f3f4f6" }}
        >
          <Ionicons name="menu-outline" size={22} color="#374151" />
        </Pressable>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Buzz Feed</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<CreatePostBox onPostCreated={handlePostCreated} />}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <Text style={styles.loading}>Loading...</Text> : null
        }
         refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === "Corporate Buzz" && "No global posts yet"}
                {activeTab === "Team Buzz" && "No team posts yet"}
                {activeTab === "My Buzz" && "You haven't posted anything yet"}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  /* HEADER */
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 8,
  },
  headerTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerRightSpacer: {
    width: 40,
  },

  loading: {
    textAlign: "center",
    padding: 16,
    color: "#777",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#2563EB",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#2563EB",
    fontWeight: "600",
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
  },
});