/**
 * FlashCard Component with Flip Animation and Gesture Support
 */

import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  BORDER_RADIUS,
  COLORS,
  FONTS,
  SHADOWS,
  SPACING,
} from "../constants/theme";
import { FlashCard, SwipeDirection } from "../types";

interface FlashCardComponentProps {
  card: FlashCard;
  onSwipe: (direction: SwipeDirection) => void;
  onFlip: () => void;
  onSpeak?: (text: string) => void;
  showBack: boolean;
  isLastCard?: boolean;
  disabled?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.85;
const CARD_HEIGHT = screenHeight * 0.55;
const SWIPE_THRESHOLD = screenWidth * 0.25;

export const FlashCardComponent: React.FC<FlashCardComponentProps> = ({
  card,
  onSwipe,
  onFlip,
  onSpeak,
  showBack = false,
  isLastCard = false,
  disabled = false,
}) => {
  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Card flip state
  const [isFlipped, setIsFlipped] = useState(showBack);

  // Reset animation values when card changes
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    rotateY.value = showBack ? 180 : 0;
    scale.value = 1;
    opacity.value = 1;
    setIsFlipped(showBack);

    // Debug logging
    console.log("🃏 FlashCard data:", {
      id: card.id,
      front: card.front,
      back: card.back,
      reading: card.reading,
      showBack: showBack,
      isFlipped: isFlipped,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  // Text-to-Speech function
  const handleSpeak = (text: string) => {
    console.log("🔊 handleSpeak called with text:", text);
    console.log("📱 onSpeak prop available:", !!onSpeak);

    if (onSpeak) {
      console.log("📞 Using onSpeak prop callback");
      onSpeak(text);
    } else {
      console.log("🎙️ Using Speech.speak directly");
      try {
        Speech.speak(text, {
          language: "ja-JP",
          pitch: 1.0,
          rate: 0.8,
          onStart: () => console.log("🎵 Speech started"),
          onDone: () => console.log("✅ Speech finished"),
          onStopped: () => console.log("🛑 Speech stopped"),
          onError: (error) => console.error("❌ Speech error:", error),
        });
        console.log("🚀 Speech.speak called successfully");
      } catch (error) {
        console.error("💥 Error calling Speech.speak:", error);
      }
    }
  };

  // Flip animation
  const handleFlip = () => {
    const newFlippedState = !isFlipped;

    rotateY.value = withSpring(newFlippedState ? 180 : 0, {
      damping: 15,
      stiffness: 100,
    });

    setIsFlipped(newFlippedState);
    onFlip();

    console.log(
      `🔄 Card flipped: ${newFlippedState ? "Back" : "Front"} (rotateY: ${
        newFlippedState ? 180 : 0
      })`
    );
  };

  // Gesture handler for swipe
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(0.95);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      // Opacity based on distance from center
      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2
      );
      opacity.value = interpolate(distance, [0, SWIPE_THRESHOLD], [1, 0.7]);
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;

      // Determine swipe direction
      let swipeDirection: SwipeDirection | null = null;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe
        if (
          Math.abs(translationX) > SWIPE_THRESHOLD ||
          Math.abs(velocityX) > 500
        ) {
          swipeDirection =
            translationX > 0 ? SwipeDirection.RIGHT : SwipeDirection.LEFT;
        }
      } else {
        // Vertical swipe
        if (
          Math.abs(translationY) > SWIPE_THRESHOLD ||
          Math.abs(velocityY) > 500
        ) {
          swipeDirection =
            translationY > 0 ? SwipeDirection.DOWN : SwipeDirection.UP;
        }
      }

      if (swipeDirection && !disabled) {
        // Animate card off screen
        const targetX =
          swipeDirection === SwipeDirection.RIGHT
            ? screenWidth
            : swipeDirection === SwipeDirection.LEFT
            ? -screenWidth
            : 0;
        const targetY =
          swipeDirection === SwipeDirection.DOWN
            ? screenHeight
            : swipeDirection === SwipeDirection.UP
            ? -screenHeight
            : 0;

        translateX.value = withTiming(targetX, { duration: 300 });
        translateY.value = withTiming(targetY, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });

        // Trigger callback
        runOnJS(onSwipe)(swipeDirection);
      } else {
        // Spring back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        opacity.value = withSpring(1);
      }

