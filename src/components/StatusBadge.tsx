import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, CURRENCY } from '@constants';

interface StatusBadgeProps {
  status: 'pending' | 'paid' | 'cancelled' | 'partial';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return { bg: COLORS.warningLight, text: COLORS.warningDark };
      case 'paid':
        return { bg: COLORS.successLight, text: COLORS.successDark };
      case 'cancelled':
        return { bg: COLORS.errorLight, text: COLORS.errorDark };
      case 'partial':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      default:
        return { bg: COLORS.gray100, text: COLORS.gray700 };
    }
  };

  const getStatusLabel = () => {
    if (label) return label;
    switch (status) {
      case 'pending':
        return 'लंबित';
      case 'paid':
        return 'चुकाया गया';
      case 'cancelled':
        return 'रद्द';
      case 'partial':
        return 'आंशिक';
      default:
        return status;
    }
  };

  const colors = getStatusColor();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{getStatusLabel()}</Text>
    </View>
  );
};

interface CurrencyDisplayProps {
  amount: number;
  size?: 'small' | 'medium' | 'large';
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ amount, size = 'medium' }) => {
  const formatCurrency = (value: number) => {
    return `${CURRENCY} ${value.toFixed(2)}`;
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return SIZES.fontSizeSm;
      case 'large':
        return SIZES.fontSizeXl;
      default:
        return SIZES.fontSizeMd;
    }
  };

  return (
    <Text style={[styles.currencyText, { fontSize: getFontSize() }]}>
      {formatCurrency(amount)}
    </Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.borderRadiusRound,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: SIZES.fontSizeSm,
    fontWeight: '600',
  },
  currencyText: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
