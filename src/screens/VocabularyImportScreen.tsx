/**
 * Vocabulary Import Screen
 * Screen to import vocabulary data into Firebase
 */

import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from "../constants/theme";
import { VocabularyService } from "../services/vocabularyService";

export const VocabularyImportScreen: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{
    success: boolean;
    imported: number;
    failed: number;
    errors: { id: string; error: string }[];
  } | null>(null);

  const handleImport = async (jsonData: string) => {
    try {
      setImporting(true);
      setResults(null);

      const importResults = await VocabularyService.importFromFile(jsonData);
      setResults(importResults);

      if (importResults.success) {
        Alert.alert(
          "Import Successful",
          `Successfully imported ${importResults.imported} vocabulary items!`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Import Failed",
          `Failed to import ${importResults.failed} items. Check the error log.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert("Error", "Failed to import vocabulary. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const handlePasteAndImport = () => {
    Alert.prompt(
      "Import Vocabulary",
      "Paste your JSON data:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: (jsonData?: string) => {
            if (jsonData) {
              handleImport(jsonData);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Delete All Vocabulary",
      "Are you sure you want to delete ALL vocabulary items? This action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              setImporting(true);
              const result = await VocabularyService.deleteAll();
              Alert.alert(
                "Delete Complete",
                `Deleted ${result.deleted} items`,
                [{ text: "OK" }]
              );
            } catch (err) {
              console.error("Delete error:", err);
              Alert.alert("Error", "Failed to delete vocabulary");
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Vocabulary Import</Text>
        <Text style={styles.description}>
          Import vocabulary data from JSON format into Firebase
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handlePasteAndImport}
            disabled={importing}
          >
            {importing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Paste & Import JSON</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleDeleteAll}
            disabled={importing}
          >
            <Text style={styles.buttonText}>Delete All Vocabulary</Text>
          </TouchableOpacity>
        </View>

        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Import Results</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Success:</Text>
              <Text
                style={[
                  styles.resultValue,
                  results.success ? styles.successText : styles.errorText,
                ]}
              >
                {results.success ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Imported:</Text>
              <Text style={[styles.resultValue, styles.successText]}>
                {results.imported}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Failed:</Text>
              <Text style={[styles.resultValue, styles.errorText]}>
                {results.failed}
              </Text>
            </View>

            {results.errors.length > 0 && (
              <View style={styles.errorsContainer}>
                <Text style={styles.errorsTitle}>Errors:</Text>
                {results.errors.map((error, index) => (
                  <View key={index} style={styles.errorItem}>
                    <Text style={styles.errorText}>
                      {index + 1}. ID: {error.id}
                    </Text>
                    <Text style={styles.errorMessage}>{error.error}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>JSON Format Example:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {JSON.stringify(
                {
                  documents: [
                    {
                      id: "n5-001",
                      category: "pronoun",
                      kanji: "私",
                      kana: "わたし",
                      romaji: "watashi",
                      meaning_vi: "tôi",
                      pos: "pronoun",
                      notes: "Trang trọng",
                      jlpt: "N5",
                    },
                  ],
                },
                null,
                2
              )}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray[800],
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
    marginBottom: SPACING.xl,
  },
  buttonsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  resultsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  resultsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  resultLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray[600],
  },
  resultValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
  successText: {
    color: COLORS.success,
  },
  errorText: {
    color: COLORS.error,
  },
  errorsContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  errorsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.sm,
  },
  errorItem: {
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray[600],
    marginLeft: SPACING.md,
  },
  infoContainer: {
    backgroundColor: COLORS.gray[100],
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  infoTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: SPACING.sm,
  },
  codeBlock: {
    backgroundColor: COLORS.gray[800],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
  },
});

export default VocabularyImportScreen;
