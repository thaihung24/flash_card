/**
 * Category Selection Screen
 * Allow users to choose study categories
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants/theme';
import { CategoryService } from '../services/categoryService';
import { VocabularyImportService } from '../services/vocabularyImportService';

interface CategoryItem {
  category: string;
  count: number;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export const CategorySelectionScreen: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Category descriptions and icons
  const categoryInfo: Record<string, { description: string; icon: string; priority: 'high' | 'medium' | 'low' }> = {
    verb: { description: 'Động từ', icon: 'flash', priority: 'high' },
    'adj-i': { description: 'Tính từ đuôi -i', icon: 'star', priority: 'high' },
    'adj-na': { description: 'Tính từ đuôi -na', icon: 'star-outline', priority: 'medium' },
    time: { description: 'Thời gian', icon: 'time', priority: 'high' },
    food: { description: 'Đồ ăn', icon: 'restaurant', priority: 'high' },
    home: { description: 'Nhà cửa', icon: 'home', priority: 'high' },
    family: { description: 'Gia đình', icon: 'people', priority: 'high' },
    school: { description: 'Trường học', icon: 'school', priority: 'medium' },
    place: { description: 'Địa điểm', icon: 'location', priority: 'medium' },
    transport: { description: 'Giao thông', icon: 'car', priority: 'medium' },
    people: { description: 'Con người', icon: 'person', priority: 'medium' },
    body: { description: 'Cơ thể', icon: 'body', priority: 'medium' },
    clothes: { description: 'Quần áo', icon: 'shirt', priority: 'low' },
    weather: { description: 'Thời tiết', icon: 'partly-sunny', priority: 'low' },
    nature: { description: 'Tự nhiên', icon: 'leaf', priority: 'low' },
    devices: { description: 'Thiết bị', icon: 'phone-portrait', priority: 'medium' },
    kitchen: { description: 'Nhà bếp', icon: 'restaurant-outline', priority: 'low' },
    color: { description: 'Màu sắc', icon: 'color-palette', priority: 'low' },
    number: { description: 'Số đếm', icon: 'calculator', priority: 'medium' },
    counter: { description: 'Từ đếm', icon: 'list', priority: 'medium' },
    pronoun: { description: 'Đại từ', icon: 'chatbox', priority: 'medium' },
    particle: { description: 'Trợ từ', icon: 'link', priority: 'medium' },
    adv: { description: 'Trạng từ', icon: 'arrow-forward', priority: 'medium' },
    conj: { description: 'Liên từ', icon: 'git-branch', priority: 'low' },
    expr: { description: 'Biểu thức', icon: 'chatbubble', priority: 'medium' },
    expression: { description: 'Cách diễn đạt', icon: 'chatbubbles', priority: 'medium' },
    question: { description: 'Câu hỏi', icon: 'help-circle', priority: 'low' },
    abstract: { description: 'Khái niệm', icon: 'bulb', priority: 'medium' },
    general: { description: 'Chung', icon: 'grid', priority: 'low' },
    extra: { description: 'Bổ sung', icon: 'add-circle', priority: 'low' },
    money: { description: 'Tiền bạc', icon: 'card', priority: 'low' },
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
        icon: categoryInfo[category]?.icon || 'folder',
        priority: categoryInfo[category]?.priority || 'low',
      }));

      setCategories(categoriesWithInfo);
    } catch (error) {
      console.error('Failed to load categories:', error);
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryItem: CategoryItem) => {
    try {
      setSelectedCategory(categoryItem.category);
      
      // Get vocabulary for this category
      const vocabularyItems = await VocabularyImportService.getByCategory(categoryItem.category);
      
      Alert.alert(
        `${categoryItem.description} (${categoryItem.category})`,
        `Found ${vocabularyItems.length} vocabulary items.\n\nStart studying this category?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Study Now',
            onPress: () => {
              // Navigate to study screen with this category
              console.log('Start studying category:', categoryItem.category);
              // TODO: Navigate to FlashCardStudy screen with filtered data
            },
          },
        ]
      );
    } catch (err) {
      console.error('Failed to load vocabulary:', err);
      Alert.alert('Error', 'Failed to load vocabulary for this category');
    } finally {
      setSelectedCategory(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.gray[400];
      default: return COLORS.gray[400];
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Ưu tiên cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Bổ sung';
      default: return '';
    }
  };

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => {
    const isSelected = selectedCategory === item.category;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { borderColor: getPriorityColor(item.priority) },
          isSelected && styles.selectedCard,
        ]}
        onPress={() => handleCategorySelect(item)}
        disabled={isSelected}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={item.icon as any} 
              size={24} 
              color={getPriorityColor(item.priority)} 
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.categoryName}>{item.description}</Text>
            <Text style={styles.categoryCode}>({item.category})</Text>
          </View>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{item.count}</Text>
            <Text style={styles.countLabel}>từ</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{getPriorityLabel(item.priority)}</Text>
          </View>
          
          {isSelected && (
            <ActivityIndicator size="small" color={COLORS.primary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Chọn chủ đề học</Text>
      <Text style={styles.subtitle}>
        {categories.length} chủ đề • {categories.reduce((sum, cat) => sum + cat.count, 0)} từ vựng
      </Text>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
          <Text style={styles.legendText}>Ưu tiên cao</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
          <Text style={styles.legendText}>Trung bình</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.gray[400] }]} />
          <Text style={styles.legendText}>Bổ sung</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.category}
        ListHeaderComponent={renderHeader}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
  },
  listContainer: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
    marginBottom: SPACING.lg,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[600],
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  selectedCard: {
    backgroundColor: COLORS.gray[100],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray[800],
  },
  categoryCode: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[500],
  },
  countContainer: {
    alignItems: 'center',
  },
  countText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  countLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray[500],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  priorityText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: FONTS.weights.medium,
  },
});

export default CategorySelectionScreen;