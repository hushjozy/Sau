import Button from "@components/ui/Button";
import Container from "@components/ui/Container";
import OtpInput from "@components/ui/OtpInput";
import Typography from "@components/ui/Typography";
import { PRIMARY } from "@constants/colors";
import { saveItem } from "@lib/storage";
import { useTypedTranslation } from "@locales/i18nHelper";
import { useToast } from "@provider/ToastProvider";
import { useUser } from "@provider/UserProvider";
import { RouteProp, useRoute } from "@react-navigation/native";
import { login, validateOtp } from "@services/api/users";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function EnterOTP() {
  const { params } = useRoute<any>();
  const { t } = useTypedTranslation();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  const { bottom } = useSafeAreaInsets();
  const { authenticate } = useUser();
  const { showToastModal } = useToast();

  const { mutate: authenticateMutation, isPending: isAuthenticating } =
    useMutation({ mutationFn: validateOtp });
  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: login,
  });

  const handleVerify = () => {
    authenticateMutation(
      { otp },
      {
        onSuccess: (res) => {
          if (res.data) {
            console.log(res.data, "datares");

            saveItem("accessToken", res.data.accessToken);
            saveItem("refreshToken", res.data.refreshToken);
            authenticate();
          } else {
            showToastModal({
              title: "Invalid OTP code",
              type: "error",
              duration: 5000,
            });
          }
        },
        onError: (error: any) => {
          console.log(error);

          const errorMessage = error?.error?.errors?.[0];
          showToastModal({
            title: errorMessage ?? "Invalid OTP  error",
            type: "error",
            duration: 5000,
          });
        },
      }
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft < 1) {
        clearInterval(interval);
      } else {
        setTimeLeft((time) => time - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60).toString();
  const seconds = Math.floor(timeLeft % 60)
    .toString()
    .padStart(2, "0");

  useEffect(() => {
    if (otp.length === 4) {
      handleVerify();
    }
  }, [otp]);

  return (
    <Container>
      <View style={{ gap: 30 }} className="mt-3">
        <Typography
          style={{ fontSize: 16, fontFamily: "Light" }}
          interpolation={{ email: "joseph.osho.ext@lafarge.com" }}
        >
          {`Enter the verification code we just sent to the email address ${params?.email}`}
        </Typography>
        <OtpInput length={4} onOtpChange={setOtp} />
      </View>
      <View style={{ ...styles.button, bottom: bottom + 50 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Typography style={{ fontSize: 16 }}>
            {timeLeft === 0 ? "Didn’t receive any code?" : "Resend Code in"}
          </Typography>
          {timeLeft === 0 ? (
            <>
              {/* {isResending ? (
                <LottieView
                  autoPlay
                  style={{ width: 30, height: 30 }}
                  source={require("@assets/button-loader.json")}
                />
              ) : ( */}
              <TouchableOpacity
                onPress={() => {
                  resend(
                    { email: params?.email },
                    {
                      onSuccess: (res) => {
                        if (res.data) {
                          showToastModal({
                            title: "OTP resent",
                            type: "success",
                            duration: 5000,
                          });
                        } else {
                          showToastModal({
                            title: "Failed to resend OTP",
                            type: "error",
                            duration: 5000,
                          });
                        }
                      },
                      onError: (error) => {
                        showToastModal({
                          title: "Failed to resend OTP",
                          type: "error",
                          duration: 5000,
                        });
                      },
                    }
                  );
                }}
              >
                <Typography
                  style={{ fontSize: 16, fontFamily: "Bold", color: PRIMARY }}
                >
                  {"Click here"}
                </Typography>
              </TouchableOpacity>
              {/* )} */}
            </>
          ) : (
            <Typography
              style={{ fontSize: 16, fontFamily: "Bold", color: PRIMARY }}
            >
              {minutes}:{seconds}
            </Typography>
          )}
        </View>

        <Button
          label="VERIFY"
          onPress={handleVerify}
          disabled={otp.length === 0 || isAuthenticating}
          loading={isAuthenticating}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    gap: 20,
    paddingHorizontal: width * 0.05,
    alignItems: "center",
  },
});
