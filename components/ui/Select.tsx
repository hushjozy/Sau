import { Modal, Pressable, FlatList, View } from "react-native";
import { useRef, useState } from "react";
import { Text } from "react-native";
import Bottomsheet, { BottomSheetMethods } from "@components/ui/BottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { CloseCircle, DirectDown, Drop } from "iconsax-react-nativejs";

export const Select = ({ label, value, onChange, options, isRequired }) => {
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  return (
    <View className="border-none!">
      <Text
        style={{ fontWeight: "600", marginBottom: 4 }}
        className="capitalize"
      >
        {label} {isRequired && <Text className="text-red-500"> *</Text>}
      </Text>

      <Pressable
        onPress={() => bottomSheetRef.current?.handleSnapPress()}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          backgroundColor: "white",
        }}
        className="w-full flex-row justify-between items-center"
      >
        <Text>{value || "Select option..."}</Text>
        <DirectDown
          className="w-[11px] h-[11px] text-black"
          size={15}
          fill="#000"
        />
      </Pressable>

      <Bottomsheet ref={bottomSheetRef} snapStart="50%" snapEnd="50%">
        <View>
          <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 160 }}>
            <View
              style={{
                borderBottomColor: "#BDBDBD",
              }}
              className="flex-row justify-between py-[20px] px-[16px] border-b-[0.6px]"
            >
              <Text className="text-[22px] font-bold">Select {label}</Text>
              <Pressable
                onPress={() => bottomSheetRef.current?.handleClosePress()}
              >
                <CloseCircle
                  color="rgba(0, 0, 0, 0.5)"
                  variant="Bold"
                  size={24}
                />
              </Pressable>
            </View>{" "}
            {/* <Pressable
              onPress={() => {}}
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
              }}
            > */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
              }}
            >
              {options?.map((opt, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    onChange(opt.value);
                    bottomSheetRef.current?.handleClosePress();
                  }}
                  style={{ paddingVertical: 12 }}
                  className="border-[0.25px] h-[40px] border-green-800/90 my-1 rounded-lg bg-green-200/30 px-5 py-0 flex-row items-center"
                >
                  <Text style={{ fontSize: 16 }}>{opt?.label}</Text>
                </Pressable>
              ))}
            </View>
            {/* </Pressable> */}
          </BottomSheetScrollView>
        </View>
      </Bottomsheet>
    </View>
  );
};
