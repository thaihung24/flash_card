/**
 * JLPT Category Selection Screen for Expo Router with Caching
 */

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import services and hooks
import { CategoryDocument } from "@/src/types/category";
import { useVocabularyByJLPT } from "../src/hooks/useCache";
import { CategoryService } from "../src/services/FirebaseCategoryService";

interface CategoryItem {
  id: string;
  name_vi: string;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
  color: string;
  vocabulary_count: number;
}

export default function JLPTCategorySelectionScreen() {
  const router = useRouter();
  const { jlptLevel, title } = useLocalSearchParams();

  // Use cached data with hooks
  const { vocabulary: vocabularyData } = useVocabularyByJLPT(
    jlptLevel as string
  );
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize total vocabulary count
  const totalVocabularyCount = useMemo(() => {
    return vocabularyData?.length || 0;
  }, [vocabularyData]);

  // Load categories with caching
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading categories for JLPT level:", jlptLevel);

      const categoriesData = await CategoryService.getAllCategoriesByLevel(
        jlptLevel as string
      );
      setCategories(categoriesData);
      console.log("✅ Categories loaded successfully");
    } catch (error) {
      console.error("Failed to load categories:", error);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [jlptLevel]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCategorySelect = useCallback(
    async (category: CategoryItem) => {
      try {
        // Use cached vocabulary data instead of fetching again
        let filteredVocabs = vocabularyData || [];

        // Filter by category
        filteredVocabs = filteredVocabs.filter(
          (vocab) => vocab.category === category.id
        );

        if (filteredVocabs.length === 0) {
          Alert.alert("Thông báo", "Không có từ vựng nào trong danh mục này");
          return;
        }

        // Navigate to study screen with cached vocabulary
        router.push({
          pathname: "/flashcard-study",
          params: {
            vocabulary: JSON.stringify(filteredVocabs),
            title: `${category.name_vi} (${jlptLevel || "Tất cả"})`,
            category: category.id,
            jlptLevel: jlptLevel as string,
          },
        });
      } catch (error) {
        console.error("Error selecting category:", error);
        Alert.alert("Lỗi", "Không thể tải từ vựng");
      }
    },
    [vocabularyData, jlptLevel, router]
  );

  const handleRandomStudy = useCallback(async () => {
    try {
      // Use cached vocabulary data
      let filteredVocabs = vocabularyData || [];

      if (filteredVocabs.length === 0) {
        Alert.alert("Thông báo", "Không có từ vựng nào");
        return;
      }

      // Shuffle the vocabulary array
      const shuffledVocabs = [...filteredVocabs].sort(
        () => Math.random() - 0.5
      );

      // Navigate to study screen with cached vocabulary (shuffled)
      router.push({
        pathname: "/flashcard-study",
        params: {
          vocabulary: JSON.stringify(shuffledVocabs),
          title: `Học ngẫu nhiên (${jlptLevel || "Tất cả"})`,
          category: "random",
          jlptLevel: jlptLevel as string,
        },
      });
    } catch (error) {
      console.error("Error loading random study:", error);
      Alert.alert("Lỗi", "Không thể tải từ vựng ngẫu nhiên");
    }
  }, [vocabularyData, jlptLevel, router]);

  const renderCategoryCard = (category: CategoryItem) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "high":
          return "#10B981";
        case "medium":
          return "#F59E0B";
        case "low":
          return "#6B7280";
        default:
          return "#6B7280";
      }
    };

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryCard,
          { borderLeftColor: getPriorityColor(category.priority) },
        ]}
        onPress={() => handleCategorySelect(category)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeader}>
          <View
            style={[styles.categoryIcon, { backgroundColor: category.color }]}
          >
            <Ionicons name={category.icon as any} size={24} color="white" />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.name_vi}</Text>
            <Text style={styles.categoryDescription}>
              {category.description}
            </Text>
          </View>
          <View style={styles.categoryStats}>
            <Text style={styles.vocabularyCount}>
              {category.vocabulary_count}
            </Text>
            <Text style={styles.vocabularyLabel}>từ</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Đang tải danh mục...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{title || "Chọn danh mục"}</Text>
          <Text style={styles.headerSubtitle}>
            {totalVocabularyCount} từ vựng có sẵn
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Random Study Card */}
        <TouchableOpacity
          style={styles.randomStudyCard}
          onPress={handleRandomStudy}
          activeOpacity={0.8}
        >
          <View style={styles.randomStudyContent}>
            <View style={styles.randomStudyIcon}>
              <Ionicons name="shuffle" size={32} color="white" />
            </View>
            <View style={styles.randomStudyInfo}>
              <Text style={styles.randomStudyTitle}>Học ngẫu nhiên</Text>
              <Text style={styles.randomStudyDescription}>
                Học tất cả {totalVocabularyCount} từ vựng theo thứ tự ngẫu nhiên
              </Text>
            </View>
            <Ionicons name="play" size={24} color="white" />
          </View>
        </TouchableOpacity>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục học tập</Text>
          <Text style={styles.sectionSubtitle}>
            Chọn danh mục để học theo chủ đề
          </Text>

          <View style={styles.categoriesContainer}>
            {categories
              .filter((cat) => cat.vocabulary_count > 0)
              .map(renderCategoryCard)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  randomStudyCard: {
    backgroundColor: "#4ECDC4",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  randomStudyContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  randomStudyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  randomStudyInfo: {
    flex: 1,
  },
  randomStudyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  randomStudyDescription: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#666",
  },
  categoryStats: {
    alignItems: "center",
  },
  vocabularyCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4ECDC4",
  },
  vocabularyLabel: {
    fontSize: 12,
    color: "#666",
  },
});
