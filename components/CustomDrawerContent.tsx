import {
  BLACK,
  BORDER,
  PLACEHOLDER_COLOR,
  PRIMARY,
  WHITE,
} from "@constants/colors";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React, { ReactNode } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "./ui/Typography";
import { DrawerStackParamsList } from "@navigation/types";
import { Headphone, People } from "iconsax-react-nativejs";
import { useUser } from "@provider/UserProvider";
import { capitalizeFirstLetter } from "@lib/utils";

type CustomDrawerContentProps = DrawerContentComponentProps & {
  // Add any additional props you may need
};

interface IDrawerItemProps {
  children: ReactNode;
  icon: ReactNode;
  secondaryText?: boolean;
  onPress?: () => void;
}

const CustomDrawerContent = ({ ...props }: CustomDrawerContentProps) => {
  const { bottom } = useSafeAreaInsets();
  const { navigation } = props;
  const { user } = useUser();
  const navigateToScreen = (screen: keyof DrawerStackParamsList) => {
    navigation.navigate(screen);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingBottom: bottom + 50 }}
    >
      <View style={styles.header}>
        <View style={{ marginLeft: 8, marginBottom: 10, gap: 8 }}>
          <Image
            source={require("@assets/images/icon.png")}
            style={styles.avatar}
          />
          <Typography style={{ fontFamily: "SemiBold", fontSize: 16 }}>
            {capitalizeFirstLetter(user?.firstName ?? "")}{" "}
            {capitalizeFirstLetter(user?.lastName ?? "")}
          </Typography>
        </View>
      </View>
      <View style={[{ paddingTop: 12, paddingBottom: 40, gap: 7 }]}>
        <DrawerItem
          icon={<Headphone size={24} color={PRIMARY} variant="Bulk" />}
          onPress={() => navigateToScreen("ChatWithSupport")}
        >
          Chat with Support
        </DrawerItem>
        <DrawerItem
          icon={<People size={24} color={PRIMARY} variant="Bulk" />}
          onPress={() => navigateToScreen("ChatWithEmployees")}
        >
          Chat with Employees
        </DrawerItem>
      </View>
      {/* <View style={[{ paddingTop: 12, paddingBottom: 40 }]}>
        <DrawerItemList {...props} />
      </View> */}
      <Text className="text-[16px] text-black mx-auto mt-10 font-bold">
        {" "}
        V1.0.0
      </Text>
      ;
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const DrawerItem = ({ children, icon, onPress }: IDrawerItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.flexContainer, styles.drawerItem]}>
        {icon}
        <Typography style={{ fontSize: 16, fontFamily: "Medium" }}>
          {children}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  drawerItem: {
    padding: 12,
    gap: 10,
  },
  bottomItems: {
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  bottomItem: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 200,
  },
});
