import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { COLORS } from '@constants/colors';

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.dark }}>
        Item Detail — Day 7
      </Text>
      <Text style={{ fontSize: 14, color: COLORS.gray, marginTop: 8 }}>
        Item ID: {itemId}
      </Text>
    </View>
  );
}