import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const SEARCH_HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await SecureStore.getItemAsync(SEARCH_HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored) as string[]);
      }
    } catch {
      // ignore — history is non-critical
    }
  };

  const addToHistory = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...history.filter((h) => h.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_HISTORY_ITEMS);

    setHistory(updated);
    try {
      await SecureStore.setItemAsync(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeFromHistory = async (query: string) => {
    const updated = history.filter((h) => h !== query);
    setHistory(updated);
    try {
      await SecureStore.setItemAsync(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await SecureStore.deleteItemAsync(SEARCH_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  return { history, addToHistory, removeFromHistory, clearHistory };
}