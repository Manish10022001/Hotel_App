export interface Category {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  sortOrder: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  mrp?: number;
  image?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  prepTime: number;
  rating: number;
  ratingCount: number;
  tags: string[];
}
