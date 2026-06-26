import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { useAuth } from "@context/auth-context";
import { showToast } from "@utils/toast";
import type { Address } from "src/types/user";

export default function AddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();

  const addresses = user?.addresses ?? [];

  const handleSetDefault = (addressId: string) => {
    if (!user) return;
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    updateUser({ ...user, addresses: updated });
    showToast.success("Default address updated.");
  };

  const handleDelete = (addressId: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (!user) return;
            const updated = user.addresses.filter((a) => a.id !== addressId);
            updateUser({ ...user, addresses: updated });
            showToast.success("Address deleted.");
          },
        },
      ]
    );
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View
      style={[styles.addressCard, item.isDefault && styles.addressCardDefault]}
    >
      {/* Top row */}
      <View style={styles.addressTopRow}>
        <View style={styles.labelBadge}>
          <MaterialIcons
            name={
              item.label === "Home"
                ? "home"
                : item.label === "Work"
                  ? "work"
                  : "location-on"
            }
            size={14}
            color={item.isDefault ? COLORS.white : COLORS.primary}
          />
          <Text
            style={[
              styles.labelText,
              item.isDefault && styles.labelTextDefault,
            ]}
          >
            {item.label}
          </Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>

      {/* Address text */}
      <Text style={styles.streetText}>{item.street}</Text>
      <Text style={styles.cityText}>
        {item.city}, {item.state} — {item.pincode}
      </Text>

      {/* Actions */}
      <View style={styles.actionsRow}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.actionButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => showToast.info("Address editing coming in Phase 2")}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity
          onPress={() => showToast.info("Add address coming in Phase 2")}
        >
          <MaterialIcons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📍</Text>
          <Text style={styles.emptyTitle}>No saved addresses</Text>
          <Text style={styles.emptySubtitle}>
            Add your home or work address for faster checkout
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => showToast.info("Add address coming in Phase 2")}
          >
            <MaterialIcons name="add-location" size={18} color={COLORS.white} />
            <Text style={styles.addButtonText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addMoreButton}
              onPress={() => showToast.info("Add address coming in Phase 2")}
            >
              <MaterialIcons
                name="add-location"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.addMoreText}>Add New Address</Text>
            </TouchableOpacity>
          }
        />
      )}
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    marginBottom: 12,
  },
  addressCardDefault: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  addressTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  labelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  labelTextDefault: {
    color: COLORS.primary,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
  },
  streetText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
  },
  cityText: {
    fontSize: 13,
    color: COLORS.gray,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    paddingVertical: 2,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.red,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.lightGray,
    textAlign: "center",
    lineHeight: 20,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    marginTop: 4,
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
