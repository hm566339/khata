import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '@constants';

interface StockIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
  style?: ViewStyle;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({
  stock,
  lowStockThreshold = 10,
  style,
}) => {
  const getStatus = () => {
    if (stock === 0) return { label: 'Out of Stock', color: COLORS.error };
    if (stock <= lowStockThreshold) return { label: 'Low Stock', color: COLORS.warning };
    return { label: 'In Stock', color: COLORS.success };
  };

  const status = getStatus();
  const percentage = stock === 0 ? 0 : Math.min((stock / (lowStockThreshold * 2)) * 100, 100);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.info}>
        <Text style={styles.stock}>{stock}</Text>
        <Text style={[styles.status, { color: status.color }]}>{status.label}</Text>
      </View>
      <View style={styles.bar}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: status.color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.sm,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  stock: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: '700',
    color: COLORS.text,
  },
  status: {
    fontSize: SIZES.fontSizeSm,
    fontWeight: '600',
  },
  bar: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: SIZES.radiusRound,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: SIZES.radiusRound,
  },
});
