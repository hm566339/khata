import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '@constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...SHADOWS.medium,
          backgroundColor: COLORS.white,
        };
      case 'outline':
        return {
          borderWidth: 1,
          borderColor: COLORS.gray200,
          backgroundColor: COLORS.white,
        };
      default:
        return {
          ...SHADOWS.light,
          backgroundColor: COLORS.white,
        };
    }
  };

  const content = (
    <View
      style={[
        styles.card,
        getCardStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.borderRadiusLg,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
});
