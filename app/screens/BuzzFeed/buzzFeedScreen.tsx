import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "./components/tabs";
import { CreatePostBox } from "./components/createPostBox";
import { PostCard } from "./components/postCard";
import { useBuzzFeed } from "./hooks/useBuzzFeed";
import SideDrawer from "../../../components/SideDrawer";
import React, { useState } from "react";

export default function BuzzFeedScreen() {
  const {
    posts,
    tabs,
    activeTab,
    setActiveTab,
    loadMore,
    loading,
  } = useBuzzFeed();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

      {/* Tabs and Content */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<CreatePostBox />}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <Text style={styles.loading}>Loading...</Text> : null
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
});