/**
 * Quick Category Selection Screen
 * Simplified category selection for quick study
 */

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoryCard } from "../components/CategoryCard";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../constants/theme";
import { CategoryService } from "../services/categoryService";
import { VocabularyService } from "../services/vocabularyService";

interface CategoryItem {
  category: string;
  count: number;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
}

export const QuickCategoryScreen: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all"
  );

  // Category info mapping
  const categoryInfo: Record<
    string,
    { description: string; icon: string; priority: "high" | "medium" | "low" }
  > = {
    verb: { description: "Động từ", icon: "flash", priority: "high" },
    "adj-i": { description: "Tính từ -i", icon: "star", priority: "high" },
    time: { description: "Thời gian", icon: "time", priority: "high" },
    food: { description: "Đồ ăn", icon: "restaurant", priority: "high" },
    home: { description: "Nhà cửa", icon: "home", priority: "high" },
    family: { description: "Gia đình", icon: "people", priority: "high" },
    "adj-na": {
      description: "Tính từ -na",
      icon: "star-outline",
      priority: "medium",
    },
    school: { description: "Trường học", icon: "school", priority: "medium" },
    place: { description: "Địa điểm", icon: "location", priority: "medium" },
    transport: { description: "Giao thông", icon: "car", priority: "medium" },
    people: { description: "Con người", icon: "person", priority: "medium" },
    body: { description: "Cơ thể", icon: "body", priority: "medium" },
    devices: {
      description: "Thiết bị",
      icon: "phone-portrait",
      priority: "medium",
    },
    number: { description: "Số đếm", icon: "calculator", priority: "medium" },
    counter: { description: "Từ đếm", icon: "list", priority: "medium" },
    pronoun: { description: "Đại từ", icon: "chatbox", priority: "medium" },
    particle: { description: "Trợ từ", icon: "link", priority: "medium" },
    adv: { description: "Trạng từ", icon: "arrow-forward", priority: "medium" },
    expr: { description: "Biểu thức", icon: "chatbubble", priority: "medium" },
    expression: {
      description: "Diễn đạt",
      icon: "chatbubbles",
      priority: "medium",
    },
    abstract: { description: "Khái niệm", icon: "bulb", priority: "medium" },
    clothes: { description: "Quần áo", icon: "shirt", priority: "low" },
    weather: {
      description: "Thời tiết",
      icon: "partly-sunny",
      priority: "low",
    },
    nature: { description: "Tự nhiên", icon: "leaf", priority: "low" },
    kitchen: {
      description: "Nhà bếp",
      icon: "restaurant-outline",
      priority: "low",
    },
    color: { description: "Màu sắc", icon: "color-palette", priority: "low" },
    question: { description: "Câu hỏi", icon: "help-circle", priority: "low" },
    conj: { description: "Liên từ", icon: "git-branch", priority: "low" },
    general: { description: "Chung", icon: "grid", priority: "low" },
    extra: { description: "Bổ sung", icon: "add-circle", priority: "low" },
    money: { description: "Tiền bạc", icon: "card", priority: "low" },
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoryStats = await CategoryService.getCategoryStats();

      const categoriesWithInfo = categoryStats.map(({ category, count }) => ({
        category,
        count,
        description: categoryInfo[category]?.description || category,
        icon: categoryInfo[category]?.icon || "folder",
        priority: categoryInfo[category]?.priority || "low",
      }));

      setCategories(categoriesWithInfo);
    } catch (error) {
      console.error("Failed to load categories:", error);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryItem: CategoryItem) => {
    try {
      const vocabularyItems = await VocabularyService.getByCategory(
        categoryItem.category
      );

      Alert.alert(
        `${categoryItem.description}`,
        `${vocabularyItems.length} từ vựng\n\nBắt đầu học ngay?`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Học ngay",
            onPress: () => {
              console.log(
                "Start studying:",
                categoryItem.category,
                vocabularyItems.length,
                "words"
              );
              // TODO: Navigate to study screen
            },
          },
        ]
      );
    } catch (err) {
      console.error("Category select error:", err);
      Alert.alert("Lỗi", "Không thể tải từ vựng cho chủ đề này");
    }
  };

  const filteredCategories = categories.filter(
    (cat) => filter === "all" || cat.priority === filter
  );

  const getFilterCount = (priority: string) => {
    if (priority === "all") return categories.length;
    return categories.filter((cat) => cat.priority === priority).length;
  };

  const renderFilterButton = (
    priority: "all" | "high" | "medium" | "low",
    label: string,
    color: string
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: filter === priority ? color : COLORS.gray[100] },
      ]}
      onPress={() => setFilter(priority)}
    >
      <Text
        style={[
          styles.filterText,
          { color: filter === priority ? COLORS.white : COLORS.gray[600] },
        ]}
      >
        {label} ({getFilterCount(priority)})
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải chủ đề...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chọn chủ đề học</Text>
        <Text style={styles.subtitle}>
          {filteredCategories.length} chủ đề •{" "}
          {filteredCategories.reduce((sum, cat) => sum + cat.count, 0)} từ
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton("all", "Tất cả", COLORS.primary)}
        {renderFilterButton("high", "Ưu tiên", COLORS.success)}
        {renderFilterButton("medium", "Trung bình", COLORS.warning)}
        {renderFilterButton("low", "Bổ sung", COLORS.gray[400])}
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.category}
        renderItem={({ item }) => (
          <CategoryCard
            category={item.category}
            count={item.count}
            description={item.description}
            icon={item.icon}
            priority={item.priority}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
  },
  filterContainer: {
    flexDirection: "row",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  listContainer: {
    padding: SPACING.md,
    paddingTop: 0,
  },
});

export default QuickCategoryScreen;
