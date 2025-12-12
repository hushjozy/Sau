// import React from "react";
// import {
//   View,
//   StyleSheet,
//   Pressable,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import Typography from "./ui/Typography";
// import { useTheme } from "@provider/ThemeProvider";
// import { WHITE, PRIMARY } from "@constants/colors";
// import { ChatItem, ChatPayload } from "@hooks/useSignalRHubChat";

// interface ChatHistoryProps {
//   onViewAll?: () => void;
//   onItemPress?: (item: ChatItem) => void;
//   chatHistoryItems: ChatPayload;
// }

// const { width } = Dimensions.get("window");

// const AIChatHistory: React.FC<ChatHistoryProps> = ({
//   onViewAll,
//   onItemPress,
//   chatHistoryItems,
// }) => {
//   const { theme } = useTheme();

//   const renderChatHistoryItem = (item: ChatItem, index: number) => (
//     <Pressable
//       key={item.chatId}
//       style={[
//         styles.chatHistoryItem,
//         {
//           borderColor: PRIMARY,
//           backgroundColor: WHITE,
//         },
//       ]}
//       onPress={() => onItemPress?.(item)}
//     >
//       {item.name && (
//         <Typography
//           style={
//             [
//               styles.chatHistoryText,
//               {
//                 color: theme === "dark" ? "#8B5CF6" : "#8B5CF6",
//               },
//             ] as any
//           }
//         >
//           {item.name}
//         </Typography>
//       )}
//     </Pressable>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={{ ...styles.header, paddingHorizontal: width * 0.05 }}>
//         <Typography style={{ ...styles.title }}>Chat History</Typography>
//         <Pressable onPress={onViewAll}>
//           <Typography style={styles.viewAllText}>View all</Typography>
//         </Pressable>
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.chatHistoryGrid}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//       >
//         {chatHistoryItems.map((item, index) =>
//           renderChatHistoryItem(item, index)
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // paddingHorizontal: 12,
//     paddingVertical: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 16,
//     fontFamily: "SemiBold",
//   },
//   viewAllText: {
//     fontSize: 12,
//     fontFamily: "Regular",
//     color: "#4F4F4F",
//   },
//   chatHistoryGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     paddingHorizontal: width * 0.05,
//   },
//   chatHistoryItem: {
//     minWidth: 80,
//     height: 36,
//     borderRadius: 18,
//     borderWidth: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 12,
//   },
//   chatHistoryText: {
//     fontSize: 12,
//     fontFamily: "Medium",
//   },
// });

// export default AIChatHistory;
