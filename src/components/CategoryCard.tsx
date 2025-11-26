/**
 * Category Card Component
 * Quick category selection component
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants/theme';

interface CategoryCardProps {
  category: string;
  count: number;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  onPress: () => void;
  disabled?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  count,
  description,
  icon,
  priority,
  onPress,
  disabled = false,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.success;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.gray[400];
      default: return COLORS.gray[400];
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: getPriorityColor(priority) },
        disabled && styles.disabledCard,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.iconContainer, { backgroundColor: getPriorityColor(priority) }]}>
        <Ionicons name={icon as any} size={20} color={COLORS.white} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        <Text style={styles.categoryCode}>({category})</Text>
      </View>
      
      <View style={styles.countContainer}>
        <Text style={styles.count}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  disabledCard: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.gray[800],
  },
  categoryCode: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[500],
  },
  countContainer: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  count: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary,
  },
});

export default CategoryCard;