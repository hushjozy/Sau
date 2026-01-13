import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { router } from "expo-router";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import Container from "@/components/ui/Container";
import { login } from "@/services/api/users";
import { useMutation } from "@tanstack/react-query";

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
});

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const { top } = useSafeAreaInsets();

  const loginMutation = useMutation({
    mutationFn: (email: string) => login(email),

    onSuccess: (res, email) => {
      if (res?.data?.requestSuccessful) {
        router.push({
          pathname: "/auth/otp",
          params: { email },
        });
      } else {
        // handle failed login
      }
    },

    onError: (error: any) => {
      const errorMessage = error?.error?.errors?.[0];
      // handle error toast
    },
  });

  const onSubmit = () => {
    // Prevent empty or invalid email submission
    const result = validationSchema.safeParse({ email });
    if (!result.success) return;

    loginMutation.mutate(email);
  };

  return (
    <Container style={{ gap: 25, paddingTop: top + 100 }}>
      <View style={{ gap: 15 }}>
        <Typography style={{ fontFamily: "Bold", fontSize: 30 }}>
          Welcome back!
        </Typography>

        <Typography style={{ fontFamily: "Light", fontSize: 16 }}>
          Let’s sign you in.
        </Typography>
      </View>

      <TextField
        label="EMAIL"
        onChangeText={setEmail}
        placeholder="Enter your email address"
        placeholderTextColor="#8391A1"
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Button
        label="NEXT"
        onPress={onSubmit}
        loading={loginMutation.isPending}
        disabled={loginMutation.isPending}
      />
    </Container>
  );
}

const styles = StyleSheet.create({});
