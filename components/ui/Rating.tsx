import { Pressable, Text, View } from "react-native";
import Bottomsheet, { BottomSheetMethods } from "@components/ui/BottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef } from "react";

export const Rating = ({
  maxRating,
  label,
  value = 0,
  onChange,
  isRequired,
}) => {
  console.log(value);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{ fontWeight: "600", marginBottom: 4 }}
        className="capitalize"
      >
        {label}
        {isRequired && <Text className="text-red-500"> *</Text>}
      </Text>

      <View style={{ flexDirection: "row" }}>
        {Array(Number(maxRating))
          .fill("")
          ?.map((_, i) => (
            <Pressable key={i} onPress={() => onChange(i)}>
              <Text
                style={{
                  fontSize: 32,
                  color: i <= value ? "#FFD700" : "#aaa",
                }}
              >
                ★
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
};
