import { Pressable, Text, View } from "react-native";
import Bottomsheet, { BottomSheetMethods } from "@components/ui/BottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef } from "react";

export const Checkbox = ({ label, value, onChange, isRequired }) => {
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
    <Pressable
      onPress={() => onChange(!value)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderWidth: 2,
          borderRadius: 4,
          borderColor: "#555",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value && (
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#007bff",
              borderRadius: 2,
            }}
            className="border-[0.25px]  border-green-800/90 my-1 rounded-lg bg-green-200/30  flex-row items-center"
          />
        )}
      </View>

      <Text style={{ marginLeft: 8, fontSize: 16 }}>
        {label} {isRequired && <Text className="text-red-500"> *</Text>}
      </Text>
    </Pressable>
    //     </BottomSheetScrollView>
    //   </View>
    // </Bottomsheet>
  );
};
