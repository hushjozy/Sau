import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.82;
const ITEM_SPACING = 0;

const SAMPLE_ITEMS = [
  {
    title: "Cement Solutions",
    imageUrls: require("../../../assets/gifs/swipe-bg.gif"),
    backgroundColor: "#1D5BFF", // Vibrant blue
    content: "High-quality cement for residential and commercial projects.",
  },
  {
    title: "Ready-Mix Concrete",
    imageUrls: require("../../../assets/gifs/swipe-bg.gif"),
    backgroundColor: "#FF1178", // Vibrant pink
    content: "Durable ready-mix concrete delivered to your site.",
  },
  {
    title: "Aggregates",
    imageUrls: require("../../../assets/gifs/swipe-bg.gif"),
    backgroundColor: "#8D4CFF", // Vibrant purple
    content: "Top-grade sand, gravel, and crushed stone for construction.",
  },
  {
    title: "Sustainable Solutions",
    imageUrls: require("../../../assets/gifs/swipe-bg.gif"),
    backgroundColor: "#FF7A00", // Vibrant orange
    content: "Innovative eco-friendly solutions reducing environmental impact.",
  },
];
export function ImageRotator({ imageUrls }) {
  const images = imageUrls ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <View className="w-full h-full bg-black/50">
      <Image
        source={{ uri: images[index] }}
        resizeMode="cover"
        className="w-full h-full object-cover"
      />
    </View>
  );
}
export default function CarouselSnapMenu({
  items = SAMPLE_ITEMS,
  height = 150,
}) {
  const navigation = useNavigation();

  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 70,
  });

  const goPrev = () => {
    if (activeIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  };

  const goNext = () => {
    if (activeIndex < items.length - 1) {
      flatListRef.current.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View className="w-full">
      {/* Buttons */}

      {/* Carousel */}
      <Animated.FlatList
        ref={flatListRef}
        horizontal
        data={items}
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: ITEM_SPACING,
        }}
        className=" flex-start"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              width: ITEM_WIDTH,
              height,
              borderColor: `${item.backgroundColor}20`,
              marginRight: 6,
            }}
            className="rounded-xl border flex-row overflow-hidden shadow-lg"
            onPress={() =>
              navigation.navigate("BannerDetails", {
                item,
              })
            }
          >
            {/* Left imageUrls */}

            <ImageRotator imageUrls={item.imageUrls ?? []} />

            {/* Right Text */}
            <View
              className="absolute top-0 z-3 flex-1  justify-end items-end h-full w-full"
              style={{ backgroundColor: `${item.backgroundColor}50` }}
            >
              <View
                className="rounded-tr-lg  w-auto overflow-hidden  mr-auto"
                style={{
                  //   ...StyleSheet.absoluteFillObject,
                  backgroundColor: `#00000020`,
                }}
              >
                <BlurView
                  intensity={50}
                  tint="dark"
                  className="mr-auto  w-auto p-[5px] "
                  style={{
                    //   ...StyleSheet.absoluteFillObject,
                    backgroundColor: `#00000020`,
                  }}
                >
                  <Text className="text-white font-bold text-[12px] ">
                    {item.title}
                  </Text>
                </BlurView>
              </View>
              <BlurView
                intensity={50}
                tint="dark"
                className=" rounded-full w-full p-[2px] px-3 "
                style={{
                  //   ...StyleSheet.absoluteFillObject,
                  backgroundColor: `#00000020`,
                }}
              >
                <Text className="text-white font-semibold text-[10px]">
                  {item.content?.substring(0, 100)}
                </Text>
              </BlurView>
            </View>
          </TouchableOpacity>
        )}
      />
      <View className="flex-row justify-end mr-3 mb-3 space-x-3 mx-auto mt-3">
        <TouchableOpacity
          onPress={goPrev}
          className="w-[35px] h-[35px] rounded-full flex-row bg-green-300/50 border border-green-800 justify-center items-center"
        >
          <Text className="text-[15px] font-bold text-green-800">◀</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center mt-3 space-x-3">
          {items.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                flatListRef.current.scrollToIndex({ index: i, animated: true })
              }
            >
              <View
                className={`w-2 h-2 rounded-full ${
                  i === activeIndex ? "bg-black" : "bg-gray-300"
                }`}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={goNext}
          className="w-[35px] h-[35px] rounded-full flex-row bg-green-300/50 border border-green-800 justify-center items-center"
        >
          <Text className="text-[15px] font-bold text-green-800">▶</Text>
        </TouchableOpacity>
      </View>
      {/* Pagination Dots */}
    </View>
  );
}
