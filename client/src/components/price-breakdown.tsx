import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { formatCurrency } from '@utils/format-currency';
import {
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  PACKAGING_CHARGE,
  GST_PERCENTAGE,
} from '@constants/app';

interface PriceBreakdownProps {
  itemsTotal: number;
  couponDiscount?: number;
  couponCode?: string;
}

interface PriceRow {
  label: string;
  value: string;
  isDiscount?: boolean;
  isFree?: boolean;
  isBold?: boolean;
}

export default function PriceBreakdown({
  itemsTotal,
  couponDiscount = 0,
  couponCode,
}: PriceBreakdownProps) {
  const deliveryCharge =
    itemsTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const packagingCharge = PACKAGING_CHARGE;
  const gstAmount = Math.round(
    ((itemsTotal - couponDiscount + packagingCharge) * GST_PERCENTAGE) / 100
  );
  const totalAmount =
    itemsTotal - couponDiscount + deliveryCharge + packagingCharge + gstAmount;

  const rows: PriceRow[] = [
    {
      label: 'Item Total',
      value: formatCurrency(itemsTotal),
    },
    ...(couponDiscount > 0
      ? [
          {
            label: `Coupon (${couponCode ?? ''})`,
            value: `− ${formatCurrency(couponDiscount)}`,
            isDiscount: true,
          },
        ]
      : []),
    {
      label: 'Delivery Charges',
      value: deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge),
      isFree: deliveryCharge === 0,
    },
    {
      label: 'Packaging',
      value: formatCurrency(packagingCharge),
    },
    {
      label: `GST (${GST_PERCENTAGE}%)`,
      value: formatCurrency(gstAmount),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      {/* Free delivery progress */}
      {itemsTotal < FREE_DELIVERY_THRESHOLD && (
        <View style={styles.freeDeliveryBanner}>
          <Text style={styles.freeDeliveryText}>
            🛵 Add{' '}
            <Text style={styles.freeDeliveryAmount}>
              {formatCurrency(FREE_DELIVERY_THRESHOLD - itemsTotal)}
            </Text>{' '}
            more for FREE delivery
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    (itemsTotal / FREE_DELIVERY_THRESHOLD) * 100,
                    100
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Price rows */}
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text
            style={[
              styles.rowValue,
              row.isDiscount && styles.discountValue,
              row.isFree && styles.freeValue,
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>To Pay</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
      </View>

      {/* Savings */}
      {(couponDiscount > 0 || deliveryCharge === 0) && (
        <View style={styles.savingsBanner}>
          <Text style={styles.savingsText}>
            🎉 You are saving{' '}
            {formatCurrency(
              couponDiscount + (deliveryCharge === 0 ? DELIVERY_CHARGE : 0)
            )}{' '}
            on this order!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 14,
  },

  // free delivery
  freeDeliveryBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  freeDeliveryText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  freeDeliveryAmount: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  // rows
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  rowLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  rowValue: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: '500',
  },
  discountValue: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  freeValue: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  // divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },

  // total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // savings
  savingsBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  savingsText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});