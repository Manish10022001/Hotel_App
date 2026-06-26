import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";

interface InfoRow {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const infoRows: InfoRow[] = [
    {
      icon: "restaurant",
      label: "Cuisine",
      value: "100% Pure Vegetarian",
    },
    {
      icon: "location-on",
      label: "Location",
      value: "Akola, Maharashtra, India",
    },
    {
      icon: "schedule",
      label: "Hours",
      value: "Mon–Sun: 9:00 AM – 10:00 PM",
    },
    {
      icon: "phone",
      label: "Phone",
      value: "+91 98765 43210",
      onPress: () => Linking.openURL("tel:+919876543210"),
    },
    {
      icon: "email",
      label: "Email",
      value: "hello@meerahotel.com",
      onPress: () => Linking.openURL("mailto:hello@meerahotel.com"),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Meera Hotel</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🌿</Text>
          <Text style={styles.heroTitle}>Meera Hotel</Text>
          <Text style={styles.heroTagline}>Pure Vegetarian • Pure Taste</Text>
        </View>

        {/* About text */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Story</Text>
          <Text style={styles.aboutText}>
            Meera Hotel has been serving pure vegetarian food to the people of
            Akola for over a decade. Founded with a simple mission — to provide
            wholesome, fresh, and delicious vegetarian meals that feel like
            home.
          </Text>
          <Text style={[styles.aboutText, { marginTop: 10 }]}>
            Every dish is prepared fresh daily using locally sourced vegetables
            and traditional recipes passed down through generations. We believe
            that vegetarian food does not mean compromise — it means a
            celebration of flavour, colour, and nutrition.
          </Text>
        </View>

        {/* Info rows */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Restaurant Info</Text>
          {infoRows.map((row, index) => (
            <View key={row.label}>
              <TouchableOpacity
                style={styles.infoRow}
                onPress={row.onPress}
                disabled={!row.onPress}
                activeOpacity={row.onPress ? 0.7 : 1}
              >
                <View style={styles.infoIconWrapper}>
                  <MaterialIcons
                    name={row.icon}
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      row.onPress && styles.infoValueLink,
                    ]}
                  >
                    {row.value}
                  </Text>
                </View>
                {row.onPress && (
                  <MaterialIcons
                    name="open-in-new"
                    size={16}
                    color={COLORS.lightGray}
                  />
                )}
              </TouchableOpacity>
              {index < infoRows.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Values */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Values</Text>
          {[
            {
              emoji: "🌿",
              title: "100% Vegetarian",
              desc: "No eggs, no meat. Every single dish, every single day.",
            },
            {
              emoji: "🥦",
              title: "Fresh Ingredients",
              desc: "Locally sourced vegetables, prepared fresh daily.",
            },
            {
              emoji: "👨‍🍳",
              title: "Traditional Recipes",
              desc: "Authentic flavours passed down through generations.",
            },
            {
              emoji: "❤️",
              title: "Made with Love",
              desc: "Every dish cooked with care and attention to detail.",
            },
          ].map((value) => (
            <View key={value.title} style={styles.valueRow}>
              <Text style={styles.valueEmoji}>{value.emoji}</Text>
              <View style={styles.valueContent}>
                <Text style={styles.valueTitle}>{value.title}</Text>
                <Text style={styles.valueDesc}>{value.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* App version */}
        <Text style={styles.appVersion}>
          Meera Hotel App v1.0.0{"\n"}
          Built with ❤️ for pure vegetarian food lovers
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    gap: 6,
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
  },
  heroTagline: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.85,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.lightGray,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: "500",
  },
  infoValueLink: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    marginLeft: 48,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  valueEmoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  valueContent: {
    flex: 1,
    gap: 2,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.dark,
  },
  valueDesc: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 18,
  },
  appVersion: {
    fontSize: 11,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 18,
    paddingVertical: 8,
  },
});
