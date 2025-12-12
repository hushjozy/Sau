import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NoRecord = ({ message = "No records found" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 300,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default NoRecord;
