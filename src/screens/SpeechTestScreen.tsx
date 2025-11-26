/**
 * Test Screen for Speech Functionality
 */

import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function SpeechTestScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const testTexts = [
    { label: 'English Test', text: 'Hello World', language: 'en-US' },
    { label: 'Japanese Hiragana', text: 'こんにちは', language: 'ja-JP' },
    { label: 'Japanese Katakana', text: 'アリガトウ', language: 'ja-JP' },
    { label: 'Japanese Kanji', text: '今日は', language: 'ja-JP' },
    { label: 'Vietnamese', text: 'Xin chào', language: 'vi-VN' },
    { label: 'Simple Japanese', text: 'arigatou', language: 'ja-JP' },
  ];

  const testSpeech = async (text: string, language: string, label: string) => {
    console.log(`🔊 Testing speech: "${text}" in ${language}`);
    setCurrentTest(label);
    setIsPlaying(true);

    try {
      // Check if speech is available
      const available = await Speech.isSpeakingAsync();
      console.log('Speech already playing?', available);

      if (available) {
        await Speech.stop();
      }

      Speech.speak(text, {
        language,
        pitch: 1.0,
        rate: 0.8,
        onStart: () => {
          console.log(`🎵 Started speaking: ${label}`);
          setIsPlaying(true);
        },
        onDone: () => {
          console.log(`✅ Finished speaking: ${label}`);
          setIsPlaying(false);
          setCurrentTest(null);
        },
        onStopped: () => {
          console.log(`🛑 Stopped speaking: ${label}`);
          setIsPlaying(false);
          setCurrentTest(null);
        },
        onError: (error) => {
          console.error(`❌ Speech error for ${label}:`, error);
          Alert.alert('Speech Error', `Error with ${label}: ${error.message}`);
          setIsPlaying(false);
          setCurrentTest(null);
        },
      });

      console.log(`🚀 Speech.speak() called successfully for: ${label}`);
    } catch (error) {
      console.error(`💥 Exception in testSpeech for ${label}:`, error);
      Alert.alert('Speech Error', `Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsPlaying(false);
      setCurrentTest(null);
    }
  };

  const stopSpeech = async () => {
    try {
      await Speech.stop();
      setIsPlaying(false);
      setCurrentTest(null);
      console.log('🛑 Speech stopped manually');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const getVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('📋 Available voices:', voices);
      Alert.alert(
        'Available Voices',
        `Found ${voices.length} voices. Check console for details.`
      );
    } catch (error) {
      console.error('Error getting voices:', error);
      Alert.alert('Error', `Could not get voices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>🎙️ Speech Test Screen</Text>
        
        <TouchableOpacity style={styles.button} onPress={getVoices}>
          <Ionicons name="list" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Get Available Voices</Text>
        </TouchableOpacity>

        {isPlaying && (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopSpeech}>
            <Ionicons name="stop" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Stop Speech</Text>
          </TouchableOpacity>
        )}

        {currentTest && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>🎵 Playing: {currentTest}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Test Different Languages:</Text>
        
        {testTexts.map((test, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.testButton,
              isPlaying && currentTest === test.label && styles.activeButton
            ]}
            onPress={() => testSpeech(test.text, test.language, test.label)}
            disabled={isPlaying}
          >
            <Text style={styles.testLabel}>{test.label}</Text>
            <Text style={styles.testText}>&ldquo;{test.text}&rdquo;</Text>
            <Text style={styles.testLanguage}>{test.language}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray[900],
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
  statusContainer: {
    backgroundColor: COLORS.success,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  statusText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: FONTS.sizes.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray[800],
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  testButton: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    elevation: 2,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeButton: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  testLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  testText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  testLanguage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[600],
    fontStyle: 'italic',
  },
});