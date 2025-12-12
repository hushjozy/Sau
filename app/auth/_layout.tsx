import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    // <Stack
    //   screenOptions={{
    //     headerShown: false,
    //   }}
    // />
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="otp" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
