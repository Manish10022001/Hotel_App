import { Tabs } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
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
    </Tabs>
  );
}
