/**
 * Test Screen for Theme System and FlashCard Component
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlashCardComponent } from "../components/FlashCard";
import { FONTS, SPACING } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { DifficultyLevel } from "../types";

const testCard = {
  id: "test-1",
  front: "東京",
  back: "Tokyo",
  reading: "とうきょう",
  difficulty: DifficultyLevel.BEGINNER,
  category: "Places",
  jlptLevel: "N5",
  tags: ["place", "city", "japan"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sampleNextCards = [
  {
    id: "next-1",
    front: "大阪",
    back: "Osaka",
    reading: "おおさか",
    difficulty: DifficultyLevel.BEGINNER,
    category: "Places",
    jlptLevel: "N5",
    tags: ["place", "city"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "next-2",
    front: "京都",
    back: "Kyoto",
    reading: "きょうと",
    difficulty: DifficultyLevel.BEGINNER,
    category: "Places",
    jlptLevel: "N5",
    tags: ["place", "city"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "next-3",
    front: "横浜",
    back: "Yokohama",
    reading: "よこはま",
    difficulty: DifficultyLevel.BEGINNER,
    category: "Places",
    jlptLevel: "N5",
    tags: ["place", "city"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "next-4",
    front: "名古屋",
    back: "Nagoya",
    reading: "なごや",
    difficulty: DifficultyLevel.BEGINNER,
    category: "Places",
    jlptLevel: "N5",
    tags: ["place", "city"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const ThemeTestScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleSwipe = (direction: string) => {
    console.log("Swiped:", direction);
  };

  const handleFlip = () => {
    console.log("Card flipped");
  };

  const handleSpeak = (text: string) => {
    console.log("Speaking:", text);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header with theme toggle */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primaryText }]}>
          Theme Test
        </Text>
        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: theme.tagBackground }]}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={24}
            color={theme.primaryText}
          />
        </TouchableOpacity>
      </View>

      {/* Current theme info */}
      <View style={styles.themeInfo}>
        <Text style={[styles.themeText, { color: theme.secondaryText }]}>
          Current Theme: {isDark ? "Dark" : "Light"}
        </Text>
        <Text style={[styles.themeText, { color: theme.secondaryText }]}>
          Background: {theme.background}
        </Text>
        <Text style={[styles.themeText, { color: theme.secondaryText }]}>
          Card Background: {theme.cardBackground}
        </Text>
      </View>

      {/* FlashCard Component */}
      <View style={styles.cardContainer}>
        <FlashCardComponent
          card={testCard}
          onSwipe={handleSwipe}
          onFlip={handleFlip}
          onSpeak={handleSpeak}
          showBack={false}
          nextCards={sampleNextCards}
          currentIndex={0}
          totalCards={5}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={[styles.instructionText, { color: theme.secondaryText }]}>
          • Tap the sun/moon icon to toggle theme
        </Text>
        <Text style={[styles.instructionText, { color: theme.secondaryText }]}>
          • Tap the card to flip
        </Text>
        <Text style={[styles.instructionText, { color: theme.secondaryText }]}>
          • Swipe left/right to rate difficulty
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  themeToggle: {
    padding: SPACING.sm,
    borderRadius: 8,
  },
  themeInfo: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  themeText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructions: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  instructionText: {
    fontSize: FONTS.sizes.sm,
    marginBottom: 4,
  },
});