      scale.value = withSpring(1);
    })
    .enabled(!disabled);

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateY: `${rotateY.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      rotateY.value,
      [0, 90, 180],
      [1, 0, 0],
      "clamp"
    );
    return { opacity };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      rotateY.value,
      [0, 90, 180],
      [0, 1, 1], // Changed: show back at 90° and 180°
      "clamp"
    );
    return {
      opacity,
      transform: [{ rotateY: "180deg" }],
    };
  });

  // Get difficulty color
  const getDifficultyColor = () => {
    switch (card.difficulty) {
      case "beginner":
        return COLORS.beginner;
      case "intermediate":
        return COLORS.intermediate;
      case "advanced":
        return COLORS.advanced;
      case "expert":
        return COLORS.expert;
      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          {/* Card Front */}
          <Animated.View
            style={[styles.cardSide, styles.cardFront, frontAnimatedStyle]}
          >
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={handleFlip}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor() },
                ]}
              >
                <Text style={styles.difficultyText}>{card.difficulty}</Text>
              </View>
              {/* Empty space where speaker button was */}
              <View style={styles.speakButtonPlaceholder} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardContentTouchable}
              onPress={handleFlip}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardTextFront}>
                  {card.front || "No front text"}
                </Text>
                {card.reading && (
                  <Text style={styles.readingText}>{card.reading}</Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardFooter}
              onPress={handleFlip}
              activeOpacity={0.7}
            >
              <Text style={styles.hintText}>Tap to flip • Swipe to answer</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Card Back */}
          <Animated.View
            style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}
          >
            <TouchableOpacity
              style={styles.cardBackTouchable}
              onPress={handleFlip}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor() },
                  ]}
                >
                  <Text style={styles.difficultyText}>{card.difficulty}</Text>
                </View>
                {/* No speaker button on back side */}
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTextBack}>
                  {card.back || "No back text"}
                </Text>
                <Text style={styles.originalText}>
                  {card.front || "No front text"}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.hintText}>← Hard • Easy →</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* Speaker button positioned absolutely outside gesture detector */}
      <Animated.View style={[styles.speakButtonContainer, frontAnimatedStyle]}>
        <TouchableOpacity
          style={styles.speakButton}
          onPress={() => {
            console.log("🔊 Speaker button pressed directly");
            handleSpeak(card.front);
          }}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="volume-high" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Swipe indicators */}
      <View style={styles.swipeIndicators}>
        <View style={[styles.indicator, styles.leftIndicator]}>
          <Ionicons name="close-circle" size={24} color={COLORS.error} />
          <Text style={[styles.indicatorText, { color: COLORS.error }]}>
            Hard
          </Text>
        </View>
        <View style={[styles.indicator, styles.rightIndicator]}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <Text style={[styles.indicatorText, { color: COLORS.success }]}>
            Easy
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    position: "relative",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: "relative",
  },
  cardSide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.lg,
    // backfaceVisibility: 'hidden', // Temporarily removed for debugging
  },
  cardFront: {
    // Front side styling
  },
  cardBack: {
    // Back side automatically rotated
  },
  cardBackTouchable: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    textTransform: "capitalize",
  },
  speakButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.gray[100],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  speakButtonContainer: {
    position: "absolute",
    top: SPACING.lg + SPACING.md, // Match cardHeader position
    right: SPACING.lg + SPACING.md,
    zIndex: 30,
  },
  speakButtonPlaceholder: {
    width: 40, // Same width as speaker button
    height: 40, // Same height as speaker button
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContentTouchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardTextFront: {
    fontSize: FONTS.sizes.display,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray[800],
    textAlign: "center",
    marginBottom: SPACING.md,
    backgroundColor: "rgba(255,0,0,0.1)", // Debug background
    // fontFamily: FONTS.japanese, // Temporarily removed for debugging
  },
  cardTextBack: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.sm,
    backgroundColor: "rgba(0,255,0,0.2)", // Debug green background
  },
  readingText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.gray[600],
    textAlign: "center",
    fontStyle: "italic",
  },
  originalText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.gray[500],
    textAlign: "center",
    // fontFamily: FONTS.japanese, // Temporarily removed for debugging
  },
  cardFooter: {
    alignItems: "center",
  },
  hintText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[500],
    textAlign: "center",
  },
  swipeIndicators: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    zIndex: -1,
  },
  indicator: {
    alignItems: "center",
    opacity: 0.6,
  },
  leftIndicator: {
    transform: [{ translateX: -20 }],
  },
  rightIndicator: {
    transform: [{ translateX: 20 }],
  },
  indicatorText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    marginTop: SPACING.xs,
  },
});
