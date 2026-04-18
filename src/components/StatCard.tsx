import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '@constants';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  style?: ViewStyle;
  animateValue?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = COLORS.primary,
  style,
  animateValue = true,
}) => {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideUp = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (animateValue) {
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [animateValue, fadeIn, slideUp]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          ...SHADOWS.sm,
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface || COLORS.white,
    borderRadius: SIZES.borderRadiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  icon: {
    fontSize: 28,
    marginRight: SIZES.md,
  },
  label: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: SIZES.fontSizeXxl,
    fontWeight: '700',
  },
});
