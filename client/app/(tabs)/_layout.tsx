import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "src/constants/colors";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

interface TabConfig {
  name: string;
  label: string;
  icon: MaterialIconName;
}

const TAB_CONFIG: TabConfig[] = [
  { name: "index", label: "Home", icon: "home" },
  { name: "menu", label: "Menu", icon: "restaurant-menu" },
  { name: "orders", label: "Orders", icon: "receipt-long" },
  { name: "profile", label: "Profile", icon: "person" },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.white,
        },
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
      {/* These screens exist as routes but are hidden from the tab bar */}
      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="item-detail" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="order-confirmation" options={{ href: null }} />
      <Tabs.Screen name="order-tracking" options={{ href: null }} />
      <Tabs.Screen name="order-detail" options={{ href: null }} />
    </Tabs>
  );
}
