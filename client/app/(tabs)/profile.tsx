import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "src/constants/colors";
import { useAuth } from "@context/auth-context";
import { showToast } from "@utils/toast";

interface ProfileOption {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  showBadge?: boolean;
}

interface ProfileSection {
  title: string;
  options: ProfileOption[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const sections: ProfileSection[] = [
    {
      title: "MY ACCOUNT",
      options: [
        {
          icon: "person-outline",
          label: "Edit Profile",
          onPress: () => router.push("/(tabs)/edit-profile" as never),
        },
        {
          icon: "location-on",
          label: "My Addresses",
          onPress: () => router.push("/(tabs)/addresses" as never),
        },
        {
          icon: "favorite-border",
          label: "My Favourites",
          onPress: () => showToast.info("Favourites coming in Phase 2"),
        },
        {
          icon: "notifications-none",
          label: "Notifications",
          onPress: () => showToast.info("Notifications coming in Phase 4"),
        },
      ],
    },
    {
      title: "MY ORDERS",
      options: [
        {
          icon: "receipt-long",
          label: "Order History",
          onPress: () => router.push("/(tabs)/orders" as never),
        },
        {
          icon: "star-border",
          label: "My Reviews",
          onPress: () => showToast.info("Reviews coming in Phase 2"),
        },
      ],
    },
    {
      title: "SUPPORT",
      options: [
        {
          icon: "info-outline",
          label: "About Meera Hotel",
          onPress: () => router.push("/(tabs)/about" as never),
        },
        {
          icon: "help-outline",
          label: "Help & Support",
          onPress: () => showToast.info("Support coming soon"),
        },
        {
          icon: "star-rate",
          label: "Rate the App",
          onPress: () =>
            showToast.info("Rate us on Play Store — coming at launch"),
        },
        {
          icon: "logout",
          label: "Logout",
          onPress: handleLogout,
          color: COLORS.red,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Green header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name ?? "Guest"}</Text>
          <Text style={styles.userPhone}>+91 {user?.phone ?? "—"}</Text>
          {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}

          {/* Edit profile shortcut */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/(tabs)/edit-profile" as never)}
          >
            <MaterialIcons name="edit" size={14} color={COLORS.white} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.addresses?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionCard}>
                {section.options.map((option, index) => (
                  <View key={option.label}>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={option.onPress}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.optionIconWrapper,
                          {
                            backgroundColor: option.color
                              ? COLORS.redLight
                              : COLORS.primaryLight,
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={option.icon}
                          size={20}
                          color={option.color ?? COLORS.primary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.optionLabel,
                          option.color && { color: option.color },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color={COLORS.border}
                      />
                    </TouchableOpacity>
                    {index < section.options.length - 1 && (
                      <View style={styles.optionDivider} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* App version */}
        <Text style={styles.appVersion}>Meera Hotel v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // header
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 24,
    gap: 6,
  },
  avatarWrapper: {
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  userPhone: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.85,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.7,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },

  // stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 14,
    paddingVertical: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.lightGray,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },

  // sections
  sectionsContainer: {
    padding: 16,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.lightGray,
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  optionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 64,
  },

  // version
  appVersion: {
    fontSize: 11,
    color: COLORS.lightGray,
    textAlign: 'center',
    paddingBottom: 8,
  },
});