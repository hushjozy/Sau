import { View, Text, Pressable, StyleSheet } from "react-native";

export function Tabs({ tabs, activeTab, onChange }: any) {
  return (
    <View style={styles.container}>
      {tabs.map((tab: string) => (
        <Pressable key={tab} onPress={() => onChange(tab)}>
          <View style={styles.tab}>
            <Text style={[
              styles.text,
              activeTab === tab && styles.activeText
            ]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.underline} />}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tab: { alignItems: "center", paddingBottom: 8 },
  text: { color: "#777", fontSize: 16 },
  activeText: { color: "#2563eb", fontWeight: "600" },
  underline: {
    height: 3,
    width: "100%",
    backgroundColor: "#2563eb",
    marginTop: 4,
    borderRadius: 2,
  },
});
