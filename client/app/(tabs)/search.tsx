import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { COLORS } from "@constants/colors";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { SEARCH_DEBOUNCE_MS } from "@constants/app";
import { searchService } from "@services/search";
import { useSearchHistory } from "@hooks/use-search-history";
import SearchResultItem from "@components/search-result-item";
import FloatingCartButton from "@components/floating-cart-button";
import { SkeletonLoader } from "@components/skeleton-loader";
import type { FoodItem } from "src/types/food-item";

type SearchState = "idle" | "loading" | "results" | "no-results";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [searchState, setSearchState] = useState<SearchState>("idle");

  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();

  // auto focus input on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const runSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchState("idle");
      return;
    }

    setSearchState("loading");
    try {
      const found = await searchService.search(searchQuery);
      setResults(found);
      setSearchState(found.length > 0 ? "results" : "no-results");
    } catch {
      setResults([]);
      setSearchState("no-results");
    }
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!text.trim()) {
      setResults([]);
      setSearchState("idle");
      return;
    }

    setSearchState("loading");
    debounceTimer.current = setTimeout(() => {
      runSearch(text);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    addToHistory(query.trim());
    runSearch(query.trim());
    Keyboard.dismiss();
  };

  const handleHistoryTap = (historyQuery: string) => {
    setQuery(historyQuery);
    addToHistory(historyQuery);
    runSearch(historyQuery);
    Keyboard.dismiss();
  };

  const handleItemPress = (item: FoodItem) => {
    addToHistory(query || item.name);
    router.push({
      pathname: "/(tabs)/item-detail",
      params: { itemId: item.id },
    });
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSearchState("idle");
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Search header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <MaterialIcons name="search" size={18} color={COLORS.lightGray} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={handleSubmit}
            placeholder="Search for dishes..."
            placeholderTextColor={COLORS.lightGray}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialIcons name="close" size={18} color={COLORS.lightGray} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Content area */}
      <View style={styles.content}>
        {/* IDLE — show search history */}
        {searchState === "idle" && (
          <View style={styles.historyContainer}>
            {history.length > 0 ? (
              <>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearAll}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                {history.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.historyItem}
                    onPress={() => handleHistoryTap(item)}
                  >
                    <MaterialIcons
                      name="history"
                      size={18}
                      color={COLORS.lightGray}
                    />
                    <Text style={styles.historyText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => removeFromHistory(item)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.historyRemove}
                    >
                      <MaterialIcons
                        name="close"
                        size={14}
                        color={COLORS.lightGray}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryEmoji}>🔍</Text>
                <Text style={styles.emptyHistoryTitle}>Search for dishes</Text>
                <Text style={styles.emptyHistorySubtitle}>
                  Try searching for paneer, naan, or biryani
                </Text>
              </View>
            )}
          </View>
        )}

        {/* LOADING — skeleton */}
        {searchState === "loading" && (
          <View style={styles.loadingContainer}>
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <View key={i} style={styles.skeletonItem}>
                  <SkeletonLoader width={80} height={80} borderRadius={10} />
                  <View style={styles.skeletonInfo}>
                    <SkeletonLoader width={140} height={14} borderRadius={4} />
                    <SkeletonLoader
                      width={90}
                      height={12}
                      borderRadius={4}
                      style={{ marginTop: 6 }}
                    />
                    <SkeletonLoader
                      width={60}
                      height={12}
                      borderRadius={4}
                      style={{ marginTop: 6 }}
                    />
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* RESULTS */}
        {searchState === "results" && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SearchResultItem item={item} onPress={handleItemPress} />
            )}
            contentContainerStyle={[
              styles.resultsList,
              { paddingBottom: insets.bottom + 80 },
            ]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.resultsCount}>
                {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                <Text style={styles.resultsQuery}>"{query}"</Text>
              </Text>
            }
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* NO RESULTS */}
        {searchState === "no-results" && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsEmoji}>🥗</Text>
            <Text style={styles.noResultsTitle}>No dishes found</Text>
            <Text style={styles.noResultsSubtitle}>
              Try searching for{" "}
              <Text style={styles.noResultsSuggestion}>paneer</Text>,{" "}
              <Text style={styles.noResultsSuggestion}>naan</Text>, or{" "}
              <Text style={styles.noResultsSuggestion}>thali</Text>
            </Text>
          </View>
        )}
      </View>

      <FloatingCartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  inputWrapper: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.dark,
    paddingVertical: 0,
  },
  cancelText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // content
  content: {
    flex: 1,
  },

  // history
  historyContainer: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
  },
  clearAll: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark,
  },
  historyRemove: {
    padding: 4,
  },

  // empty history
  emptyHistory: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyHistoryEmoji: {
    fontSize: 48,
  },
  emptyHistoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
  },
  emptyHistorySubtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: "center",
  },

  // loading skeletons
  loadingContainer: {
    padding: 16,
    gap: 12,
  },
  skeletonItem: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
  },
  skeletonInfo: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },

  // results
  resultsList: {
    padding: 16,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.lightGray,
    marginBottom: 14,
  },
  resultsQuery: {
    color: COLORS.dark,
    fontWeight: "600",
  },

  // no results
  noResults: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 32,
  },
  noResultsEmoji: {
    fontSize: 52,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 22,
  },
  noResultsSuggestion: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
