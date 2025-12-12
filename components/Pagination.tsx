import usePagination from "@hooks/usePagination";
import React, { useEffect } from "react";
import { View, Button, Text, Pressable } from "react-native";
import {
  ArrowCircleRight,
  ArrowCircleLeft,
  RefreshCircle,
} from "iconsax-react-nativejs";
import { PRIMARY } from "@constants/colors";

export default function Pagination({
  pageQuery,
  limit = 10,
  meta = null,
}: {
  pageQuery: (query: string) => void;
  limit: number;
  meta: object | null;
}) {
  const { pageNumber, nextPage, prevPage, resetPage, query } =
    usePagination(limit);

  useEffect(() => {
    pageQuery(query);
  }, [query]);
  return (
    <View
      style={{
        padding: 4,
        flexDirection: "row",
        gap: 7,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "red",
      }}
    >
      {/* totalItems: res.data.totalItems,
    totalPages: res.data.totalPages,
    currentPage: res.data.currentPage,
    pageSize: res.data.pageSize, */}
      <Pressable
        onPress={prevPage}
        style={{ width: 25, height: 25, borderRadius: 25 }}
      >
        <ArrowCircleLeft color={PRIMARY} />
      </Pressable>
      <Text style={{ fontSize: 12 }}>
        {pageNumber} <Text style={{ fontSize: 14 }}>of</Text>
      </Text>
      <Text style={{ fontSize: 10 }}>
        <Text style={{ fontSize: 12 }}>{meta?.totalPages ?? "--"}</Text>
      </Text>
      <Pressable
        style={{ width: 25, height: 25, borderRadius: 25 }}
        onPress={nextPage}
      >
        <ArrowCircleRight color={PRIMARY} />
      </Pressable>
      <Pressable
        onPress={resetPage}
        style={{ width: 25, height: 25, borderRadius: 25, marginLeft: 10 }}
      >
        <RefreshCircle color={PRIMARY} />
      </Pressable>
    </View>
  );
}
