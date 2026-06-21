import { MOCK_FOOD_ITEMS } from "./mock-data";
import type { FoodItem } from "src/types/food-item";

export const searchService = {
  search: async (query: string): Promise<FoodItem[]> => {
    // simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    return MOCK_FOOD_ITEMS.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesDescription = item.description.toLowerCase().includes(q);
      const matchesCategory = item.category.name.toLowerCase().includes(q);
      const matchesTags = item.tags.some((tag) =>
        tag.toLowerCase().includes(q)
      );
      return (
        matchesName || matchesDescription || matchesCategory || matchesTags
      );
    });
  },
};
