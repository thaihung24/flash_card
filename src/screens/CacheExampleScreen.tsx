/**
 * Example Component demonstrating cache usage
 * This shows how to use the caching hooks in React components
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONTS, SPACING } from "../constants/theme";
import {
  useCacheStats,
  useCategories,
  useOptimizedDataLoader,
  useVocabularyByCategory,
} from "../hooks/useCache";

export const CacheExampleScreen: React.FC = () => {
  const {
    categories,
    loading: categoriesLoading,
    refresh: refreshCategories,
  } = useCategories();
  const {
    vocabulary,
    loading: vocabLoading,
    refresh: refreshVocabulary,
  } = useVocabularyByCategory("verb");
  const { stats, clearAllCaches, warmupCaches } = useCacheStats();
  const { isWarming } = useOptimizedDataLoader();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cache Demo</Text>

      {/* Cache Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cache Statistics</Text>
        <Text style={styles.statText}>
          Vocabulary Cache Size: {stats.vocabulary.size}
        </Text>
        <Text style={styles.statText}>
          Categories Cached: {stats.category.cached ? "Yes" : "No"}
        </Text>
        <Text style={styles.statText}>
          Cache Duration: {stats.vocabulary.duration / 1000}s
        </Text>
      </View>

      {/* Cache Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cache Controls</Text>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearAllCaches}
        >
          <Text style={styles.buttonText}>Clear All Caches</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.warmupButton,
            isWarming && styles.disabledButton,
          ]}
          onPress={warmupCaches}
          disabled={isWarming}
        >
          <Text style={styles.buttonText}>
            {isWarming ? "Warming up..." : "Warmup Caches"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Categories ({categories.length})
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshCategories}
        >
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
        {categoriesLoading ? (
          <Text style={styles.loadingText}>Loading categories...</Text>
        ) : (
          <Text style={styles.dataText}>
            {categories.slice(0, 5).join(", ")}
            {categories.length > 5 ? "..." : ""}
          </Text>
        )}
      </View>

      {/* Vocabulary Demo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Verb Vocabulary ({vocabulary.length})
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshVocabulary}
        >
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
        {vocabLoading ? (
          <Text style={styles.loadingText}>Loading vocabulary...</Text>
        ) : (
          <View>
            {vocabulary.slice(0, 3).map((item) => (
              <Text key={item.id} style={styles.vocabItem}>
                {item.kana} - {item.meaning_vi}
              </Text>
            ))}
            {vocabulary.length > 3 && (
              <Text style={styles.moreText}>
                ... and {vocabulary.length - 3} more
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Cache Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Cache Benefits</Text>
        <Text style={styles.benefitText}>
          • Faster data loading (cached responses)
        </Text>
        <Text style={styles.benefitText}>• Reduced database calls</Text>
        <Text style={styles.benefitText}>• Better offline experience</Text>
        <Text style={styles.benefitText}>• Lower data usage</Text>
        <Text style={styles.benefitText}>• Improved app responsiveness</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
    padding: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.sm,
  },
  statText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  button: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  clearButton: {
    backgroundColor: COLORS.error,
  },
  warmupButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.gray[400],
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
    textAlign: "center",
  },
  refreshButton: {
    alignSelf: "flex-end",
    padding: SPACING.xs,
  },
  refreshText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
  },
  loadingText: {
    color: COLORS.gray[500],
    fontStyle: "italic",
  },
  dataText: {
    color: COLORS.gray[700],
    fontSize: FONTS.sizes.sm,
  },
  vocabItem: {
    color: COLORS.gray[700],
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  moreText: {
    color: COLORS.gray[500],
    fontSize: FONTS.sizes.sm,
    fontStyle: "italic",
  },
  benefitText: {
    color: COLORS.gray[600],
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
});
