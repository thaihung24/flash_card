/**
 * Vocabulary Type for Firebase Import
 */

export interface VocabularyDocument {
  id: string;
  category?: string;
  kanji?: string;
  kana?: string;
  romaji?: string;
  meaning_vi?: string;
  pos?: string; // Part of speech
  notes?: string;
  jlpt?: string;
}

export interface VocabularyImportData {
  documents: VocabularyDocument[];
}
