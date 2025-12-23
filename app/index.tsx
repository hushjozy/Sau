import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stars Among Us</Text>
      <Text style={styles.subtitle}>
        Discover rewards, vouchers, and exclusive perks—right at your
        fingertips.
      </Text>

      <Pressable
        style={styles.button}
        // onPress={() => router.push("/auth/login")}
        onPress={() => router.push("/screens/BuzzFeed/buzzFeedScreen")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E0F1A", // deep night sky feel
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#C8C8D4",
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 26,
  },
  button: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
