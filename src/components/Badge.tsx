import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '@constants';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'paid' | 'partial';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'info',
  size = 'small',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
      case 'paid':
        return { bg: COLORS.successLight, text: COLORS.successDark };
      case 'warning':
      case 'pending':
        return { bg: COLORS.warningLight, text: COLORS.warningDark };
      case 'error':
        return { bg: COLORS.errorLight, text: COLORS.errorDark };
      case 'partial':
        return { bg: COLORS.infoLight, text: COLORS.infoDark };
      case 'info':
      default:
        return { bg: COLORS.infoLight, text: COLORS.infoDark };
    }
  };

  const getPadding = () => {
    return size === 'small'
      ? { paddingVertical: SIZES.xs, paddingHorizontal: SIZES.sm }
      : { paddingVertical: SIZES.sm, paddingHorizontal: SIZES.md };
  };

  const getFontSize = () => {
    return size === 'small' ? SIZES.fontSizeXs : SIZES.fontSizeSm;
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          ...getPadding(),
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: getFontSize(),
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: SIZES.borderRadiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
