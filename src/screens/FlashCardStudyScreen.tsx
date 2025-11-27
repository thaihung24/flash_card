/**
 * FlashCard Study Screen with SRS Algorithm
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FlashCardComponent } from "../components/FlashCard";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../constants/theme";
import { sampleDecks, shuffleCards } from "../data/sampleData";
import { SRSService } from "../services/srsService";
import {
  CardProgress,
  Deck,
  FlashCard,
  StudyResult,
  SwipeDirection,
} from "../types";

interface FlashCardStudyScreenProps {
  route?: {
    params: {
      deckId?: string;
      deck?: Deck;
    };
  };
  navigation?: any;
}

export const FlashCardStudyScreen: React.FC<FlashCardStudyScreenProps> = ({
  route,
  navigation,
}) => {
  // State management
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    startTime: new Date(),
    cardsStudied: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [cardProgress, setCardProgress] = useState<Map<string, CardProgress>>(
    new Map()
  );

  // Services
  const srsService = useMemo(() => new SRSService(), []);

  // Initialize deck and cards
  useEffect(() => {
    const initializeDeck = () => {
      let targetDeck: Deck;

      if (route?.params?.deck) {
        targetDeck = route.params.deck;
      } else if (route?.params?.deckId) {
        const foundDeck = sampleDecks.find(
          (d) => d.id === route.params?.deckId
        );
        if (!foundDeck) {
          Alert.alert("Lỗi", "Không tìm thấy bộ thẻ", [
            { text: "OK", onPress: () => navigation?.goBack() },
          ]);
          return;
        }
        targetDeck = foundDeck;
      } else {
        // Default to first deck
        targetDeck = sampleDecks[0];
      }

      setDeck(targetDeck);

      // Shuffle cards for better learning experience
      const shuffledCards = shuffleCards(targetDeck.cards);
      setCards(shuffledCards);

      // Initialize card progress
      const progressMap = new Map<string, CardProgress>();
      shuffledCards.forEach((card) => {
        progressMap.set(
          card.id,
          srsService.initializeCardProgress(card.id, "current-user")
        );
      });
      setCardProgress(progressMap);
    };

    initializeDeck();
  }, [route?.params, navigation, srsService]);

  // Handle card swipe
  const handleCardSwipe = useCallback(
    (direction: SwipeDirection) => {
      const currentCard = cards[currentCardIndex];
      if (!currentCard) return;

      const wasCorrect = direction === SwipeDirection.RIGHT;
      const difficulty = direction === SwipeDirection.RIGHT ? 3 : 1; // Easy or Hard

      // Create study result
      const studyResult: StudyResult = {
        cardId: currentCard.id,
        wasCorrect,
        responseTime: 3000, // Could be measured in real app
        difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
      };

      // Update card progress with SRS
      const currentProgress = cardProgress.get(currentCard.id);
      if (currentProgress) {
        const newProgress = srsService.calculateNextReview(
          currentProgress,
          studyResult
        );
        setCardProgress(
          (prev) => new Map(prev.set(currentCard.id, newProgress))
        );
      }

      // Update session stats
      setSessionStats((prev) => ({
        ...prev,
        cardsStudied: prev.cardsStudied + 1,
        correctAnswers: wasCorrect
          ? prev.correctAnswers + 1
          : prev.correctAnswers,
        wrongAnswers: wasCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1,
      }));

      // Move to next card
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
        setShowBack(false);
      } else {
        // Session complete
        setIsSessionComplete(true);
      }
    },
    [cards, currentCardIndex, cardProgress, srsService]
  );

  // Handle card flip
  const handleCardFlip = useCallback(() => {
    setShowBack((prev) => !prev);
  }, []);

  // Calculate progress percentage
  const progressPercentage =
    cards.length > 0 ? (currentCardIndex / cards.length) * 100 : 0;

  // Get current card
  const currentCard = cards[currentCardIndex];

  // Handle session restart
  const handleRestart = () => {
    setCurrentCardIndex(0);
    setShowBack(false);
    setIsSessionComplete(false);
    setSessionStats({
      startTime: new Date(),
      cardsStudied: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });

    // Re-shuffle cards
    const shuffledCards = shuffleCards(deck?.cards || []);
    setCards(shuffledCards);
  };

  // Handle go back
  const handleGoBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  // Session complete modal
  const renderSessionCompleteModal = () => {
    const studyTime =
      (new Date().getTime() - sessionStats.startTime.getTime()) / (1000 * 60);
    const performance = srsService.getPerformanceFeedback({
      cardsStudied: sessionStats.cardsStudied,
      correctAnswers: sessionStats.correctAnswers,
      studyTime,
    });

    return (
      <Modal
        visible={isSessionComplete}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSessionComplete(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons
                name="trophy"
                size={48}
                color={
                  performance.performance === "excellent"
                    ? COLORS.gold
                    : COLORS.primary
                }
              />
              <Text style={styles.modalTitle}>Hoàn thành!</Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {sessionStats.cardsStudied}
                </Text>
                <Text style={styles.statLabel}>Thẻ học</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{performance.accuracy}%</Text>
                <Text style={styles.statLabel}>Độ chính xác</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(studyTime)}</Text>
                <Text style={styles.statLabel}>Phút</Text>
              </View>
            </View>

            <Text style={styles.feedbackText}>{performance.feedback}</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleRestart}
              >
                <Ionicons name="refresh" size={20} color={COLORS.primary} />
                <Text style={[styles.buttonText, { color: COLORS.primary }]}>
                  Học lại
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleGoBack}
              >
                <Ionicons name="home" size={20} color={COLORS.white} />
                <Text style={[styles.buttonText, { color: COLORS.white }]}>
                  Về trang chủ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (!deck || !currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.deckTitle}>{deck.name}</Text>
          <Text style={styles.progressText}>
            {currentCardIndex + 1} / {cards.length}
          </Text>
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLORS.gray[700]}
          />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>
      </View>

      {/* FlashCard */}
      <View style={styles.cardContainer}>
        <FlashCardComponent
          card={currentCard}
          onSwipe={handleCardSwipe}
          onFlip={handleCardFlip}
          onSpeak={(text: string) => console.log("Speaking:", text)}
          showBack={showBack}
          isLastCard={currentCardIndex === cards.length - 1}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.error }]}
          onPress={() => handleCardSwipe(SwipeDirection.LEFT)}
        >
          <Ionicons name="close" size={28} color={COLORS.white} />
          <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
            Khó
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipButton} onPress={handleCardFlip}>
          <Ionicons name="sync" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.success }]}
          onPress={() => handleCardSwipe(SwipeDirection.RIGHT)}
        >
          <Ionicons name="checkmark" size={28} color={COLORS.white} />
          <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
            Dễ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Session Complete Modal */}
      {renderSessionCompleteModal()}
    </SafeAreaView>
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
    fontSize: FONTS.sizes.lg,
    color: COLORS.gray[600],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  deckTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray[800],
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[600],
    marginTop: 2,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  progressBarContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.sm,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    marginTop: 4,
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.md,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray[800],
    marginTop: SPACING.sm,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[600],
    marginTop: 4,
  },
  feedbackText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[700],
    textAlign: "center",
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
});
