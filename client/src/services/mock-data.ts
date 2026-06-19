import type { Category, FoodItem } from "src/types/food-item";
import type { Order } from "src/types/order";
import type { User } from "src/types/user";

export const MOCK_USER: User = {
  id: "u1",
  phone: "9876543210",
  name: "Ramesh",
  email: "ramesh@meerahotel.com",
  addresses: [
    {
      id: "a1",
      label: "Home",
      street: "12 MG Road",
      city: "Nashik",
      state: "Maharashtra",
      pincode: "422001",
      isDefault: true,
    },
  ],
  createdAt: new Date().toISOString(),
};

export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Starters", emoji: "🥗", sortOrder: 1 },
  { id: "c2", name: "Soups", emoji: "🍲", sortOrder: 2 },
  { id: "c3", name: "Main Course", emoji: "🍛", sortOrder: 3 },
  { id: "c4", name: "Breads", emoji: "🫓", sortOrder: 4 },
  { id: "c5", name: "Rice & Biryani", emoji: "🍚", sortOrder: 5 },
  { id: "c6", name: "Snacks", emoji: "🍟", sortOrder: 6 },
  { id: "c7", name: "Desserts", emoji: "🍮", sortOrder: 7 },
  { id: "c8", name: "Beverages", emoji: "☕", sortOrder: 8 },
  { id: "c9", name: "Thali", emoji: "🍽️", sortOrder: 9 },
];

const [
  starters,
  soups,
  mainCourse,
  breads,
  rice,
  ,
  desserts,
  beverages,
  thali,
] = MOCK_CATEGORIES;

export const MOCK_FOOD_ITEMS: FoodItem[] = [
  {
    id: "f1",
    name: "Paneer Butter Masala",
    category: mainCourse,
    description:
      "Soft paneer cubes simmered in rich creamy tomato-butter gravy. Made fresh daily with farm-fresh paneer. Best paired with butter naan.",
    price: 180,
    mrp: 200,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    prepTime: 20,
    rating: 4.5,
    ratingCount: 128,
    tags: ["popular", "creamy"],
  },
  {
    id: "f2",
    name: "Dal Makhani",
    category: mainCourse,
    description:
      "Slow-cooked black lentils in a buttery tomato gravy. Simmered overnight for deep rich flavour.",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isBestseller: false,
    prepTime: 15,
    rating: 4.3,
    ratingCount: 89,
    tags: ["healthy"],
  },
  {
    id: "f3",
    name: "Veg Spring Rolls",
    category: starters,
    description:
      "Crispy golden rolls stuffed with spiced vegetables and glass noodles. Served with sweet chilli sauce.",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    prepTime: 12,
    rating: 4.2,
    ratingCount: 67,
    tags: ["crispy", "kids-friendly"],
  },
  {
    id: "f4",
    name: "Aloo Tikki",
    category: starters,
    description:
      "Golden shallow-fried potato patties with a crunchy outside and spiced filling. Served with mint chutney.",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    prepTime: 10,
    rating: 4.4,
    ratingCount: 201,
    tags: ["crispy", "popular"],
  },
  {
    id: "f5",
    name: "Butter Naan",
    category: breads,
    description:
      "Soft leavened bread baked in tandoor, brushed with real butter. Goes with any curry.",
    price: 30,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: false,
    prepTime: 8,
    rating: 4.6,
    ratingCount: 310,
    tags: [],
  },
  {
    id: "f6",
    name: "Garlic Naan",
    category: breads,
    description:
      "Tandoor-baked naan topped with fresh garlic and butter. Aromatic and soft.",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: false,
    prepTime: 8,
    rating: 4.5,
    ratingCount: 198,
    tags: ["garlic"],
  },
  {
    id: "f7",
    name: "Gulab Jamun",
    category: desserts,
    description:
      "Soft milk-solid dumplings soaked in rose-flavoured sugar syrup. Served warm.",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isBestseller: false,
    prepTime: 5,
    rating: 4.7,
    ratingCount: 156,
    tags: ["sweet", "popular"],
  },
  {
    id: "f8",
    name: "Masala Chaas",
    category: beverages,
    description:
      "Chilled spiced buttermilk with roasted cumin, coriander and a hint of ginger. Refreshing and digestive.",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: true,
    prepTime: 3,
    rating: 4.3,
    ratingCount: 94,
    tags: ["cold", "healthy"],
  },
  {
    id: "f9",
    name: "Special Thali",
    category: thali,
    description:
      "Complete vegetarian meal — 2 sabzi, dal, rice, 2 rotis, papad, salad and sweet. Changes daily.",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: true,
    isBestseller: true,
    prepTime: 15,
    rating: 4.8,
    ratingCount: 412,
    tags: ["value", "complete-meal"],
  },
  {
    id: "f10",
    name: "Veg Pulao",
    category: rice,
    description:
      "Fragrant basmati rice cooked with seasonal vegetables and whole spices. Light and flavourful.",
    price: 130,
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: false,
    prepTime: 18,
    rating: 4.1,
    ratingCount: 72,
    tags: ["light"],
  },
  {
    id: "f11",
    name: "Tomato Soup",
    category: soups,
    description:
      "Classic creamy tomato soup made from fresh tomatoes, served with croutons and cream swirl.",
    price: 90,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    isAvailable: true,
    isFeatured: false,
    isBestseller: false,
    prepTime: 10,
    rating: 4.2,
    ratingCount: 55,
    tags: ["hot"],
  },
  {
    id: "f12",
    name: "Paneer Tikka",
    category: starters,
    description:
      "Marinated paneer cubes grilled in tandoor with peppers and onions. Smoky, spiced and absolutely delicious.",
    price: 160,
    mrp: 180,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    isAvailable: false,
    isFeatured: false,
    isBestseller: true,
    prepTime: 20,
    rating: 4.6,
    ratingCount: 143,
    tags: ["tandoor", "spicy"],
  },
];

export const MOCK_BANNERS = [
  {
    id: "b1",
    title: "Free Delivery Today! 🛵",
    subtitle: "On all orders above ₹200",
    bgColor: "#1B5E20",
  },
  {
    id: "b2",
    title: "New! Special Thali 🍽️",
    subtitle: "Complete meal at just ₹250",
    bgColor: "#2E7D32",
  },
  {
    id: "b3",
    title: "Pure Vegetarian 🌿",
    subtitle: "No eggs. No meat. Always fresh.",
    bgColor: "#388E3C",
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    orderNumber: "MH-2024-0001",
    items: [
      {
        foodItem: MOCK_FOOD_ITEMS[0],
        name: "Paneer Butter Masala",
        price: 180,
        quantity: 1,
        subtotal: 180,
      },
      {
        foodItem: MOCK_FOOD_ITEMS[4],
        name: "Butter Naan",
        price: 30,
        quantity: 2,
        subtotal: 60,
      },
    ],
    type: "delivery",
    address: MOCK_USER.addresses[0],
    status: "delivered",
    paymentMethod: "cod",
    paymentStatus: "paid",
    itemsTotal: 240,
    deliveryCharge: 0,
    packagingCharge: 10,
    gstAmount: 12.5,
    totalAmount: 262.5,
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        status: "confirmed",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
      },
      {
        status: "preparing",
        timestamp: new Date(Date.now() - 2700000).toISOString(),
      },
      {
        status: "delivered",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];
