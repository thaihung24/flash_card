/**
 * React Hook for Cache Management
 * Provides cache-aware data fetching for React components
 */

import { useCallback, useEffect, useState } from "react";
import { CategoryService } from "../services/categoryService";
import { VocabularyService } from "../services/vocabularyService";
import { VocabularyDocument } from "../types/vocabulary";
import { CacheManager } from "../utils/cacheManager";

// Hook for vocabulary by category with caching
export const useVocabularyByCategory = (category: string | null) => {
  const [vocabulary, setVocabulary] = useState<VocabularyDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = useCallback(async () => {
    if (!category) {
      setVocabulary([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await VocabularyService.getByCategory(category);
      setVocabulary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch vocabulary"
      );
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  const refresh = useCallback(() => {
    // Clear cache and refetch
    VocabularyService.clearCache();
    fetchVocabulary();
  }, [fetchVocabulary]);

  return { vocabulary, loading, error, refresh };
};

// Hook for vocabulary by JLPT level with caching
export const useVocabularyByJLPT = (jlptLevel: string | null) => {
  const [vocabulary, setVocabulary] = useState<VocabularyDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = useCallback(async () => {
    if (!jlptLevel) {
      setVocabulary([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await VocabularyService.getByJLPTLevel(jlptLevel);
      setVocabulary(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch vocabulary"
      );
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  }, [jlptLevel]);

  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary]);

  const refresh = useCallback(() => {
    VocabularyService.clearCache();
    fetchVocabulary();
  }, [fetchVocabulary]);

  return { vocabulary, loading, error, refresh };
};

// Hook for categories with caching
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refresh = useCallback(() => {
    CategoryService.clearCache();
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refresh };
};

// Hook for cache statistics
export const useCacheStats = () => {
  const [stats, setStats] = useState(CacheManager.getCacheStats());

  const refreshStats = useCallback(() => {
    setStats(CacheManager.getCacheStats());
  }, []);

  const clearAllCaches = useCallback(() => {
    CacheManager.clearAllCaches();
    refreshStats();
  }, [refreshStats]);

  const warmupCaches = useCallback(async () => {
    await CacheManager.warmupCaches();
    refreshStats();
  }, [refreshStats]);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    refreshStats,
    clearAllCaches,
    warmupCaches,
  };
};

// Hook for optimized data loading with cache warmup
export const useOptimizedDataLoader = () => {
  const [isWarming, setIsWarming] = useState(false);

  const warmupCache = useCallback(async () => {
    setIsWarming(true);
    try {
      await CacheManager.warmupCaches();
      console.log("🔥 Cache warmup completed successfully");
    } catch (error) {
      console.error("❌ Cache warmup failed:", error);
    } finally {
      setIsWarming(false);
    }
  }, []);

  // Automatically warmup cache on mount
  useEffect(() => {
    warmupCache();
  }, [warmupCache]);

  return { isWarming, warmupCache };
};
