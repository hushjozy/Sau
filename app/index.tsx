import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/provider/UserProvider";
import { useEffect, useState } from "react";
import { getItem } from "@/lib/storage";

export default function Onboarding() {
  const router = useRouter();
  const { authenticate, user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Check if user data and token exist in storage
        const storedUser = await getItem("user", "object");
        const storedToken = await getItem("accessToken", "string");

        console.log("🔍 Checking stored credentials:", {
          hasUser: !!storedUser,
          hasToken: !!storedToken,
        });

        if (storedUser && storedToken) {
          console.log("✅ Found stored credentials, authenticating...");
          
          // Authenticate and wait for it to complete
          await authenticate();
          
          if (isMounted) {
            console.log("🚀 Navigating to BuzzFeed");
            router.replace("/screens/BuzzFeed/buzzFeedScreen");
          }
        } else {
          console.log("❌ No stored credentials found");
          if (isMounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("❌ Error during auth initialization:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Run only once on mount

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stars Among Us</Text>
      <Text style={styles.subtitle}>
        Discover rewards, vouchers, and exclusive perks—right at your
        fingertips.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/auth/login")}
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
    backgroundColor: "#0E0F1A",
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