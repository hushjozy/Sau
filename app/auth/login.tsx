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
import { useMutation, useQuery } from "@tanstack/react-query";

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Must be a valid email"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState(false);

  const { top } = useSafeAreaInsets();
  // const { showToastModal } = useToast();
  const {
    data: loggedIn,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["login", email, submit],
    queryFn: () => login({ email }),
  });

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });

  const loginMutation = useMutation({
    mutationFn: (email: string) => login({ email }),

    onSuccess: (res, email) => {
      if (res?.data?.data?.responseData) {
        console.log(res);

        router.push({
          pathname: "/auth/otp",
          params: { email },
        });
      } else {
        // showToastModal({
        //   title: "Failed to login",
        //   type: "error",
        //   duration: 5000,
        // });
      }
    },

    onError: (error: any) => {
      const errorMessage = error?.error?.errors?.[0];
      // showToastModal({
      //   title: errorMessage ?? "Failed to login",
      //   type: "error",
      //   duration: 5000,
      // });
    },
  });

  const onSubmit = () => {
    loginMutation.mutate(email);
  };

  return (
    <Container style={{ gap: 25, paddingTop: top + 100 }}>
      <View style={{ gap: 15 }}>
        <Typography
          style={{ fontFamily: "Bold", fontSize: 30 }}
          interpolation={{ name: "email" }}
        >
          {"Welcome back !"}
        </Typography>
        <Typography style={{ fontFamily: "Light", fontSize: 16 }}>
          {"Let’s sign you in."}
        </Typography>
      </View>
      {/* <Controller
        // control={control}
        render={({ field: { onChange, onBlur, value } }) => ( */}
      <TextField
        label="EMAIL"
        onChangeText={(v: string) => setEmail(v)}
        placeholder="Enter your email address"
        placeholderTextColor="#8391A1"
        value={email}
        // onBlur={onBlur}
        // error={!!errors.email?.message}
        // errorMessage={errors.email?.message}
        className="w-full"
      />
      {/* )}
        name="email" */}
      {/* /> */}
      <Button
        label={"NEXT"}
        onPress={onSubmit}
        loading={isLoading}
        disabled={isLoading}
      />
    </Container>
  );
}

const styles = StyleSheet.create({});
