import { Pressable, Text } from "react-native";
import { View } from "react-native";
import Bottomsheet, { BottomSheetMethods } from "@components/ui/BottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef } from "react";

export const Radio = ({ label, value, onChange, options, isRequired }) => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  return (
    // <Bottomsheet ref={bottomSheetRef} snapStart="50%" snapEnd="50%">
    //   <View>
    //     <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 160 }}>
    //       <View
    //         style={{
    //           borderBottomColor: "#BDBDBD",
    //         }}
    //         className="flex-row justify-between py-[20px] px-[16px] border-b-[0.6px]"
    //       ></View>
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "600", marginBottom: 8 }}>
        {label} {isRequired && <Text className="text-red-500"> *</Text>}
      </Text>

      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onChange(opt)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "#333",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {value === opt && (
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "#007bff",
                }}
              />
            )}
          </View>
          <Text style={{ marginLeft: 8 }}>{opt}</Text>
        </Pressable>
      ))}
    </View>
    //     </BottomSheetScrollView>
    //   </View>
    // </Bottomsheet>
  );
};
