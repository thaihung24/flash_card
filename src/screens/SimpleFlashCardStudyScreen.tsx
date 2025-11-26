/**
 * Simple FlashCard Study Screen
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlashCardComponent } from '../components/FlashCard';
import { COLORS, FONTS, SHADOWS, SPACING } from '../constants/theme';
import { sampleDecks, shuffleCards } from '../data/sampleData';
import { CardProgress, Deck, FlashCard, StudyResult, SwipeDirection } from '../types';
import { srsAlgorithm } from '../utils/srsAlgorithm';

export default function FlashCardStudyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse deck from params or use default
  const getDeck = (): Deck => {
    if (params.deck && typeof params.deck === 'string') {
      try {
        return JSON.parse(params.deck);
      } catch (e) {
        console.log('Failed to parse deck:', e);
      }
    }
    // Return first deck as default
    return sampleDecks[0];
  };
  
  const deck = getDeck();
  
  // State
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    correct: 0,
    wrong: 0,
    remaining: 0,
  });
  const [cardProgress, setCardProgress] = useState<Map<string, CardProgress>>(new Map());
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Initialize study session
  useEffect(() => {
    const initializeSession = () => {
      const shuffledCards = shuffleCards(deck.cards);
      setCards(shuffledCards);
      setSessionStats({
        total: shuffledCards.length,
        correct: 0,
        wrong: 0,
        remaining: shuffledCards.length,
      });

      // Initialize card progress
      const progressMap = new Map<string, CardProgress>();
      shuffledCards.forEach(card => {
        progressMap.set(
          card.id,
          srsAlgorithm.initializeCardProgress(card.id, 'current_user')
        );
      });
      setCardProgress(progressMap);
    };

    initializeSession();
  }, [deck]);

  // Get current card
  const currentCard = cards[currentCardIndex];
  
  // Debug log
  console.log('Current card index:', currentCardIndex, 'Total cards:', cards.length, 'Current card:', currentCard?.id);

  // Handle card flip
  const handleFlip = useCallback(() => {
    setShowBack(!showBack);
  }, [showBack]);

  // Handle text-to-speech
  const handleSpeak = useCallback((text: string) => {
    console.log('🎙️ SimpleFlashCardStudyScreen handleSpeak called with:', text);
    
    try {
      Speech.speak(text, {
        language: 'ja-JP',
        pitch: 1.0,
        rate: 0.8,
        onStart: () => console.log('🎵 Speech started in screen'),
        onDone: () => console.log('✅ Speech finished in screen'),
        onStopped: () => console.log('🛑 Speech stopped in screen'),
        onError: (error) => console.error('❌ Speech error in screen:', error),
      });
      console.log('🚀 Speech.speak called successfully from screen');
    } catch (error) {
      console.error('💥 Error calling Speech.speak from screen:', error);
      Alert.alert('Speech Error', `Could not play audio: ${error.message}`);
    }
  }, []);

  // Reset session to study again
  const resetSession = useCallback(() => {
    setCurrentCardIndex(0);
    setShowBack(false);
    setIsSessionComplete(false);
    setSessionStats({
      total: cards.length,
      correct: 0,
      wrong: 0,
      remaining: cards.length,
    });
    
    // Re-shuffle cards
    const reshuffled = shuffleCards(cards);
    setCards(reshuffled);
  }, [cards]);

  // Complete study session
  const completeSession = useCallback(() => {
    setIsSessionComplete(true);
    
    // Show completion alert
    Alert.alert(
      'Session Complete! 🎉',
      `Great job! You studied ${sessionStats.total} cards.\n\nCorrect: ${sessionStats.correct}\nWrong: ${sessionStats.wrong}\nAccuracy: ${Math.round((sessionStats.correct / sessionStats.total) * 100)}%`,
      [
        { text: 'Study Again', onPress: resetSession },
        { text: 'Back to Home', onPress: () => router.back() },
      ]
    );
  }, [sessionStats, router, resetSession]);

  // Handle swipe gestures
  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (!currentCard) return;

    let wasCorrect = false;
    let difficulty = 3; // Default to "good"

    // Determine result based on swipe direction
    switch (direction) {
      case SwipeDirection.LEFT:
        wasCorrect = false;
        difficulty = 1; // Hard/Wrong
        break;
      case SwipeDirection.RIGHT:
        wasCorrect = true;
        difficulty = 4; // Easy
        break;
      case SwipeDirection.UP:
        wasCorrect = true;
        difficulty = 3; // Good
        break;
      case SwipeDirection.DOWN:
        wasCorrect = false;
        difficulty = 2; // Hard but remembered
        break;
    }

    // Create study result
    const studyResult: StudyResult = {
      cardId: currentCard.id,
      wasCorrect,
      responseTime: 5000, // TODO: Track actual response time
      difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
    };

    // Update card progress using SRS algorithm
    const currentProgress = cardProgress.get(currentCard.id);
    if (currentProgress) {
      const updatedProgress = srsAlgorithm.calculateNextReview(currentProgress, studyResult);
      const newProgress = { ...currentProgress, ...updatedProgress };
      
      setCardProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(currentCard.id, newProgress);
        return newMap;
      });
    }

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      correct: wasCorrect ? prev.correct + 1 : prev.correct,
      wrong: !wasCorrect ? prev.wrong + 1 : prev.wrong,
      remaining: prev.remaining - 1,
    }));

    // Move to next card or complete session
    if (currentCardIndex < cards.length - 1) {
      // Add small delay to let animation complete
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowBack(false);
      }, 50);
    } else {
      setTimeout(() => {
        completeSession();
      }, 300);
    }
  }, [currentCard, currentCardIndex, cards.length, cardProgress, completeSession]);

  // Calculate progress percentage
  const progressPercentage = sessionStats.total > 0 
    ? ((sessionStats.total - sessionStats.remaining) / sessionStats.total) * 100 
    : 0;

  if (!currentCard || isSessionComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completionContainer}>
          <Text style={styles.completionTitle}>Session Complete!</Text>
          <Text style={styles.completionText}>
            Come back tomorrow for your next review session.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header with progress */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.deckTitle}>{deck.name}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentCardIndex + 1} / {cards.length}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sessionStats.correct}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sessionStats.wrong}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sessionStats.remaining}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* FlashCard */}
      <View style={styles.cardContainer}>
        <FlashCardComponent
          key={`card-${currentCard?.id}-${currentCardIndex}`}
          card={currentCard}
          onSwipe={handleSwipe}
          onFlip={handleFlip}
          onSpeak={handleSpeak}
          showBack={showBack}
          isLastCard={currentCardIndex === cards.length - 1}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Answer:</Text>
        <Text style={styles.instructionsText}>
          • Swipe ← if you got it wrong (Hard)
        </Text>
        <Text style={styles.instructionsText}>
          • Swipe → if you got it right (Easy)
        </Text>
        <Text style={styles.instructionsText}>
          • Tap card to flip and see the answer
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  deckTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.white + '30',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white + '90',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  instructionsContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  instructionsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
  },
  instructionsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs / 2,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  completionTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  completionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
});