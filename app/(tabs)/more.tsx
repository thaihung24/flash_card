import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MoreScreen() {
  const router = useRouter();

  const navigateToThemeTest = () => {
    router.push("/theme-test");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>Additional features and options</Text>

      <TouchableOpacity style={styles.button} onPress={navigateToThemeTest}>
        <Text style={styles.buttonText}>Test New FlashCard Theme</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
