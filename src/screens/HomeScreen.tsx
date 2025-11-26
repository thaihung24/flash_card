/**
 * Home Screen - JLPT Course Selection
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface HomeScreenProps {
  navigation: any;
}

// Remove unused import

// JLPT Levels - Exact layout từ ảnh (5 items, 3 hàng đầu + 2 hàng dưới)
const jlptLevels = [
  { id: 'N5', name: 'Khoá học N5', level: 'N5', color: '#4ECDC4' },
  { id: 'N4', name: 'Khoá học N4', level: 'N4', color: '#4ECDC4' },
  { id: 'N3', name: 'Khoá học N3', level: 'N3', color: '#4ECDC4' },
  { id: 'N2', name: 'Khoá học N2', level: 'N2', color: '#4ECDC4' },
  { id: 'N1', name: 'Khoá học N1', level: 'N1', color: '#4ECDC4' },
];

// Skill Categories - Exact layout từ ảnh (4x2 grid)
const skillCategories = [
  // Hàng 1
  { id: 'business', name: 'Business', icon: 'people-outline', color: '#3B82F6' },
  { id: 'kaiwa', name: 'Kaiwa', icon: 'person-circle-outline', color: '#EF4444' },
  { id: 'tokutei', name: 'Tokutei', icon: 'school-outline', color: '#10B981' },
  { id: 'tangkem', name: 'Tăng kèm', icon: 'library-outline', color: '#F59E0B' },
  // Hàng 2
  { id: 'biendich', name: 'Biên - Phiên dịch', icon: 'language-outline', color: '#F97316' },
  { id: 'jinzai', name: 'Jinzai', icon: 'people-outline', color: '#3B82F6' },
  { id: 'n3-advanced', name: 'Khoá N3 tích hợp', icon: 'trophy-outline', color: '#4ECDC4' },
  { id: 'n2-advanced', name: 'Khoá N2 tích hợp', icon: 'star-outline', color: '#4ECDC4' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Handle JLPT level selection
  const handleJLPTLevelPress = (level: any) => {
    navigation.navigate('JLPTCategorySelection', { 
      jlptLevel: level.id,
      title: level.name 
    });
  };

  // Handle skill category selection
  const handleSkillCategoryPress = (category: any) => {
    navigation.navigate('CategorySelection', { 
      skillCategory: category.id,
      title: category.name 
    });
  };

  // Render JLPT Level Card
  const renderJLPTCard = (level: any) => (
    <TouchableOpacity
      key={level.id}
      style={styles.jlptCard}
      onPress={() => handleJLPTLevelPress(level)}
      activeOpacity={0.8}
    >
      <View style={[styles.jlptCircle, { backgroundColor: level.color }]}>
        <Text style={styles.jlptText}>{level.level}</Text>
      </View>
      <Text style={styles.jlptLabel}>{level.name}</Text>
    </TouchableOpacity>
  );

  // Render Skill Category Card
  const renderSkillCard = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={styles.skillCard}
      onPress={() => handleSkillCategoryPress(category)}
      activeOpacity={0.8}
    >
      <View style={[styles.skillCircle, { backgroundColor: category.color }]}>
        <Ionicons name={category.icon as any} size={20} color="white" />
      </View>
      <Text style={styles.skillLabel}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Top Stats Header */}
      <View style={styles.topStatsHeader}>
        <View style={styles.statItem}>
          <View style={[styles.statCircle, { backgroundColor: '#FF6B6B' }]}>
            <Text style={styles.statIcon}>●</Text>
          </View>
          <Text style={styles.statNumber}>20</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statCircle, { backgroundColor: '#FF9500' }]}>
            <Ionicons name="flame" size={16} color="white" />
          </View>
          <Text style={styles.statNumber}>24</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statCircle, { backgroundColor: '#007AFF' }]}>
            <Ionicons name="cube" size={16} color="white" />
          </View>
          <Text style={styles.statNumber}>1252</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.statCircle, { backgroundColor: '#8E44AD' }]}>
            <Ionicons name="flash" size={16} color="white" />
          </View>
          <Text style={styles.statNumber}>∞</Text>
        </View>
      </View>

      {/* Main Header */}
      <LinearGradient
        colors={['#4A9FFF', '#007AFF']}
        style={styles.mainHeader}
      >
        <View style={styles.mainHeaderContent}>
          <Text style={styles.lessonLabel}>PHẦN 3, CỬA 1</Text>
          <Text style={styles.lessonTitle}>Chuẩn bị họp mặt bạn bè</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* JLPT Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khoá học JLPT</Text>
          <View style={styles.jlptGrid}>
            {/* First row: N5, N4, N3 */}
            <View style={styles.jlptRow}>
              {jlptLevels.slice(0, 3).map(renderJLPTCard)}
            </View>
            {/* Second row: N2, N1 */}
            <View style={styles.jlptRow}>
              {jlptLevels.slice(3, 5).map(renderJLPTCard)}
            </View>
          </View>
        </View>

        {/* Skill Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khoá học kỹ năng</Text>
          <View style={styles.skillGrid}>
            {/* First row: 4 skills */}
            <View style={styles.skillRow}>
              {skillCategories.slice(0, 4).map(renderSkillCard)}
            </View>
            {/* Second row: 4 skills */}
            <View style={styles.skillRow}>
              {skillCategories.slice(4, 8).map(renderSkillCard)}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  statIcon: {
    color: 'white',
    fontSize: 12,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 16,
    margin: 16,
    marginBottom: 8,
  },
  mainHeaderContent: {
    flex: 1,
  },
  lessonLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  lessonTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  menuButton: {
    padding: 4,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  navItem: {
    padding: 8,
    position: 'relative',
  },
  notificationDot: {
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  jlptGrid: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jlptRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  jlptCard: {
    alignItems: 'center',
    flex: 1,
  },
  jlptCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#E5E5E5',
  },
  jlptText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  jlptLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  skillGrid: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  skillCard: {
    alignItems: 'center',
    flex: 1,
  },
  skillCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  skillLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;