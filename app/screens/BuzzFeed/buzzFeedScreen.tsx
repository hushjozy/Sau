import { View, Text, FlatList, StyleSheet } from "react-native";
import { Tabs } from "./components/tabs";
import { CreatePostBox } from "./components/createPostBox";
import { PostCard } from "./components/postCard";
import { useBuzzFeed } from "./hooks/useBuzzFeed";

export default function BuzzFeedScreen() {
  const {
    posts,
    tabs,
    activeTab,
    setActiveTab,
    loadMore,
    loading,
  } = useBuzzFeed();

  return (
    <View style={styles.container}>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<CreatePostBox />}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <Text style={styles.loading}>Loading...</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  loading: {
    textAlign: "center",
    padding: 16,
    color: "#777",
  },
});
