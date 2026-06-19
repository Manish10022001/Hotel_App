import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "@constants/colors";
import type { Category } from "src/types/food-item";

interface CategoryChipsProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CategoryChips({
  categories,
  selectedId,
  onSelect,
}: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const isSelected = category.id === selectedId;
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(category.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.chipEmoji}>{category.emoji}</Text>
            <Text
              style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}
              numberOfLines={1}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
  },
  chipEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.gray,
    textAlign: "center",
  },
  chipLabelSelected: {
    color: COLORS.white,
  },
});
