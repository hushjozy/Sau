import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="BuzzFeed/buzzFeedScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BuzzFeed/[reference]"
        options={{
          title : "Post Details",
        }}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
